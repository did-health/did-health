import { create } from '@web3-storage/w3up-client'

export async function storeEncryptedFileByHash(
  encryptedBlob: Blob,
  fileHash: string,              // ← Passed from encryptFile()
  resourceType: string
): Promise<string> {
  const spaceDID = localStorage.getItem('didhealth_space_did') as `did:${string}:${string}` | null
  const email = localStorage.getItem('didhealth_user_email') as `${string}@${string}` | null

  if (!spaceDID || !email) {
    throw new Error('Missing Web3.Storage credentials in localStorage')
  }

  const client = await create()
  await client.login(email)
  await client.setCurrentSpace(spaceDID)

  const file = new File([encryptedBlob], `${resourceType}/${fileHash}.enc`, {
    type: 'application/octet-stream',
  })

  const cid = await client.uploadFile(file)

  return `ipfs://${cid}`
}
