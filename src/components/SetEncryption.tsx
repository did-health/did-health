import { useOnboardingState } from '../store/OnboardingState'
import ShareModal from 'lit-share-modal-v3'
import 'lit-share-modal-v3/dist/ShareModal.css'
import { useState, useEffect } from 'react'

// You may need to update this type import depending on your setup
import type { AccessControlConditions } from 'lit-share-modal-v3'

export function SetEncryption() {
  const {
    fhirResource,
    walletAddress,
    accessControlConditions,
    setAccessControlConditions,
    setEncryptionSkipped
  } = useOnboardingState()

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    console.log('🔍 fhirResource:', fhirResource)
    console.log('🔍 walletAddress:', walletAddress)
    console.log('🔍 accessControlConditions:', accessControlConditions)
  }, [fhirResource, walletAddress, accessControlConditions])

  if (!fhirResource) {
    console.log('❌ No FHIR resource set')
    return (
      <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-red-500">Missing FHIR Resource</h2>
      </div>
    )
  }

  const resourceType = fhirResource.resourceType

  if (resourceType === 'Organization' || resourceType === 'Practitioner') {
    console.log(`ℹ️ Skipping encryption for resource type: ${resourceType}`)

    return (
      <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Encryption Not Required</h2>
        <p className="mb-4 text-yellow-600">
          <strong>Note:</strong> {resourceType} records are <strong>not encrypted</strong>.
        </p>
        <p className="mb-4">
          To control access, please apply for DAO membership to participate in record governance.
        </p>
        <button
          onClick={() => {
            setEncryptionSkipped(true)
            console.log('✅ Encryption skipped confirmed by user')
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

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 5. Set Access Control</h2>

      <button
        onClick={() => {
          console.log('🟢 Opening Lit ShareModal...')
          setShowModal(true)
        }}
        className="btn btn-primary"
      >
        Set Access Control Conditions
      </button>

      {showModal && (
        <ShareModal
          clientShareModal
          showModal={showModal}
          onClose={() => {
            console.log('🔴 Closing Lit ShareModal...')
            setShowModal(false)
          }}
          onAccessControlConditionsSelected={(acc: AccessControlConditions) => {
            console.log('✅ Access Control Conditions Selected:', acc)
            setAccessControlConditions(acc)
            setShowModal(false)
          }}
          walletAddress={walletAddress as string}
        />
      )}
    </div>
  )
}
