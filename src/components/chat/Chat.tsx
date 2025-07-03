import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import ConnectWallet from '../eth/WalletConnectETH';
import { useXmtp } from '../../lib/useXmtp';
import { useOnboardingState } from '../../store/OnboardingState';
import { MemberSearch } from './MemberSearch';
import { Inbox } from './Inbox';
import { ChatPanel } from './ChatPanel';
import logo from '../../assets/did-health.png';
import { Client, type Signer } from '@xmtp/browser-sdk';

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

  const { xmtpClient: xmtpClientGeneric, initXmtp, isInitializing, error } = useXmtp();
  const xmtpClient = xmtpClientGeneric as Client | undefined;

  const [recipientDid, setRecipientDid] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState({ name: '', zip: '' });

  // Handle wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
          } else {
            setWalletConnected(false);
            setWalletAddress('');
          }
        }
      } catch (e) {
        console.error('Error checking wallet connection:', e);
        setWalletConnected(false);
        setWalletAddress('');
      }
    };

    checkWalletConnection();
  }, []);

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
        // Check if wallet is still connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          console.warn('Wallet disconnected');
          return;
        }

        // Add delay to avoid race conditions
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        if (!signer) {
          console.error('No signer available');
          return;
        }

        const xmtpSigner: Signer = {
          type: 'EOA' as const,
          async getIdentifier() {
            return {
              identifier: (walletAddress ?? '').toLowerCase(),
              identifierKind: 'Ethereum' as const,
            };
          },
          async signMessage(message: string | Uint8Array) {
            if (!signer) {
              throw new Error('Signer not available');
            }
            const msg = typeof message === 'string' ? message : Buffer.from(message).toString('utf8');
            const sig = await signer.signMessage(msg);
            return Buffer.from(sig.replace(/^0x/, ''), 'hex');
          },
        };

        await initXmtp(xmtpSigner);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error('Error setting up XMTP:', e.message);
        } else {
          console.error('Unknown error setting up XMTP:', e);
        }
        
        // Handle specific errors
        if (e instanceof Error) {
          if (e.message.includes('eth_requestAccounts')) {
            console.log('Retrying XMTP initialization after delay...');
            setTimeout(init, 2000);
          } else if (e.message.includes('identity update')) {
            console.log('Retrying identity registration...');
            setTimeout(init, 5000);
          }
        }
      }
    };

    init();

    // Cleanup
    return () => {
      if (xmtpClient) {
        try {
          (xmtpClient as Client).close();
        } catch (e: unknown) {
          console.error('Error closing XMTP client:', e);
        }
      }
    };
  }, [walletConnected, litConnected, storageReady, walletAddress, xmtpClient, isInitializing]);

// Check readiness flags
const isXmtpReady = !!xmtpClient;
const isReady =
  isConnected &&
  walletConnected &&
  litConnected &&
  storageReady &&
  isXmtpReady;

useEffect(() => {
  console.log('🧩 Chat readiness state:', {
    isConnected,
    walletConnected,
    litConnected,
    storageReady,
    xmtpClientReady: isXmtpReady,
  });
}, [isConnected, walletConnected, litConnected, storageReady, isXmtpReady]);

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
        {error || 'Waiting for wallet, Lit, storage, and XMTP to be ready'}
      </div>
      <pre className="text-xs bg-gray-100 p-2 rounded max-w-md overflow-auto">
        {JSON.stringify(
          {
            isConnected,
            walletConnected,
            litConnected,
            storageReady,
            xmtpClientReady: isXmtpReady,
          },
          null,
          2
        )}
      </pre>
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
            isConnected={isConnected}
            recipientDid={recipientDid}
            setRecipientDid={setRecipientDid}
            messageText={messageText}
            setMessageText={setMessageText}
            status={status}
            setStatus={setStatus}
            walletAddress={walletAddress || ''}
            litClient={litClient}
            email={email || ''}
            web3SpaceDid={web3SpaceDid || ''}
            chainId={chainId}
            xmtpClient={xmtpClient}
          />

          <Inbox walletAddress={walletAddress} litClient={litClient} xmtpClient={xmtpClient} />
        </div>
      </div>
    </main>
  );
};

export default Chat;
