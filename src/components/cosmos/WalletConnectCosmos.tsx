import React, { useEffect, useMemo } from 'react';
import { useChainWallet } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';
import type { Wallet } from '@cosmos-kit/core';
import { useTranslation } from 'react-i18next';
import { Button } from '@interchain-ui/react';
import { useOnboardingState } from '../../store/OnboardingState';

const DHEALTH_CHAIN_ID = 'dhealth-1';

export const dhealthChain = {
  chain_name: 'dhealth',
  chain_type: 'cosmos',
  chain_id: DHEALTH_CHAIN_ID,
  rpc: 'https://rpc.dhealth.cosmos.directory:443',
  rest: 'https://api.dhealth.cosmos.directory:443',
  stake_currency: {
    coin_denom: 'DHT',
    coin_minimal_denom: 'udht',
    coin_decimals: 6,
    coin_gecko_id: 'dhealth',
  },
  bip44: { coin_type: 118 },
  bech32_config: {
    bech32_prefix_acc_addr: 'dhealth',
    bech32_prefix_acc_pub: 'dhealthpub',
    bech32_prefix_val_addr: 'dhealthvaloper',
    bech32_prefix_val_pub: 'dhealthvaloperpub',
    bech32_prefix_cons_addr: 'dhealthvalcons',
    bech32_prefix_cons_pub: 'dhealthvalconspub',
  },
  currencies: [
    {
      coin_denom: 'DHT',
      coin_minimal_denom: 'udht',
      coin_decimals: 6,
      coin_gecko_id: 'dhealth',
      coin_image_url: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dhealth/images/dht.png'
    }
  ],
  fee_currencies: [
    {
      coin_denom: 'DHT',
      coin_minimal_denom: 'udht',
      coin_decimals: 6,
      coin_gecko_id: 'dhealth',
      gas_price_step: {
        low: 0.001,
        average: 0.0025,
        high: 0.004,
      },
      coin_image_url: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dhealth/images/dht.png'
    }
  ],
  features: ['stargate', 'ibc-transfer', 'ibc-go', 'cosmwasm'],
  coin_type: 118,
  decimals: 6,
  gas_price: 0.0025,
  gas_price_step: {
    low: 0.001,
    average: 0.0025,
    high: 0.004,
  },
  coin_gecko_id: 'dhealth',
  coin_image_url: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dhealth/images/dht.png',
  explorer_url: 'https://dhealth.cosmos.directory',
  chain_type_pretty: 'Cosmos',
  chain_type_pretty_short: 'Cosmos',
  chain_type_pretty_shortest: 'C',
  chain_type_pretty_shortest_color: '#2563eb',
  chain_type_pretty_shortest_color_dark: '#3b82f6',
  chain_type_pretty_shortest_color_light: '#60a5fa',
  chain_type_pretty_shortest_color_lighter: '#93c5fd',
  chain_type_pretty_shortest_color_lightest: '#bfdbfe',
  chain_type_pretty_shortest_color_darker: '#1d4ed8',
  chain_type_pretty_shortest_color_darkest: '#1e40af',
  chain_type_pretty_shortest_color_contrast: '#ffffff',
  chain_type_pretty_shortest_color_contrast_dark: '#000000',
  chain_type_pretty_shortest_color_contrast_light: '#ffffff',
  chain_type_pretty_shortest_color_contrast_lighter: '#ffffff',
  chain_type_pretty_shortest_color_contrast_lightest: '#ffffff',
  chain_type_pretty_shortest_color_contrast_darkest: '#000000',
  chain_type_pretty_shortest_color_contrast_darker: '#000000'
} as const;



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
