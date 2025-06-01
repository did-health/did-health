import { getWalletClient } from 'wagmi/actions'
import  contracts  from '../generated/deployedContracts'

export async function registerDid({
  did,
  ipfsUri,
  chainId,
}: {
  did: string
  ipfsUri: string
  chainId: number
}): Promise<`0x${string}`> {
  const contractEntry = (contracts as Record<number, any>)[chainId]?.[0]
  const contractInfo = contractEntry?.contracts?.HealthDIDRegistry

  if (!contractInfo) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  const walletClient = await getWalletClient({ chainId: chainId })

  if (!walletClient) {
    throw new Error('Could not get wallet client (are you connected?)')
  }

  const [account] = await walletClient.getAddresses()

  const txHash = await walletClient.writeContract({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    functionName: 'registerDID',
    args: [did, ipfsUri],
    account,
  })

  return txHash
}