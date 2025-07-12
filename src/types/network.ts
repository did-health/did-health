export interface NetworkConfig {
  DidHealthDAO?: {
    address: string;
    abi: any;
    chainId: number;
    chainIdHex: string;
    rpcUrl: string;
    graphRpcUrl?: string;
  };
  HealthDIDRegistry?: {
    address: string;
    abi: any;
    chainId: number;
    chainIdHex: string;
    rpcUrl: string;
    graphRpcUrl?: string;
  };
}
