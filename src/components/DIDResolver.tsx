import { useState } from 'react'
import { ethers, JsonRpcProvider } from 'ethers'
import deployedContracts from '../generated/deployedContracts'
import didLogo from '../assets/did-health.png'

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

function parseDidHealth(did: string): { chainId: number; lookupKey: string } {
  const parts = did.trim().split(':')
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health') {
    throw new Error('❌ Invalid DID format. Use: did:health:<chainId>:<name>')
  }

  const chainId = parseInt(parts[2], 10)
  if (isNaN(chainId)) throw new Error(`❌ Invalid chain ID: ${parts[2]}`)
  const name = parts[3]

  return {
    chainId,
    lookupKey: `${chainId}:${name}`,
  }
}

export default function DIDResolver() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<DIDDocument | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function resolveDID() {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const { chainId, lookupKey } = parseDidHealth(input)

      const env = 'testnet' // or 'mainnet'
      const registryEntry = Object.values(deployedContracts[env]).find(
        (net: any) => net.HealthDIDRegistry?.chainId === chainId
      )?.HealthDIDRegistry

      if (!registryEntry) {
        throw new Error(`❌ No HealthDIDRegistry deployed for chain ${chainId}`)
      }

      const provider = new JsonRpcProvider(registryEntry.rpcUrl)
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
    } catch (err: any) {
      console.error(err)
      setError(err.message || '❌ Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <img src={didLogo} alt="DID:Health Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold">DID:Health Resolver</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="did:health:<chainId>:<name>"
        />
        <button
          onClick={resolveDID}
          disabled={!input || loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Resolving...' : 'Resolve DID'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>
      )}

      {result && (
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <div><strong>Owner:</strong> {result.owner}</div>
          <div><strong>DID:</strong> {result.healthDid}</div>
          <div><strong>IPFS URI:</strong> {result.ipfsUri}</div>
          <div><strong>Reputation:</strong> {result.reputationScore}</div>
          <div><strong>World ID:</strong> {result.hasWorldId ? 'Yes' : 'No'}</div>
          <div><strong>Polygon ID:</strong> {result.hasPolygonId ? 'Yes' : 'No'}</div>
          <div><strong>Social ID:</strong> {result.hasSocialId ? 'Yes' : 'No'}</div>
          {result.altIpfsUris.length > 0 && (
            <div>
              <strong>Alt URIs:</strong>
              <ul className="list-disc list-inside">
                {result.altIpfsUris.map((uri, i) => (
                  <li key={i}>{uri}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
