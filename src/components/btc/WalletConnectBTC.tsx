import { useEffect, useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { useTranslation } from 'react-i18next'

export function ConnectWalletBTC() {
  const [walletName, setWalletName] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const {
    setWallet,
    setAESKeyFromWallet,
    reset,
    aesKey,
  } = useOnboardingState()

  // Detect wallet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.unisat) {
        setWalletName('UniSat')
        setIsInstalled(true)
      } else if (window.xverse) {
        setWalletName('Xverse')
        setIsInstalled(true)
      } else {
        setWalletName(null)
        setIsInstalled(false)
        setError(t('noSupportedBitcoinWalletsFound'))
      }
    }
  }, [])

  // Connect to UniSat
  const connectUniSat = async () => {
    try {
      if (!window.unisat) throw new Error(t('failedToConnectToUniSat'))

      const accounts = await window.unisat.requestAccounts()
      const address = accounts[0]
      const signer = window.unisat

      setWalletAddress(address)
      setWallet(address, 0) // Bitcoin chain ID = 0
      if (!aesKey) await setAESKeyFromWallet(signer)
    } catch (err) {
      console.error('UniSat connection error:', err)
      setError(t('failedToConnectToUniSat'))
    }
  }

  // Connect to Xverse
  const connectXverse = async () => {
    try {
      const xverse = (window as any).xverse
      if (!xverse) throw new Error('Xverse wallet is not available.')

      const response = await xverse.connect()
      const address = response?.addresses?.bitcoin
      if (!address) throw new Error('No Bitcoin address returned.')

      const signer = {
        signMessage: async (msg: string) => {
          const result = await xverse.request('signMessage', { payload: msg })
          return result?.signature || ''
        },
      }

      setWalletAddress(address)
      setWallet(address, 0)
      if (!aesKey) await setAESKeyFromWallet(signer)
    } catch (err) {
      console.error('Xverse connection error:', err)
      setError(t('failedToConnectToXverse'))
    }
  }

  const connectWallet = () => {
    setError(null)
    if (walletName === 'UniSat') return connectUniSat()
    if (walletName === 'Xverse') return connectXverse()
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    reset() // clears AES key and other wallet state
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">{t('connectBitcoinWallet')}</h2>

      {isInstalled && walletName ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('detectedWallet')} <strong>{walletName}</strong>
          </p>
          <button
            onClick={connectWallet}
            className="btn btn-primary"
          >
           {t('connect')} {walletName}
          </button>
        </>
      ) : (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {walletAddress && (
        <div className="mt-4 space-y-2">
          <p className="text-green-600 text-sm">✅ Connected: {walletAddress}</p>
          <button
            onClick={disconnectWallet}
            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
          >
            {t('disconnect')}
          </button>
        </div>
      )}
    </div>
  )
}
