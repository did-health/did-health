import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3'
import { updateDIDUriOnChain } from '../../lib/updateDidUriOnChain'

import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
// import other Create[Type]Form components as needed

export default function UpdateDIDUri() {
  const { address } = useAccount()
  const { litClient } = useOnboardingState()

  const [fhirResource, setFhirResource] = useState<any>(null)
  const [didDoc, setDidDoc] = useState<any>(null)
  const [chainName, setChainName] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [editedResource, setEditedResource] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      if (!address || !litClient) return

      setStatus('🔍 Resolving DID...')
      const result = await resolveDidHealthAcrossChains(address)
      if (!result) return setStatus('❌ DID not found')

      const { doc, chainName } = result
      setDidDoc(doc)
      setChainName(chainName)

      const fhirEndpoint = doc?.service?.find(s => s.type === 'FHIRResource')?.serviceEndpoint
      if (!fhirEndpoint) return setStatus('❌ No FHIR endpoint')

      setStatus('📦 Fetching existing FHIR...')
      const res = await fetch(fhirEndpoint)
      const json = await res.json()

      const isEncrypted = fhirEndpoint.endsWith('.enc') || fhirEndpoint.endsWith('.lit')
      if (isEncrypted) {
        setStatus('🔐 Decrypting...')
        const decrypted = await getLitDecryptedFHIR(json, litClient)
        setFhirResource(decrypted)
      } else {
        setFhirResource(json)
      }

      setStatus('✅ FHIR loaded. Ready to edit.')
    }

    load()
  }, [address, litClient])

  const handleSubmit = async (updatedFHIR: any) => {
    try {
      setStatus('🔐 Encrypting updated FHIR...')
      // Convert updatedFHIR to a Blob for encryption
      const resourceBlob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })
      // TODO: Set the correct chain and accessControlConditions as needed
      const litChain = chainName || 'ethereum'
      const accessControlConditions = [] // Set your access control conditions here

      const { encryptedJSON, hash } = await encryptFHIRFile({
        file: resourceBlob,
        litClient,
        chain: litChain,
        accessControlConditions,
      })

      // Compute a hash of the encrypted file for storage naming (already provided as 'hash')
      // If you need the encrypted file as a Blob:
      const encrypted = new Blob([encryptedJSON], { type: 'application/json' })

      setStatus('📤 Uploading to Web3.Storage...')
      const url = await storeEncryptedFileByHash(encrypted, hash, updatedFHIR.resourceType)

      setStatus('📝 Updating smart contract...')
      await updateDIDUriOnChain({
        did: address,
        newUri: url,
        chainName,
      })

      setStatus('✅ DID updated on-chain!')
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Error: ${err.message}`)
    }
  }

  const renderForm = () => {
    if (!fhirResource) return null
    switch (fhirResource.resourceType) {
      case 'Patient':
        return <CreatePatientForm  />
      case 'Organization':
        return <CreateOrganizationForm  />
      // Add cases for Practitioner, Device, etc.
      default:
        return <p>❌ Unsupported FHIR resource type: {fhirResource.resourceType}</p>
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🛠 Update Your did:health Resource</h1>
      {status && <p className="text-sm text-gray-600">{status}</p>}
      {renderForm()}
    </main>
  )
}
