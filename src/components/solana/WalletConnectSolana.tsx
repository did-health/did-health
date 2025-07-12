import { useEffect, useMemo, useCallback } from 'react';
import {
  useWallet,
  useConnection,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

import { useTranslation } from 'react-i18next';
import { useOnboardingState } from '../../store/OnboardingState';

/**
 * Deep-link helper for Phantom Mobile on iOS
 */
function usePhantomDeepLink() {
  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const openInPhantom = useCallback(() => {
    const dappUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(dappUrl)}`;
  }, []);
  return { isIOS, openInPhantom };
}

export function ConnectSolanaWallet() {
  const { t } = useTranslation();
  const { publicKey, connected, connect, disconnect, wallet } = useWallet();
  const { connection } = useConnection();

  const {
    setWalletConnected,
    setWalletAddress,
    setChainId,
  } = useOnboardingState();

  const { isIOS, openInPhantom } = usePhantomDeepLink();

  /* ------------------------------------------------------------------ */
  /* Sync Solana wallet state into Zustand                              */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true);
      setWalletAddress(publicKey.toBase58());
      setChainId(9999); // You may use a custom ID or Solana's cluster identifier
    }
  }, [connected, publicKey, setWalletConnected, setWalletAddress, setChainId]);

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>

      {connected && publicKey ? (
        <div className="flex flex-col gap-2">
          <p className="text-green-600">✅ Connected: {publicKey.toBase58()}</p>
          <button onClick={disconnect} className="text-red-600 underline">
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="btn btn-primary"
        >
          {t('onboarding.connectSolana')}
        </button>
      )}

      {isIOS && (
        <button
          onClick={openInPhantom}
          className="mt-4 text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
        >
          {t('onboarding.openInPhantom')}
        </button>
      )}
    </div>
  );
}
