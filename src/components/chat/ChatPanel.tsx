import React from 'react';
import { ethers } from 'ethers';
import { Client as XmtpClient } from '@xmtp/browser-sdk';
import type { LitNodeClient } from '@lit-protocol/lit-node-client';
import deployedContracts from '../../generated/deployedContracts';
import { parseDidHealth } from '../../utils/did';
import { ConnectLit } from '../lit/ConnectLit';

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
 
    const sendMessage = async () => {
        try {
          if (!recipientDid) throw new Error('Please select a recipient');
          if (!walletAddress) throw new Error('Please connect your wallet');
          if (!xmtpClient) throw new Error('XMTP not ready');
          if (!litClient) throw new Error('Lit not initialized');
          if (!messageText.trim()) throw new Error('Message is empty');
      
          const env = 'dev'; // or 'production'
          const { chainId: didChainId, name: lookupKey } = parseDidHealth(recipientDid);
      
          const network = deployedContracts[env as keyof typeof deployedContracts];
          const chainEntry = Object.values(network).find(
            (entry: any) => entry.HealthDIDRegistry?.chainId === parseInt(didChainId)
          );
      
          if (!chainEntry || !chainEntry.HealthDIDRegistry) {
            throw new Error(`No HealthDIDRegistry deployed for chain ${didChainId}`);
          }
      
          const registry = chainEntry.HealthDIDRegistry;
          const provider = new ethers.JsonRpcProvider(registry.rpcUrl);
          const contract = new ethers.Contract(registry.address, registry.abi, provider);
          const didData = await contract.getHealthDID(lookupKey);
      
          if (!didData || didData.owner === ethers.ZeroAddress) {
            throw new Error(`DID ${lookupKey} not found`);
          }
      
          const recipientWallet = didData.owner.toLowerCase();
      
          // 1. Check if the recipient can be messaged
          const reachability = await xmtpClient.canMessage([recipientWallet]);
          if (!reachability.get(recipientWallet)) {
            throw new Error('Recipient is not reachable on XMTP');
          }
      
          // Create a new DM conversation directly with the wallet address
          const conversation = await xmtpClient.conversations.newDm(recipientWallet);
      
          // 4. Optimistically send
          conversation.sendOptimistic(messageText);
      
          // 5. Publish the message to the XMTP network
          await conversation.publishMessages();
      
          setStatus('Message sent!');
          setMessageText('');
        } catch (err: any) {
          console.error('Send message failed:', err);
          setStatus(err.message || 'Unknown error');
        }
      };
      
      

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <ConnectLit />

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
