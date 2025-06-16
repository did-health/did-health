import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../store/OnboardingState'
import { ConnectWallet } from './WalletConnect'
import { ConnectLit } from './ConnectLit'
import { generateQRCode } from '../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../lib/litSessionSigs'
import { resolveDidHealthAcrossChains } from '../lib/DIDDocument'
import FHIRResource from './FHIRResource'

export default function ShowDIDPage() {
  const { litClient, litConnected } = useOnboardingState()
  const { address: connectedWalletAddress, isConnected } = useAccount()

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [accessControlConditions, setAccessControlConditions] = useState<any | null>(null)
  const [resolvedChainName, setResolvedChainName] = useState<string>('')

  const handleResolve = async () => {
    try {
      setStatus('🔍 Resolving DID across all supported chains...')
      setDidDoc(null)
      setFhir(null)
      setQrCode('')
      setResolvedChainName('')

      if (!isConnected || !connectedWalletAddress) {
        setStatus('❌ Wallet not connected')
        return
      }

      const result = await resolveDidHealthAcrossChains(connectedWalletAddress)
      if (!result) {
        throw new Error('❌ You do not have a did:health identifier yet. Please create one.')
      }

      const { doc, chainName } = result
      console.log('✅ Found DID Document:', doc)
      setDidDoc(doc)
      setResolvedChainName(chainName)

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
    if (isConnected && connectedWalletAddress && litConnected && litClient) {
      handleResolve()
    }
  }, [isConnected, connectedWalletAddress, litConnected, litClient])

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🔎 View Your did:health Identifier</h1>

      <ConnectWallet />
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
    <div className="mt-4">
      <p className="font-semibold">Resolved DID:</p>
      <code className="block p-2 bg-gray-100 rounded break-words">{didDoc.id}</code>
      <p className="text-sm text-gray-500 mt-1">🧠 Found on: {resolvedChainName}</p>
    </div>

    {qrCode && (
      <div className="mt-4">
        <h2 className="text-lg font-semibold">DID Document QR Code</h2>
        <img src={qrCode} alt="QR Code" width={300} height={300} />
      </div>
    )}

    <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
      <h2 className="text-lg font-semibold mb-2">📄 Resolved DID Document</h2>
      <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(didDoc, null, 2)}</pre>
    </div>

    {accessControlConditions && (
      <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
        <h2 className="text-lg font-semibold mb-2">🔐 Access Control Conditions</h2>
        <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(accessControlConditions, null, 2)}</pre>
      </div>
    )}

    {fhir && (
      <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[600px]">
        <h2 className="text-lg font-semibold mb-2">🧾 FHIR Resource</h2>
        <FHIRResource resource={fhir} />
        <pre className="mt-4 text-xs whitespace-pre-wrap break-words">{JSON.stringify(fhir, null, 2)}</pre>
      </div>
    )}
  </>
)}

    </main>
  )
}
