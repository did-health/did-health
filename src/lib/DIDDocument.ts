import { ethers, JsonRpcProvider } from "ethers";
import deployedContracts from "../generated/deployedContracts";
import { chains } from '../lib/wagmiConfig';

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
  owner: string;
  healthDid: string;
  ipfsUri: string;
  altIpfsUris?: string[];
  hasWorldId: boolean;
  hasPolygonId: boolean;
  hasSocialId: boolean;
  reputationScore: number;
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
      ...(altIpfsUris || []).map((uri, index) => ({
        id: `did:health:${healthDid}#alt-${index}`,
        type: 'FHIRResource',
        serviceEndpoint: uri,
      }))
    ],
    verificationMethod: [],
    reputationScore,
    credentials: {
      hasWorldId,
      hasPolygonId,
      hasSocialId,
    },
  };
}

export async function resolveDidHealth(chainId: number, address: string) {
  const env = 'testnet';
  const contractEntry = Object.entries(deployedContracts[env] || {}).find(
    ([, value]) => value?.HealthDIDRegistry?.chainId === chainId
  );

  if (!contractEntry) {
    throw new Error(`❌ No HealthDIDRegistry deployed for chainId: ${chainId}`);
  }

  const [chainKey, chainContracts] = contractEntry;
  const registryInfo = chainContracts.HealthDIDRegistry;
  const chain = chains.find((c) => c.id === chainId);
  if (!chain || !registryInfo) throw new Error(`❌ Missing chain or registry info`);

  const provider = new JsonRpcProvider(chain.rpcUrls.default.http[0]);
  const contract = new ethers.Contract(registryInfo.address, registryInfo.abi, provider);
  const result = await contract.addressDidMapping(address.toLowerCase());

  return convertToDidDocument({
    owner: result.owner,
    healthDid: result.healthDid,
    ipfsUri: result.ipfsUri,
    altIpfsUris: result.altIpfsUris,
    hasWorldId: result.hasWorldId,
    hasPolygonId: result.hasPolygonId,
    hasSocialId: result.hasSocialId,
    reputationScore: Number(result.reputationScore),
  });
}

export async function resolveDidHealthAcrossChains(walletAddress: string, chainId?: number) {
  const chainsToCheck = chainId ? chains.filter((c) => c.id === chainId) : chains;
  for (const chainInfo of chainsToCheck) {
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

export async function resolveDidHealthByDidName(fullDid: string) {
  const didParts = fullDid.split(':');
  if (didParts.length < 4) throw new Error('❌ Invalid DID format');
  const [,, chainIdStr, didName] = didParts;
  const chainId = Number(chainIdStr);

  const chainInfo = chains.find((c) => Number(c.id) === chainId);
  if (!chainInfo) throw new Error(`❌ Chain ID ${chainId} not found`);

  const env = 'testnet';
  const networkKey = Object.keys(contracts[env]).find((key) => contracts[env][key]?.HealthDIDRegistry?.chainId === chainId);
  if (!networkKey) throw new Error(`❌ No deployed contract found for chain ID ${chainId}`);

  const registry = contracts[env][networkKey]?.HealthDIDRegistry;
  const provider = new JsonRpcProvider(chainInfo.rpcUrls.default.http[0]);
  const contract = new ethers.Contract(registry.address, registry.abi, provider);

  try {
    const result = await contract.getHealthDID(didName);
    const [owner, healthDid, ipfsUri, altIpfsUris, hasWorldId, hasPolygonId, hasSocialId, reputationScore] = result;
    console.log('************************.'+ altIpfsUris)
    return {
      doc: convertToDidDocument({
        owner,
        healthDid,
        ipfsUri,
        altIpfsUris,
        hasWorldId,
        hasPolygonId,
        hasSocialId,
        reputationScore: Number(reputationScore),
      }),
      chainName: chainInfo.name,
    };
  } catch (err: any) {
    throw new Error(`❌ Error resolving DID: ${err.message}`);
  }
}

export async function resolveDidHealthByDidNameAcrossChains(fullDid: string) {
  const didParts = fullDid.split(':');
  if (didParts.length < 4) throw new Error('Invalid DID format');
  const chainId = Number(didParts[2]);
  const didName = didParts[3];

  const chainInfo = chains.find((c) => c.id === chainId);
  if (!chainInfo) throw new Error(`Chain with ID ${chainId} not found`);

  const env = 'testnet';
  const networkKey = Object.keys(deployedContracts[env] || {}).find((key) => {
    const info = (deployedContracts[env] as any)[key]?.HealthDIDRegistry;
    return info?.chainId === chainId;
  });

  if (!networkKey) throw new Error(`No HealthDIDRegistry found for chain ID ${chainId}`);
  const registry = (deployedContracts[env] as any)[networkKey]?.HealthDIDRegistry;
  const provider = new JsonRpcProvider(chainInfo.rpcUrls.default.http[0]);
  const contract = new ethers.Contract(registry.address, registry.abi, provider);

  try {
    const result = await contract.getHealthDID(didName);
    const [owner, healthDid, ipfsUri, altIpfsUris, hasWorldId, hasPolygonId, hasSocialId, reputationScore] = result;
    console.log(altIpfsUris)
    return {
      doc: convertToDidDocument({
        owner,
        healthDid,
        ipfsUri,
        altIpfsUris,
        hasWorldId,
        hasPolygonId,
        hasSocialId,
        reputationScore: Number(reputationScore),
      }),
      chainName: chainInfo.name,
    };
  } catch (err: any) {
    throw new Error(`❌ Error resolving DID: ${err.message}`);
  }
}

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
