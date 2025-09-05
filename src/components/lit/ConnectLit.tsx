import { useEffect, useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LIT_NETWORK } from '@lit-protocol/constants'
import { useChainId } from 'wagmi'
import { chainIdToLitChain } from '../../lib/getChains'
import { useTranslation } from 'react-i18next'

export function ConnectLit() {
  const { litConnected, setLitConnected, setLitClient } = useOnboardingState()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    async function connectLit() {
      try {
        const lit = new LitNodeClient({
          litNetwork: LIT_NETWORK.DatilTest,
          debug: false
        })

        await lit.connect()
        setLitConnected(true)
        setLitClient(lit)
      } catch (err) {
        console.error('Lit connection failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect to Lit')
        setLitConnected(false)
        //setLitClient(null)
      }
    }

    connectLit()
  }, [])

  return (
   <div></div>
  )
}
