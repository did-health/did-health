import { getWalletClient } from 'wagmi/actions'
import { wagmiConfig } from './wagmiConfig'
import contracts from '../generated/deployedContracts'

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

  const walletClient = await getWalletClient(wagmiConfig, { chainId: contractInfo.chainId })
  const [account] = await walletClient.getAddresses()

  return await walletClient.writeContract({
    address: contractInfo.address,
    abi: contractInfo.abi,
    functionName: 'addAltData',
    args: [healthDid, uris],
    account,
  })
}
