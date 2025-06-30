import { create as createW3Client } from '@web3-storage/w3up-client'
import { useOnboardingState } from '../store/OnboardingState'

let w3Client: Awaited<ReturnType<typeof createW3Client>> | null = null

export async function getW3Client(email: string) {
  if (!w3Client) {
    w3Client = await createW3Client()
  }

  const account = await w3Client.login(email as `${string}@${string}`)
  await account?.plan.wait()
  return w3Client
}


export async function storeEncryptedFileByHash(
  encryptedBlob: Blob,
  fileHash: string | { hash: string },
  resourceType: string
): Promise<string> {
  const { email, web3SpaceDid } = useOnboardingState.getState()

  if (!email || !web3SpaceDid) {
    throw new Error('Missing Web3.Storage credentials in Zustand state')
  }

  try {
    const client = await createW3Client()
    await client.login(email as `${string}@${string}`)
    await client.setCurrentSpace(web3SpaceDid as `did:${string}:${string}`)

    // Create FHIR-style structure: Patient/abc123.enc
    const hash = typeof fileHash === 'object' ? fileHash.hash : fileHash
    const file = new File([encryptedBlob], `${resourceType}/${hash}.enc`, {
      type: 'application/octet-stream',
    })

    // Upload the file using the directory API
    const directoryCid = await client.uploadDirectory([file])
    console.log('Web3.Storage upload response:', directoryCid)

    // Return the Web3.Storage URL
    return `https://w3s.link/ipfs/${directoryCid}/${resourceType}/${hash}.enc`
  } catch (error) {
    console.error('❌ Web3.Storage upload error:', error)
    throw new Error(`Failed to upload file to web3 storage: ${error instanceof Error ? error.message : String(error)}`)
  }
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

  try {
    const directoryCid = await client.uploadDirectory([file])
    return `https://w3s.link/ipfs/${directoryCid}/${resourceType}/${fileName}.json`
  } catch (error: unknown) {
    console.error('❌ Error uploading to web3 storage:', error)
    throw new Error(`Failed to upload file to web3 storage: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getFromIPFS(url: string): Promise<any> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch IPFS content: ${res.statusText}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return await res.json()
  } else if (contentType.startsWith('text/')) {
    return await res.text()
  } else {
    return await res.blob()
  }
}