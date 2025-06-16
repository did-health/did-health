import { createConfig, http } from 'wagmi';
import {
  walletConnect,
  injected,
  coinbaseWallet,
} from 'wagmi/connectors';
import type { Chain } from 'viem/chains';

import { loadFullChainMetadata } from './getChains'; // adjust the path as needed

//const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY as string;
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

// Build Viem-style `Chain` objects from dynamic chain metadata
function buildChains(): readonly [Chain, ...Chain[]] {
  const networks = loadFullChainMetadata();

  const chains: Chain[] = networks.map((net): Chain => ({
    id: net.chainId,
    name: net.name,
    nativeCurrency: {
      name: 'ETH', // Adjust if different per network
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
        url: `https://${net.name}.etherscan.io`, // optionally adjust per-chain if you store it
      },
    },
  }));

  if (chains.length === 0) {
    throw new Error('No chains found in deployedContracts');
  }

  return chains as [Chain, ...Chain[]];
}

export const chains = buildChains();

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'DID:health' }),
    walletConnect({ projectId, showQrModal: true }),
  ],
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
  ),
  ssr: false,
});
