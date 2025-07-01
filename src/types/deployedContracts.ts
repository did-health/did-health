export type ContractData = {
  readonly address: string;
  readonly abi: readonly any[];
  readonly chainId: number;
  readonly chainIdHex: string;
  readonly rpcUrl: string;
  readonly graphRpcUrl?: string;
};

export type ChainData = {
  readonly DidHealthDAO?: ContractData;
  readonly HealthDIDRegistry?: ContractData;
};

export type DeployedContracts = {
  readonly testnet: {
    readonly arbitrumSepolia?: ChainData;
    readonly baseSepolia?: ChainData;
    readonly lineaSepolia?: ChainData;
    readonly optimismSepolia?: ChainData;
    readonly polygonPOSAmoy?: ChainData;
    readonly sepolia?: ChainData;
    readonly zksyncSepolia?: ChainData;
  };
  readonly mainnet: {
    readonly arbitrum?: ChainData;
    readonly base?: ChainData;
    readonly linea?: ChainData;
    readonly optimism?: ChainData;
    readonly polygonPOS?: ChainData;
    readonly ethereum?: ChainData;
    readonly zksync?: ChainData;
  };
};
