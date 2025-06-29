import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnboardingState } from '../../store/OnboardingState';
import { ChatPanel } from './ChatPanel';
import { MemberSearch } from './MemberSearch';
import { Inbox } from './Inbox';
import { SettingsPanel } from './SettingsPanel';

interface Message {
  from: string;
  content: string;
}

export default function Chat() {
  const { address } = useAccount();

  const {
    setWalletAddress,
    walletConnected,
    litConnected,
    storageReady,
    setStorageReady,
    web3SpaceDid,
    email,
    litClient,
    walletAddress
  } = useOnboardingState();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address, setWalletAddress]);

  const [recipientDid, setRecipientDid] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    zip: '',
    specialty: ''
  });
  const [inbox, setInbox] = useState<Message[]>([]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        {address ? (
          !walletConnected ? (
            <div className="bg-white rounded-lg shadow p-6">
              <SettingsPanel onStorageReady={(client) => {
                if (client) {
                  setStorageReady(true);
                }
              }} />
            </div>
          ) : (
            walletConnected && litConnected && storageReady ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-4">
                  <MemberSearch
                    filters={filters}
                    onFilterChange={(e) => {
                      const { name, value } = e.target;
                      setFilters(prev => ({ ...prev, [name]: value }));
                    }}
                    filtered={[]} // TODO: Implement filtering logic
                    onSelectRecipient={setRecipientDid}
                  />
                  <Inbox inbox={inbox} />
                  <ChatPanel 
                    isConnected={true}
                    recipientDid={recipientDid}
                    setRecipientDid={setRecipientDid}
                    messageText={messageText}
                    setMessageText={setMessageText}
                    status={status}
                    setStatus={setStatus}
                    litClient={litClient}
                    email={email || ''}
                    web3SpaceDid={web3SpaceDid || ''}
                    walletAddress={walletAddress || ''}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="mr-2">💬</span>
                  <span>Chat</span>
                </h2>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">Please complete the onboarding process to start chatting.</p>
                </div>
                <SettingsPanel onStorageReady={(client) => {
                  if (client) {
                    setStorageReady(true);
                  }
                }} />
              </div>
            )
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">💬</span>
              <span>Chat</span>
            </h2>
            <p className="text-gray-600">Please connect your wallet to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
