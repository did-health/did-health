import React, { useState } from 'react'
import { ethers, JsonRpcProvider } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
import { getRpcUrl } from '../lib/getChains'
import { resolveDidHealthBtc } from '../lib/resolveDidHealthBtc'
import didLogo from '../assets/did-health.png'
import FHIRResource from '../components/fhir/FHIRResourceView'

interface DIDDocument {
  owner: string
  healthDid: string
  ipfsUri: string
  altIpfsUris: string[]
  hasWorldId: boolean
  hasPolygonId: boolean
  hasSocialId: boolean
  reputationScore: number
}

export function parseDidHealth(did: string): { chainId: number; lookupKey: string } {
  const parts = did.trim().split(':')
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health') {
    throw new Error('❌ Invalid DID format. Use: did:health:<chainId>:<name> or did:health:btc:<wallet>')
  }
  
  if (parts[2] === 'btc') {
    // Validate BTC wallet address format
    const wallet = parts[3]
    if (!wallet) {
      throw new Error('❌ Invalid BTC wallet address')
    }
    // Basic BTC address format validation
    if (!/^([13bc][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(wallet)) {
      throw new Error('❌ Invalid BTC wallet address format')
    }
    return {
      chainId: 0, // Special case for BTC
      lookupKey: wallet
    }
  }
  
  const chainId = parseInt(parts[2], 10)
  if (isNaN(chainId)) throw new Error(`❌ Invalid chain ID: ${parts[2]}`)
  return {
    chainId,
    lookupKey: `${chainId}:${parts[3]}`,
  }
}

export default function DIDResolver() {
  const [input, setInput] = useState('')
  const [autoResolved, setAutoResolved] = useState(false)
  const [initialDid, setInitialDid] = useState<string | null>(null)

  // Check for query string parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const didParam = urlParams.get('q')
    if (didParam) {
      setInitialDid(didParam)
      setInput(didParam)
      setAutoResolved(true)
    }
  }, [])

  // Resolve DID when input changes and we have an initial DID
  React.useEffect(() => {
    if (initialDid && input === initialDid) {
      resolveDID()
    }
  }, [input, initialDid])
  const [result, setResult] = useState<DIDDocument | null>(null)
  const [fetchedFHIR, setFetchedFHIR] = useState<{ uri: string; resource: any; error?: string }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function resolveDID() {
    setLoading(true)
    setError('')
    setResult(null)
    setFetchedFHIR([])

    try {
      const { chainId, lookupKey } = parseDidHealth(input)
      
      if (chainId === 0) { // BTC case
        const btcDoc = await resolveDidHealthBtc(input)
        const doc: DIDDocument = {
          owner: '', // BTC doesn't have an owner address
          healthDid: input,
          ipfsUri: btcDoc.ipfsUri,
          altIpfsUris: [],
          hasWorldId: false,
          hasPolygonId: false,
          hasSocialId: false,
          reputationScore: 0,
        }
        setResult(doc)
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

      if (!data || data.owner === ethers.ZeroAddress) {
        throw new Error(`❌ DID "${lookupKey}" not found on chain ${chainId}`)
      }

      const doc: DIDDocument = {
        owner: data.owner,
        healthDid: data.healthDid,
        ipfsUri: data.ipfsUri,
        altIpfsUris: data.altIpfsUris ?? [],
        hasWorldId: data.hasWorldId,
        hasPolygonId: data.hasPolygonId,
        hasSocialId: data.hasSocialId,
        reputationScore: Number(data.reputationScore ?? 0),
      }

      setResult(doc)

      const fetchResource = async (uri: string) => {
        try {
          const isEnc = uri.endsWith('.enc') || uri.endsWith('.lit')
          const res = await fetch(uri)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json = await res.json()
          return { uri, resource: isEnc ? null : json }
        } catch (err: any) {
          return { uri, resource: null, error: err.message }
        }
      }

      const resources = await Promise.all([
        fetchResource(doc.ipfsUri),
        ...doc.altIpfsUris.map(fetchResource),
      ])
      setFetchedFHIR(resources)
    } catch (err: any) {
      setError(err.message || '❌ Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      {autoResolved && (
        <div className="text-sm text-gray-600 mb-4">
          Resolved from query parameter: {input}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <img src={didLogo} alt="DID:Health Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold">did:health Resolver</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="did:health:<chainId>:<name> or did:health:btc:<wallet>"
        />
        <button
          onClick={resolveDID}
          disabled={!input || loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Resolving did:health...' : 'Resolve did:health'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>}

      {result && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div><strong>Owner:</strong> {result.owner}</div>
          <div><strong>DID:</strong> {result.healthDid}</div>
          <div><strong>Reputation:</strong> {result.reputationScore}</div>
          <div><strong>World ID:</strong> {result.hasWorldId ? 'Yes' : 'No'}</div>
          <div><strong>Polygon ID:</strong> {result.hasPolygonId ? 'Yes' : 'No'}</div>
          <div><strong>Social ID:</strong> {result.hasSocialId ? 'Yes' : 'No'}</div>

          {fetchedFHIR.map(({ uri, resource, error }, idx) => {
            const label = idx === 0 ? 'Primary Resource' : `Alternate Resource #${idx}`
            const pathParts = uri.split('/')
            const type = pathParts[pathParts.length - 2] || 'Resource'
            return (
              <div key={uri} className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-1">{label} ({type})</h3>
                <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                  {uri}
                </a>
                {error && <p className="text-red-500 text-sm mt-1">❌ {error}</p>}
                {resource && (
                  <div className="mt-2 border border-gray-200 rounded p-2 bg-gray-50">
                    <FHIRResource resource={resource} />
                    <pre className="text-xs mt-2 overflow-x-auto">
                      <code>{JSON.stringify(resource, null, 2)}</code>
                    </pre>
                  </div>
                )}
                {!resource && !error && (
                  <p className="text-yellow-600 text-sm mt-1">🔐 Encrypted or unsupported format</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
