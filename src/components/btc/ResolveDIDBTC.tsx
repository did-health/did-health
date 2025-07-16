import { useState, useEffect } from 'react'
import { ConnectWalletBTC } from './WalletConnectBTC'
import { ConnectLit } from '../lit/ConnectLit'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { useOnboardingState } from '../../store/OnboardingState'
import FHIRResource from '../fhir/FHIRResourceView'
import logo from '../../assets/did-health.png'
import btcLogo from '../../assets/bitcoin-btc-logo.svg'
import { DAOStatus } from '../dao/DAOStatus'
import { useTranslation } from 'react-i18next'
interface FHIRResource {
  accessControlConditions?: any
  [key: string]: any
}

interface DIDService {
  type: string
  serviceEndpoint: string
  id?: string
}

interface DIDDocument {
  id: string
  service: DIDService[]
  [key: string]: any
}

export default function ResolveDIDBitcoin() {
  const { walletAddress, litClient } = useOnboardingState()
  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [fhir, setFhir] = useState<any | null>(null)
  const [resolvedUri, setResolvedUri] = useState<string | null>(null)
 
  const { t } = useTranslation();

  const btcDid = walletAddress ? `did:health:btc:${walletAddress}` : null

  useEffect(() => {
    if (!btcDid) return

    const resolveDidHealthBtc = async (did: string) => {
      try {
        const suffix = did.split(':').pop()
        if (!suffix || !suffix.startsWith('bc1')) {
          setStatus('❌ Invalid DID format')
          return
        }

        setStatus(`🔍 Searching inscriptions for ${suffix}...`)
        
        const apiKey = import.meta.env.VITE_UNISAT_KEY
        if (!apiKey) {
          setStatus('❌ Missing Unisat API key')
          return
        }

        const res = await fetch(`https://open-api.unisat.io/v1/indexer/address/${suffix}/inscription-data`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`API Error ${res.status}: ${errorText}`)
        }

        const apiResponse = await res.json()
        console.log('API Response:', apiResponse)
        if (!apiResponse || !apiResponse.data || !apiResponse.data.inscription) {
          throw new Error('Invalid API response format')
        }

        const inscriptions = apiResponse.data.inscription
        console.log('Found inscriptions:', inscriptions)

        for (const ins of inscriptions) {
          console.log('Processing inscription:', ins)
          try {
            const inscriptionId = ins.inscriptionId
            console.log('Inscription ID:', inscriptionId)
            const contentRes = await fetch(`https://open-api.unisat.io/v1/indexer/inscription/content/${inscriptionId}`, {
              headers: {
                'Authorization': `Bearer ${apiKey}`
              }
            })
            console.log('Content Response:', contentRes)
            if (!contentRes.ok) continue

            const text = await contentRes.text()
            console.log('Content Text:', text)
            let parsed: { did: string; ipfsUri: string }

            try {
              parsed = JSON.parse(text.trim())
              console.log('Parsed JSON:', JSON.stringify(parsed))
            } catch {
              continue // Not valid JSON, skip
            }

            if (parsed?.did !== did) continue
            
            // Handle both ipfs:// and https://w3s.link/ipfs/ formats
            let normalizedIpfsUri = parsed.ipfsUri
            if (normalizedIpfsUri.startsWith('https://w3s.link/ipfs/')) {
              normalizedIpfsUri = normalizedIpfsUri.replace('https://w3s.link/ipfs/', 'ipfs://')
            } else if (!normalizedIpfsUri.startsWith('ipfs://')) {
              continue
            }

            const docUrl = normalizedIpfsUri.replace('ipfs://', 'https://w3s.link/ipfs/')
            const docRes = await fetch(docUrl)
            if (!docRes.ok) {
              const errorText = await docRes.text()
              throw new Error(`Failed to fetch DID document: ${errorText}`)
            }

            const didDocJson = await docRes.json() as DIDDocument
            if (didDocJson?.id !== did) continue

            setDidDoc(didDocJson)
            setResolvedUri(normalizedIpfsUri)
            setStatus('✅ DID Document resolved!')

            const qr = await generateQRCode(JSON.stringify(didDocJson))
            if (qr) setQrCode(qr)

            const fhirEndpoint = didDocJson?.service?.find((s: DIDService) =>
              s.id?.includes('#fhir')
            )?.serviceEndpoint

            if (!fhirEndpoint) {
              setStatus('⚠️ DID resolved, but no FHIR service endpoint found.')
              return
            }

            const cleanUrl = fhirEndpoint.replace('ipfs://', 'https://w3s.link/ipfs/')
            setStatus(`📦 Fetching FHIR resource from ${fhirEndpoint}...`)
            try {
              const fhirRes = await fetch(cleanUrl)
              if (!fhirRes.ok) {
                const errorText = await fhirRes.text()
                throw new Error(`Failed to fetch FHIR resource: ${errorText}`)
              }
              const fhirJson = await fhirRes.json() as FHIRResource
              if (fhirJson?.accessControlConditions && litClient) {
                setStatus('🔐 ' + t('decryptingFHIRResource'))
                try {
                  const decrypted = await getLitDecryptedFHIR(fhirJson, litClient, { chain: 'bitcoin' })
                  setFhir(decrypted)
                  setStatus('✅ ' + t('fhirResourceLoaded'))
                } catch (err) {
                  console.warn('❌ Failed to decrypt FHIR:', err)
                  setStatus('❌ ' + t('failedToDecryptFHIR'))
                }
              } else {
                setFhir(fhirJson)
                setStatus('✅ ' + t('fhirResourceLoaded'))
              }
            } catch (err) {
              console.error('❌ Error fetching FHIR resource:', err)
              setStatus('⚠️ ' + t('failedToFetchFHIRResource'))
            }
            return
          } catch (err) {
            console.warn('⚠️ ' + t('skippingInvalidInscription'), err)
          }
        }

        setStatus(`❌ ' + t('didNotFoundInInscriptionsFor') + ${suffix}`)
      } catch (err: any) {
        console.error('❌ Resolution error', err)
        setStatus(err.message ?? '❌ Unknown error during resolution')
      }
    }

    resolveDidHealthBtc(btcDid)
  }, [btcDid, litClient])

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
<div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-green-400/50">
          <img src={logo} alt="DID Health Logo" className="w-full h-full object-contain" />
        </div>
        {didDoc?.id && (
          <div className="mt-4">
            <a href={`/btc/did/update?did=${didDoc.id}`} className="btn-primary w-full">
              🔄 {t('common.update')} {t('Your')}  did:health
            </a>
          </div>
        )}
        <h1 className="text-2xl font-bold mt-4 text-center">
          🔎 {t('viewYourDID')}<span className="text-green-600 dark:text-green-400">did:health</span> Identifier
        </h1>
      </div>
      <ConnectWalletBTC />
      <ConnectLit />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}

      {didDoc?.id && (
        <>
          <div className="mt-4">
            <p className="font-semibold">{t('resolvedDID')}:</p>
            <div className="flex items-center gap-2">
              <code className="block p-2 bg-gray-100 rounded whitespace-pre-wrap break-all max-w-full">{didDoc.id}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(didDoc.id)
                  setStatus('✓ ' + t('didCopiedToClipboard'))
                  setTimeout(() => setStatus(''), 2000)
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Copy DID to clipboard"
              >
                📋
              </button>
            </div>
          </div>

          {resolvedUri && (
            <div className="mt-2 text-sm text-gray-600">
              📍 IPFS URI: <code className="break-words">{resolvedUri}</code>
            </div>
          )}

          {qrCode && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">did:health QR Code</h2>
              <img src={qrCode} alt="QR Code" width={300} height={300} />
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">did:health Document</h2>
            <pre>{JSON.stringify(didDoc, null, 2)}</pre>
          </div>

          {fhir && (
            <>
              <div className="bg-green-50 border border-green-200 p-4 rounded mt-6 text-sm">
                <h2 className="text-lg font-semibold mb-2">{t('fhirResource')}</h2>
                <FHIRResource resource={fhir} />
              </div>

              <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[600px]">
                <h2 className="text-lg font-semibold mb-2">{t('rawFhirData')}</h2>
                <pre className="mt-4 bg-white p-2 rounded text-xs overflow-x-auto">
                  <code>{JSON.stringify(fhir, null, 2)}</code>
                </pre>
              </div>
            </>
          )}
        </>
      )}

      {!didDoc?.id && walletAddress && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">{t('noDIDFoundForYourBitcoinAddressReadyToCreateOne')}</p>
          <a
            href="/register-bitcoin"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            📝 {t('createDID')}
          </a>
        </div>
      )}
                          {fhir && (fhir.resourceType === 'Practitioner' || fhir.resourceType === 'Organization') && connectedWalletAddress && (
                  <div className="mt-6 text-center">
                    <DAOStatus walletAddress={connectedWalletAddress} did={didDoc?.id ?? ''} />
                  </div>
                )}
    </main>
  )
}
