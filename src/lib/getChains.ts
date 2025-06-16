import { LIT_CHAINS } from "@lit-protocol/constants";
import deployedContracts from "../generated/deployedContracts";

export type NetworkGroup = "mainnet" | "testnet";

export type NetworkConfig = {
  name: string;
  group: NetworkGroup;
  chainId: number;
  chainIdHex: string;
  address: string;
  abi: any;
  rpcUrl: string;
  litChainKey?: keyof typeof LIT_CHAINS;
  litChain?: any;
};

export const chainIdToLitChain: Record<number, string> = {};

let cachedNetworks: NetworkConfig[] | undefined;

export function loadFullChainMetadata(): NetworkConfig[] {
  if (cachedNetworks) return cachedNetworks;

  const networks: NetworkConfig[] = [];

  (["testnet", "mainnet"] as const).forEach((group) => {
    const groupContracts = deployedContracts[group];
    for (const [name, contracts] of Object.entries(groupContracts)) {
      const registry = (contracts as any).HealthDIDRegistry;
      if (!registry?.address || !registry?.abi || !registry?.chainId) continue;

      const chainId = registry.chainId;
      const chainIdHex = `0x${chainId.toString(16)}`;
      const rpcUrl = registry.rpcUrl ?? "";

      // Find LIT chain key dynamically by matching chain ID
      const litChainKey = Object.keys(LIT_CHAINS).find(
        (key) => LIT_CHAINS[key].chainId === chainId
      ) as keyof typeof LIT_CHAINS | undefined;

      const litChain = litChainKey ? LIT_CHAINS[litChainKey] : undefined;

      if (litChainKey && litChain) {
        chainIdToLitChain[chainId] = litChainKey;
      }

      networks.push({
        name,
        group,
        chainId,
        chainIdHex,
        address: registry.address,
        abi: registry.abi,
        rpcUrl,
        litChainKey,
        litChain,
      });
    }
  });

  cachedNetworks = networks;
  return networks;
}

// ✅ New: Get hex chain ID from number
export function getChainIdHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

// ✅ New: Get RPC URL by chain ID
export function getRpcUrl(chainId: number): string | undefined {
  return loadFullChainMetadata().find((n) => n.chainId === chainId)?.rpcUrl;
}

export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
  return loadFullChainMetadata().find((n) => n.chainId === chainId);
}

export function getLitChainByChainId(chainId: number): string | undefined {
  return chainIdToLitChain[chainId];
}
