// utils/litChainMap.ts
import { LIT_CHAINS } from '@lit-protocol/constants'
import  deployedContracts  from '../generated/deployedContracts'

export async function getAvailableChains(): Promise<string[]> {
  const res = await fetch('/api/deployedContracts') // or full URL if external
  const data = await res.json()
  return Object.keys(data) // assuming format: { sepolia: {address:...}, ... }
}


export const deployedToLitChainKeyMap: Record<string, keyof typeof LIT_CHAINS> = {
  sepolia: 'sepolia',
  baseSepolia: 'base-sepolia',
  optimismSepolia: 'optimism-sepolia',
  polygonMumbai: 'polygon-mumbai',
  polygon: 'polygon',
  base: 'base',
  arbitrum: 'arbitrum',
  arbitrumSepolia: 'arbitrum-sepolia',
  ethereum: 'ethereum',
}


export const chainIdToLitChain: Record<number, string> = {}

for (const [chainKey, contracts] of Object.entries(deployedContracts)) {
  const HealthDIDRegistry = (contracts as any).HealthDIDRegistry
  if (!HealthDIDRegistry?.chainId) continue

  const litChainKey = deployedToLitChainKeyMap[chainKey]
  console.log(`🔗 Chain "${chainKey}" → LIT chain "${litChainKey}"`)
  const litChain = LIT_CHAINS[litChainKey]
console.log(`🔗 LIT chain:`, litChain)
  if (!litChain) {
    console.warn(`⚠️ Missing LIT_CHAINS entry for chain "${chainKey}" → "${litChainKey}"`)
    continue
  }

  chainIdToLitChain[HealthDIDRegistry.chainId] = String(litChain)
    console.log(`🔗 Mapped chainId ${HealthDIDRegistry.chainId} to LIT chain "${litChainKey}"`)
}
