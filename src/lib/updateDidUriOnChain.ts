import { ethers } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
// import { getWalletClient } from '../eth/walletClient'
// TODO: Update the import path below to the correct location of walletClient

type UpdateParams = {
  healthDid: string // e.g., 'did:health:11155111:didhealth'
  newUri: string    // new IPFS URL
  chainName: string // e.g., 'sepolia', 'baseSepolia'
}

export async function updateDIDUriOnChain({ healthDid, newUri, chainName }: UpdateParams) {
  if (!healthDid || !newUri || !chainName) throw new Error('❌ Missing required input')

  const chainContracts = (deployedContracts as any)[chainName]
  if (!chainContracts?.HealthDIDRegistry) {
    throw new Error(`❌ No HealthDIDRegistry deployed for chain: ${chainName}`)
  }

  const { address: contractAddress, abi } = chainContracts.HealthDIDRegistry

  // Get the user's wallet signer
  const walletClient = await getWalletClient()
  const provider = new ethers.BrowserProvider(walletClient)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(contractAddress, abi, signer)

  // Call updateDIDData(_healthDid, _uri)
  const tx = await contract.updateDIDData(healthDid, newUri)
  await tx.wait()

  console.log(`✅ Updated DID URI on-chain: ${tx.hash}`)
  return tx.hash
}