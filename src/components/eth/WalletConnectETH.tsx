import { useEffect, useMemo } from 'react'
import { useAccount, useChainId, useDisconnect, useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'
import { useOnboardingState } from '../../store/OnboardingState'
import { ethers } from 'ethers'

/**
 * Deep-link helper for MetaMask Mobile.
 * iOS mobile browsers do NOT expose window.ethereum,
 * so we give users a one-click fallback that opens the dapp
 * directly inside MetaMask Mobile.
 */
function useMetaMaskDeepLink() {
  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), [])
  const openInMetaMask = () => {
    const dappUrl = window.location.href.replace(/^https?:\/\//, '')
    console.log('Opening in MetaMask:', dappUrl)
    window.location.href = `https://metamask.app.link/dapp/${encodeURIComponent(dappUrl)}`
  }
  return { isIOS, openInMetaMask }
}

export function ConnectWallet() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { data: signer } = useWalletClient()
  const { t } = useTranslation()

  const {
    setWallet,
    setAESKeyFromWallet,
    reset,
  } = useOnboardingState()

  const { isIOS, openInMetaMask } = useMetaMaskDeepLink()

  // 🔐 Setup AES key + onboarding state
  useEffect(() => {
    const setupEncryption = async () => {
      if (isConnected && address && signer) {
        setWallet(address, chainId)
        try {
          await setAESKeyFromWallet(signer)
        } catch (err) {
          console.error('Failed to derive AES key from wallet signature:', err)
        }
      }
    }
    setupEncryption()
  }, [isConnected, address, signer, chainId, setWallet, setAESKeyFromWallet])

  // 🧼 Wipe AES key and onboarding state on disconnect
  useEffect(() => {
    if (!isConnected) {
      reset()
    }
  }, [isConnected, reset])

  const disconnectWallet = () => {
    disconnect()
    reset() // clears AES key and other wallet state
  }
  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t('onboarding.connectWalletDescription')}
      </p>

      {/* RainbowKit modal trigger */}
      <ConnectButton showBalance={false} />

      {/* iOS fallback — deep-link straight to MetaMask Mobile */}
      {isIOS && (
        <button
          onClick={openInMetaMask}
          className="mt-4 text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
        >
          {t('onboarding.openInMetaMask')}
        </button>
      )}
            {address && (
        <div className="mt-4 space-y-2">
          <p className="text-green-600 text-sm">✅ Connected: {address}</p>
          <button
            onClick={disconnectWallet}
            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
