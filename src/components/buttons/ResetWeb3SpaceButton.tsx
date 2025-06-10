import { useState } from 'react'
import { Client } from '@web3-storage/w3up-client'

type Props = {
  agent: Client // Pass the initialized agent
  onSpaceReset?: (newDid: string) => void
}

export function ResetWeb3SpaceButton({ agent, onSpaceReset }: Props) {
  const [loading, setLoading] = useState(false)
  const [newSpaceDid, setNewSpaceDid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResetSpace = async () => {
    try {
      setLoading(true)
      setError(null)
      const name = `space-${Date.now()}`
      const space = await agent.createSpace(name)
      await agent.setCurrentSpace(space.did())

      setNewSpaceDid(space.did())
      onSpaceReset?.(space.did())
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to reset Web3 space.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button className="btn btn-warning" onClick={handleResetSpace} disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Web3 Space'}
      </button>

      {newSpaceDid && (
        <p className="text-sm text-green-700">
          ✅ New space created: <code>{newSpaceDid}</code>
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          ❌ {error}
        </p>
      )}
    </div>
  )
}
