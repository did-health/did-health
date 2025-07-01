import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useOnboardingState } from '../../store/OnboardingState';
import { ChatPanel } from './ChatPanel';
import { MemberSearch } from './MemberSearch';
import { Inbox } from './Inbox';

interface Message {
  from: string;
  content: string;
}

export default function Chat() {
  const { address, chain } = useAccount();

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
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-6">
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
            <Inbox walletAddress={walletAddress} litClient={litClient} />
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
              walletAddress={walletAddress}
              web3SpaceDid={web3SpaceDid}
              chainId={chain?.id || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
