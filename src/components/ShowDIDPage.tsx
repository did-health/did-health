import React, { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useOnboardingState } from '../store/OnboardingState'
import { ConnectWallet } from './WalletConnect'
import { ConnectLit } from './ConnectLit'
import { LitAccessControlConditionResource } from '@lit-protocol/auth-helpers'
import { resolveDidHealth } from '../lib/DIDDocument'
import { generateQRCode } from '../lib/QRCodeGeneration'
import { decryptFromLitJson } from '../lib/litEncryptFile'
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser'
import { chainIdToLitChain } from '../lib/getChains'

export default function ShowDIDPage() {
  const { litClient, litConnected } = useOnboardingState()
  const { address: connectedWalletAddress, isConnected } = useAccount()
  const chainId = useChainId()
  console.log('🔗 Connected Chain ID:', chainId)
  const litChain = chainIdToLitChain[chainId] ?? 'ethereum' // default fallback
  console.log('🔗 Lit Chain:', litChain)

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')

  const handleResolve = async () => {
    try {
      setStatus('🔍 Resolving DID...')
      setDidDoc(null)
      setFhir(null)
      setQrCode('')

      if (!isConnected || !connectedWalletAddress || !chainId) {
        setStatus('❌ Wallet not connected');
        return;
      }

      const doc = await resolveDidHealth(chainId, connectedWalletAddress)
      if (doc?.id && doc.id.trim().toLowerCase() === 'did:health:')
      {
        throw new Error('❌ You do not have a did:health identifier yet. Please create one.')
        setDidDoc(null)
        //setStatus(`✅ You Do not have a did:health identifier yet. Please create one.`)
        return;
      }
      console.log('🔍 Resolved DID Document:', doc)
      setDidDoc(doc)

      const qr = await generateQRCode(JSON.stringify(doc))
      setQrCode(qr ?? '')

      const fhirService = doc?.service?.find(
        (s: any) => s.type === 'FHIRResource' || s.id?.includes('#fhir')
      )

      if (!fhirService?.serviceEndpoint) {
        throw new Error('❌ No FHIR resource endpoint found in DID Document')
      }

      const resourceUrl = fhirService.serviceEndpoint
      const isEncrypted = resourceUrl.endsWith('.enc') || resourceUrl.endsWith('.lit')

      setStatus(`📦 Fetching FHIR resource from ${resourceUrl}...`)
      const response = await fetch(resourceUrl)
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

      const json = await response.json()

      console.log('🔍 FHIR resource JSON:', json)
      if (isEncrypted) {
        if (!litClient) throw new Error('❌ Lit client not connected')

        setStatus('🔐 Getting auth sig...')

        const {
          accessControlConditions,
          chain,
        } = json

        console.log('🔍 Access Control Conditions:', accessControlConditions)
        console.log('🔍 Chain:', chain)

        const sessionSigs = await litClient.getSessionSigs({
          chain: 'sepolia', // fallback if chain is missing
          resourceAbilityRequests: [
            {
              accessControlConditions,
              chain: 'sepolia',
              ability: 'access-control-condition-decryption',
            },
          ],
          authNeededCallback: async () => {
            const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
            const nonce = Math.floor(Math.random() * 1e16).toString()
            console.log('🔐 Signing auth message with nonce:', nonce)
            return await checkAndSignAuthMessage({
              chain: chain ?? litChain,
              expiration,
              nonce,
            })
          },
        })

        setStatus('🔐 Decrypting with Lit...')

        const decrypted = await decryptFromLitJson({
          encryptedJson: json,
          litClient,
          sessionSigs,
        })

        setFhir(decrypted)
        setStatus('✅ Decrypted FHIR resource loaded!')
      }
      else {
        setFhir(json)
        setStatus('✅ Plaintext FHIR resource loaded!')
      }
    } catch (err: any) {
      console.error(err)
      setStatus(err.message)
    }
  }

  useEffect(() => {
    if (isConnected && connectedWalletAddress && chainId && litConnected && litClient) {
      handleResolve()
    }
  }, [isConnected, connectedWalletAddress, chainId, litConnected, litClient])

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🔎 View Your did:health Identifier</h1>

      <ConnectWallet />
      <ConnectLit />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}
      {status?.includes('❌ You do not have a did:health') && (
  <div className="mt-4">
    <button
      onClick={() => window.location.href = '/'}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Create a did:health Identifier
    </button>
  </div>
)}

      {didDoc?.id && didDoc.id.trim().toLowerCase() !== 'did:health:' && (
        <>
          {/* Show resolved DID */}
          <div className="mt-4">
            <p className="font-semibold">Resolved DID:</p>
            <code className="block p-2 bg-gray-100 rounded break-words">{didDoc.id}</code>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">DID Document QR Code</h2>
              <img src={qrCode} alt="QR Code" width={300} height={300} />
            </div>
          )}

          {/* FHIR resource */}
          {fhir && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
              <h2 className="text-lg font-semibold mb-2">FHIR Resource</h2>
              <pre>{JSON.stringify(fhir, null, 2)}</pre>
            </div>
          )}
        </>
      )}

    </main>
  )
}
