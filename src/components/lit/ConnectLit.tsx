import { useEffect } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LIT_NETWORK } from '@lit-protocol/constants'
import { useChainId } from 'wagmi'
import { chainIdToLitChain } from '../../lib/getChains'

export function ConnectLit() {
  const { litConnected, setLitConnected, setLitClient } = useOnboardingState()

  useEffect(() => {
    async function connectLit() {
      try {
        const lit = new LitNodeClient({
          litNetwork: LIT_NETWORK.DatilTest,
          debug: true
        })

        await lit.connect()
        setLitConnected(true)
        setLitClient(lit)
      } catch (err) {
        console.error('Lit connection failed:', err)
        setLitConnected(false)
        setLitClient(null)
      }
    }

    connectLit()
  }, [])

  return (
    <div>
      {litConnected ? (
        <p>✅ Connected to Lit</p>
      ) : (
        <p>Connecting to Lit...</p>
      )}
    </div>
  )

  return (
    <div>
       {litConnected ? <p>✅ Connected to Lit</p> : <p>Connecting...</p>}
    </div>
  )
}
