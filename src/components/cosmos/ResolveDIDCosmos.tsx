import React, { useEffect, useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { Wallet } from './WalletConnectCosmos'
import { ConnectLit } from '../lit/ConnectLit'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import FHIRResource from '../fhir/FHIRResourceView'
import logo from '../../assets/did-health.png'

// Import useWallet from your wallet integration library
// Example for @cosmos-kit/react:
import { useWallet } from '@cosmos-kit/react'

export default function ResolveDIDCosmos() {
  const { litClient, litConnected } = useOnboardingState()
  // Adjust according to your wallet context structure; for example, if it's 'addresses' array:
    const { address, isConnected } = useWallet()
    const cosmosAddress = address ?? ''

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [accessControlConditions, setAccessControlConditions] = useState<any | null>(null)
  const [resolvedChainName, setResolvedChainName] = useState<string>('')

  const handleResolve = async () => {
    try {
      setStatus('🔍 Resolving DID...')
      setDidDoc(null)
      setFhir(null)
      setQrCode('')
      setResolvedChainName('')

      if (!isConnected || !cosmosAddress) {
        setStatus('❌ Wallet not connected')
        return
      }

      const result = await resolveDidHealthAcrossChains(cosmosAddress)
      if (!result) {
        throw new Error('❌ You do not have a did:health identifier yet. Please create one.')
      }

      const { doc, chainName } = result
      setDidDoc(doc)
      setResolvedChainName(chainName)

      const qr = await generateQRCode(JSON.stringify(doc))
      setQrCode(qr ?? '')

      const fhirService = doc?.service?.find(
        (s: any) => s.id?.includes('#fhir')
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

      if (isEncrypted) {
        setStatus('🔐 Decrypting with Lit Protocol...')
        setAccessControlConditions(json.accessControlConditions || null)
        const decrypted = await getLitDecryptedFHIR(json, litClient)
        setFhir(decrypted)
        setStatus('✅ Decrypted FHIR resource loaded!')
      } else {
        setFhir(json)
        setStatus('✅ Plaintext FHIR resource loaded!')
      }
    } catch (err: any) {
      console.error(err)
      setStatus(err.message)
    }
  }

  useEffect(() => {
    if (isConnected && cosmosAddress && litConnected && litClient) {
      handleResolve()
    }
  }, [isConnected, cosmosAddress, litConnected, litClient])

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
          <img src={logo} alt="did:health Logo" className="w-full h-full object-contain scale-110" />
        </div>
        <h1 className="text-2xl font-bold mt-4 text-center">
          🔎 View Your <span className="text-green-600 dark:text-green-400">did:health</span> Identifier
        </h1>
      </div>

      <Wallet />
      <ConnectLit />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}

      {status.includes('❌ You do not have a did:health') && (
        <div className="mt-4">
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create a did:health Identifier
          </button>
        </div>
      )}

      {didDoc?.id && (
        <>
          {/* same DID details, QR, FHIR, and access control UI as before */}
        </>
      )}
    </main>
  )
}
