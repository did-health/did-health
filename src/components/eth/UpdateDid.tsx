import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'

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

const handleSubmit = async (updatedFHIR: any) => {
  try {
    const resourceType = updatedFHIR?.resourceType
    const skipEncryption = ['Practitioner', 'Organization'].includes(resourceType)
    setModalOpen(true)

    let fileToUpload: Blob
    let hash = ''

    if (skipEncryption) {
      setStatus('📄 Uploading unencrypted FHIR resource...')
      fileToUpload = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })
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
    }

    setStatus('📤 Uploading to Web3.Storage...')
    const url = await storeEncryptedFileByHash(fileToUpload, hash, resourceType)

    setStatus('📝 Updating smart contract...')
    await updateDIDUriOnChain({
      healthDid: didDoc?.id || address,
      newUri: url,
      chainName
    })
    setStatus('✅ DID updated on-chain!')
    setTimeout(() => setModalOpen(false), 2000)
  } catch (err: any) {
    console.error(err)
    setStatus(`❌ Error Updating DID`)
  }
}


  const handleUpdateClick = () => {
    if (!fhir) {
      setStatus('❌ No FHIR resource loaded.')
      return
    }
    handleSubmit(fhir)
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
        return <CreatePatientForm {...props} defaultValues={fhir} onSubmit={handleSubmit} />
      case 'Organization':
        return <CreateOrganizationForm {...props} defaultValues={fhir} onSubmit={handleSubmit} />
      case 'Practitioner':
        return <CreatePractitionerForm {...props} defaultValues={fhir} onSubmit={handleSubmit} />
      case 'Device':
        return <CreateDeviceForm {...props} defaultValues={fhir} onSubmit={handleSubmit} />
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
              💾 Save Changes
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
