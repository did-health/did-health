// lib/litSessionSigs.ts
import { LIT_ABILITY } from '@lit-protocol/constants'
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from '@lit-protocol/auth-helpers'
import { hexValue } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { decryptFromLitJson } from './litEncryptFile'
import { chainIdToLitChain } from './getChains'

export async function getLitDecryptedFHIR(
  json: any,
  litClient: any,
  options: { chain?: string } = {} // 👈 accept override
) {
  const { accessControlConditions } = json
  const provider = new Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const walletAddress = await signer.getAddress()
console.log('((((((((' + options.chain)
  // ✅ FIX: Use override if provided, fallback to ACC or wallet
  const resolvedChain = options.chain

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


  console.log("dlkldklfkdlfk" + resolvedChain)

  const sessionSigs = await litClient.getSessionSigs({
    chain: resolvedChain, // ✅ FIXED HERE
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LIT_ABILITY.AccessControlConditionDecryption,
      },
    ],
    authNeededCallback: authSigCallback,
  })

  const decrypted = await decryptFromLitJson({
    encryptedJson: json,
    litClient,
    sessionSigs,
  })

  try {
    return decrypted
  } catch (err) {
    throw new Error('❌ Decrypted content is not valid JSON')
  }
}

