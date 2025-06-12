import { encryptToJson, decryptFromJson } from '@lit-protocol/encryption'
import type { AccessControlConditions, ILitNodeClient } from '@lit-protocol/types'


export async function decryptFromLitJson({
  encryptedJson,
  litClient,
  sessionSigs,
}: {
  encryptedJson: any // parsed JSON file
  litClient: any
  sessionSigs: any
}) {
  const result = await decryptFromJson({
    parsedJsonData: encryptedJson,
    litNodeClient: litClient,
    sessionSigs,
  })

  // Return either string or Blob result
  if (result && typeof result === 'string') {
    return JSON.parse(result)
  }

  if (result instanceof Blob) {
    const text = await result.text()
    return JSON.parse(text)
  }

  throw new Error('Unexpected result from decryptFromJson')
}


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

