import { useState } from 'react'
import { useOnboardingState } from './../store/OnboardingState'
import { create } from '@web3-storage/w3up-client'

export function SetupStorage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const { setStorageReady } = useOnboardingState()

  async function setupStorage() {
    try {
      if (!email.includes('@')) {
        setStatus('❌ Please enter a valid email address')
        return
      }

      const client = await create()
      const account = await client.login(email as `${string}@${string}`)

      setStatus('📧 Verification email sent. Please check your inbox.')

      await account?.plan.wait()
      const space = await client.createSpace('did-health-user-space', { account })
      await client.setCurrentSpace(space.did())

      setStatus('✅ Web3.Storage space is ready')
      setStorageReady(true)
    } catch (err) {
      console.error(err)
      setStatus('❌ Error setting up Web3.Storage space')
      setStorageReady(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">3. Setup Web3.Storage</h2>
      <input
        type="email"
        className="input"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn mt-2" onClick={setupStorage}>
        Verify and Setup
      </button>
      {status && <p className="mt-1 text-sm">{status}</p>}
    </div>
  )
}
