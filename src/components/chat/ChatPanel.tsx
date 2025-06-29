import React, { useEffect, useCallback } from 'react';
import { ethers, JsonRpcProvider, Contract } from 'ethers';
import deployedContracts from '../../generated/deployedContracts';
import { resolveDidHealthByDidName } from '../../lib/DIDDocument';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import { useXmtp } from '../../hooks/useXmtp';
import type { AccessControlConditions } from '@lit-protocol/types';
import type { ILitNodeClient } from '@lit-protocol/types';
import { Client as XmtpClient, type Conversation } from '@xmtp/xmtp-js';

interface ChatPanelProps {
  isConnected: boolean;
  recipientDid: string | null;
  setRecipientDid: (did: string | null) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  status: string;
  setStatus: (status: string) => void;
  walletAddress: string | null;
  litClient: ILitNodeClient | null;
  email: string;
  web3SpaceDid: string;
}

export function ChatPanel({ 
  isConnected, 
  recipientDid, 
  setRecipientDid, 
  messageText, 
  setMessageText, 
  status, 
  setStatus,
  walletAddress,
  litClient,
  email,
  web3SpaceDid,
}: ChatPanelProps) {
  const { xmtpClient, initXmtp } = useXmtp();

  useEffect(() => {
    if (isConnected) {
      initXmtp();
    }
  }, [isConnected, initXmtp]);

  const getAccessControlConditions = useCallback((recipientWallet: string): AccessControlConditions[] => {
    return [{
      contractAddress: '',
      standardContractType: '',
      chain: 'sepolia',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: recipientWallet
      },
    }];
  }, []);



  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="/logo.svg" alt="DID:Health Logo" className="h-8 w-8 mr-2" />
          <h2 className="text-2xl font-bold">Secure Chat</h2>
        </div>
      </div>
      
      {!isConnected && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Please connect your wallet to start chatting.</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's DID:Health</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter recipient's DID:Health (did:health:chainId:name)"
            value={recipientDid || ''}
            onChange={(e) => setRecipientDid(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={async () => {
            try {
              if (!xmtpClient || !litClient || !email || !web3SpaceDid) {
                setStatus('❌ Missing required state (Lit, Web3, XMTP, etc.)');
                return;
              }

              if (!recipientDid || !recipientDid.startsWith('did:health:')) {
                throw new Error('Please provide a valid DID (did:health:chainId:name)');
              }

              setStatus('🔍 Resolving DID...');

              const parts = recipientDid.trim().split(':');
              if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health') {
                throw new Error('Invalid DID format');
              }

              const chainId = parseInt(parts[2], 10);
              const lookupKey = `${chainId}:${parts[3]}`;
              const chainName = parts[2];

              const env = 'testnet';
              const registry = Object.values(deployedContracts[env]).find(
                (n: any) => n.HealthDIDRegistry?.chainId === chainId
              )?.HealthDIDRegistry;
              if (!registry) throw new Error(`No registry for chain ${chainId}`);

              const provider = new JsonRpcProvider(registry.rpcUrl);
              const contract = new ethers.Contract(registry.address, registry.abi, provider);
              const didData = await contract.getHealthDID(lookupKey);
              if (!didData || didData.owner === ethers.ZeroAddress) {
                throw new Error(`DID not found on chain ${chainId}`);
              }

              const recipientWallet = didData.owner;
              const conv = await xmtpClient.conversations.newConversation(recipientWallet);

              const bundle = {
                resourceType: 'Bundle',
                type: 'message',
                entry: [
                  {
                    resource: {
                      resourceType: 'MessageHeader',
                      eventCoding: {
                        system: 'http://hl7.org/fhir/message-events',
                        code: 'communication-request',
                      },
                      source: { name: 'DID:Health dApp', endpoint: walletAddress },
                      destination: [{ endpoint: recipientWallet }],
                      focus: [{ reference: 'Communication/1' }],
                    },
                  },
                  {
                    resource: {
                      resourceType: 'Communication',
                      status: 'completed',
                      sender: { reference: `Patient/${walletAddress}` },
                      recipient: [{ reference: `Practitioner/${recipientDid}` }],
                      payload: [{ contentString: messageText }],
                    },
                  },
                ],
              };

              setStatus('🔐 Encrypting...');
              const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });

              const accessControlConditions = getAccessControlConditions(recipientWallet);

              const { encryptedJSON } = await encryptFHIRFile({
                file: blob,
                litClient,
                chain: 'ethereum',
                accessControlConditions
              } as any);
              setStatus('📦 Storing...');
              const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' });
              const hash = await storeEncryptedFileByHash(encryptedBlob, recipientWallet, 'Message');
              
              setStatus('📨 Sending...');
              await conv.send(hash);
              setMessageText('');
              setStatus('✅ Message sent!');
            } catch (error: any) {
              setStatus(`❌ Error: ${error.message || 'Unknown error occurred'}`);
            }
          }}>
          <span className="mr-2">🚀</span>
          Send Secure Message
        </button>
      </div>

      {status && (
        <div className={`p-3 rounded-lg ${
          status.startsWith('❌') ? 'bg-red-50 text-red-700' :
          status.startsWith('✅') ? 'bg-green-50 text-green-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
}
