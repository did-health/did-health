import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useXmtp } from '../../hooks/useXmtp';
import { getFromIPFS } from '../../lib/storeFIleWeb3';
import { decryptFHIRFile } from '../../lib/litEncryptFile';
import FHIRResource from '../fhir/FHIRResourceView';
import { ContentTypeId, DecodedMessage } from '@xmtp/browser-sdk';
import deployedContracts from '../../generated/deployedContracts';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  decrypted: boolean;
  decryptedContent?: any;
}

interface InboxProps {
  walletAddress: string | null;
  litClient: any;
}

export function Inbox({ walletAddress, litClient }: InboxProps) {
  const { chain } = useAccount();
  const { xmtpClient } = useXmtp({
    address: walletAddress,
    walletClient: chain?.id ? deployedContracts['testnet'].arbitrumSepolia.DidHealthDAO.rpcUrl : '',
    isConnected: !!walletAddress
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!xmtpClient || !walletAddress) return;

    const fetchMessages = async () => {
      try {
        const conversations = await xmtpClient.conversations.list();
        const allMessages: Message[] = [];

        for (const conv of conversations) {
          const msgs = await conv.messages();
          for (const msg of msgs) {
            if (msg.contentType.authorityId === 'xmtp.org' && msg.contentType.typeId === 'text') {
              const content = msg.content as string;
              allMessages.push({
                id: msg.id,
                sender: (msg as any).senderAddress,
                content,
                timestamp: new Date(Number(msg.sentAtNs) / 1e9),
                decrypted: false
              });
            }
          }
        }

        setMessages(allMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [xmtpClient, walletAddress]);

  const decryptMessage = async (message: Message) => {
    try {
      const [hash, cid] = message.content.split(':');
      const file = await getFromIPFS(`https://w3s.link/ipfs/${cid}/Message/${hash}.enc`);
      const decrypted = await decryptFHIRFile({
        file,
        litClient,
        chain: 'ethereum',
        accessControlConditions: [] // We don't need conditions for decryption
      } as any);
      
      setSelectedMessage({
        ...message,
        decrypted: true,
        decryptedContent: JSON.parse(decrypted.decryptedJSON)
      });
    } catch (err) {
      console.error('Error decrypting message:', err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">📥 Inbox</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => decryptMessage(msg)}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">From:</span> {msg.sender}
              </div>
              <span className="text-sm text-gray-500">
                {msg.timestamp.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {msg.decrypted ? '✅ Decrypted' : '🔒 Encrypted'}
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && selectedMessage.decrypted && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Message Content</h3>
          <div className="overflow-hidden rounded-lg border">
            <FHIRResource resource={selectedMessage.decryptedContent} followReferences={true} />
          </div>
        </div>
      )}
    </div>
  );
}
