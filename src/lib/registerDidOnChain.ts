import { getWalletClient } from 'wagmi/actions'
import { wagmiConfig } from '../lib/wagmiConfig' // adjust the import path if needed
import contracts from '../generated/deployedContracts'

type RegisterDIDParams = {
  did: string
  ipfsUri: string
  chainId: number
}

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

  // Hardcoded $5 fee in ETH assuming ETH = $2500 => 0.002 ETH
  const registrationFeeInWei = BigInt('2000000000000000') // 0.002 ETH

  // ✅ LOGGING INPUTS
  console.log('🧾 Registering DID with the following values:')
  console.log('📛 DID:', did)
  console.log('📦 IPFS URI:', ipfsUri)
  console.log('🔗 Chain ID:', chainId)
  console.log('💰 Fee (wei):', registrationFeeInWei.toString())
  console.log('👤 Account:', account)
  console.log('🏦 Contract address:', contractInfo.address)

  try {
    // Patch: Convert hex chain to decimal format for contract
const decimalDid = `${chainId}:${did.split(':').pop()}`;

    const txHash = await walletClient.writeContract({
      address: contractInfo.address as `0x${string}`,
      abi: contractInfo.abi,
      functionName: 'registerDID',
      args: [decimalDid, ipfsUri],
      account,
      value: registrationFeeInWei,
    })

    console.log('📤 TX hash:', txHash)
    return txHash
  } catch (err: any) {
    const message = parseRevertReason(err)
    if (message?.toLowerCase().includes('already exists')) {
      throw new Error(`❌ This DID is already registered on-chain.`)
    }

    console.error('❌ Error during contract write:', err)
    throw new Error(`Contract call failed: ${message || err.message || 'Unknown error'}`)
  }
}

function resolveContractByChainId(chainId: number): { address: string; abi: any } | null {
  for (const networkGroup of Object.values(contracts)) {
    for (const network of Object.values(networkGroup)) {
      const registry =
        (network as any)?.contracts?.HealthDIDRegistry ??
        (network as any)?.HealthDIDRegistry;

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

function parseRevertReason(err: unknown): string | null {
  const message = typeof err === 'object' && err !== null ? (err as any).message : null

  if (message?.includes('reverted with reason string')) {
    const match = message.match(/reverted with reason string '(.*?)'/)
    return match?.[1] || null
  }

  return message || null
}
