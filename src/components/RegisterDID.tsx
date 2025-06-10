import { useState } from 'react'
import { encryptFHIRFile } from '../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../lib/storeFIleWeb3'
import { registerDid } from '../lib/registerDidOnChain'
import { useOnboardingState } from '../store/OnboardingState'
import { Dialog } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function getExplorerTxUrl(chainId: number, txHash: string): string {
  const map: Record<number, string> = {
    11155111: 'https://sepolia.etherscan.io',
    1: 'https://etherscan.io',
    8453: 'https://basescan.org',
    42161: 'https://arbiscan.io',
    137: 'https://polygonscan.com',
  }
  const base = map[chainId] ?? 'https://etherscan.io'
  return `${base}/tx/${txHash}`
}

export function RegisterDID() {
  const {
    fhirResource,
    did,
    litClient,
    accessControlConditions,
    encryptionSkipped,
    ipfsUri,
    setDID,
    setIpfsUri,
  } = useOnboardingState()

  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const steps = [
    'Validating FHIR Resource',
    encryptionSkipped ? 'Skipping Encryption' : 'Encrypting with Lit Protocol',
    'Uploading to Web3.Storage',
    'Executing Smart Contract',
  ]

  const handleRegister = async () => {
    if (!fhirResource || !did || (!encryptionSkipped && !litClient)) {
      setError('Missing FHIR Resource, DID, or Lit Client')
      return
    }

    setOpen(true)
    setError(null)

    try {
      setActiveStep(0)

      const chainId = parseInt(did.split(':')[2])
      let finalIpfsUri = ipfsUri

      if (!finalIpfsUri) {
        const resourceJson = JSON.stringify(fhirResource, null, 2)
        const resourceBlob = new Blob([resourceJson], { type: 'application/json' })

        if (encryptionSkipped) {
          setActiveStep(1)
          const fileName = fhirResource.id || crypto.randomUUID()
          finalIpfsUri = await storePlainFHIRFile(fhirResource, fileName, fhirResource.resourceType)
        } else {
          setActiveStep(1)
          const { encryptedJSON, hash } = await encryptFHIRFile({
            file: resourceBlob,
            litClient: litClient!,
            chain: 'ethereum',
            accessControlConditions,
          })
          const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
          setActiveStep(2)
          finalIpfsUri = await storeEncryptedFileByHash(encryptedBlob, hash, fhirResource.resourceType)
        }

        if (!finalIpfsUri) {
          throw new Error('Failed to upload file to Web3.Storage')
        }

        console.log('✅ File uploaded to Web3.Storage:', finalIpfsUri)
        setIpfsUri(finalIpfsUri)
      } else {
        console.log('ℹ️ Skipping upload — using existing IPFS URI:', finalIpfsUri)
      }

      setActiveStep(3)
      const tx = await registerDid({ did, ipfsUri: finalIpfsUri, chainId })
      console.log('✅ DID registered:', tx)
      setTxHash(tx)

      setActiveStep(4)
      setDID(did)
    } catch (err: any) {
      console.error('❌ Registration error:', err)
      setError(err.message || '❌ Registration failed. See console for details.')
    }
  }

  return (
    <div className="space-y-4">
      <button className="btn btn-primary" onClick={handleRegister}>
        Register DID
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6 shadow">
            <Dialog.Title className="text-lg font-bold mb-4">Registering DID</Dialog.Title>

            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {index < activeStep ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : index === activeStep ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 1010 10h-4l3 3 3-3h-4a8 8 0 01-8 8z"
                      />
                    </svg>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-300" />
                  )}
                  <span className={index === activeStep ? 'font-semibold' : 'text-gray-500'}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            {activeStep === steps.length  && !error && (
              <div className="mt-6 space-y-4 text-sm text-gray-800">
                <div>
                  ✅ <strong>DID registered:</strong><br />
                  <code className="text-xs break-all">{did}</code>
                </div>
                {ipfsUri && (
                  <div>
                    📦 <strong>FHIR File:</strong>{' '}
                    <a
                      href={`${ipfsUri}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View on IPFS
                    </a>
                  </div>
                )}
                {txHash && (
                  <div>
                    🔗 <strong>Transaction:</strong>{' '}
                    <a
                      href={did ? getExplorerTxUrl(parseInt(did.split(':')[2]), txHash) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View on Explorer
                    </a>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

            <div className="mt-6 text-center">
              <button className="btn btn-sm btn-outline" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}