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

export async function getLitDecryptedFHIR(json: any, litClient: any) {
  const { accessControlConditions, chain } = json
  const provider = new Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const network = await provider.getNetwork()
  const connectedChainId = hexValue(network.chainId)
  const resolvedChain = chainIdToLitChain[Number(connectedChainId) as keyof typeof chainIdToLitChain]
  const litResource = new LitAccessControlConditionResource('*')

  console.log('🔐 Decryption Start')
  console.log('📦 Chain:', chain, 'Resolved:', resolvedChain)
  console.log('🔑 Conditions:', accessControlConditions)

  const signer = provider.getSigner()
  const walletAddress = await signer.getAddress()
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

  const decrypted = await decryptFromLitJson({
    encryptedJson: json,
    litClient,
    sessionSigs,
  })
  // Convert Uint8Array → string → JSON
  //const decoder = new TextDecoder();
  //const decryptedText = decoder.decode(decrypted);
  try {
    console.log('🔍 Decrypted FHIR JSON:', decrypted)
    return decrypted;
    //return JSON.parse(decryptedText);
  } catch (err) {
    throw new Error("❌ Decrypted content is not valid JSON");
  }


}
