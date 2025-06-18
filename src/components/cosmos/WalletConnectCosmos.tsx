import React, { useEffect, useMemo } from 'react';
import { useChainWallet } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';
import { useTranslation } from 'react-i18next';
import { useOnboardingState } from '../../store/OnboardingState';
import { Button } from '@interchain-ui/react';

const chainName = 'dhealth';
const walletName = 'keplr';

function useMobileDeepLink(walletName: string) {
  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const openInWallet = () => {
    const dappUrl = window.location.href.replace(/^https?:\/\//, '');
    const encodedUrl = encodeURIComponent(dappUrl);
    switch (walletName) {
      case 'keplr':
        window.location.href = `https://wallet.keplr.app/#/dapp/${encodedUrl}`;
        break;
      case 'leap':
        window.location.href = `https://wallet.leapwallet.io/dapp/${encodedUrl}`;
        break;
      default:
        break;
    }
  };
  return { isIOS, openInWallet };
}

export function Wallet() {
  const { t } = useTranslation();

  const {
    wallet,
    status,
    address,
    connect,
    disconnect,
    chain,
  } = useChainWallet(chainName, walletName);

  const {
    setWalletConnected,
    setWalletAddress,
    setChainId,
  } = useOnboardingState();

  const { isIOS, openInWallet } = useMobileDeepLink(wallet?.name || '');

  useEffect(() => {
    if (status === WalletStatus.Connected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
      setChainId(chain?.chain_id ? chain.chain_id : ''); // chain_id usually string
    }
  }, [status, address, chain?.chain_id]);

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>

      {status === WalletStatus.Connected ? (
        <div className="space-y-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Connected to <strong>{wallet?.name}</strong><br />
            Address: <span className="break-all">{address}</span>
          </p>
          <Button variant="outlined" onClick={() => disconnect()}>
            🔌 {t('onboarding.disconnect')}
          </Button>
        </div>
      ) : (
        <Button onClick={() => connect()}>
          🔗 {t('onboarding.connect')}
        </Button>
      )}

      {isIOS && wallet?.name && (
        <button
          onClick={openInWallet}
          className="mt-4 text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
        >
          {t('onboarding.openInWallet')}
        </button>
      )}
    </div>
  );
}
