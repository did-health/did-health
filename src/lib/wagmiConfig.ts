import { createConfig, http } from 'wagmi';
import type { Chain } from 'viem/chains';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  braveWallet,
  ledgerWallet,
  omniWallet,
  safeWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { loadFullChainMetadata } from './getChains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;
if (!projectId) throw new Error('❌ WalletConnect Project ID missing from .env');

// ✅ Build wagmi-compatible chains from your deployedContracts
function buildChains(): readonly [Chain, ...Chain[]] {
  const networks = loadFullChainMetadata();

  const chains: Chain[] = networks.map((net): Chain => ({
    id: net.chainId,
    name: net.name,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: [net.rpcUrl] },
      public: { http: [net.rpcUrl] },
    },
    blockExplorers: {
      default: {
        name: `${net.name} Explorer`,
        url: `https://${net.name}.etherscan.io`,
      },
    },
  }));

  if (chains.length === 0) {
    throw new Error('❌ No chains found in deployedContracts');
  }

  return chains as [Chain, ...Chain[]];
}

export const chains = buildChains();

// ✅ Pass wallet factories (not instances) and shared config to connectorsForWallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        coinbaseWallet,
        braveWallet,
        ledgerWallet,
        omniWallet,
        safeWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'did:health',
    projectId,
  }
);

// ✅ Final wagmi config export
export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
  ),
  ssr: false,
});
