import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { ConnectWallet } from './WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { resolveDidHealth } from '../../lib/DIDDocument'
import { storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { v4 as uuidv4 } from 'uuid'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3'
import { updateDIDUriOnChain } from '../../lib/updateDidUriOnChain'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import { SetEncryption } from '../lit/SetEncryption'
import {useTranslation} from 'react-i18next'
import logo from '../../assets/did-health.png'
import ethlogo from '../../assets/ethereum-eth-logo.svg'
interface FHIRResource {
  accessControlConditions?: any
  [key: string]: any
}
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

// Modal component
function StatusModal({ isOpen, status, onClose }: { isOpen: boolean; status: string; onClose: () => void }) {
  if (!isOpen) return null

  const isFinal = status.startsWith('✅') || status.startsWith('❌')

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold">⏳ Update in Progress</h2>
        <div className="flex items-center gap-3">
          {!isFinal && (
            <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300">{status}</p>
        </div>
        {isFinal && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UpdateDIDETH() {
  const { litConnected, litClient, chainId, encryptionSkipped , fhirResource, accessControlConditions, setFhirResource, setAccessControlConditions} = useOnboardingState()
  const { address: connectedWalletAddress, isConnected } = useAccount()
  const { t } = useTranslation()
  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<DIDDocument | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  
  const [resolvedChainName, setResolvedChainName] = useState<string>('')
  const [didFHIRResources, setDidFHIRResources] = useState<
    { uri: string; resource: any; error?: string }[]
  >([])
  const [modalOpen, setModalOpen] = useState(false)
  const [chainName, setChainName] = useState<string>('ethereum')

  useEffect(() => {
    const load = async () => {
      try {
        if (!connectedWalletAddress || !litConnected || !litClient) return

        setStatus('🔍 Resolving DID...')
        setDidDoc(null)
        setFhir(fhirResource)
        setQrCode('')
        setChainName('')
        setDidFHIRResources([])

        if (!isConnected || !connectedWalletAddress) {
          setStatus('❌ {t("walletNotConnected")}')
          return
        }

        // Only try to resolve on the main chain (Sepolia)
        if (!chainId) {
          setStatus('❌ { t("noChainId") }')
          return
        }
        const result = await resolveDidHealth(chainId, connectedWalletAddress)
        if (!result) {
          setStatus('❌ {t("noDIDFound")}s')
          return
        }

        setStatus('✅resolvedDID')
        const { doc, chainName } = result
        setChainName(chainName)
        setDidDoc(doc)

        // Extract FHIRResource service endpoints
        const fhirServices = doc.service?.filter(
          (s: any) => s.serviceEndpoint
        ) || []
  
        if (fhirServices.length === 0) {
          setStatus('✅ ' + t('noFHIRResourcesFound'))
        }

        setDidFHIRResources(fhirServices)
        const primary = fhirServices[0]
        const resourceUrl = primary.serviceEndpoint

        const isEncrypted = primary.serviceEndpoint.endsWith('.enc') || primary.serviceEndpoint.endsWith('.lit')

        setStatus(`📦 ${t('fetchingFHIRResource')} ${resourceUrl}`)
       console.log(resourceUrl)
       //return
        const response = await fetch(resourceUrl)
        console.log('response', response)
        //return
        
console.log('response', response)
if (!response.ok) {
  setStatus(`❌ Failed to fetch FHIR resource: ${response.statusText}`)
  return
}

        const json = await response.json() as FHIRResource
console.log('json', json)
console.log('isEncrypted', isEncrypted)
        //return
        if (isEncrypted) {
          setStatus('🔐 Decrypting...')
          const acc = json.accessControlConditions || []
          useOnboardingState.setState({ accessControlConditions: acc })

          const accChain = acc?.[0]?.chain || chainName || 'ethereum'
          const decrypted = await getLitDecryptedFHIR(json, litClient, { chain: accChain })
console.log('decrypted', decrypted)
          setFhir(decrypted)
          setStatus('✅ Decrypted FHIR loaded. Ready to edit.')
        } else {
          setFhir(json)
          setStatus('✅ Plaintext FHIR loaded. Ready to edit.')
        }
      } catch (err: any) {
        console.error(err)
        setStatus(err.message || '❌ Unexpected error')
      }
    }
    

    if (isConnected && connectedWalletAddress && litConnected && litClient) {
      load()
    }
  }, [connectedWalletAddress, isConnected, litClient, litConnected, setStatus, setFhir, setDidDoc, setDidFHIRResources, setQrCode, setResolvedChainName, setAccessControlConditions, setChainName ])

  const handleUpdateClick = () => {
    if (!fhir) {
      setStatus('❌ No FHIR resource loaded.')
      return
    }

    // Wait for the form to update the FHIR resource
    const updatedFHIR = useOnboardingState.getState().fhirResource
    if (!updatedFHIR) {
      setStatus('❌ No updated FHIR resource found.')
      return
    }

    // Call the update handler with the updated FHIR resource
    handleUpdateDID(updatedFHIR)
  }

  const handleUpdateDID = async (updatedFHIR: any) => {
    try {
      const resourceType = updatedFHIR?.resourceType
    
      if (!didDoc?.id) {
        setStatus('❌ DID Document not loaded')
        return
      }
  
      // Determine encryption logic
      let skipEncryption = false
      if (resourceType === 'Patient' || resourceType === 'Device') {
        skipEncryption = false
      } else {
        skipEncryption = encryptionSkipped ||
          ['Practitioner', 'Organization'].includes(resourceType) ||
          (!fhir?.resourceUrl?.endsWith('.enc') && !fhir?.resourceUrl?.endsWith('.lit'))
      }
  
      setModalOpen(true)
  
      let fhirUrl: string
      setStatus(skipEncryption ? '📄 Uploading plain FHIR...' : '🔐 Encrypting FHIR...')
  
      if (skipEncryption) {
        fhirUrl = await storePlainFHIRFile(updatedFHIR, updatedFHIR.id || uuidv4(), resourceType)
        setStatus('📤 Uploaded unencrypted FHIR')
      } else {
        if (!litClient) {
          setStatus('❌ Lit client not initialized')
          return
        }
        if (!accessControlConditions || accessControlConditions.length === 0) {
          setStatus('❌ Missing access control conditions')
          return
        }
  
        const blob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })
        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: chainName || 'ethereum',
          accessControlConditions
        })
        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        fhirUrl = await storeEncryptedFileByHash(encryptedBlob, hash, resourceType)
        setStatus('📤 Uploaded encrypted FHIR')
      }
  
      // 🧬 Replace or insert FHIR service entry in DID Document
      setStatus('📄 Updating DID Document...')
      const updatedService = {
        id: `${didDoc.id}#fhir`,
        type: resourceType,
        serviceEndpoint: fhirUrl
      }
  
      const existingServices = Array.isArray(didDoc.service) ? didDoc.service : []
      const updatedServices = [
        ...existingServices.filter((s: { type: string; id?: string }) => s.id?.includes('#fhir')),
        updatedService
      ]
  
      const updatedDidDoc = {
        ...didDoc,
        service: updatedServices
      }
  
      // 📦 Upload updated DID Document to IPFS
      const didDocUrl = await storePlainFHIRFile(updatedDidDoc, `did-${uuidv4()}`, 'didDocument')
      if (!didDocUrl) throw new Error('❌ Failed to upload updated DID Document')
  
      // 🔗 Update the DID registry on-chain with the new DID Document URI
      setStatus('📡 Updating on-chain DID registry...')
      const success = await updateDIDUriOnChain({
        healthDid: didDoc.id,
        newUri: didDocUrl,
        chainName
      })
  
      if (!success) throw new Error('❌ Smart contract update failed')
      setStatus(`✅ DID Document updated successfully! IPFS: ${didDocUrl}`)
  
    } catch (err: any) {
      console.error('❌ Error in handleUpdateDID:', err)
      setStatus(`❌ ${err.message || 'Unexpected error updating DID'}`)
    }
  }

  const handleSubmit = async (updatedFHIR: any) => {
    console.log('💾 Submitting updated FHIR:', updatedFHIR)
    setFhirResource(updatedFHIR)
    setFhir(updatedFHIR)
  }

  const renderForm = () => {
    if (!fhir || typeof fhir.resourceType !== 'string') {
      return <p className="text-sm text-gray-500">⏳ Loading or unsupported resource...</p>
    }

    const props = {
      defaultValues: fhir,
      onSubmit: handleSubmit,
    }

    switch (fhir.resourceType) {
      case 'Patient':
        return <CreatePatientForm {...props} defaultValues={fhir} />
      case 'Organization':
        return <CreateOrganizationForm {...props} defaultValues={fhir} />
      case 'Practitioner':
        return <CreatePractitionerForm {...props} defaultValues={fhir} />
      case 'Device':
        return <CreateDeviceForm {...props} defaultValues={fhir} />
      default:
        return <p className="text-sm text-red-500">❌ Unsupported FHIR resource type: {fhir.resourceType}</p>
    }
  }

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <div className="mb-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                {/* DID:Health Logo */}
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
                  <img
                    src={logo}
                    alt="did:health Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>+</div>
                {/* Chain Logo */}
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
                  <img
                    src={ethlogo} // Replace with actual path to Ethereum logo
                    alt={`eth logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
      <h1 className="text-2xl font-bold">✏️ {t('updateDID') }</h1>

      <ConnectWallet />
      <ConnectLit />
      {/* ✅ Show resolved DID */}
      {didDoc?.id && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200">
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">{t('resolvedDID')}  :</p>
          <code className="block break-words text-indigo-700 dark:text-indigo-400">{didDoc.id}</code>
          <p className="mt-1 text-xs text-gray-500">🔗 Found on: {chainName}</p>
        </div>
      )}

      {status && <p className="text-sm text-gray-600">{status}</p>}
      {renderForm()}

      {fhir && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">🔐 {t('editAccessControl')}</h2>
          {encryptionSkipped && (
            <SetEncryption />
          )}
          <div className="mt-4 text-right">
            <button
              onClick={handleUpdateClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              🔄 {t('updateDID')}
            </button>
          </div>
        </div>
      )}

      <StatusModal
        isOpen={modalOpen}
        status={status}
        onClose={() => setModalOpen(false)}
      />
    </div>
    </main>
  )
}
