export interface ContractInfo {
  address: string;
  abi: readonly {
    type: string;
    inputs?: readonly {
      name: string;
      type: string;
      internalType?: string;
    }[];
    outputs?: readonly {
      name: string;
      type: string;
      internalType?: string;
    }[];
    stateMutability?: string;
  }[];
  chainId: number;
  chainIdHex: string;
  rpcUrl: string;
  graphRpcUrl?: string;
}

export interface NetworkContracts {
  DidHealthDAO?: ContractInfo;
  HealthDIDRegistry?: ContractInfo;
}

export interface DeployedContracts {
  testnet: Record<string, NetworkContracts>;
  mainnet: Record<string, NetworkContracts>;
}
