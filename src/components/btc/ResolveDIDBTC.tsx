import { useState, useEffect } from 'react'
import { ConnectWalletBTC } from './WalletConnectBTC'
import { ConnectLit } from '../lit/ConnectLit'
import { generateQRCode } from '../../lib/QRCodeGeneration'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { useOnboardingState } from '../../store/OnboardingState'
import FHIRResource from '../fhir/FHIRResourceView'
import { DownloadFhirButton } from '../buttons/DownloadFhirButton'
import { SaveFhirButton } from '../buttons/SaveFhirButton'
import logo from '../../assets/did-health.png'
import btcLogo from '../../assets/bitcoin-btc-logo.svg' 
import { DAOStatus } from '../dao/DAOStatus'
import { useTranslation } from 'react-i18next'
// Remove file-saver import as we're using the DownloadFhirButton component
interface FHIRResource {
  accessControlConditions?: any
  [key: string]: any
}

export interface DIDService {
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
  // QR code generation is not currently used but kept for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            // Generate QR code
            const qr = await generateQRCode(JSON.stringify(didDocJson))
            if (qr) setQrCode(qr)
            setResolvedUri(normalizedIpfsUri)
            setStatus('✅ DID Document resolved!')

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

  const handleSaveToLocal = () => {
    try {
      if (!didDoc) return
      
      const savedDIDs = JSON.parse(localStorage.getItem('savedDIDs') || '[]')
      const existingIndex = savedDIDs.findIndex((d: any) => d.id === didDoc.id)
      
      if (existingIndex >= 0) {
        savedDIDs[existingIndex] = { ...didDoc, timestamp: new Date().toISOString() }
      } else {
        savedDIDs.push({ ...didDoc, timestamp: new Date().toISOString() })
      }
      
      localStorage.setItem('savedDIDs', JSON.stringify(savedDIDs))
      setStatus('✅ ' + t('savedToLocalStorage'))
    } catch (err) {
      console.error('Failed to save DID:', err)
      setStatus('❌ ' + t('failedToSave'))
    }
  }

  const handleDownloadDID = () => {
    if (!didDoc) return
    
    const blob = new Blob([JSON.stringify(didDoc, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `did-${didDoc.id.split(':').pop()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-center gap-4">
        {/* DID:Health Logo */}
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300 flex-shrink-0">
          <img
            src={logo}
            alt="did:health Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* + Symbol */}
        <div className="text-3xl font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">+</div>

        {/* Bitcoin Logo */}
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300 flex-shrink-0">
          <img
            src={btcLogo}
            alt="Bitcoin Logo"
            className="w-full h-full object-contain"
          />
        </div>


      </div>
      {/* Title */}
      <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold ml-4">
        🔎 <span className="text-green-600 dark:text-green-400">{t('viewYourDID')}</span>
      </h1>
      </div>
      <div className="flex flex-col items-center">
        {didDoc?.id && (
          <div className="mt-4">
            <a href={`/btc/did/update?did=${didDoc.id}`} className="btn-primary w-full">
              🔄 {t('common.update')} {t('Your')} did:health
            </a>
          </div>
        )}
        <ConnectWalletBTC />
      </div>
      <ConnectLit />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}

      {didDoc?.id && (
        <div>
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
            {qrCode && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">did:health QR Code</h2>
              <img src={qrCode} alt="QR Code" width={300} height={300} />
            </div>
          )}
          </div>

          {resolvedUri && (
            <div className="mt-2 text-sm text-gray-600">
              📍 IPFS URI: <code className="break-words">{resolvedUri}</code>
            </div>
          )}

          {fhir && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t('fhirResource')}
                </h2>
                <div className="flex space-x-2">
                  <SaveFhirButton fhirResource={fhir} className="text-sm" />
                  <DownloadFhirButton fhirResource={fhir} className="text-sm" />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <FHIRResource resource={fhir} />
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded mt-6 text-sm overflow-auto max-h-[600px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {t('resolvedDIDDocument')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveToLocal}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                  title={t('saveToLocalStorage')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {t('save')}
                </button>
                <button
                  onClick={handleDownloadDID}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
                  title={t('downloadDID')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('download')}
                </button>
              </div>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(didDoc, null, 2)}
            </pre>
          </div>
        </div>
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
      {fhir && (fhir.resourceType === 'Practitioner' || fhir.resourceType === 'Organization') && walletAddress && (
        <div className="mt-6 text-center">
          <DAOStatus walletAddress={walletAddress} />
        </div>
      )}
      
    </main>

  )
}
