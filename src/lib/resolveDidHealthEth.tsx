import deployedContracts from '../generated/deployedContracts'
import { resolveDidHealth } from './DIDDocument'

/**
 * Returns a list of chainIds that have HealthDIDRegistry contracts deployed.
 */
export const getSupportedChains = (): { chainId: number; name: string }[] => {
  const testnets = deployedContracts.testnet || {}
  const mainnets = deployedContracts.mainnet || {}

  const result: { chainId: number; name: string }[] = []

  for (const [name, contracts] of Object.entries({ ...testnets, ...mainnets })) {
    const registry = (contracts as any).HealthDIDRegistry
    if (registry?.chainId) {
      result.push({ chainId: registry.chainId, name })
    }
  }

  return result
}



