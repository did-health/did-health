import { encryptFile } from '@lit-protocol/encryption'
import type { ILitNodeClient } from '@lit-protocol/types'

export async function encryptFHIRFile(
  file: File | Blob,
  litClient: ILitNodeClient,
  chain: string
): Promise<{ encryptedBlob: Blob; symmetricKey: Uint8Array }> {
  const response = await encryptFile({ file, chain }, litClient)

  console.log('[encryptFile] response:', response)

  // Try to guess correct keys from actual object
  const encryptedBlob = (response as any).encryptedFile ?? (response as any).encryptedBlob
  const symmetricKey = (response as any).symmetricKey

  if (!encryptedBlob || !symmetricKey) {
    throw new Error('Lit encryption failed: missing encrypted blob or symmetric key')
  }

  return {
    encryptedBlob,
    symmetricKey,
  }
}
