import { useState } from 'react'
import ShareModal from 'lit-share-modal-v3'
import 'lit-share-modal-v3/dist/ShareModal.css'
import { useOnboardingState } from '../store/OnboardingState'

export function SetAccessControl() {
  const {
    walletConnected,
    walletAddress,
    litConnected,
    storageReady,
    fhirResource,
    accessControlConditions,
    setAccessControlConditions,
  } = useOnboardingState()

  const [showModal, setShowModal] = useState(false)
  const [choice, setChoice] = useState<'none' | 'self' | 'share'>('none')

  const handleClose = () => {
    console.log('🔒 Closing Lit ShareModal...')
    setShowModal(false)
  }

  const handleOpenModal = () => {
    console.log('🔓 Opening Lit ShareModal...')
    setShowModal(true)
  }

  const handleAccessControlSelected = (result: any) => {
    console.log('✅ Access Control Selected from Modal:', result)
    if (result?.accessControlConditions) {
      setAccessControlConditions(result.accessControlConditions)
    }
    handleClose()
  }

  const setSelfOnlyCondition = () => {
    if (!walletAddress) {
      alert('Wallet address not available.')
      return
    }

    const condition = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
      },
    ]

    setAccessControlConditions(condition)
    setChoice('self')
  }

  if (!walletConnected || !walletAddress || !litConnected || !storageReady || !fhirResource) {
    return null
  }

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-2">Access Control</h2>

      {accessControlConditions ? (
        <>
          <p className="text-green-600">✅ Access Control Conditions Set</p>
          <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 mt-2 rounded overflow-x-auto">
            {JSON.stringify(accessControlConditions, null, 2)}
          </pre>
          <button
            onClick={handleOpenModal}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Access Control
          </button>
        </>
      ) : (
        <>
          <p className="text-yellow-500 mb-2">⚠️ Access Control Conditions Not Set</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setChoice('self')
                setSelfOnlyCondition()
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Only I (my wallet) can access
            </button>
            <button
              onClick={() => {
                setChoice('share')
                handleOpenModal()
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              I want to share access with others
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed z-[9999] inset-0 bg-black/50 flex justify-center items-center">
          <ShareModal
            showModal={showModal}
            onClose={handleClose}
            onAccessControlConditionsSelected={handleAccessControlSelected}
            darkTheme={true}
            injectCSS={true}
          />
        </div>
      )}
    </div>
  )
}
