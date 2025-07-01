import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { v4 as uuidv4 } from 'uuid'

interface FormProps {
  defaultValues: any;
  onSubmit: (updatedFHIR: any) => Promise<void>;
}
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
  const { litClient, litConnected, accessControlConditions } = useOnboardingState()

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

  const handleFormSubmit = async (updatedFHIR: any) => {
    try {
      console.log('💾 Submitting updated FHIR:', updatedFHIR)
      useOnboardingState.getState().setFHIRResource(updatedFHIR)
      
      const resourceType = updatedFHIR?.resourceType
      const { encryptionSkipped } = useOnboardingState.getState()
      
      // Only update FHIR resource in store during creation
      if (!didDoc?.id) {
        setStatus('✅ FHIR resource updated in store!')
        return
      }

      // For updates, handle encryption and DID update
      let skipEncryption = encryptionSkipped || 
        ['Practitioner', 'Organization'].includes(resourceType) ||
        (!fhir?.resourceUrl?.endsWith('.enc') && !fhir?.resourceUrl?.endsWith('.lit'))

      setModalOpen(true)

      let fileToUpload: Blob
      let hash = ''
      let url: string

      if (skipEncryption) {
        setStatus('📄 Uploading unencrypted FHIR resource...')
        url = await storePlainFHIRFile(updatedFHIR, updatedFHIR.id || uuidv4(), resourceType)
        setStatus('📤 Uploaded unencrypted file to Web3.Storage')
      } else {
        const { accessControlConditions } = useOnboardingState.getState()
        if (!accessControlConditions || accessControlConditions.length === 0) {
          setStatus('❌ No access control conditions set. Cannot encrypt.')
          return
        }

        setStatus('🔐 Encrypting updated FHIR...')
        const blob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })
        const litChain = chainName || 'ethereum'

        if (!litClient) {
          setStatus('❌ Lit client not initialized. Please try again.')
          return
        }

        const result = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: litChain,
          accessControlConditions,
        })

        fileToUpload = new Blob([result.encryptedJSON], { type: 'application/json' })
        hash = result.hash

        setStatus('📤 Uploading to Web3.Storage...')
        url = await storeEncryptedFileByHash(fileToUpload, hash, resourceType)
      }

      // Update DID on chain
      setStatus('📝 Updating smart contract...')
      const updateResult = await updateDIDUriOnChain({
        healthDid: didDoc?.id || address,
        newUri: url,
        chainName
      })
      
      if (!updateResult) {
        throw new Error('Failed to update DID on chain')
      }

      setStatus(`✅ DID updated successfully! IPFS URL: ${url}`)
    } catch (err: any) {
      console.error('Error updating DID:', err)
      setStatus(`❌ Error updating DID: ${err.message || 'Unknown error'}`)
    }
  }

  const handleUpdateClick = () => {
    if (!fhir) {
      setStatus('❌ No FHIR resource loaded.')
      return
    }
    
    // Submit the form when clicking update
    const form = document.querySelector('form')
    if (form) {
      form.requestSubmit()
    }
  }

  const handleUpdateDID = async (updatedFHIR: any) => {
    try {
      const resourceType = updatedFHIR?.resourceType
      const { encryptionSkipped } = useOnboardingState.getState()
      
      let skipEncryption = encryptionSkipped || 
        ['Practitioner', 'Organization'].includes(resourceType) ||
        (!fhir?.resourceUrl?.endsWith('.enc') && !fhir?.resourceUrl?.endsWith('.lit'))

      setModalOpen(true)

      let fileToUpload: Blob
      let hash = ''
      let url: string

      if (skipEncryption) {
        setStatus('📄 Uploading unencrypted FHIR resource...')
        url = await storePlainFHIRFile(updatedFHIR, updatedFHIR.id || uuidv4(), resourceType)
        setStatus('📤 Uploaded unencrypted file to Web3.Storage')
      } else {
        const { accessControlConditions } = useOnboardingState.getState()
        if (!accessControlConditions || accessControlConditions.length === 0) {
          setStatus('❌ No access control conditions set. Cannot encrypt.')
          return
        }

        setStatus('🔐 Encrypting updated FHIR...')
        const blob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })
        const litChain = chainName || 'ethereum'

        if (!litClient) {
          setStatus('❌ Lit client not initialized. Please try again.')
          return
        }

        const result = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: litChain,
          accessControlConditions,
        })

        fileToUpload = new Blob([result.encryptedJSON], { type: 'application/json' })
        hash = result.hash

        setStatus('📤 Uploading to Web3.Storage...')
        url = await storeEncryptedFileByHash(fileToUpload, hash, resourceType)
      }

      // Update DID on chain
      setStatus('📝 Updating smart contract...')
      const updateResult = await updateDIDUriOnChain({
        healthDid: didDoc?.id || address,
        newUri: url,
        chainName
      })
      
      if (!updateResult) {
        throw new Error('Failed to update DID on chain')
      }

      setStatus(`✅ DID updated successfully! IPFS URL: ${url}`)
    } catch (err: any) {
      console.error('Error updating DID:', err)
      setStatus(`❌ Error updating DID: ${err.message || 'Unknown error'}`)
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
