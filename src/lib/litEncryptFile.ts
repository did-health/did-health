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
}) 

{
  console.log('🔍 Encrypted JSON ACL:', JSON.stringify(encryptedJson?.accessControlConditions, null, 2));

  for (const cond of encryptedJson?.accessControlConditions || []) {
  if (cond.returnValueTest) {
    const { comparator, value } = cond.returnValueTest;
    console.log(`🧪 Condition: ${cond.contractAddress || cond.conditionType}`);
    console.log(`🧪 Comparator: ${comparator}, Value: ${value}`);
    if (comparator && typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`Invalid returnValueTest value: ${value}`);
    }
  }
}

  const result = await decryptFromJson({
    parsedJsonData: encryptedJson,
    litNodeClient: litClient,
    sessionSigs,
  })

console.log('🔐 Decryption Result:', result);

// ✅ Handle string
if (result && typeof result === 'string') {
  return JSON.parse(result);
}

// ✅ Handle Blob
if (result instanceof Blob) {
  const text = await result.text();
  return JSON.parse(text);
}

// ✅ Handle Uint8Array (raw bytes)
if (result instanceof Uint8Array) {
  const decoder = new TextDecoder();
  const text = decoder.decode(result);
  console.log('🔓 Decoded Text from Uint8Array:', text);
  return JSON.parse(text);
}

// ❌ If none match
throw new Error('❌ Unexpected result from decryptFromJson');
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