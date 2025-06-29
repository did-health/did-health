// AltFHIRData.tsx
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { ConnectWallet } from './../eth/WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { addAltDataOnChain, type ChainName } from '../../lib/addAltDataonChain'
import PatientDirectivesStudio from './pcaio/PatientDirectivesStudio'
import CreateEndpointForm from './CreateEndpointForm'

export default function AltFHIRData() {
  const { address } = useAccount()
  const { litClient, litConnected } = useOnboardingState()

  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [chainName, setChainName] = useState<ChainName | null>(null)
  const [allResources, setAllResources] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [didType, setDidType] = useState<'Patient' | 'Practitioner' | 'Organization' | 'Device' | null>(null)

  const loadDIDData = async () => {
    try {
      if (!address || !litClient) return
      setStatus('🔍 Resolving did:health...')
      const result = await resolveDidHealthAcrossChains(address)
      if (!result) throw new Error('❌ DID not found')

      const { doc, chainName } = result
      setDidDoc(doc)
      setChainName(chainName)

      // Log the DID document structure for debugging
      console.log('📦 DID Document:', {
        id: doc.id,
        service: doc.service,
        altIpfsUris: doc.altIpfsUris
      })

      // Process all endpoints (main and alt)
      const allEndpoints = [
        ...(doc?.service?.[0]?.serviceEndpoint ? [doc.service[0]] : []),
        ...(doc?.altIpfsUris?.map(uri => ({
          id: `did:health:${doc.id}#alt-${uri}`,
          type: 'FHIRResource',
          serviceEndpoint: uri
        })) || [])
      ]

      const resources: any[] = []
      
      // Process each endpoint
      for (const endpoint of allEndpoints) {
        try {
          const res = await fetch(endpoint.serviceEndpoint)
          const json = await res.json()
          const decrypted = endpoint.serviceEndpoint.endsWith('.enc') || endpoint.serviceEndpoint.endsWith('.lit')
            ? await getLitDecryptedFHIR(json, litClient, { chain: chainName })
            : json
          resources.push({ 
            uri: endpoint.serviceEndpoint, 
            resource: decrypted 
          })
        } catch (err) {
          console.warn(`❌ Could not load resource: ${endpoint.serviceEndpoint}`, err)
        }
      }

      // Set the first resource type as the didType
      const didResourceType = resources[0]?.resource?.resourceType || 'Patient'
      setDidType(didResourceType as any)

      // Log the final resources array
      console.log('📦 Final resources:', resources)

      setAllResources(resources)
      setStatus('')
    } catch (err: any) {
      console.error(err)
      setStatus(err.message || '❌ Unexpected error')
    }
  }

  useEffect(() => {
    if (address && litClient) loadDIDData()
  }, [address, litClient])

  const handleSubmitResources = async (resources: any[]) => {
    try {
      if (!address || !didDoc || !chainName) return

      const acc = useOnboardingState.getState().accessControlConditions
      const uris: string[] = []

      for (const resource of resources) {
        const resourceType = resource.resourceType
        const shouldEncrypt = ['Patient', 'Device', 'Consent'].includes(resourceType)

        let fileToUpload: Blob
        let hash = ''

        if (shouldEncrypt) {
          if (!litClient || !litConnected || !acc || acc.length === 0) {
            throw new Error('❌ Missing access control conditions for encryption')
          }
          const result = await encryptFHIRFile({
            file: new Blob([JSON.stringify(resource)], { type: 'application/json' }),
            litClient,
            chain: chainName,
            accessControlConditions: acc,
          })
          fileToUpload = new Blob([result.encryptedJSON], { type: 'application/json' })
          hash = result.hash
        } else {
          fileToUpload = new Blob([JSON.stringify(resource)], { type: 'application/json' })
        }

        setStatus(`📤 Uploading ${resourceType}...`)
        const uri = await storeEncryptedFileByHash(fileToUpload, hash, resourceType)
        uris.push(uri)
      }

      const addAltUrls = async (uris: string[]) => {
        if (!chainName || !address) {
          setStatus('❌ Please connect wallet first')
          return
        }

        try {
          setStatus('⏳ Adding alt URLs...')
          const tx = await addAltDataOnChain({
            healthDid: didDoc?.id || '',
            uris,
            chainName,
          })
          
          // Wait for the transaction to be confirmed
          await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds for confirmation
          
          // Refresh the DID data
          await loadDIDData()
          
          console.log('✅ Added alt URLs:', uris)
          setStatus('✅ Alt URLs added successfully')
        } catch (err: any) {
          console.error(err)
          setStatus(`❌ Error adding alt URLs: ${err.message}`)
        }
      }

      await addAltUrls(uris)
    } catch (err: any) {
      console.error(err)
      setStatus(err.message || '❌ Upload failed')
    }
  }

  const renderFormByType = () => {
    if (!didType) return null

    if (didType === 'Patient') {
      return <PatientDirectivesStudio onComplete={handleSubmitResources} />
    }

    if (didType === 'Practitioner' || didType === 'Organization') {
      return <CreateEndpointForm onSubmit={(endpoint) => handleSubmitResources([endpoint])} />
    }

    return <p className="text-sm text-gray-600 italic">⚠️ No alt resources supported for this DID type.</p>
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">➕ Manage Alternate FHIR Resources</h1>
      <ConnectWallet />
      <ConnectLit />

      {status && <p className="text-sm text-gray-600">{status}</p>}

      {didDoc?.id && (
        <div className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded border">
          <div><strong>DID:</strong> <code>{didDoc.id}</code></div>
          <div><strong>Type:</strong> {didType}</div>
        </div>
      )}

      {renderFormByType()}

      {allResources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">🔗 Linked Resources</h3>
          {Object.entries(
            allResources.reduce((acc: any, item) => {
              const type = item.resource?.resourceType || 'Unknown'
              acc[type] = [...(acc[type] || []), item]
              return acc
            }, {})
          ).map(([type, items]) => (
            <div key={type} className="mb-4">
              <h4 className="font-medium">{type}</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300">
                {(items as any[]).map(({ uri, resource }, i) => (
                  <li key={i} className="break-all">
                    ✅ {resource.id || '[no id]'} –{' '}
                    <a href={uri} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
