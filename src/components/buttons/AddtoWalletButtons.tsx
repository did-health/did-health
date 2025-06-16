import React, { useState } from 'react'

export function AddToWalletButtons({ qrValue }: { qrValue: string }) {
  const [loading, setLoading] = useState(false)
  const [applePassUrl, setApplePassUrl] = useState<string | null>(null)
  const [googlePassUrl, setGooglePassUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createPasses = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://<YOUR_CLOUD_RUN_URL>/create-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrValue }),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)

      const { applePassUrl, googlePassUrl } = await res.json()
      setApplePassUrl(applePassUrl)
      setGooglePassUrl(googlePassUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border p-4 bg-white shadow dark:bg-gray-900">
      <p className="text-gray-800 dark:text-gray-200 mb-4">
        Add your ticket to Apple or Google Wallet
      </p>
      {!applePassUrl && !googlePassUrl && (
        <button
          onClick={createPasses}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Generating...' : 'Create Wallet Passes'}
        </button>
      )}
      {applePassUrl && (
        <a href={applePassUrl} download className="inline-block mt-4">
          <img
            src="/apple-wallet-button.svg"
            alt="Add to Apple Wallet"
            style={{ height: 40 }}
          />
        </a>
      )}
      {googlePassUrl && (
        <a href={googlePassUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 ml-4">
          <img
            src="https://developers.google.com/wallet/images/SaveToGoogleWallet-button.svg"
            alt="Save to Google Wallet"
            style={{ height: 40 }}
          />
        </a>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
