import { useOnboardingState } from '../store/OnboardingState'
import ShareModal from 'lit-share-modal-v3'
import 'lit-share-modal-v3/dist/ShareModal.css'
import { useState, useEffect } from 'react'
import type { AccessControlConditions } from 'lit-share-modal-v3'

export function SetEncryption() {
  const {
    fhirResource,
    walletAddress,
    accessControlConditions,
    setAccessControlConditions,
    setEncryptionSkipped,
  } = useOnboardingState()

  const [showModal, setShowModal] = useState(false)

  // 🔍 Always log key state
  useEffect(() => {
    console.log('🔍 fhirResource:', fhirResource)
    console.log('🔍 walletAddress:', walletAddress)
    console.log('🔍 accessControlConditions:', accessControlConditions)
  }, [fhirResource, walletAddress, accessControlConditions])

  // 🔒 Safe check
  if (!fhirResource) {
    return (
      <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-red-600">No FHIR Resource</h2>
        <p>Cannot proceed without a resource.</p>
      </div>
    )
  }

  if (!walletAddress) {
    return (
      <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-red-600">Wallet Not Connected</h2>
        <p>Please connect your wallet to proceed.</p>
      </div>
    )
  }

  const resourceType = fhirResource.resourceType

  // 🔓 Practitioner / Organization (no encryption)
  if (resourceType === 'Organization' || resourceType === 'Practitioner') {
    return (
      <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Encryption Not Required</h2>
        <p className="mb-4 text-yellow-600">
          <strong>Note:</strong> {resourceType} records are <strong>not encrypted</strong>.
        </p>
        <p className="mb-4">
          To control access, apply for DAO membership to participate in record governance.
        </p>
        <button
          onClick={() => {
            setEncryptionSkipped(true)
            console.log('✅ Skipped encryption for:', resourceType)
          }}
          className="btn btn-outline btn-warning mb-2"
        >
          Confirm No Encryption Required
        </button>
        <a
          href="/dao/membership"
          className="btn btn-outline btn-secondary"
        >
          Apply for DAO Membership
        </a>
      </div>
    )
  }

  // 🔒 Patient / Device — Show encryption options
  const handleSelfOnly = () => {
    const acc: AccessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
      },
    ]
    setAccessControlConditions(acc)
    setEncryptionSkipped(false)
    console.log('✅ Self-only access set:', acc)
  }

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 5. Set Access Control</h2>
      <p className="mb-4">Choose how this record should be encrypted.</p>

      <button
        className="btn btn-outline btn-accent w-full mb-4"
        onClick={handleSelfOnly}
      >
        🔒 Only I can decrypt
      </button>

      <button
        className="btn btn-primary w-full mb-4"
        onClick={() => {
          console.log('🟢 Opening ShareModal...')
          setShowModal(true)
        }}
      >
        🤝 Share with Others
      </button>

      {showModal && (
        <ShareModal
          clientShareModal
          showModal={showModal}
          walletAddress={walletAddress}
          onClose={() => {
            console.log('🔴 Closing modal')
            setShowModal(false)
          }}
          onAccessControlConditionsSelected={(acc: AccessControlConditions) => {
            console.log('✅ Selected ACC:', acc)
            setAccessControlConditions(acc)
            setEncryptionSkipped(false)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
