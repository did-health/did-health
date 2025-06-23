import { ethers } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
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
  // Use the injected EIP-1193 provider (e.g., MetaMask)
  if (!(window as any).ethereum) {
    throw new Error('❌ No Ethereum provider found. Please install MetaMask or another wallet.')
  }
  const provider = new ethers.BrowserProvider((window as any).ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(contractAddress, abi, signer)

  // Call updateDIDData(_healthDid, _uri)
  const tx = await contract.updateDIDData(healthDid, newUri)
  await tx.wait()

  console.log(`✅ Updated DID URI on-chain: ${tx.hash}`)
  return tx.hash
}