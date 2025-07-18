import { useState } from 'react'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { registerDid } from '../../lib/registerDidOnChain'
import { useOnboardingState } from '../../store/OnboardingState'
import { Dialog } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { usePublicClient, useChainId } from 'wagmi'
import { chainIdToLitChain } from '../../lib/getChains'
import { useTranslation } from 'react-i18next'

export function RegisterDID() {
  const {
    fhirResource,
    did,
    litClient,
    accessControlConditions,
    encryptionSkipped,
    ipfsUri,
    setDid,
    setIpfsUri,
    walletAddress,
  } = useOnboardingState()

  const publicClient = usePublicClient()
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [finalDid, setFinalDid] = useState<string | null>(null)
  const chainId = useChainId()
  const { t } = useTranslation();
  console.log('🔗 Connected Chain ID:', chainId)
  const litChain = chainIdToLitChain[chainId] ?? 'ethereum' // default fallback
  console.log('🔗 Lit Chain:', litChain)
  const steps = [
    'Validating FHIR Resource',
    encryptionSkipped ? 'Skipping Encryption' : 'Encrypting with Lit Protocol',
    'Uploading to Web3.Storage',
    'Executing Smart Contract',
    'Registered Successfully',
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
  
      // ✅ Inject the DID into the FHIR identifier
      const didIdentifier = { system: 'https://www.w3.org/ns/did', value: did }
      const existingIds = Array.isArray(fhirResource.identifier) ? fhirResource.identifier : []
      const newIdentifiers = existingIds.some((id: { system: string }) => id?.system === didIdentifier.system)
        ? existingIds.map((id: { system: string }) => id?.system === didIdentifier.system ? didIdentifier : id)
        : [...existingIds, didIdentifier]
  
      const fhirWithDid = { ...fhirResource, identifier: newIdentifiers }
      const resourceBlob = new Blob([JSON.stringify(fhirWithDid, null, 2)], { type: 'application/json' })
  
      // ✅ Encrypt or store plain FHIR resource
      let fhirUri: string
      setActiveStep(1)
  
      if (encryptionSkipped || ['Organization', 'Practitioner'].includes(fhirResource.resourceType)) {
        fhirUri = await storePlainFHIRFile(fhirWithDid, fhirResource.id || crypto.randomUUID(), fhirResource.resourceType)
      } else {
        if (!litClient) {
          throw new Error('Lit client is not initialized');
        }
        if (!accessControlConditions) {
          throw new Error('Access control conditions are required');
        }
        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: resourceBlob,
          litClient,
          chain: litChain,
          accessControlConditions,
        })
        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        setActiveStep(2)
        fhirUri = await storeEncryptedFileByHash(encryptedBlob, hash, fhirResource.resourceType)
      }
  
      if (!fhirUri) throw new Error('Failed to upload FHIR resource to Web3.Storage')
  
      // ✅ Create DID Document
      const didDocument = {
        id: did,
        controller: walletAddress,
        service: [
          {
            id: `${did}#fhir`,
            type: fhirResource.resourceType,
            serviceEndpoint: fhirUri
          }
        ],
        verificationMethod: [
          {
            id: `${did}#controller`,
            type: 'EcdsaSecp256k1RecoveryMethod2020',
            controller: did,
            ethereumAddress: walletAddress
          }
        ]
      }
  console.log(didDocument)
      setActiveStep(3)
      const didDocUri = await storePlainFHIRFile(didDocument, crypto.randomUUID(), 'didDocument')
      console.log(didDocUri)
      if (!didDocUri) throw new Error('Failed to upload DID Document')
  
      setIpfsUri(didDocUri)
  
      // ✅ Register DID on chain with DID Document URI
      const tx = await registerDid({ did: shortDid, ipfsUri: didDocUri, chainId: chainIdDecimal })
      if (!publicClient) throw new Error('Wallet not connected')
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
  
      if (receipt.status !== 'success') throw new Error('Transaction failed or reverted')
  
      setActiveStep(4)
      setTxHash(tx)
      setFinalDid(did)
      setDid(did)
  
      setTimeout(() => setActiveStep(5), 1000)
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
    did && (
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
                      activeStep === 5 ? (
                        <div className="h-5 w-5 rounded-full border border-blue-300 bg-blue-100" />
                      ) : (
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
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300" />
                    )}
                    <span className={index === activeStep ? "font-semibold" : "text-gray-500"}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
              {activeStep === 5 && txHash && (
                <div className="mt-4 space-y-4">
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-green-800">Registration Complete!</h3>
                        <p className="text-green-700 mt-1">
                          Your did:health has been successfully registered.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">View your DID:</p>
                    <div className="flex gap-2">
                      <a 
                        href={`/ethereum/did`} 
                        className="btn btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Your did:health
                      </a>
                      <a 
                        href={getExplorerLink(txHash)} 
                        className="btn btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Your Registration on Etherscan
                      </a>
                    </div>
                  </div>
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
    ))
}


