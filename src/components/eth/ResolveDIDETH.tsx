import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { ConnectWallet } from './WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import FHIRResource from '../fhir/FHIRResourceView'
import logo from '../../assets/did-health.png'

export default function ResolveDIDETH() {
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
<div className="flex flex-col items-center mb-6">
  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
    <img
      src={logo}
      alt="did:health Logo"
      className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
    />
  </div>
  <h1 className="text-2xl font-bold mt-4 text-center">
    🔎 View Your <span className="text-green-600 dark:text-green-400">did:health</span> Identifier
  </h1>
</div>

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

          {didDoc && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
              <h2 className="text-lg font-semibold mb-4">📄 Resolved DID Document</h2>

              <div className="grid gap-y-2 text-gray-800">
                <div>
                  <span className="font-medium text-gray-600">DID:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">{didDoc.id}</code>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Wallet Address:</span>{' '}
                  <code className="bg-white px-2 py-1 rounded">{didDoc.controller}</code>
                </div>

                {didDoc?.service?.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-600">Service Endpoints:</span>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      {didDoc.service.map((svc: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-semibold">{svc.type}:</span>{' '}
                          <a href={svc.serviceEndpoint} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-words">
                            {svc.serviceEndpoint}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {didDoc.credentials && (
                  <div>
                    <span className="font-medium text-gray-600">Credentials:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {Object.entries(didDoc.credentials).map(([key, val]) => (
                        <li key={key}>
                          {key}: {val ? '✅' : '❌'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {typeof didDoc.reputationScore === 'number' && (
                  <div>
                    <span className="font-medium text-gray-600">Reputation Score:</span>{' '}
                    <span className="font-semibold text-indigo-600">{didDoc.reputationScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}


          {accessControlConditions?.length > 0 && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
              <h2 className="text-lg font-semibold mb-4">🔐 Access Control Conditions</h2>

              <div className="space-y-4">
                {accessControlConditions.map((cond: any, idx: number) => {
                  const isSelfOnly =
                    cond?.returnValueTest?.comparator === '=' &&
                    String(cond?.returnValueTest?.value).toLowerCase() === connectedWalletAddress?.toLowerCase();

                  return (
                    <div key={idx} className="bg-white p-4 rounded shadow border border-gray-200">
                      <p className="font-semibold text-gray-700 mb-2">Condition #{idx + 1}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Chain:</span> {String(cond.chain ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Method:</span> {String(cond.method ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Contract Address:</span>{' '}
                          {String(cond.contractAddress ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Standard Contract:</span>{' '}
                          {String(cond.standardContractType ?? 'N/A')}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">Parameters:</span>{' '}
                          {Array.isArray(cond.parameters)
                            ? cond.parameters.map((p: unknown) => String(p)).join(', ')
                            : 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">Return Value Test:</span>
                          <div className="ml-2">
                            Comparator: {String(cond.returnValueTest?.comparator ?? '')}
                            <br />
                            Value: {String(cond.returnValueTest?.value ?? '')}
                            {isSelfOnly && (
                              <p className="mt-2 text-green-600 font-medium">
                                ✅ Only viewable by <span className="underline">you</span>.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {fhir && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[600px]">
              <h2 className="text-lg font-semibold mb-2">🧾 FHIR Resource</h2>
              <FHIRResource resource={fhir} />
              <pre className="mt-4 bg-white p-2 rounded text-xs overflow-x-auto">
                <code>{JSON.stringify(fhir, null, 2)}</code>
              </pre>
             </div>
          )}
        </>
      )}

    </main>
  )
}
