import React, { useState, useEffect } from 'react'
import { ConnectWallet } from '../eth/WalletConnectETH'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { resolveDidHealthBtc } from '../../lib/resolveDidHealthBtc'
import { useOnboardingState } from '../../store/OnboardingState'

export default function ResolveDIDBitcoin() {
  const { walletAddress } = useOnboardingState()
  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [fhir, setFhir] = useState<any | null>(null)

  const btcDid = walletAddress ? `did:health:btc:${walletAddress.split(':').pop()}` : null


  useEffect(() => {
    if (!btcDid) return

    const handle = async () => {
      try {
        setStatus('🔍 Resolving DID...')
        const result = await resolveDidHealthBtc(btcDid ?? '')
        if (result.error) throw new Error(result.error)
        if (!result.resolved) return

        setDidDoc(result.resolved)
        const qr = await generateQRCode(JSON.stringify(result.resolved))
        setQrCode(qr ?? '')

        const fhirService = result.resolved?.service?.find(
          (s: any) => s.type === 'FHIRResource' || s.id?.includes('#fhir') || s.type === 'IPFS'
        )

        if (!fhirService?.serviceEndpoint) {
          throw new Error('❌ No FHIR resource endpoint found in DID Document')
        }

        setStatus(`📦 Fetching FHIR resource from ${fhirService.serviceEndpoint}...`)
        const res = await fetch(fhirService.serviceEndpoint.replace('ipfs://', 'https://w3s.link/ipfs/'))
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)

        const json = await res.json()
        setFhir(json)
        setStatus('✅ Plaintext FHIR resource loaded!')
      } catch (err: any) {
        setStatus(err.message)
      }
    }

    handle()
  }, [btcDid])
  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🔎 View Your did:health Identifier on Bitcoin</h1>

      <ConnectWallet />

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
          <div className="mt-4">
            <p className="font-semibold">Resolved DID:</p>
            <code className="block p-2 bg-gray-100 rounded break-words">{didDoc.id}</code>
          </div>

          {qrCode && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">DID Document QR Code</h2>
              <img src={qrCode} alt="QR Code" width={300} height={300} />
            </div>
          )}

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
