import React, { useEffect, useState } from 'react'
import { ethers, JsonRpcProvider } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
import { getRpcUrl } from '../lib/getChains'
import { resolveDidHealthBtc } from '../lib/resolveDidHealthBtc'
import { getLitDecryptedFHIR } from '../lib/litSessionSigs'
import FHIRResource from '../components/fhir/FHIRResourceView'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import didLogo from '../assets/did-health.png'

interface DIDDocument {
  id: string
  controller: string
  service?: Array<{
    id: string
    type?: string
    serviceEndpoint: string
  }>
}

export function parseDidHealth(did: string): { chainId: number; lookupKey: string } {
  const parts = did.trim().split(':')
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health') {
    throw new Error('❌ Invalid DID format. Use: did:health:<chainId>:<name> or did:health:btc:<wallet>')
  }

  if (parts[2] === 'btc') return { chainId: 0, lookupKey: parts[3] }
  const chainId = parseInt(parts[2], 10)
  if (isNaN(chainId)) throw new Error(`❌ Invalid chain ID: ${parts[2]}`)
  return { chainId, lookupKey: `${chainId}:${parts[3]}` }
}

export default function DIDResolver() {
  const [input, setInput] = useState('')
  const [didDoc, setDidDoc] = useState<DIDDocument | null>(null)
  const [owner, setOwner] = useState('')
  const [fhirResources, setFhirResources] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const didParam = urlParams.get('q')
    if (didParam) {
      setInput(didParam)
      resolveDID(didParam)
    }
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input && input.startsWith('did:health:')) {
        resolveDID(input)
      }
    }, 600)
    return () => clearTimeout(delayDebounce)
  }, [input])

  async function resolveDID(did: string) {
    setLoading(true)
    setError('')
    setDidDoc(null)
    setOwner('')
    setFhirResources([])

    try {
      const { chainId, lookupKey } = parseDidHealth(did)

      if (chainId === 0) {
        const btcDoc = await resolveDidHealthBtc(did)
        if (!btcDoc?.ipfsUri) throw new Error('❌ BTC DID has no IPFS URI')

        const url = btcDoc.ipfsUri.replace('ipfs://', 'https://w3s.link/ipfs/')
        const res = await fetch(url)
        if (!res.ok) throw new Error(`❌ Failed to fetch DID Document`)
        const doc: DIDDocument = await res.json()

        setDidDoc(doc)
        setOwner('') // BTC doesn't track owner
        await fetchServiceFHIR(doc.service || [], 'bitcoin')
        return
      }

      const env = 'testnet'
      const registryEntry = Object.values(deployedContracts[env]).find(
        (net: any) => net.HealthDIDRegistry?.chainId === chainId
      )?.HealthDIDRegistry

      if (!registryEntry) throw new Error(`❌ No HealthDIDRegistry deployed for chain ${chainId}`)

      const rpcUrl = getRpcUrl(chainId)
      if (!rpcUrl) throw new Error(`❌ No RPC URL configured for chain ${chainId}`)

      const provider = new JsonRpcProvider(rpcUrl)
      const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider)
      const data = await contract.getHealthDID(lookupKey)

      if (!data || data.owner === ethers.ZeroAddress) throw new Error(`❌ DID not found on chain ${chainId}`)

      setOwner(data.owner)

      const ipfsUrl = data.ipfsUri.replace('ipfs://', 'https://w3s.link/ipfs/')
      const res = await fetch(ipfsUrl)
      if (!res.ok) throw new Error('❌ Failed to fetch DID Document from IPFS')

      const doc: DIDDocument = await res.json()
      setDidDoc(doc)
      await fetchServiceFHIR(doc.service || [], 'ethereum')
    } catch (err: any) {
      console.error(err)
      setError(err.message || '❌ Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchServiceFHIR(services: DIDDocument['service'], chain: string) {
    const results: any[] = []
    for (const s of services) {
      try {
        const url = s.serviceEndpoint.replace('ipfs://', 'https://w3s.link/ipfs/')
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const final = json?.accessControlConditions
          ? await getLitDecryptedFHIR(json, null, { chain })
          : json
        results.push(final)
      } catch (e) {
        console.warn(`Error fetching service endpoint:`, e)
      }
    }
    setFhirResources(results.filter(r => !!r))
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-center">
        <img src={didLogo} alt="DID:Health Logo" className="w-14 h-14" />
      </div>
      <h1 className="text-center text-3xl font-bold text-gray-800">did:health Resolver</h1>

      <div className="relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter a did:health..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div className="text-gray-500">Resolving...</div>}

      {didDoc && (
        <div className="bg-white shadow rounded p-4 space-y-2">
          <div><strong>DID:</strong> {didDoc.id}</div>
          <div><strong>Owner:</strong> {owner || '(BTC or unassigned)'}</div>
          <div><strong>Controller:</strong> {didDoc.controller}</div>
          <div><strong>Service Count:</strong> {didDoc.service?.length || 0}</div>
        </div>
      )}

      {fhirResources.length > 0 && (
        <div className="space-y-6">
          {fhirResources.map((res, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded shadow">
              <FHIRResource resource={res} />
              <pre className="text-xs mt-2 overflow-x-auto">
                {JSON.stringify(res, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
