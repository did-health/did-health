import { useState, useEffect } from 'react'
import { Client } from '@web3-storage/w3up-client'

type Props = {
  agent?: Client // Pass the initialized agent (optional)
  onSpaceReset?: (newDid: string) => void
  className?: string
  email?: string // Email for client login
}

// Helper type for DID strings
type DIDString = `did:${string}:${string}`

export function ResetWeb3SpaceButton({ agent, onSpaceReset, className, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [newSpaceDid, setNewSpaceDid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if the agent is initialized
  useEffect(() => {
    if (agent) {
      setIsInitialized(true)
    } else {
      setIsInitialized(false)
    }
  }, [agent])

  const handleResetSpace = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Ensure we have a valid agent
      if (!agent) {
        throw new Error('Web3.Storage client is not initialized');
      }

      // First, ensure we're logged in
      if (!email || !email.includes('@')) {
        throw new Error('Valid email is required for Web3.Storage login');
      }
      console.log('Logging in with email:', email)
      const account = await agent.login(email as `${string}@${string}`)
      console.log('Account logged in:', account)
      await account?.plan.wait()
      console.log('Account plan:', account?.plan)
      // First, get the current space
      const currentSpace = await agent.currentSpace()
      
      // Create a new space with a unique name
      const name = `reset-${Date.now()}`
      console.log('Creating new space with name:', name)
      // Create and set the new space in one operation
      const space = await agent.createSpace(name)
      console.log('New space created:', space)
      await agent.setCurrentSpace(space.did())
      console.log('New space set as current space' + space.did())
      // Update the UI with the new space
      setNewSpaceDid(space.did())
      onSpaceReset?.(space.did())

      // If we had a current space, wait a bit and then clean it up
      if (currentSpace) {
        setTimeout(async () => {
          try {
            // Create a cleanup space
            const cleanupSpace = await agent.createSpace('cleanup')
            await agent.setCurrentSpace(cleanupSpace.did())
          } catch (cleanupErr) {
            console.error('Error during cleanup:', cleanupErr)
          }
        }, 1000)
      }
    } catch (err: any) {
      console.error('Error resetting Web3 space:', err)
      setError(err.message || 'Failed to reset Web3 space.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <button
        className={`btn btn-primary w-full mt-2 rounded-md py-2 text-white font-semibold transition
          ${loading || !isInitialized ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
          ${className || ''}
        `}
        onClick={handleResetSpace}
        disabled={loading || !isInitialized}
        aria-busy={loading}
      >
        {loading
        ? 'Resetting...'
        : !isInitialized
          ? 'Storage Not Initialized'
          : 'Reset Web3 Space'}
      </button>

      {newSpaceDid && (
        <p className="text-sm text-green-700">
          New space created: <code>{newSpaceDid}</code>
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
