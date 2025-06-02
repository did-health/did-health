import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useOnboardingState } from '../store/OnboardingState'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'

export function ConnectWallet() {
  const { isConnected } = useAccount()
  const { setWalletConnected } = useOnboardingState()
  const { t } = useTranslation()

  useEffect(() => {
    if (isConnected) {
      setWalletConnected(true)
    }
  }, [isConnected, setWalletConnected])

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
       <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>
      <ConnectButton showBalance={false} />
    </div>
  )
}
