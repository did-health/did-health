import React, { useState } from 'react'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { useOnboardingState } from '../../store/OnboardingState'
import { Dialog } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { chainIdToLitChain } from '../../lib/getChains'

export function RegisterDIDBTC() {
  // Add type assertion to avoid implicit 'any' error
  // const litChain = (chainIdToLitChain as Record<string, string>)['bitcoin'] ?? 'ethereum'
// Error state for displaying errors in the UI
const [error, setError] = useState<string | null>(null)
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

  const [txid, setTxid] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  // const litChain = chainIdToLitChain['bitcoin'] ?? 'ethereum' // replaced with typed version above
  const [finalDid, setFinalDid] = useState<string | null>(null)

  const litChain =  'bitcoin'

  const steps = [
    'Validating FHIR Resource',
    encryptionSkipped ? 'Skipping Encryption' : 'Encrypting with Lit Protocol',
    'Uploading to Web3.Storage',
    'Awaiting Manual Ordinals Inscription',
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

    setOpen(true)
    setError(null)

    try {
      setActiveStep(0)

      const didIdentifier = {
        system: 'https://www.w3.org/ns/did',
        value: did,
      }

      const fhirWithDid = {
        ...fhirResource,
        identifier: Array.isArray(fhirResource.identifier)
          ? fhirResource.identifier.some(id => id.system === 'https://www.w3.org/ns/did')
            ? fhirResource.identifier.map(id =>
                id.system === 'https://www.w3.org/ns/did' ? { ...id, value: didIdentifier.value } : id
              )
            : [...fhirResource.identifier, didIdentifier]
          : [didIdentifier],
      }

      const resourceJson = JSON.stringify(fhirWithDid, null, 2)
      const resourceBlob = new Blob([resourceJson], { type: 'application/json' })

      let finalIpfsUri = null

      if (encryptionSkipped) {
        setActiveStep(1)
        const fileName = fhirResource.id || crypto.randomUUID()
        finalIpfsUri = await storePlainFHIRFile(fhirResource, fileName, fhirResource.resourceType)
      } else {
        setActiveStep(1)
        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: resourceBlob,
          litClient: litClient!,
          chain: litChain,
          accessControlConditions,
        })

        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        setActiveStep(2)
        finalIpfsUri = await storeEncryptedFileByHash(encryptedBlob, hash, fhirResource.resourceType)
      }

      if (!finalIpfsUri) throw new Error('Failed to upload to Web3.Storage')
      setIpfsUri(finalIpfsUri)

      setActiveStep(3)
      setFinalDid(did)
    } catch (err: any) {
      console.error('❌ Registration error:', err)
      setError(err.message || '❌ Registration failed. See console.')
    }
  }

  const handleTxidSubmit = () => {
    if (!txid || txid.trim().length < 10) {
      alert('❌ Please enter a valid Bitcoin txid.')
      return
    }
    localStorage.setItem(`btc-txid-${did}`, txid.trim())
    setSubmitted(true)
    setActiveStep(4)
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
              <Dialog.Title className="text-lg font-bold mb-4">Registering DID (Bitcoin)</Dialog.Title>
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
                    <span className={index === activeStep ? 'font-semibold' : 'text-gray-500'}>{step}</span>
                  </li>
                ))}
              </ol>

              {activeStep === 3 && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-gray-700">Now inscribe your DID document manually via Ordinals on Bitcoin Testnet using the following IPFS URI:</p>
                  <p className="break-words bg-gray-100 rounded p-2 text-xs">{ipfsUri}</p>
<button
  className="btn btn-primary"
  onClick={() => {
    const text = encodeURIComponent(ipfsUri ?? ''); // Your actual IPFS URI
    const url = `https://unisat.io/inscribe?tab=text&text=${text}`;
    window.open(url, '_blank');
  }}
>
  🪙 Open Unisat to Inscribe IPFS URI
</button>


                  <input
                    className="input w-full mt-2"
                    placeholder="Enter txid after Ordinals inscription"
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                  />
                  <button className="btn btn-primary w-full" onClick={handleTxidSubmit}>
                    📬 Submit txid
                  </button>
                </div>
              )}

              {submitted && (
                <p className="text-green-600 mt-4">✅ txid stored! You can now resolve your DID.</p>
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
  )
}

export default RegisterDIDBTC


