import { ethers } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
type UpdateParams = {
  healthDid: string // e.g., 'did:health:11155111:didhealth'
  newUri: string    // new IPFS URL
  chainName: string // e.g., 'sepolia', 'baseSepolia'
}

export async function updateDIDUriOnChain({ healthDid, newUri, chainName }: UpdateParams) {
 console.log('🧾 Calling updateDIDData with:')
console.log('  DID:', healthDid)
console.log('  New URI:', newUri)
console.log('  Chain:', chainName)

  if (!healthDid || !newUri || !chainName) throw new Error('❌ Missing required input')
const chainContracts = (deployedContracts as any)?.testnet?.[chainName]

//  const chainContracts = (deployedContracts as any)[chainName]
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

const caller = await signer.getAddress()
console.log('  Caller:', caller)

  const contract = new ethers.Contract(contractAddress, abi, signer)
console.log('📡 Is contract address:', contractAddress)
console.log('📡 Calling method on:', contract.target || contract.address)
console.log('🧪 Raw DID being passed:', JSON.stringify(healthDid))
const parts = healthDid.split(':');
  if (parts.length < 4 || parts[0] !== 'did' || parts[1] !== 'health') {
    throw new Error(`❌ Invalid DID format: ${did}`);
  }
  const thisDid =  `${parts[2]}:${parts[3]}`;
const actualOwner = await contract.getDidOwner(thisDid)

//const actualOwner = await contract.didOwners("did:health:11155111:richardbraman")
console.log("🧾 On-chain registered owner is:", actualOwner)

  // Call updateDIDData(_healthDid, _uri)
  const tx = await contract.updateDIDData(thisDid, newUri)
  await tx.wait()

  console.log(`✅ Updated DID URI on-chain: ${tx.hash}`)
  return tx.hash
}