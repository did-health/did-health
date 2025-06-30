// AltFHIRData.tsx
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { v4 as uuidv4 } from 'uuid'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { ConnectWallet } from './../eth/WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { addAltDataOnChain, type ChainName, contracts } from '../../lib/addAltDataonChain'
import PatientDirectivesStudio from './pcaio/PatientDirectivesStudio'
import CreateEndpointForm from './CreateEndpointForm'

export default function AltFHIRData() {
  const { address } = useAccount()
  const { litClient, litConnected } = useOnboardingState()

  interface DIDDocType {
    id: string;
    controller: string;
    service: { id: string; type: string; serviceEndpoint: string; }[];
    verificationMethod: never[];
    reputationScore: number;
    credentials: { hasWorldId: boolean; hasPolygonId: boolean; hasSocialId: boolean; };
  }

  const [didDoc, setDidDoc] = useState<DIDDocType | null>(null)
  const [chainName, setChainName] = useState<ChainName | null>(null)

  // Helper function to get all valid chain names
  const getAllChainNames = (): ChainName[] => {
    const testnetChains = Object.keys(contracts['testnet']) as ChainName[]
    const mainnetChains = Object.keys(contracts['mainnet']) as ChainName[]
    return [...testnetChains, ...mainnetChains]
  }

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
      // Transform the doc object to match the DIDDocType interface
      const completeDoc: DIDDocType = {
        id: doc.id,
        controller: doc.controller,
        service: doc.service || [],
        verificationMethod: [],
        reputationScore: doc.reputationScore || 0,
        credentials: {
          hasWorldId: doc.credentials?.hasWorldId || false,
          hasPolygonId: doc.credentials?.hasPolygonId || false,
          hasSocialId: doc.credentials?.hasSocialId || false
        },
  
      }
      setDidDoc(completeDoc)
      // Ensure chainName is a valid ChainName type
      if (Object.keys(contracts['testnet']).includes(chainName) || Object.keys(contracts['mainnet']).includes(chainName)) {
        setChainName(chainName as ChainName)
      } else {
        setChainName(null)
        console.error('Invalid chain name:', chainName)
      }

      // Log the DID document structure for debugging
      console.log('📦 DID Document:', {
        id: doc.id,
        service: doc.service,
  
      })

      // Process all endpoints (main and alt)
      interface ServiceEndpoint {
        id: string;
        type: string;
        serviceEndpoint: string;
      }

      const allEndpoints: ServiceEndpoint[] = [
        ...(doc?.service?.[0]?.serviceEndpoint ? [doc.service[0]] : []),
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
        const uuid = uuidv4()
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
        const uri = shouldEncrypt 
          ? await storeEncryptedFileByHash(fileToUpload, hash, resourceType)
          : await storePlainFHIRFile(resource, uuid, resourceType)
        uris.push(uri)
      }

// In addAltUrls
const addAltUrls = async (uris: string[]) => {
  if (!chainName || !address) {
    setStatus('❌ Please connect wallet first')
    return
  }

  try {
    setStatus('⏳ Sending transaction to register alt data...')

    // Use the wallet address as the healthDID
    const resolved = await resolveDidHealthAcrossChains(address)
    if (!resolved || !resolved.doc) throw new Error('❌ DID not found during transaction.')

    const walletDid = resolved.doc.id 
    console.log('**********' + walletDid)
    // Ensure the DID is properly formatted as a 0x-prefixed string
    const formattedDid = `0x${walletDid.replace(/^0x/, '')}` as `0x${string}`
    const tx = await addAltDataOnChain({
      healthDid: formattedDid,
      uris,
      chainName,
    })

    console.log('✅ Transaction receipt:', tx)

    if (tx.status !== 'success') throw new Error('❌ Transaction failed')

    setStatus('🔁 Re-fetching DID from chain...')
    const result = await resolveDidHealthAcrossChains(address)

    if (!result) {
      throw new Error('❌ Failed to resolve DID document')
    }

    setDidDoc(result.doc)
    await loadDIDData()

    console.log('✅ Alt URLs updated and fetched:', result.doc.service)
    setStatus(`✅ Alt URLs registered: ${uris.join(', ')}`)
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
