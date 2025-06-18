import { useEffect } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LIT_NETWORK } from '@lit-protocol/constants'

export function ConnectLit() {
  const { litConnected, setLitConnected, setLitClient } = useOnboardingState()

  useEffect(() => {
    async function connectLit() {
      const lit = new LitNodeClient({
        litNetwork: LIT_NETWORK.DatilTest,
      })

      try {
        await lit.connect()
        setLitConnected(true)
        setLitClient(lit)
      } catch (err) {
        console.error('Lit connection failed:', err)
      }
    }

    connectLit()
  }, [])

  return (
    <div>
       {litConnected ? <p>✅ Connected to Lit</p> : <p>Connecting...</p>}
    </div>
  )
}
