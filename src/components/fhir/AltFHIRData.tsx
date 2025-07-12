// AltFHIRData.tsx
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../../store/OnboardingState'
import { storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { v4 as uuidv4 } from 'uuid'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { updateDIDUriOnChain } from '../../lib/updateDidUriOnChain'
import PatientDirectivesStudio from './pcaio/PatientDirectivesStudio'
import CreateEndpointForm from './CreateEndpointForm'
import deployedContracts from '../../generated/deployedContracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'

export default function AltFHIRData() {
  const { address } = useAccount()
  const { litClient } = useOnboardingState()

  interface DIDDocType {
    id: string;
    controller: string;
    service: { id: string; type: string; serviceEndpoint: string; }[];
    verificationMethod: never[];
    reputationScore: number;
    credentials: { hasWorldId: boolean; hasPolygonId: boolean; hasSocialId: boolean; };
  }

  const [didDoc, setDidDoc] = useState<DIDDocType | null>(null)
  const [chainName, setChainName] = useState<string | null>(null)

  const [allResources, setAllResources] = useState<any[]>([])
  const [status, setStatus] = useState('')

  const createAndStoreAltFHIR = async (fhirResource: any) => {
    try {
      if (!address) throw new Error('❌ Wallet not connected')
      
      setStatus('🔍 Resolving DID...')
      const result = await resolveDidHealthAcrossChains(address)
      if (!result) throw new Error('❌ DID not found')

      const { doc: resolvedDoc, chainName } = result
      const fullDid = resolvedDoc.id // e.g., did:health:baseSepolia:rich
      const [_did, _method, chainPart] = fullDid.split(':')

      // Store the FHIR resource
      setStatus('💾 Storing FHIR resource...')
      const ipfsUri = await storePlainFHIRFile(fhirResource)

      // Update the DID with the new FHIR resource
      setStatus('🔄 Updating DID...')
      const updateResult = await updateDIDUriOnChain({
        healthDid: fullDid,
        newUri: ipfsUri,
        chainName
      })

      // Update state with new resource
      setAllResources(prev => [...prev, {
        id: uuidv4(),
        ipfsUri,
        timestamp: new Date().toISOString(),
        type: fhirResource.resourceType
      }])

      setStatus('✅ FHIR resource stored and DID updated!')
      return updateResult
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
      throw err
    }
  }

  const loadDIDData = async () => {
    try {
      if (!address || !litClient) return
      setStatus('🔍 Resolving did:health...')

      const result = await resolveDidHealthAcrossChains(address)
      if (!result) throw new Error('❌ DID not found')

      const { doc: resolvedDoc, chainName } = result
      const fullDid = resolvedDoc.id // e.g., did:health:baseSepolia:rich
      const [_did, _method, chainPart] = fullDid.split(':')
      const env = import.meta.env.VITE_ENV || 'testnet'

      const registryEntry = Object.values(deployedContracts[env]).find(
        (net: any) => net.HealthDIDRegistry?.chainId === parseInt(chainPart)
      )?.HealthDIDRegistry

      if (!registryEntry) {
        throw new Error(`❌ No HealthDIDRegistry deployed for chain ID ${chainPart}`)
      }

      const provider = new JsonRpcProvider(registryEntry.rpcUrl)
      const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider)

      const data = await contract.getHealthDID(chainPart)

      if (!data || data.owner === ethers.ZeroAddress) {
        throw new Error(`❌ DID not found on chain ${chainName}`)
      }

      // Get all altIpfsUris and fetch their contents
      const altIpfsUris = data.altIpfsUris || []
      const fetchedResources = await Promise.all(
        altIpfsUris.map(async (uri: string) => {
          try {
            const content = await fetch(`https://w3s.link/ipfs/${uri.replace('ipfs://', '')}`)
            return {
              id: uuidv4(),
              ipfsUri: uri,
              content: await content.json(),
              timestamp: new Date().toISOString()
            }
          } catch (err) {
            console.error(`❌ Failed to fetch resource from ${uri}:`, err)
            return null
          }
        })
      ).then(results => results.filter(Boolean))

      setAllResources(fetchedResources)
      
      const completeDoc: DIDDocType = {
        id: `did:health:${chainPart}:${address}`, // Use address as identifier
        controller: data.owner,
        service: altIpfsUris.map((uri: string, idx: number) => ({
          id: `#service-${idx}`,
          type: 'AlternateFHIR',
          serviceEndpoint: uri,
        })),
        verificationMethod: [],
        reputationScore: Number(data.reputationScore ?? 0),
        credentials: {
          hasWorldId: data.hasWorldId,
          hasPolygonId: data.hasPolygonId,
          hasSocialId: data.hasSocialId,
        },
      }

      setDidDoc(completeDoc)
      setChainName(chainName as string)
      setStatus('✅ DID loaded successfully')

      // Fetch and decrypt altIpfsUris
      const decryptedResources = await Promise.all(
        completeDoc.service.map(async (svc) => {
          try {
            const content = await getLitDecryptedFHIR(svc.serviceEndpoint)
            return content
          } catch (err) {
            console.error(`❌ Failed to decrypt resource from ${svc.serviceEndpoint}:`, err)
            return null
          }
        })
      ).then(results => results.filter(Boolean))

      setAllResources(prev => [...prev, ...decryptedResources])
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`)
      throw err
    }
  }

  useEffect(() => {
    if (address && litClient) loadDIDData()
  }, [address, litClient])

  const handleSubmitResources = async (resources: any[]) => {
    try {
      if (!address || !didDoc || !chainName) return

      for (const resource of resources) {
        await createAndStoreAltFHIR(resource)
      }
    } catch (err: any) {
      console.error(err)
      setStatus(err.message || '❌ Upload failed')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">➕ Manage Alternate FHIR Resources</h1>

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
