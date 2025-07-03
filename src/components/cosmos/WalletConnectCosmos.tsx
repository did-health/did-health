import React, { useEffect, useMemo } from 'react';
import { useChainWallet } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';
import type { Wallet } from '@cosmos-kit/core';
import { useTranslation } from 'react-i18next';
import { Button } from '@interchain-ui/react';
import { useOnboardingState } from '../../store/OnboardingState';

const DHEALTH_CHAIN_ID = 'dhealth-1';

export const dhealthChain = {
  chainId: DHEALTH_CHAIN_ID,
  chainName: 'dhealth',
  rpc: 'https://rpc.dhealth.cosmos.directory:443',
  rest: 'https://api.dhealth.cosmos.directory:443',
  stakeCurrency: {
    coinDenom: 'DHT',
    coinMinimalDenom: 'udht',
    coinDecimals: 6,
    coinGeckoId: 'dhealth',
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: 'dhealth',
    bech32PrefixAccPub: 'dhealthpub',
    bech32PrefixValAddr: 'dhealthvaloper',
    bech32PrefixValPub: 'dhealthvaloperpub',
    bech32PrefixConsAddr: 'dhealthvalcons',
    bech32PrefixConsPub: 'dhealthvalconspub',
  },
  currencies: [
    {
      coinDenom: 'DHT',
      coinMinimalDenom: 'udht',
      coinDecimals: 6,
      coinGeckoId: 'dhealth',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'DHT',
      coinMinimalDenom: 'udht',
      coinDecimals: 6,
      coinGeckoId: 'dhealth',
    },
  ],
  features: ['stargate', 'ibc-transfer'],
};



export function Wallet() {
  const { t } = useTranslation();
  const { wallet, status, address, connect, disconnect, chain } = useChainWallet(DHEALTH_CHAIN_ID, 'keplr');

  const { setWalletConnected, setWalletAddress, setChainId } = useOnboardingState();

  useEffect(() => {
    if (status === WalletStatus.Connected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
      setChainId(chain?.chain_id || '');
    }
  }, [status, address, chain?.chain_id]);

  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const openInWallet = () => {
    const dappUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `keplr://${dappUrl}?chain-id=${DHEALTH_CHAIN_ID}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>

      {status === WalletStatus.Connected ? (
        <div className="space-y-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Connected to <strong>{wallet?.name}</strong>
            <br />
            Address: <span className="break-all">{address}</span>
          </p>
          <Button variant="outlined" onClick={disconnect}>
            🔌 {t('onboarding.disconnect')}
          </Button>
        </div>
      ) : (
        <Button onClick={connect}>🔗 {t('onboarding.connect')}</Button>
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
