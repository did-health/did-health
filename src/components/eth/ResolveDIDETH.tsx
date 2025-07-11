import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { ConnectWallet } from './WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import FHIRResource from '../fhir/FHIRResourceView'
import logo from '../../assets/did-health.png'
import { DAOStatus } from '../dao/DAOStatus'

export default function ResolveDIDETH() {
  const { litClient, litConnected } = useOnboardingState()
  const { address: connectedWalletAddress, isConnected } = useAccount()

  const [status, setStatus] = useState('')
  interface DIDDocument {
    id: string;
    controller: string;
    service: Array<{
      id: string;
      type: string;
      serviceEndpoint: string;
    }>;
    verificationMethod: never[];
    reputationScore: number;
    credentials: {
      hasWorldId: boolean;
      hasPolygonId: boolean;
      hasSocialId: boolean;
    };
    ipfsUri?: string;
  }

  const [didDoc, setDidDoc] = useState<DIDDocument | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [accessControlConditions, setAccessControlConditions] = useState<any | null>(null)
  const [resolvedChainName, setResolvedChainName] = useState<string>('')
  const [didFHIRResources, setDidFHIRResources] = useState<
    { uri: string; resource: any; error?: string }[]
  >([])

  const handleResolve = async () => {
    try {
      setStatus('🔍 Resolving DID across all supported chains...')
      setDidDoc(null)
      setFhir(null)
      setQrCode('')
      setResolvedChainName('')
      setDidFHIRResources([])
  
      if (!isConnected || !connectedWalletAddress) {
        setStatus('❌ Wallet not connected')
        return
      }
  
      // 🔎 Resolve on-chain DID registry
      const result = await resolveDidHealthAcrossChains(connectedWalletAddress)
      if (!result) {
        throw new Error('❌ You do not have a did:health on any supported chain yet.')
      }
  
      setStatus('✅ DID resolved!')
      console.log(result)
      const { doc, chainName } = result
      setResolvedChainName(chainName)

      console.log(doc)
      setDidDoc(doc)

      // 🔗 Generate QR code
      const qr = await generateQRCode(JSON.stringify(doc))
      setQrCode(qr ?? '')
  
      // 🔍 Extract FHIRResource service endpoints
      const fhirServices = doc.service?.filter(
        (s: any) => s.serviceEndpoint
      ) || []
  
      console.log(fhirServices)
      if (fhirServices.length === 0) {
        throw new Error('❌ No FHIRResource service endpoints found in DID Document')
      }
  
      setDidFHIRResources(fhirServices) // optionally store them all for UI
  
      // 📦 Load first FHIR resource for preview
      const primary = fhirServices[0]
      const resourceUrl = primary.serviceEndpoint
      const isEncrypted = resourceUrl.endsWith('.enc') || resourceUrl.endsWith('.lit')
  
      setStatus(`📦 Fetching FHIR resource from ${resourceUrl}...`)
      const response = await fetch(resourceUrl)
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
  
      const json = await response.json()
  
      if (isEncrypted) {
        setStatus('🔐 Decrypting with Lit Protocol...')
        const accChain = json.accessControlConditions?.[0]?.chain || 'ethereum'
        setAccessControlConditions(json.accessControlConditions || null)
  
        const decrypted = await getLitDecryptedFHIR(json, litClient, { chain: accChain })
        setFhir(decrypted)
        setStatus('✅ Decrypted FHIR resource loaded!')
      } else {
        setFhir(json)
        setStatus('✅ Plaintext FHIR resource loaded!')
      }
  
    } catch (err: any) {
      console.error('❌ Resolve error:', err)
      setStatus(err.message || '❌ Unexpected error during resolution')
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
          <img src={logo} alt="DID Health Logo" className="w-full h-full object-contain" />
        </div>
        {didDoc?.id && (
          <div className="mt-4">
            <a href={`/ethereum/did/update?did=${didDoc.id}`} className="btn-primary w-full">
              🔄 Update DID
            </a>
          </div>
        )}
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

          <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-4">📄 Resolved DID Document</h2>
            <div className="grid gap-y-2 text-gray-800">
              <div><span className="font-medium text-gray-600">DID:</span> <code className="bg-white px-2 py-1 rounded">{didDoc.id}</code></div>
              <div><span className="font-medium text-gray-600">Wallet Address:</span> <code className="bg-white px-2 py-1 rounded">{didDoc.controller}</code></div>

              {didDoc?.service?.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600">Service Endpoints:</span>
                  <ul className="list-disc list-inside mt-1 ml-2">
                    {didDoc.service.map((svc: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-semibold">{svc.type}:</span>{' '}
                        <a href={svc.serviceEndpoint} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-words">
                          🔥 View FHIR Resource
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

          {accessControlConditions?.length > 0 && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
              <h2 className="text-lg font-semibold mb-4">🔐 Access Control Conditions</h2>
              {accessControlConditions.map((cond: any, idx: number) => {
                const isSelfOnly =
                  cond?.returnValueTest?.comparator === '=' &&
                  String(cond?.returnValueTest?.value).toLowerCase() === connectedWalletAddress?.toLowerCase()
                return (
                  <div key={idx} className="bg-white p-4 rounded shadow border border-gray-200 mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Condition #{idx + 1}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div><span className="font-medium text-gray-600">Chain:</span> {cond.chain}</div>
                      <div><span className="font-medium text-gray-600">Method:</span> {cond.method}</div>
                      <div><span className="font-medium text-gray-600">Contract Address:</span> {cond.contractAddress}</div>
                      <div><span className="font-medium text-gray-600">Standard Contract:</span> {cond.standardContractType}</div>
                      <div className="col-span-2"><span className="font-medium text-gray-600">Parameters:</span> {cond.parameters?.join(', ')}</div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Return Value Test:</span>
                        <div className="ml-2">
                          Comparator: {cond.returnValueTest?.comparator}<br />
                          Value: {cond.returnValueTest?.value}
                          {isSelfOnly && <p className="mt-2 text-green-600 font-medium">✅ Only viewable by <span className="underline">you</span>.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {fhir && (fhir.resourceType === 'Practitioner' || fhir.resourceType === 'Organization') && connectedWalletAddress && (
            <div className="mt-6 text-center">
              <DAOStatus walletAddress={connectedWalletAddress} did={didDoc?.id ?? ''} />
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

          {didFHIRResources.length > 0 && (
            <div className="bg-gray-100 p-4 rounded mt-6 text-sm">
              <h2 className="text-lg font-semibold mb-2">🌐 Alternate FHIR Resources</h2>
              {didFHIRResources.map(({ uri, resource, error }, idx) => (
                <div key={idx} className="bg-white rounded border border-gray-200 mb-4 p-4 shadow-sm">
                  <p className="text-sm mb-2 break-all">
                    🔗 <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{uri}</a>
                  </p>
                  {error ? (
                    <p className="text-red-500">❌ Failed to load: {error}</p>
                  ) : (
                    <>
                      <FHIRResource resource={resource} />
                      <pre className="mt-4 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        <code>{JSON.stringify(resource, null, 2)}</code>
                      </pre>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
