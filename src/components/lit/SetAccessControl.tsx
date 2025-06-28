import { useState, useEffect } from 'react'
import { searchDAOApprovedMembers} from '../../lib/DAOApporovedMembers'
import { resolveDidHealthByDidNameAcrossChains } from '../../lib/DIDDocument'

interface SetAccessControlProps {
  onSetAccessConditions: (conditions: any[]) => void
  connectedWallet: string
}

export function SetAccessControl({ onSetAccessConditions, connectedWallet }: SetAccessControlProps) {
  const [shareAddress, setShareAddress] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSelfOnly() {
    onSetAccessConditions([
      {
        conditionType: 'evmBasic',
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: '',
        parameters: [],
        returnValueTest: {
          comparator: '=',
          value: connectedWallet,
        },
      },
    ])
  }

  async function handleShareWithOther() {
    if (!shareAddress) return
    onSetAccessConditions([
      {
        conditionType: 'evmBasic',
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: '',
        parameters: [],
        returnValueTest: {
          comparator: '=',
          value: shareAddress,
        },
      },
    ])
  }

  async function handleResolveAndShare(did: string) {
    setLoading(true)
    try {
      const doc = await resolveDidHealthByDidNameAcrossChains(did)
      const controller = doc?.doc?.controller ?? null
      setLoading(false)

      if (controller) {
        setShareAddress(controller)
        await handleShareWithOther()
      } else {
        alert('Could not resolve wallet address for this DID.')
      }
    } catch (error) {
      console.error('Error resolving DID:', error)
      setLoading(false)
      alert('Error resolving DID. Please try again.')
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        const results = await searchDAOApprovedMembers(searchTerm)
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 5. Set Access Control</h2>
      <p className="mb-4">Choose how this record should be encrypted.</p>

      <div className="space-y-4">
        <button className="btn btn-outline btn-accent w-full" onClick={handleSelfOnly}>
          🔒 Only I can decrypt
        </button>

        <div className="w-full space-y-2">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Enter wallet address"
            value={shareAddress}
            onChange={(e) => setShareAddress(e.target.value)}
          />
          <button className="btn btn-primary w-full" onClick={handleShareWithOther}>
            🤝 Share with wallet address
          </button>
        </div>

        <div className="pt-4">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Search for healthcare provider (name or org)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="menu bg-base-100 w-full rounded-box mt-2">
              {searchResults.map((r) => (
                <li key={r.did}>
                  <button
                    disabled={loading}
                    onClick={() => handleResolveAndShare(r.did)}
                  >
                    {r.name} ({r.resourceType}) — {r.did}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
