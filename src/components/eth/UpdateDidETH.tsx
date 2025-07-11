import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { v4 as uuidv4 } from 'uuid'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3'
import { updateDIDUriOnChain } from '../../lib/updateDidUriOnChain'
import { ConnectWallet } from './WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import { SetEncryption } from '../lit/SetEncryption'

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

export default function UpdateDIDUri() {
  const { address, isConnected } = useAccount()
  const { litClient, litConnected } = useOnboardingState()

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [chainName, setChainName] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        if (!address || !litConnected || !litClient) return

        setStatus('🔍 Resolving DID...')
        const result = await resolveDidHealthAcrossChains(address)
        if (!result) throw new Error('❌ DID not found')

        const { doc, chainName } = result
        setDidDoc(doc)
        setChainName(chainName)

        const fhirService = doc?.service?.find((s: any) => s.type === 'FHIRResource')
        if (!fhirService?.serviceEndpoint) throw new Error('❌ No FHIR resource endpoint')

        const resourceUrl = fhirService.serviceEndpoint
        const isEncrypted = resourceUrl.endsWith('.enc') || resourceUrl.endsWith('.lit')

        setStatus(`📦 Fetching FHIR resource from ${resourceUrl}...`)
        const response = await fetch(resourceUrl)
        if (!response.ok) throw new Error(`❌ Failed to fetch: ${response.statusText}`)

        const json = await response.json()

        if (isEncrypted) {
          setStatus('🔐 Decrypting...')
          const acc = json.accessControlConditions || []
          useOnboardingState.setState({ accessControlConditions: acc })

          const accChain = acc?.[0]?.chain || chainName || 'ethereum'
          const decrypted = await getLitDecryptedFHIR(json, litClient, { chain: accChain })

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

    if (isConnected && address && litConnected && litClient) {
      load()
    }
  }, [address, isConnected, litConnected, litClient])

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
      const { encryptionSkipped, accessControlConditions } = useOnboardingState.getState()
  
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
        type: 'FHIRResource',
        serviceEndpoint: fhirUrl
      }
  
      const existingServices = Array.isArray(didDoc.service) ? didDoc.service : []
      const updatedServices = [
        ...existingServices.filter((s: { type: string; id?: string }) => !(s.type === 'FHIRResource' || s.id?.includes('#fhir'))),
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


  const renderForm = () => {
    if (!fhir || typeof fhir.resourceType !== 'string') {
      return <p className="text-sm text-gray-500">⏳ Loading or unsupported resource...</p>
    }

    const props = {
      defaultValues: fhir,
      onSubmit: handleUpdateDID,
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
      <h1 className="text-2xl font-bold">✏️ Update Your <span className="text-indigo-600">did:health</span> Resource</h1>

      <ConnectWallet />
      <ConnectLit />
      {/* ✅ Show resolved DID */}
      {didDoc?.id && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200">
          <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Resolved DID:</p>
          <code className="block break-words text-indigo-700 dark:text-indigo-400">{didDoc.id}</code>
          <p className="mt-1 text-xs text-gray-500">🔗 Found on: {chainName}</p>
        </div>
      )}

      {status && <p className="text-sm text-gray-600">{status}</p>}
      {renderForm()}

      {fhir && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">🔐 Edit Access Control</h2>
          <SetEncryption />
          <div className="mt-4 text-right">
            <button
              onClick={handleUpdateClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              🔄 Update did:health
            </button>
          </div>
        </div>
      )}

      <StatusModal
        isOpen={modalOpen}
        status={status}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}
