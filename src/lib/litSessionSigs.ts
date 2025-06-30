// lib/litSessionSigs.ts
import { LIT_ABILITY } from '@lit-protocol/constants'
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from '@lit-protocol/auth-helpers'
import { hexValue } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { decryptFHIRFile } from './litEncryptFile'
import { chainIdToLitChain } from './getChains'

export async function getLitDecryptedFHIR(
  json: any,
  litClient: any,
  options: { chain?: string } = {}
) {
  const { accessControlConditions } = json
  const provider = new Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const walletAddress = await signer.getAddress()

  // Get chain from options or fallback to first ACC or default to ethereum
  const resolvedChain = options.chain || 
    (accessControlConditions?.[0]?.chain || 'ethereum')
  console.log('Resolving chain:', resolvedChain)

  const litResource = new LitAccessControlConditionResource('*')
  const latestBlockhash = await litClient.getLatestBlockhash()

  const authSigCallback = async (params: any) => {
    const { uri, expiration, resourceAbilityRequests } = params
    const toSign = await createSiweMessageWithRecaps({
      uri,
      expiration,
      resources: resourceAbilityRequests,
      walletAddress,
      nonce: latestBlockhash,
      litNodeClient: litClient,
    })
    return await generateAuthSig({ signer, toSign })
  }

  const sessionSigs = await litClient.getSessionSigs({
    chain: resolvedChain,
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LIT_ABILITY.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback: authSigCallback,
  })

  try {
    const decrypted = await decryptFHIRFile({
      encryptedJson: json,
      litClient,
      sessionSigs,
    })
    return decrypted
  } catch (err: any) {
    // If decryption fails but we have access control conditions, rethrow the error
    if (accessControlConditions?.length) {
      throw new Error(`❌ Failed to decrypt: ${err.message || 'Unknown error'}`)
    }
    // If no access control conditions and decryption fails, return the original JSON
    return json
  }
}
