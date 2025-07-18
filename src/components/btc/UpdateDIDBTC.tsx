import { useEffect, useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { decryptFHIRFile } from '../../lib/litEncryptFile'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import type { DIDService } from './ResolveDIDBTC'
import { ConnectWalletBTC } from './WalletConnectBTC'
import { ConnectLit } from '../lit/ConnectLit'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import { SetEncryption } from '../lit/SetEncryption'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/did-health.png'
import btcLogo from '../../assets/bitcoin-btc-logo.svg'
interface FHIRResource {
  accessControlConditions?: any
  [key: string]: any
}
interface DIDDocument {
  id: string
  service: DIDService[]
  [key: string]: any
}

export default function UpdateDidBTC() {
  const {
    walletAddress,
    litClient,
    litConnected,
    accessControlConditions,
    encryptionSkipped,
    setFhirResource,
  } = useOnboardingState()

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [didIpfsUri, setDidIpfsUri] = useState<string | null>(null)
  const [txid, setTxid] = useState<string>('')
  const { t } = useTranslation()
  const did = walletAddress ? `did:health:btc:${walletAddress}` : null

  useEffect(() => {
    const resolveDid = async () => {
      if (!did || !litConnected || !litClient) return
      const suffix = did.split(':').pop()
      if (!suffix || !suffix.startsWith('bc1')) {
        setStatus('❌ Invalid DID format')
        return
      }
      setStatus('🔍 Resolving DID from Ordinals...')
      try {

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
        console.error(err)
        setStatus(`❌ Error: ${err.message}`)
      }
    }

    resolveDid()
  }, [walletAddress, litConnected, litClient])

  const handleUpdate = async (updatedFHIR: any) => {
    try {
      setModalOpen(true)
      setStatus('📄 {t("preparingUpdate")}...')

      const resourceType = updatedFHIR?.resourceType
      setFhirResource(updatedFHIR)

      let fhirUri: string

      if (
        ['Practitioner', 'Organization'].includes(resourceType) ||
        encryptionSkipped
      ) {
        setStatus('📤 {t("uploadingPlaintextFHIR")}...')
        fhirUri = await storePlainFHIRFile(updatedFHIR, updatedFHIR.id || crypto.randomUUID(), resourceType)
      } else {
        setStatus('🔐 {t("encryptingFHIR")}...')
        const blob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })

        if (!litClient) {
          throw new Error('Lit client is not initialized. Please connect to Lit first.');
        }

        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: 'bitcoin',
          accessControlConditions: accessControlConditions || [],
        })

        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        setStatus('📤 {t("uploadingEncryptedFHIR")}...')
        fhirUri = await storeEncryptedFileByHash(encryptedBlob, hash, resourceType)
      }

      // Rebuild DID Document
      const newDidDoc = {
        id: did,
        controller: walletAddress,
        service: [
          {
            id: `${did}#fhir`,
            type: resourceType,
            serviceEndpoint: fhirUri,
          },
        ],
      }

      setStatus('📁 {t("uploadingUpdatedDIDDocumentToIPFS")}...')
      const didDocUri = await storePlainFHIRFile(newDidDoc, `${updatedFHIR.id}-didDocument.json`, 'didDocument')
      setDidIpfsUri(didDocUri)
      setStatus(`✅ {t("didDocumentUploaded")}. {t("reInscribeManuallyAtUnisat")}`)
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Failed: ${err.message}`)
    }
  }

  const renderForm = () => {
    if (!fhir || typeof fhir.resourceType !== 'string') return null
    console.log('fhir ======'+JSON.stringify(fhir))
    console.log('fhir.resourceType ======'+fhir.resourceType)
    const props = {
      defaultValues: fhir,
      onSubmit: handleUpdate,
    }

    switch (fhir.resourceType) {
      case 'Patient':
        return <CreatePatientForm {...props} />
      case 'Organization':
        return <CreateOrganizationForm {...props} />
      case 'Practitioner':
        return <CreatePractitionerForm {...props} />
      case 'Device':
        return <CreateDeviceForm {...props} />
      default:
        return <p>❌ Unsupported resource type: {fhir.resourceType}</p>
    }
  }

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">

      <div className="mb-8  flex flex-col">
  {/* Logos Row */}
  <div className="flex items-center gap-4 mb-6">
    
    {/* DID:Health Logo */}
    <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
      <img
        src={logo}
        alt="did:health Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* + Symbol */}
    <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">+</div>

    {/* Chain Logo */}
    <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
      <img
        src={btcLogo} // or ethlogo, btclogo, etc.
        alt="Cosmos Logo"
        className="w-full h-full object-contain"
      />
    </div>
  </div>
       <h1 className="text-2xl font-bold">✏️ {t("updateYourDIDBTC")}</h1>

      <ConnectWalletBTC />
      <ConnectLit />

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}

      {didDoc?.id && (
        <div className="p-3 bg-gray-50 rounded border border-gray-300 text-sm">
          <p className="font-medium text-gray-700">{t("resolvedDID")}:</p>
          <code className="block break-words">{didDoc.id}</code>
        </div>
      )}

      {renderForm()}

      {fhir(
        <div className="mt-6">
          <h2 className="text-lg font-semibold">🔐 {t("editAccessControl")}</h2>
          <SetEncryption />
        </div>
      )}

      {didIpfsUri && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-700">
            🔁 {t("reInscribeThisIPFSURIOnBitcoin")}
          </p>
          <code className="block break-words bg-gray-100 p-2 rounded text-xs">{didIpfsUri}</code>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={() =>
              window.open(`https://unisat.io/inscribe?tab=text&text=${encodeURIComponent(didIpfsUri)}`, '_blank')
            }
          >
            🪙 {t("openUnisat")}
          </button>

          <input
            className="input w-full mt-2"
            placeholder="Enter txid after inscription"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
          />
          <button
            className="btn btn-success w-full mt-1"
            onClick={() => {
              if (did && txid.trim().length > 10) {
                localStorage.setItem(`btc-txid-${did}`, txid.trim())
                setStatus('✅ txid saved locally.')
              } else {
                setStatus('❌ {t("invalidTxidOrDID")}.')
              }
            }}
          >
            📬 {t("saveTxid")}
          </button>
        </div>
      )}
      </div>
    </main>
  )
}
