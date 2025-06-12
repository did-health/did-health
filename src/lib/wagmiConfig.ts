import { createConfig, http } from 'wagmi'
import {
  walletConnect,
  injected,
  coinbaseWallet,
} from 'wagmi/connectors'
import type { Chain } from 'viem/chains'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY as string
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string

// All Alchemy-supported testnets with Alchemy RPCs
const sepolia: Chain = {
  id: 11155111,
  name: 'Ethereum Sepolia',
  nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: ['https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
}

const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
}

const scrollSepolia: Chain = {
  id: 534351,
  name: 'Scroll Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://scroll-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://scroll-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Scrollscan', url: 'https://sepolia.scrollscan.dev' },
  },
}

const arbitrumSepolia: Chain = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
}

const polygonMumbai: Chain = {
  id: 80001,
  name: 'Polygon Mumbai',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://mumbai.polygonscan.com' },
  },
}

const polygonAmoy: Chain = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://amoy.polygonscan.com' },
  },
}

const mainnet: Chain = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
}

const base: Chain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
}

const scroll: Chain = {
  id: 534352,
  name: 'Scroll',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://scroll-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://scroll-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Scrollscan', url: 'https://scrollscan.com' },
  },
}

const arbitrum: Chain = {
  id: 42161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
  },
}

const polygon: Chain = {
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
    public: { http: [`https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://polygonscan.com' },
  },
}


export const chains = [
  sepolia,
  baseSepolia,
  scrollSepolia,
  arbitrumSepolia,
  polygonMumbai,
  polygonAmoy,
  mainnet,
  base,
  scroll,
  arbitrum,
  polygon,
] as const satisfies readonly [Chain, ...Chain[]]


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
  
})
