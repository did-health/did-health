import { useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useOnboardingState } from '../store/OnboardingState'

export function ConnectWallet() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { setWalletConnected } = useOnboardingState()

  useEffect(() => {
    if (isConnected) {
      setWalletConnected(true)
    }
  }, [isConnected, setWalletConnected])

  return (
    <div>
      <h2 className="text-lg font-semibold">1. Connect Wallet</h2>
      {isConnected ? (
        <button className="btn" onClick={() => disconnect()}>Disconnect</button>
      ) : (
        <button
          className="btn"
          onClick={() => connect({ connector: injected() })}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
