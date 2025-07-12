import React, { useState, useEffect } from 'react'
import { ConnectWallet } from '../eth/WalletConnectETH'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { useOnboardingState } from '../../store/OnboardingState'
import { resolveDIDHealthSolana } from '../../lib/resolveDIdHealthSolana'

export default function ResolveDIDSolana() {
  const { walletAddress } = useOnboardingState()
  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [fhir, setFhir] = useState<any | null>(null)

  const solDid = walletAddress ? `did:health:sol:${walletAddress}` : null

  useEffect(() => {
    const handle = async () => {
      try {
        if (!solDid) throw new Error('❌ Wallet not connected')
        setStatus('🔍 Resolving DID...')

        const resolved = await resolveDIDHealthSolana(solDid)
        setDidDoc(resolved)

        const qr = await generateQRCode(JSON.stringify(resolved))
        setQrCode(qr ?? '')

        const fhirService = resolved?.service?.find(
          (s: any) =>s.id?.includes('#fhir') || s.type === 'IPFS'
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
  }, [solDid])

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🔎 View Your did:health Identifier on Solana</h1>

      <ConnectWallet />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}

      {didDoc?.id && (
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
