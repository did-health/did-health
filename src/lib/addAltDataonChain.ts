import { getWalletClient, getPublicClient } from '@wagmi/core'
import { wagmiConfig } from './wagmiConfig'
import contracts from '../generated/deployedContracts'
export { contracts }

interface ContractConfig {
  address: `0x${string}`
  abi: any[]
  chainId: number
}

interface ChainContracts {
  HealthDIDRegistry: ContractConfig
}

interface NetworkContracts {
  [key: string]: ChainContracts
}

type Network = 'testnet' | 'mainnet'
export type ChainName = keyof typeof contracts['testnet'] | keyof typeof contracts['mainnet']

// Get all chain names from both testnet and mainnet
const getAllChainNames = (): ChainName[] => {
  const chainNames = new Set<ChainName>()
  for (const network of ['testnet', 'mainnet'] as const) {
    Object.keys(contracts[network]).forEach(chain => {
      chainNames.add(chain as ChainName)
    })
  }
  return Array.from(chainNames)
}

type AddAltDataOnChainParams = {
  healthDid: `0x${string}`
  uris: string[]
  chainName: ChainName
}

export async function addAltDataOnChain({ healthDid, uris, chainName }: AddAltDataOnChainParams) {
  // Find the correct network (testnet or mainnet) that contains this chain
  const network = Object.entries(contracts).find(([_, chains]) => chainName in chains)?.[0] as Network | undefined
  if (!network) {
    throw new Error(`❌ Invalid chain name: ${chainName}`)
  }

  // Get the chain configuration from the correct network
  const chainConfig = contracts[network]?.[chainName as keyof typeof contracts[Network]] as ChainContracts | undefined
  if (!chainConfig) throw new Error(`❌ Missing chain configuration for ${chainName} on ${network}`)

  // Get the contract info from the chain configuration
  const contractInfo = chainConfig.HealthDIDRegistry
  if (!contractInfo) throw new Error(`❌ Missing contract for ${chainName} on ${network}`)

  // Parse the DID and get only the 3rd and 4th parts
  const didParts = healthDid.split(':');
  if (didParts.length < 4) {
    throw new Error('❌ Invalid DID format');
  }
  const didToSubmit = didParts[2] + ':' + didParts[3];

  const walletClient = await getWalletClient(wagmiConfig, { chainId: contractInfo.chainId })
  const [account] = await walletClient.getAddresses()

  try {
    const txHash = await walletClient.writeContract({
      address: contractInfo.address,
      abi: contractInfo.abi,
      functionName: 'addAltData',
      args: [didToSubmit, uris],
      account,
    });

    console.log('✅ Transaction sent:', { hash: txHash });
    
    const publicClient = await getPublicClient(wagmiConfig, { chainId: contractInfo.chainId });
    if (!publicClient) {
      throw new Error('❌ Failed to create public client');
    }
    
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log('✅ Transaction confirmed:', receipt);
    
    if (receipt.status !== 'success') {
      throw new Error('❌ Transaction failed');
    }
    
    return receipt;
  } catch (error) {
    console.error('❌ Error in transaction:', error);
    throw error;
  }
}
