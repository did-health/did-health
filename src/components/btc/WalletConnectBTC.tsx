// src/components/ConnectWalletBTC.tsx
import { useEffect, useState } from 'react';
import { useOnboardingState } from '../../store/OnboardingState';

export function ConnectWalletBTC() {
  const [walletName, setWalletName] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setWalletConnected,
    setWalletAddress: setGlobalWalletAddress,
  } = useOnboardingState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.unisat) {
        setWalletName('UniSat');
        setIsInstalled(true);
      } else if (window.xverse) {
        setWalletName('Xverse');
        setIsInstalled(true);
      } else {
        setWalletName(null);
        setIsInstalled(false);
        setError('No supported Bitcoin wallets found. Install UniSat or Xverse.');
      }
    }
  }, []);

  const connectUniSat = async () => {
    try {
      if (!window.unisat) {
        throw new Error('UniSat wallet is not available.');
      }
      const accounts = await window.unisat.requestAccounts();
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      setGlobalWalletAddress(accounts[0]);
    } catch (err) {
      console.error('UniSat connection error:', err);
      setError('Failed to connect to UniSat.');
    }
  };

  const connectXverse = async () => {
    try {
      if (!window.xverse) {
        throw new Error('Xverse wallet is not available.');
      }
      const response = await window.xverse.connect();
      const address = response?.addresses?.bitcoin;
      if (address) {
        setWalletAddress(address);
        setWalletConnected(true);
        setGlobalWalletAddress(address);
      } else {
        throw new Error('No Bitcoin address returned.');
      }
    } catch (err) {
      console.error('Xverse connection error:', err);
      setError('Failed to connect to Xverse.');
    }
  };

  const connectWallet = () => {
    setError(null);
    if (walletName === 'UniSat') return connectUniSat();
    if (walletName === 'Xverse') return connectXverse();
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Connect Bitcoin Wallet</h2>

      {isInstalled && walletName ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Detected wallet: <strong>{walletName}</strong>
          </p>
          <button
            onClick={connectWallet}
            className="btn btn-primary"
          >
            Connect {walletName}
          </button>
        </>
      ) : (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {walletAddress && (
        <p className="mt-4 text-green-600">✅ Connected: {walletAddress}</p>
      )}
    </div>
  );
}

// Extend window type for TS
declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
    };
    xverse?: {
      connect: () => Promise<{ addresses: { bitcoin: string } }>;
    };
  }
}
