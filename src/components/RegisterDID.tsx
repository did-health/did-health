import { encryptFHIRFile } from '../lib/litEncrypFile'
import { storeEncryptedFileByHash } from '../lib/storeFIleWeb3'
import { registerDid } from '../lib/registerDidOnChain'
import { useOnboardingState } from '../store/OnboardingState'
import { useState } from 'react'

export function RegisterDID() {
  const { fhirResource, did, litClient, setDID } = useOnboardingState()
  const [status, setStatus] = useState('')

  const handleRegister = async () => {
    try {
      if (!fhirResource || !did || !litClient) {
        setStatus('Missing FHIR, DID, or Lit client')
        return
      }

      const resourceJson = JSON.stringify(fhirResource, null, 2)
      const resourceBlob = new Blob([resourceJson], { type: 'application/json' })

      const chainId = parseInt(did.split(':')[2])
      const chain = chainId === 5 ? 'goerli' : 'ethereum' // extend this as needed

      setStatus('🔐 Encrypting FHIR record...')
      const { encryptedBlob, symmetricKey } = await encryptFHIRFile(resourceBlob, litClient, chain)

      setStatus('📦 Uploading to Web3.Storage...')
      const ipfsUri = await storeEncryptedFileByHash(encryptedBlob, symmetricKey.toString(), fhirResource.resourceType)

      setStatus('📝 Registering DID on-chain...')
      await registerDid({ did, ipfsUri, chainId })

      setDID(did)
      setStatus('✅ DID successfully registered!')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to register DID')
    }
  }

  return (
    <div className="space-y-4">
      <button className="btn btn-primary" onClick={handleRegister}>
        Register DID
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}

