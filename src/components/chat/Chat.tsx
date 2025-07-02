import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import ConnectWallet from '../eth/WalletConnectETH';
import { useXmtp } from '../../hooks/useXmtp';
import { useOnboardingState } from '../../store/OnboardingState';
import { MemberSearch } from './MemberSearch';
import { Inbox } from './Inbox';
import { ChatPanel } from './ChatPanel';
import logo from '../../assets/did-health.png';
import type { Signer as XmtpSigner } from '@xmtp/browser-sdk';

const Chat = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const {
    walletConnected,
    setWalletConnected,
    setWalletAddress,
    walletAddress,
    litClient,
    litConnected,
    email,
    storageReady,
    web3SpaceDid,
  } = useOnboardingState();

  const { xmtpClient, initXmtp, isInitializing, error } = useXmtp();

  const [recipientDid, setRecipientDid] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({ name: '', zip: '' });

  // Set onboarding state from wallet info
  useEffect(() => {
    if (address && isConnected) {
      setWalletAddress(address);
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }
  }, [address, isConnected]);

  // Initialize XMTP client when onboarding is complete
  useEffect(() => {
    const ready = walletConnected && litConnected && storageReady && !xmtpClient && !isInitializing;
    if (!ready || typeof window === 'undefined' || !window.ethereum) return;

    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const xmtpSigner: XmtpSigner = {
          type: 'EOA' as const,
          async getIdentifier() {
            return {
              identifier: (walletAddress ?? '').toLowerCase(),
              identifierKind: 'Ethereum' as const,
            };
          },
          async signMessage(message: string | Uint8Array) {
            const msg = typeof message === 'string' ? message : Buffer.from(message).toString('utf8');
            const sig = await signer.signMessage(msg);
            return Buffer.from(sig.replace(/^0x/, ''), 'hex');
          },
        };

        await initXmtp(xmtpSigner);
      } catch (e) {
        console.error('Error setting up XMTP:', e);
      }
    };

    init();
  }, [walletConnected, litConnected, storageReady, walletAddress, xmtpClient, isInitializing]);

  // Check readiness
  const isReady = isConnected && walletConnected && litConnected && storageReady && xmtpClient;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-xl font-semibold">Connect Wallet</div>
        <div className="text-gray-600">Please connect your wallet to start chatting</div>
        <ConnectWallet />
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-xl font-semibold">Initializing chat...</div>
        <div className="text-gray-600">
          {error || 'Please wait while we set up your chat environment'}
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="DID:Health Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-semibold">did:health Chat</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="flex flex-col gap-4">
          <MemberSearch
            filters={filters}
            onFilterChange={(e) => {
              setFilters(prev => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            filtered={[]} // TODO: implement filtering
            onSelectRecipient={setRecipientDid}
          />

          <ChatPanel
            isConnected={walletConnected}
            recipientDid={recipientDid}
            setRecipientDid={setRecipientDid}
            messageText={messageText}
            setMessageText={setMessageText}
            status={status}
            setStatus={setStatus}
            walletAddress={walletAddress}
            litClient={litClient}
            email={email || ''}
            web3SpaceDid={web3SpaceDid}
            chainId={chainId}
            xmtpClient={xmtpClient}
          />

          <Inbox walletAddress={walletAddress} litClient={litClient} />
        </div>
      </div>
    </main>
  );
};

export default Chat;
