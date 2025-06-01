import { useEffect } from 'react'
import { useOnboardingState } from './../store/OnboardingState'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LIT_NETWORK } from '@lit-protocol/constants'

export function ConnectLit() {
  const { litConnected, setLitConnected } = useOnboardingState()

  useEffect(() => {
    async function connectLit() {
      const lit = new LitNodeClient({
        litNetwork: LIT_NETWORK.DatilTest, // You can change this to 'Cayenne', 'Manzano', etc.
      })

      try {
        await lit.connect()
        setLitConnected(true)
      } catch (err) {
        console.error('Lit connection failed:', err)
      }
    }

    connectLit()
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold">2. Connect to Lit Protocol</h2>
      {litConnected ? <p>✅ Connected</p> : <p>Connecting...</p>}
    </div>
  )
}
