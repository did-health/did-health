import { ethers, JsonRpcProvider} from "ethers";
import deployedContracts from "../generated/deployedContracts";

// Define types for deployed contracts
interface ContractConfig {
  readonly address: string;
  readonly abi: readonly any[];
  readonly graphRpcUrl?: string;
}

interface NetworkConfig {
  readonly DidHealthDAO: ContractConfig;
  readonly HealthDIDRegistry?: ContractConfig & {
    readonly chainId: number;
  };
}

interface DeployedContracts {
  readonly testnet: {
    readonly [key: string]: NetworkConfig;
  };
  readonly mainnet: {
    readonly [key: string]: NetworkConfig;
  };
}

const contracts = deployedContracts as unknown as DeployedContracts;
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
export async function registerHealthDID(chainId: number, didName: string, ipfsUri: string, provider: JsonRpcProvider) {
  const env = 'testnet';
  const networkKey = Object.keys(deployedContracts[env] || {}).find((key) => {
    const info = (deployedContracts[env] as any)[key]?.HealthDIDRegistry;
    return info?.chainId === chainId;
  });

  if (!networkKey) {
    throw new Error(`No HealthDIDRegistry found for chain ID ${chainId}`);
  }

  const registry = (deployedContracts[env] as any)[networkKey]?.HealthDIDRegistry;
  if (!registry) {
    throw new Error(`HealthDIDRegistry contract not found for chain ${networkKey}`);
  }

  const contract = new ethers.Contract(registry.address, registry.abi, provider);

  try {
    const tx = await contract.registerHealthDID(didName, ipfsUri);
    await tx.wait();
    console.log(`Successfully registered DID ${didName} on ${networkKey}`);
    return true;
  } catch (error) {
    console.error('Error registering DID:', error);
    throw error;
  }
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
console.log('📦 DID resolution result:', result)

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


export async function resolveDidHealthAcrossChains(walletAddress: string, chainId?: number) {
  const supportedChains = chains;
  console.log(`🔍 Resolving DID for wallet address: ${walletAddress}`);

  const chainsToCheck = chainId
    ? supportedChains.filter((c) => c.id === chainId)
    : supportedChains;

  for (const chainInfo of chainsToCheck) {
    console.log(`🔍 Checking "${chainInfo.name}" for DID`);
    try {
      const doc = await resolveDidHealth(chainInfo.id, walletAddress);
      if (doc?.id && doc.id !== 'did:health:') {
        return { doc, chainName: chainInfo.name };
      }
    } catch (err: any) {
      console.warn(`⚠️ DID lookup failed on chain ${chainInfo.name}`, err.message);
    }
  }

  return null;
}

export async function resolveDidHealthByDidNameAcrossChains(fullDid: string) {
  console.log("recoling:" + fullDid)
  const didParts = fullDid.split(':');
  if (didParts.length < 4) {
    throw new Error('Invalid DID format, expected did:health:<chainId>:<didName>');
  }

  const chainIdStr = didParts[2];
  const didName = didParts[3];
  const chainId = Number(chainIdStr);
  console.log(chainIdStr)
  if (isNaN(chainId)) {
    throw new Error('Invalid chainId in DID');
  }

  const env = 'testnet';

  // Find chain info for this chainId
  const chainInfo = chains.find((c) => c.id === chainId);
  if (!chainInfo) {
    throw new Error(`Chain with ID ${chainId} not found`);
  }

  // Find the deployed HealthDIDRegistry for this chainId
  const networkKey = Object.keys(deployedContracts[env] || {}).find((key) => {
    const info = (deployedContracts[env] as any)[key]?.HealthDIDRegistry;
    return info?.chainId === chainId;
  });

  if (!networkKey) {
    throw new Error(`No HealthDIDRegistry found for chain ID ${chainId}`);
  }

  const registry = (deployedContracts[env] as any)[networkKey]?.HealthDIDRegistry;
  if (!registry) {
    throw new Error(`HealthDIDRegistry contract not found for chain ${networkKey}`);
  }

  const provider = new JsonRpcProvider(chainInfo.rpcUrls.default.http[0]);
  const contract = new ethers.Contract(registry.address, registry.abi, provider);

  try {
    console.log('calling addressDidMapping')
    const result = await contract.addressDidMapping(didName);
    console.log(result)
    const owner = result.owner;

    console.log(`📦 ${chainInfo.name}: owner=${owner}`);

    if (owner && owner !== ethers.ZeroAddress) {
      const result = await contract.addressDidMapping(owner);
      console.log('DID information:', result);
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
      };
    }
  } catch (err: any) {
    console.warn(`❌ DID lookup failed on ${chainInfo.name}: ${err.message}`);
  }

  return null;
}


export async function resolveDidHealthByDidName(fullDid: string) {
  console.log(`🧩 Resolving DID: ${fullDid}`);

  const didParts = fullDid.split(':');
  if (didParts.length < 4) {
    throw new Error('❌ Invalid DID format: expected did:health:<chainId>:<didName>');
  }

  const chainIdStr = didParts[2];
  const didName = didParts[3];
  const chainId = Number(chainIdStr);

  if (isNaN(chainId)) {
    throw new Error(`❌ Invalid chainId "${chainIdStr}" in DID`);
  }

  const chainInfo = chains.find((c) => Number(c.id) === chainId);
  if (!chainInfo) {
    throw new Error(`❌ Chain ID ${chainId} not found in configured chains`);
  }

  const env = 'testnet'; // or 'mainnet' based on your current config
  const networkKey = Object.keys(contracts[env]).find((key) => {
    const info = contracts[env][key]?.HealthDIDRegistry;
    return info?.chainId === chainId;
  });

  if (!networkKey) {
    throw new Error(`❌ No deployed contract found for chain ID ${chainId}`);
  }

  const registry = contracts[env][networkKey]?.HealthDIDRegistry;
  if (!registry) {
    throw new Error(`❌ HealthDIDRegistry missing for network "${networkKey}"`);
  }

  const rpcUrl = chainInfo.rpcUrls.default.http[0];
  console.log(`🔗 Using RPC: ${rpcUrl}`);
  const provider = new JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(registry.address, registry.abi, provider);
  console.log(`📞 Calling getHealthDID("${didParts[2] + ";" + didParts[3]}") on ${networkKey}`);

  try {
    const result = await contract.getHealthDID(didParts[2] + ";" + didParts[3]);
    console.log(`✅ DID Info:`, result);
    
    if (result.owner && result.owner !== ethers.ZeroAddress) {
      const doc = convertToDidDocument({
        owner: result.owner,
        healthDid: result.healthDid,
        ipfsUri: result.ipfsUri,
        altIpfsUris: result.altIpfsUris,
        hasWorldId: result.hasWorldId,
        hasPolygonId: result.hasPolygonId,
        hasSocialId: result.hasSocialId,
        reputationScore: Number(result.reputationScore),
      });
      return {
        doc,
        chainName: chainInfo.name,
      };
    } else {
      console.log(`📦 ${chainInfo.name}: No owner found for DID ${didName}`);
      return null;
    }
  } catch (err: any) {
    console.error(`❌ DID lookup failed:`, err);
    throw new Error(`❌ Error resolving DID: ${err.message}`);
  }
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