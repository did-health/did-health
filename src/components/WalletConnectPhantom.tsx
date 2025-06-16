import { useEffect, useMemo } from 'react'
import {
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useOnboardingState } from '../store/OnboardingState'
import { useTranslation } from 'react-i18next'

// Default CSS for Wallet Adapter UI
import '@solana/wallet-adapter-react-ui/styles.css'

export function ConnectWalletWrapper({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function ConnectWallet() {
  const { publicKey, connected } = useWallet()
  const { setWalletConnected, setWalletAddress } = useOnboardingState()
  const { t } = useTranslation()

  useEffect(() => {
    if (connected && publicKey) {
      setWalletConnected(true)
      setWalletAddress(publicKey.toBase58())
    }
  }, [connected, publicKey, setWalletConnected, setWalletAddress])

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>
      <WalletMultiButton />
    </div>
  )
}
