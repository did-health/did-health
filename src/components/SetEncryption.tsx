import { useOnboardingState } from '../store/OnboardingState'
import ShareModal from 'lit-share-modal-v3'
import 'lit-share-modal-v3/dist/ShareModal.css'
import { useState, useEffect } from 'react'
import type { AccessControlConditions, AccessControlCondition } from 'lit-share-modal-v3'

export function SetEncryption() {
  const {
    fhirResource,
    walletConnected,
    walletAddress,
    accessControlConditions,
    encryptionSkipped,
    setAccessControlConditions,
    setEncryptionSkipped,
  } = useOnboardingState()

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    console.log('🔍 walletConnected:', walletConnected)
    console.log('🔍 walletAddress:', walletAddress)
    console.log('🔍 fhirResource:', fhirResource)
    console.log('🔍 accessControlConditions:', accessControlConditions)
    console.log('🔍 encryptionSkipped:', encryptionSkipped)
  }, [walletConnected, walletAddress, fhirResource, accessControlConditions, encryptionSkipped])

  if (!fhirResource) {
    return (
      <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-red-600">Missing FHIR Resource</h2>
        <p>Please complete prior steps to define the resource.</p>
      </div>
    )
  }

  const resourceType = fhirResource.resourceType

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
            console.log('✅ Skipped encryption for resource type:', resourceType)
          }}
          className="btn btn-outline btn-warning mb-2"
        >
          Confirm No Encryption Required
        </button>
        <a href="/dao/membership" className="btn btn-outline btn-secondary">
          Apply for DAO Membership
        </a>
      </div>
    )
  }

  const handleSelfOnly = () => {
    if (!walletAddress) return;
    const acc: AccessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>=',
          value: walletAddress,
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

      <button className="btn btn-outline btn-accent w-full mb-4" onClick={handleSelfOnly}>
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

{showModal && walletAddress && (
  <div className="lit-share-modal">
    <ShareModal
      onClose={() => {
        console.log('🔴 Closing modal')
        setShowModal(false)
      }}
      onUnifiedAccessControlConditionsSelected={(output) => {
        console.log('✅ Selected ACC:', output.unifiedAccessControlConditions)
        setAccessControlConditions(output.unifiedAccessControlConditions)
        setEncryptionSkipped(false)
        setShowModal(false)
      }}
      allowMultipleConditions={false}
      allowChainSelector={false}
      defaultChain="ethereum"
      chainsAllowed={['ethereum']}
      injectInitialState={true}
      initialFlow="singleCondition"
      initialCondition="wallet"
      injectCSS={true}
      darkTheme={true}
    />
  </div>
)}


      {(encryptionSkipped || accessControlConditions) && (
        <div className="mt-6 p-4 bg-gray-100 border rounded text-sm text-gray-700">
          {encryptionSkipped ? (
            <p>🔓 <strong>Encryption Skipped</strong> — this record will not be encrypted.</p>
          ) : (
            <>
              <p>🔐 <strong>Encryption Enabled</strong> with the following access rules:</p>
              <ul className="mt-2 list-disc pl-6">
                {accessControlConditions?.map((cond: AccessControlCondition, idx: number) => (
                  <li key={idx}>
                    <code>{cond.method}</code> on <strong>{cond.chain}</strong>{' '}
                    → <code>{cond.returnValueTest.comparator} {cond.returnValueTest.value}</code>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
