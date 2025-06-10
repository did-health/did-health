import { encryptToJson } from '@lit-protocol/encryption'
import type { AccessControlConditions, ILitNodeClient } from '@lit-protocol/types'

export async function encryptFHIRFile({
  file,
  litClient,
  chain,
  accessControlConditions,
}: {
  file: File | Blob
  litClient: ILitNodeClient
  chain: string
  accessControlConditions: AccessControlConditions[]
}): Promise<{ encryptedJSON: string; hash: string }> {
  const encryptedJSON = await encryptToJson({
    file,
    accessControlConditions,
    chain,
    litNodeClient: litClient,
  })

  const parsed = JSON.parse(encryptedJSON)
  return {
    encryptedJSON,
    hash: parsed.dataToEncryptHash, // 🟢 Extract this
  }
}
