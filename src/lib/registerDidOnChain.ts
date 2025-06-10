import { getWalletClient } from 'wagmi/actions'
import { wagmiConfig } from '../lib/wagmiConfig' // adjust the import path if needed
import contracts from '../generated/deployedContracts'

type RegisterDIDParams = {
  did: string
  ipfsUri: string
  chainId: number
}

/**
 * Registers a DID to the HealthDIDRegistry smart contract.
 * Throws a user-friendly error if the DID is already registered or wallet is misconfigured.
 */
export async function registerDid({
  did,
  ipfsUri,
  chainId,
}: RegisterDIDParams): Promise<`0x${string}`> {
  const contractInfo = resolveContractByChainId(chainId)

  if (!contractInfo) {
    throw new Error(`❌ Unsupported chain ID: ${chainId}`)
  }

  const walletClient = await getWalletClient(wagmiConfig, { chainId })

  if (!walletClient) {
    throw new Error('❌ Wallet not connected. Please connect your wallet first.')
  }

  const walletChainId = await walletClient.getChainId()
  if (walletChainId !== chainId) {
    throw new Error(
      `❌ Wrong network. Please switch your wallet to chain ID ${chainId}.`
    )
  }

  const [account] = await walletClient.getAddresses()

  try {
    const txHash = await walletClient.writeContract({
      address: contractInfo.address as `0x${string}`,
      abi: contractInfo.abi,
      functionName: 'registerDID',
      args: [did, ipfsUri],
      account,
    })

    return txHash
  } catch (err: any) {
    const message = parseRevertReason(err)
    if (message?.toLowerCase().includes('already registered')) {
      throw new Error(`❌ This DID is already registered on-chain.`)
    }

    console.error('❌ Error during contract write:', err)
    throw new Error(`Contract call failed: ${message || err.message || 'Unknown error'}`)
  }
}

/**
 * Resolves the HealthDIDRegistry contract address + ABI by chainId from deployedContracts
 */
function resolveContractByChainId(chainId: number): { address: string; abi: any } | null {
  for (const networkGroup of Object.values(contracts)) {
    for (const network of Object.values(networkGroup)) {
      const registry =
        (network as any)?.contracts?.HealthDIDRegistry ??
        (network as any)?.HealthDIDRegistry; // <-- also check flat structure

      if (registry?.chainId === chainId) {
        return {
          address: registry.address,
          abi: registry.abi,
        };
      }
    }
  }
  return null;
}


/**
 * Parses common revert reasons from Viem/Wagmi-style error messages
 */
function parseRevertReason(err: unknown): string | null {
  const message = typeof err === 'object' && err !== null ? (err as any).message : null

  if (message?.includes('reverted with reason string')) {
    const match = message.match(/reverted with reason string '(.*?)'/)
    return match?.[1] || null
  }

  return message || null
}
