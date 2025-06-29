// ChatPanel.tsx
import React, { useEffect, useCallback, useRef } from 'react';
import type { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useXmtp } from '../../hooks/useXmtp';
import { createFHIRMessageBundle } from '../fhir/MessageBundle';
import { Favorites } from './Favorites';
import type { ILitNodeClient } from '@lit-protocol/types';
import type { DeployedContracts } from '../../types/contracts';
import type { ContractInfo } from '../../types/contracts';
import type { NetworkConfig } from '../../types/network';
import deployedContracts from '../../generated/deployedContracts';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import type { FavoritesRef } from './Favorites';
import { createMessageAccessControlConditions } from './MessageAccessControl';
import type { LitAccessControlCondition } from './MessageAccessControl';

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

function parseDidHealth(did: string) {
  const parts = did.trim().split(':');
  if (parts.length !== 4) throw new Error('Invalid DID format');
  return { chainId: parts[2], name: parts[3] };
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
  const favoritesRef = useRef<FavoritesRef>(null);

  useEffect(() => {
    if (isConnected) initXmtp();
  }, [isConnected, initXmtp]);

  const getAccessControlConditions = useCallback(
    (recipientWallet: string): LitAccessControlCondition[] => {
      if (!walletAddress) throw new Error('Sender wallet address not available');
      return createMessageAccessControlConditions(walletAddress, recipientWallet);
    },
    [walletAddress],
  );

  const sendMessage = async () => {
    try {
      if (!recipientDid || !walletAddress || !xmtpClient) throw new Error('Missing required information');
      const { chainId, name } = parseDidHealth(recipientDid);

      favoritesRef.current?.addFavorite(recipientDid);

      const env = 'testnet';
      const network = Object.values(deployedContracts[env]).find(
        (net: any) => {
          const dao = net?.DidHealthDAO;
          return dao && typeof dao.chainId === 'number' && dao.chainId.toString() === chainId;
        }
      );
      if (!network) throw new Error(`No registry for chain ${chainId}`);
      const registryEntry = network.DidHealthDAO as any;
      if (!registryEntry) throw new Error(`No registry for chain ${chainId}`);

      const provider = new JsonRpcProvider(registryEntry.rpcUrl);
      const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider);
      const data = await contract.getHealthDID(`${chainId}:${name}`);
      const recipientWallet = data.owner;

      if (recipientWallet.toLowerCase() === walletAddress.toLowerCase()) {
        throw new Error('❌ Self messaging is not supported');
      }

      const conv = await xmtpClient.conversations.newConversation(recipientWallet);

      const senderDid = `did:health:${chainId}:${walletAddress}`;
      const bundle = createFHIRMessageBundle(senderDid, recipientDid, messageText);

      setStatus('🔐 Encrypting...');
      const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
      const accessControlConditions = getAccessControlConditions(recipientWallet);
      const { encryptedJSON } = await encryptFHIRFile({ file: blob, litClient, chain: 'ethereum', accessControlConditions } as any);
      const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' });

      setStatus('📦 Storing...');
      const hash = await storeEncryptedFileByHash(encryptedBlob, recipientWallet, 'Message');

      setStatus('📨 Sending...');
      await conv.send(hash, { contentType: 'text/plain' });
      setMessageText('');
      setStatus('✅ Message sent!');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message || 'Unknown error occurred'}`);
    }
  };

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
        <Favorites ref={favoritesRef} onSelect={(did: string) => setRecipientDid(did)} />
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
          onClick={sendMessage}
        >
          <span className="mr-2">🚀</span> Send Secure Message
        </button>
      </div>
      {status && (
        <div
          className={`p-3 rounded-lg ${
            status.startsWith('❌')
              ? 'bg-red-50 text-red-700'
              : status.startsWith('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
}
