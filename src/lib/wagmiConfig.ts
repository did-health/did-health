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
  safeWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { loadFullChainMetadata } from './getChains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!;
if (!projectId) throw new Error('❌ WalletConnect Project ID missing from .env');

const appName = import.meta.env.VITE_APP_NAME || 'did:health';
const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized health identity';
const appUrl = import.meta.env.VITE_APP_URL || 'https://192.168.8.249:3000/';
const appIcon = import.meta.env.VITE_APP_ICON_URL || 'https://192.168.8.249:3000/public/og-image.png';

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

// ✅ Define each wallet with exact config to avoid type conflict
const popularWallets = [
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  braveWallet,
  ledgerWallet,
  safeWallet,
  injectedWallet,
];

const mobileWallets = [
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  (options: any) =>
    walletConnectWallet({
      ...options,
      projectId,
      options: {
        metadata: {
          name: appName,
          description: appDescription,
          url: appUrl,
          icons: [appIcon],
        },
      },
    }),
];




const walletConnect = walletConnectWallet;

// ✅ Split into two groups so TS doesn’t choke
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: popularWallets,
    },
    {
      groupName: 'Mobile Wallets',
      wallets: mobileWallets,
    },
  ],
  {
    appName,
    projectId,
  }
);
export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
  ),
  ssr: false,
});
