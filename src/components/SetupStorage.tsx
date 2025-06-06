import { useEffect, useState } from 'react'
import { useOnboardingState } from './../store/OnboardingState'
import { create } from '@web3-storage/w3up-client'

export function SetupStorage() {
  const {
    email,
    web3SpaceDid,
    setEmail,
    setWeb3SpaceDid,
    setStorageReady,
  } = useOnboardingState()

  const [status, setStatus] = useState('')

  useEffect(() => {
    if (email && web3SpaceDid) {
      setStatus(`✅ Web3.Storage already set up (DID: ${web3SpaceDid})`)
      setStorageReady(true)
    }
  }, [email, web3SpaceDid])

  async function setupStorage() {
    try {
      if (!email || !email.includes('@')) {
        setStatus('❌ Please enter a valid email address')
        return
      }

      const client = await create()
      const account = await client.login(email as `${string}@${string}`)

      setStatus('📧 Verification email sent. Please check your inbox...')

      await account?.plan.wait()

      const space = await client.createSpace('did-health-user-space', { account })
      await client.setCurrentSpace(space.did())

      setWeb3SpaceDid(space.did()) // 💾 Save to Zustand
      setStatus(`✅ Web3.Storage space is ready (DID: ${space.did()})`)
      setStorageReady(true)
    } catch (err) {
      console.error(err)
      setStatus('❌ Error setting up Web3.Storage space')
      setStorageReady(false)
    }
  }

  return (
    <div>
      <input
        type="email"
        className="input input-bordered w-full bg-white text-black"
        placeholder="Enter your email address"
        value={email ?? ''}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!!web3SpaceDid}
      />
      {!web3SpaceDid && (
        <button className="btn btn-primary mt-2" onClick={setupStorage}>
          Verify and Setup
        </button>
      )}
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  )
}
