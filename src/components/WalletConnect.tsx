import { useEffect, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { useOnboardingState } from '../store/OnboardingState';

/**
 * Deep-link helper for MetaMask Mobile.
 * iOS mobile browsers do NOT expose window.ethereum,
 * so we give users a one-click fallback that opens the dapp
 * directly inside MetaMask Mobile.
 */
function useMetaMaskDeepLink() {
  // naïve check is fine here – we only care about iOS browsers
  const isIOS = useMemo(
    () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
    []
  );

  const openInMetaMask = () => {
    // Strip the protocol so MetaMask’s router accepts the URL
    const dappUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `https://metamask.app.link/dapp/${encodeURIComponent(
      dappUrl
    )}`;
  };

  return { isIOS, openInMetaMask };
}

export function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { t } = useTranslation();

  const {
    setWalletConnected,
    setWalletAddress,
    setChainId,
  } = useOnboardingState();

  const { isIOS, openInMetaMask } = useMetaMaskDeepLink();

  /* ------------------------------------------------------------------ */
  /* Synchronise wagmi + Zustand state                                  */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
    }
  }, [isConnected, address, setWalletConnected, setWalletAddress]);

  useEffect(() => {
    setChainId(chainId);
  }, [chainId, setChainId]);

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>

      {/* RainbowKit modal trigger */}
      <ConnectButton showBalance={false} />

      {/* iOS fallback — deep-link straight to MetaMask Mobile */}
      {isIOS && (
        <button
          onClick={openInMetaMask}
          className="mt-4 text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
        >
          {t('onboarding.openInMetaMask')}
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;
