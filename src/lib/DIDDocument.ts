import { ethers, JsonRpcProvider } from "ethers";
import deployedContracts from "../generated/deployedContracts";
import { chains, getRpcUrl } from '../lib/wagmiConfig';

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

/**
 * Resolve a DID from an address on a specific chain.
 * @returns { doc, chainName }
 */
export async function resolveDidHealth(chainId: number, address: string) {
  const env = 'testnet';
  const contractEntry = Object.entries(contracts[env] || {}).find(
    ([, value]) => value?.HealthDIDRegistry?.chainId === chainId
  );

  if (!contractEntry) {
    throw new Error(`❌ No HealthDIDRegistry deployed for chainId: ${chainId}`);
  }

  const [chainKey, chainContracts] = contractEntry;
  const registryInfo = chainContracts.HealthDIDRegistry;
  const chain = chains.find((c) => c.id === chainId);
  if (!chain || !registryInfo) {
    throw new Error(`❌ Missing chain or registry info`);
  }

  // Get the RPC URL from wagmiConfig
  const rpcUrl = getRpcUrl(chainId);
  if (!rpcUrl) {
    throw new Error(`❌ No RPC URL configured for chainId: ${chainId}`);
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(registryInfo.address, registryInfo.abi, provider);
//console.log('****************' + contract)
  const result = await contract.addressDidMapping(address.toLowerCase());
console.log('****************result' + result)
  if (!result?.owner || result.owner === ethers.ZeroAddress) {
    throw new Error(`❌ No DID found for address ${address}`);
    return;
  }

  if (!result.ipfsUri) {
    throw new Error(`❌ DID has no associated IPFS URI`);
    return;
  }

  const ipfsUrl = result.ipfsUri
  console.log('****************' + ipfsUrl)
  const response = await fetch(ipfsUrl);
  if (!response.ok) throw new Error(`❌ Failed to fetch DID document from IPFS`);
  console.log('****************' + response)
  const didDoc = await response.json();
  console.log('****************' + didDoc)
  return { doc: didDoc, chainName: chain.name };
}

/**
 * Resolve a DID from an address across all supported chains.
 * @returns { doc, chainName } or null
 */
export async function resolveDidHealthAcrossChains(walletAddress: string, chainId?: number) {
  const chainsToCheck = chainId ? chains.filter((c) => c.id === chainId) : chains;

  for (const chainInfo of chainsToCheck) {
    try {
      const result = await resolveDidHealth(chainInfo.id, walletAddress);
      if (result?.doc?.id) return result;
    } catch (err) {
      console.warn(`Chain ${chainInfo.name} did not return a valid DID:`, err);
    }
  }

  return null;
}

/**
 * Resolve a DID from the full DID string.
 * @returns { doc, chainName }
 */
export async function resolveDidHealthByDidName(fullDid: string) {
  const didParts = fullDid.split(':');
  if (didParts.length < 4) throw new Error('❌ Invalid DID format');

  const [,, chainIdStr, didName] = didParts;
  const chainId = Number(chainIdStr);

  const chainInfo = chains.find((c) => c.id === chainId);
  if (!chainInfo) throw new Error(`❌ Chain ID ${chainId} not supported`);

  const env = 'testnet';
  const networkKey = Object.keys(contracts[env]).find(
    (key) => contracts[env][key]?.HealthDIDRegistry?.chainId === chainId
  );
  if (!networkKey) throw new Error(`❌ No contract for chain ID ${chainId}`);

  const registry = contracts[env][networkKey]?.HealthDIDRegistry;
  if (!registry) throw new Error(`❌ No registry contract found for chain ID ${chainId}`);
  const provider = new JsonRpcProvider(chainInfo.rpcUrls.default.http[0]);
  const contract = new ethers.Contract(registry.address, registry.abi, provider);

  const result = await contract.getHealthDID(didName);
  const [owner, , ipfsUri] = result;

  if (!owner || owner === ethers.ZeroAddress) throw new Error(`❌ DID not found`);
  if (!ipfsUri) throw new Error(`❌ DID has no associated IPFS URI`);

  const ipfsUrl = ipfsUri
  console.log('****************' + ipfsUrl)
  const response = await fetch(ipfsUrl);
  if (!response.ok) throw new Error(`❌ Failed to fetch DID document`);

  const didDoc = await response.json();
  return { doc: didDoc, chainName: chainInfo.name };
}

/**
 * Resolve a DID by name across all chains.
 * @returns { doc, chainName } or null
 */
export async function resolveDidHealthByDidNameAcrossChains(fullDid: string) {
  const didParts = fullDid.split(':');
  if (didParts.length < 4) throw new Error('❌ Invalid DID format');

  const chainId = Number(didParts[2]);
  const chainInfo = chains.find((c) => c.id === chainId);
  if (!chainInfo) throw new Error(`❌ Unsupported chain ID ${chainId}`);

  try {
    return await resolveDidHealthByDidName(fullDid);
  } catch (err) {
    console.warn(`❌ DID resolution failed for chain ${chainInfo.name}:`, err);
    return null;
  }
}

/**
 * Return all supported chains for DID resolution.
 */
export const getSupportedChains = (): { chainId: number; name: string }[] => {
  const testnets = deployedContracts.testnet || {};
  const mainnets = deployedContracts.mainnet || {};
  const result: { chainId: number; name: string }[] = [];

  for (const [name, contracts] of Object.entries({ ...testnets, ...mainnets })) {
    const registry = (contracts as any).HealthDIDRegistry;
    if (registry?.chainId) {
      result.push({ chainId: registry.chainId, name });
    }
  }
  return result;
};
