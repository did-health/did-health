import { useState } from 'react'
import { encryptFHIRFile } from '../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../lib/storeFIleWeb3'
import { registerDid } from '../lib/registerDidOnChain'
import { useOnboardingState } from '../store/OnboardingState'
import { Dialog } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { usePublicClient } from 'wagmi'

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

  const publicClient = usePublicClient()
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [finalDid, setFinalDid] = useState<string | null>(null)

  const steps = [
    'Validating FHIR Resource',
    encryptionSkipped ? 'Skipping Encryption' : 'Encrypting with Lit Protocol',
    'Uploading to Web3.Storage',
    'Executing Smart Contract',
    'Registering DID',
  ]

  const handleRegister = async () => {
    if (!fhirResource || !did || (!encryptionSkipped && !litClient)) {
      setError('Missing FHIR Resource, DID, or Lit Client')
      return
    }

    const parts = did.split(':')
    if (parts.length !== 4 || !/^[a-z0-9-]+$/.test(parts[3])) {
      setError('Invalid DID format. Use only lowercase letters, numbers, and dashes')
      return
    }

    const shortDid = `${parts[2]}:${parts[3]}`
    const chainIdDecimal = parseInt(parts[2])

    setOpen(true)
    setError(null)

    try {
      setActiveStep(0)

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

        if (!finalIpfsUri) throw new Error('Failed to upload file to Web3.Storage')
        setIpfsUri(finalIpfsUri)
      }

      setActiveStep(3)
      
      const tx = await registerDid({ did: shortDid, ipfsUri: finalIpfsUri, chainId: chainIdDecimal })
      console.log('📤 TX sent:', tx)

      if (!publicClient) throw new Error('Public client is not available')
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
      console.log('🧾 TX Receipt:', receipt)

      if (receipt.status !== 'success') throw new Error('Transaction failed or reverted')

      setActiveStep(4)
      setTxHash(tx)
      setFinalDid(did)
      setDID(did)
    } catch (err: any) {
      console.error('❌ Registration error:', err)
      setError(err.message || '❌ Registration failed. See console for details.')
    }
  }

  const getExplorerLink = (txHash: string): string => {
    const chainSegment = did?.split(':')[2]
    if (chainSegment === '1') return `https://etherscan.io/tx/${txHash}`
    if (chainSegment === '11155111') return `https://sepolia.etherscan.io/tx/${txHash}`
    if (chainSegment === '84532') return `https://sepolia.basescan.org/tx/${txHash}`
    if (chainSegment === '534351') return `https://sepolia.scrollscan.com/tx/${txHash}`
    if (chainSegment === '421614') return `https://sepolia.arbiscan.io/tx/${txHash}`
    return `https://etherscan.io/tx/${txHash}`
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

            {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

            {activeStep === 4 && txHash && (
              <div className="mt-6 text-sm space-y-2">
                <p><strong>DID:</strong> <code>{finalDid}</code></p>
                <p><strong>IPFS:</strong> <a href={ipfsUri ?? ''} className="text-blue-600 underline" target="_blank">{ipfsUri}</a></p>
                <p>
                  <strong>Transaction:</strong>{' '}
                  <a href={getExplorerLink(txHash)} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    View on Block Explorer ↗
                  </a>
                </p>
              </div>
            )}

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
