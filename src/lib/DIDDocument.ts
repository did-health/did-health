import { ethers, JsonRpcProvider} from "ethers";
import deployedContracts from "../generated/deployedContracts";
import {chains}  from '../lib/wagmiConfig' // adjust this path if needed


type ResolvedDID = {
  owner: string
  delegateAddresses: readonly string[]
  healthDid: string
  ipfsUri: string
  altIpfsUris: readonly string[]
  reputationScore: number
  hasWorldId: boolean
  hasPolygonId: boolean
  hasSocialId: boolean
}
export function convertToDidDocument({
  owner,
  healthDid,
  ipfsUri,
  altIpfsUris,
  hasWorldId,
  hasPolygonId,
  hasSocialId,
  reputationScore,
}: {
  owner: string,
  healthDid: string,
  ipfsUri: string,
  altIpfsUris?: string[],
  hasWorldId: boolean,
  hasPolygonId: boolean,
  hasSocialId: boolean,
  reputationScore: number,
}) {
  return {
    id: `did:health:${healthDid}`,
    controller: owner,
    service: [
      {
        id: `did:health:${healthDid}#fhir`,
        type: 'FHIRResource',
        serviceEndpoint: ipfsUri,
      },
    ],
    verificationMethod: [], // optional
    reputationScore,
    credentials: {
      hasWorldId,
      hasPolygonId,
      hasSocialId,
    },
  }
}
export async function resolveDidHealth(chainId: number, address: string) {
  const env = 'testnet'

  console.log('🔍 resolveDidHealth: chainId =', chainId)

  const contractEntry = Object.entries(deployedContracts[env] || {}).find(
    ([key, value]) => {
      if (!value || typeof value !== 'object' || !('HealthDIDRegistry' in value)) {
        return false
      }
      const info = (value as { HealthDIDRegistry: any }).HealthDIDRegistry
      const match =
        info?.chainId === chainId &&
        typeof info?.address === 'string' &&
        Array.isArray(info?.abi) &&
        info.abi.length > 0

      console.log(`🔍 Checking "${key}": chainId=${info?.chainId}, match=${match}`)
      return match
    }
  )

  if (!contractEntry) {
    throw new Error(`❌ No HealthDIDRegistry deployed for chainId: ${chainId}`)
  }

  const [chainKey, chainContracts] = contractEntry
  if (!('HealthDIDRegistry' in chainContracts)) {
    throw new Error(`❌ HealthDIDRegistry not found in chainContracts for chainId: ${chainId}`)
  }
  const registryInfo = (chainContracts as { HealthDIDRegistry: any }).HealthDIDRegistry

  // Get the RPC from your wagmi chain definitions
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) throw new Error(`❌ Chain config not found for chainId: ${chainId}`)

  const rpcUrl = chain.rpcUrls.default.http[0]
  if (!rpcUrl) throw new Error(`❌ No RPC URL for chain "${chain.name}"`)

  const provider = new JsonRpcProvider(rpcUrl)
  const contract = new ethers.Contract(registryInfo.address, registryInfo.abi, provider)

const result = await contract.addressDidMapping(address.toLowerCase())
console.log('📦 Mapping result:', result)

//const result = await contract.getHealthDID(did)

return convertToDidDocument({
  owner: result.owner,
  healthDid: result.healthDid, 
    ipfsUri: result.ipfsUri,
    altIpfsUris: result.altIpfsUris,
    hasWorldId: result.hasWorldId,
    hasPolygonId: result.hasPolygonId,
    hasSocialId: result.hasSocialId,
    reputationScore: Number(result.reputationScore),

  })
}

/**
 * Attempts to resolve a did:health identifier across all supported chains.
 * Returns the DID document and chain info if found.
 */


export async function resolveDidHealthAcrossChains(walletAddress: string) {
  const supportedChains = chains
  console.log(`🔍 Resolving DID for wallet address: ${walletAddress}`)
  for (const chainInfo of supportedChains) {
    console.log(`🔍 Checking "${chainInfo.name}" for DID`)
    try {
      const doc = await resolveDidHealth(chainInfo.id, walletAddress)
      if (doc?.id && doc.id !== 'did:health:') {
        return { doc, chainName: chainInfo.name }
      }
    } catch (err: any) {
      console.warn(`⚠️ DID lookup failed on chain ${chainInfo.name}`, err.message)
    }
  }

  return null
}

export async function resolveDidHealthByDidNameAcrossChains(fullDid: string) {
  const didParts = fullDid.split(':')
  const didName = didParts[didParts.length - 1] // just "didhealth" or "fhirfly3"
  console.log(`🔍 Resolving DID name across chains: ${didName}`)

  const env = 'testnet'

  for (const chainInfo of chains) {
    try {
      const networkKey = Object.keys(deployedContracts[env] || {}).find((key) => {
        const info = (deployedContracts[env] as any)[key]?.HealthDIDRegistry
        return info?.chainId === chainInfo.id
      })

      if (!networkKey) continue

      const registry = (deployedContracts[env] as any)[networkKey]?.HealthDIDRegistry
      if (!registry) continue

      const provider = new JsonRpcProvider(chainInfo.rpcUrls.default.http[0])
      const contract = new ethers.Contract(registry.address, registry.abi, provider)

      const result = await contract.getHealthDID(didName)
      const owner = result.owner

      console.log(`📦 ${chainInfo.name}: owner=${owner}`)

      if (owner && owner !== ethers.ZeroAddress) {
        return {
          doc: convertToDidDocument({
            owner: result.owner,
            healthDid: result.healthDid,
            ipfsUri: result.ipfsUri,
            altIpfsUris: result.altIpfsUris,
            hasWorldId: result.hasWorldId,
            hasPolygonId: result.hasPolygonId,
            hasSocialId: result.hasSocialId,
            reputationScore: Number(result.reputationScore),
          }),
          chainName: chainInfo.name,
        }
      }
    } catch (err: any) {
      console.warn(`❌ DID lookup failed on ${chainInfo.name}: ${err.message}`)
    }
  }

  return null
}
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