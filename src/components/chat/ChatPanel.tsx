import React, { useState, useRef } from 'react';
import { ethers, JsonRpcProvider } from 'ethers';
import { Client, type Client as XmtpClient } from '@xmtp/browser-sdk';
import type { LitNodeClient } from '@lit-protocol/lit-node-client';
import deployedContracts from '../../generated/deployedContracts';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import { createMessageAccessControlConditions } from './MessageAccessControl';
import { createFHIRMessageBundle } from '../fhir/MessageBundle';
import { parseDidHealth } from '../../utils/did';
import { ConnectLit } from '../lit/ConnectLit';
import { Favorites, type FavoritesRef } from './Favorites';

interface ChatPanelProps {
  isConnected: boolean;
  recipientDid: string | null;
  setRecipientDid: (did: string | null) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  status: string;
  setStatus: (status: string) => void;
  walletAddress: string | null;
  litClient: LitNodeClient | null;
  email: string;
  web3SpaceDid: string;
  chainId: number;
  xmtpClient: XmtpClient | null;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
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
  chainId,
  xmtpClient,

}) => {
  const [messages, setMessages] = useState<any[]>([]);
  // Use props directly instead of creating local state
  const statusState = status;
  //const subjectState = subject;
  const favoritesRef = useRef<FavoritesRef>(null);

  const sendMessage = async () => {
    try {
      if (!recipientDid) throw new Error('Please select a recipient');
      if (!walletAddress) throw new Error('Please connect your wallet');
      if (!xmtpClient) throw new Error('XMTP client not initialized');
      if (!litClient) throw new Error('Please wait for Lit Protocol initialization');
  
      const { chainId, name } = parseDidHealth(recipientDid);
      const senderDid = `did:health:${chainId}:${walletAddress}`;
  
      favoritesRef.current?.addFavorite(recipientDid);
  
      const env = 'testnet'; // or 'production'
      const registryEntry = Object.values(deployedContracts[env]).find(
        (net: any) => net.HealthDIDRegistry?.chainId === chainId
      )?.HealthDIDRegistry;
  
      if (!registryEntry) {
        throw new Error(`❌ No HealthDIDRegistry deployed for chain ${chainId}`);
      }
  
      const provider = new JsonRpcProvider(registryEntry.rpcUrl);
      const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider);
      const data = await contract.getHealthDID(chainId + ':' + name);
  
      if (!data || data.owner === ethers.ZeroAddress) {
        throw new Error(`❌ DID not found on chain ${chainId}`);
      }
  
      const recipientWallet = data.owner;
      if (!ethers.isAddress(recipientWallet)) throw new Error('Invalid recipient wallet address');
      if (recipientWallet.toLowerCase() === walletAddress.toLowerCase()) {
        throw new Error('❌ Self messaging is not supported');
      }
  
      const bundle = createFHIRMessageBundle(senderDid, recipientDid, messageText);
  
      setStatus('🔐 Encrypting...');
      const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
  
      const accessControlConditions = await createMessageAccessControlConditions(
        walletAddress,
        recipientWallet,
        chainId.toString()
      );
  
      const { encryptedJSON } = await encryptFHIRFile({
        file: blob,
        litClient,
        chain: chainId.toString(),
        accessControlConditions
      });
  
      const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' });
  
      setStatus('📦 Storing...');
      const url = await storeEncryptedFileByHash(encryptedBlob, recipientWallet, 'Message');
      console.log('Web3 Storage URL:', url);
  
      const urlRegex = /ipfs\/([^\/]+)\/Message\/([^\.]+)\.enc/;
      const match = url.match(urlRegex);
      if (!match) throw new Error(`Invalid Web3 Storage URL format: ${url}`);
  
      const [_, cid, hash] = match;
      console.log('Extracted CID:', cid);
      console.log('Extracted Hash:', hash);
  
      const messageBundle = createFHIRMessageBundle(senderDid, recipientDid, `Encrypted message: ${cid}:${hash}`);
  
      setStatus('📨 Sending...');
      const conversation = await xmtpClient.conversations.newDm(recipientWallet);
  
      const message = await conversation.send(JSON.stringify(messageBundle));
      console.log('Message sent:', message);
      setMessageText('');
      setStatus('✅ Message sent!');
    } catch (err: any) {
      console.error('❌ Send message failed:', err);
      setStatus(`❌ Error: ${err.message || 'Unknown error occurred'}`);
    }
  };
    
      

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
     

      {!recipientDid && isConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
          <p className="text-sm">Please select a recipient to start chatting</p>
        </div>
      )}

      {recipientDid && (
        <>
          {/* Status display */}
          {status && (
            <div className="text-sm text-blue-600 dark:text-blue-300">
              {status}
            </div>
          )}
<Favorites 
  onSelect={setRecipientDid}
  litClient={litClient ?? undefined}
  ref={favoritesRef}
/>
          {/* Message input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};
