import React, { useState, useEffect } from 'react';
// Removed useXmtp import since we're now using the prop directly
import { decryptFHIRFile } from '../../lib/litEncryptFile';
import { Client } from '@xmtp/browser-sdk';
import FHIRResource from '../fhir/FHIRResourceView';

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
  xmtpClient: Client | null;
}

export function Inbox({ walletAddress, litClient, xmtpClient }: InboxProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isInitializing = false;

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!xmtpClient || !walletAddress || isInitializing) return;

    const fetchMessages = async () => {
      try {
        const conversations = await xmtpClient.conversations.list();
        const allMessages: Message[] = [];

        for (const conv of conversations) {
          const msgs = await conv.messages();
          for (const msg of msgs) {
            if (msg.contentType.authorityId === 'xmtp.org' && msg.contentType.typeId === 'text') {
              const content = msg.content as string;
              const sender = (msg as { sender?: { address?: string }, senderAddress?: string }).senderAddress || 
                (msg as { sender?: { address?: string }, senderAddress?: string }).sender?.address || '';
              allMessages.push({
                id: msg.id,
                sender,
                content,
                timestamp: new Date(Number(msg.sentAtNs) / 1e9),
                decrypted: false
              });
            }
          }
        }

        setMessages(allMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [xmtpClient, walletAddress, isInitializing]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">From</span>
            <span className="text-sm text-gray-600">Subject</span>
            <span className="text-sm text-gray-600">Date</span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Toggle Inbox"
        >
          <svg
            className={`w-6 h-6 ${isVisible ? 'rotate-0' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
        {messages.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No messages found
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{msg.sender.slice(0, 6)}...</span>
                  <span className="text-sm text-gray-600">Message</span>
                  <span className="text-sm text-gray-600">{msg.timestamp.toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setSelectedMessage(msg)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
        {selectedMessage && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Message Details</h1>
              <div className="flex gap-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-600">From:</h2>
                  <p className="text-sm text-gray-600">{selectedMessage.sender.slice(0, 6)}...</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600">Date:</h2>
                  <p className="text-sm text-gray-600">{selectedMessage.timestamp.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            {selectedMessage.decrypted ? (
              <div className="mt-2">
                <FHIRResource resource={selectedMessage.decryptedContent} />
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    // Parse the encrypted JSON content
                    const encryptedJson = JSON.parse(selectedMessage.content);
                    const decryptedContent = await decryptFHIRFile({
                      encryptedJson,
                      litClient,
                      sessionSigs: []
                    });
                    setMessages(prev =>
                      prev.map(m =>
                        m.id === selectedMessage?.id ? { ...m, decrypted: true, decryptedContent } : m
                      )
                    );
                  } catch (error) {
                    console.error('Error decrypting message:', error);
                  }
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Decrypt Message
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
