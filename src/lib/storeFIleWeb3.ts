import { create as createW3Client } from '@web3-storage/w3up-client'
import { useOnboardingState } from '../store/OnboardingState'

export async function storeEncryptedFileByHash(
  encryptedBlob: Blob,
  fileHash: string,
  resourceType: string
): Promise<string> {
  const { email, web3SpaceDid } = useOnboardingState.getState()

  if (!email || !web3SpaceDid) {
    throw new Error('Missing Web3.Storage credentials in Zustand state')
  }

  const client = await createW3Client()
  await client.login(email as `${string}@${string}`)
  // If you have a space object, use its did() method:
  // await client.setCurrentSpace(space.did())

  // If web3SpaceDid is already in the correct format, cast it:
  await client.setCurrentSpace(web3SpaceDid as `did:${string}:${string}`)

  // Create FHIR-style structure: Patient/abc123.enc
  const file = new File([encryptedBlob], `${resourceType}/${fileHash}.enc`, {
    type: 'application/octet-stream',
  })

  const directoryCid = await client.uploadDirectory([file])

  // Return the Web3.Storage URL for access via w3s.link
  return `https://w3s.link/ipfs/${directoryCid}/${resourceType}/${fileHash}.enc`
}

/**
 * Uploads a plain (unencrypted) FHIR resource as a .json file under a directory named after the resourceType.
 * Example URL: https://w3s.link/ipfs/<CID>/Patient/123.json
 */
export async function storePlainFHIRFile(
  fhirResource: Record<string, any>, // Can also be typed as FHIR `Resource`
  fileName: string,                  // e.g., '123'
  resourceType: string               // e.g., 'Patient'
): Promise<string> {
  const { email, web3SpaceDid } = useOnboardingState.getState()

  if (!email || !web3SpaceDid) {
    throw new Error('Missing Web3.Storage credentials in Zustand state')
  }

  const client = await createW3Client()
  await client.login(email as `${string}@${string}`)
  await client.setCurrentSpace(web3SpaceDid as `did:${string}:${string}`)

  const jsonBlob = new Blob([JSON.stringify(fhirResource, null, 2)], {
    type: 'application/json',
  })

  const file = new File([jsonBlob], `${resourceType}/${fileName}.json`, {
    type: 'application/json',
  })

  const directoryCid = await client.uploadDirectory([file])

  return `https://w3s.link/ipfs/${directoryCid}/${resourceType}/${fileName}.json`
}