import React, { useState } from 'react'
import { useOnboardingState } from '../store/OnboardingState'

export function RegisterDIDBTC() {
  const {
    did,
    ipfsUri,
    setDID,
  } = useOnboardingState()

  const [txid, setTxid] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!txid || txid.trim().length < 10) {
      alert('❌ Please enter a valid Bitcoin transaction ID.')
      return
    }
    localStorage.setItem(`btc-txid-${did}`, txid.trim())
    setSubmitted(true)
  }

  if (!did || !ipfsUri) {
    return <p className="text-yellow-600">⚠️ DID and IPFS URI are required. Go back and complete prior steps.</p>
  }

  return (
    <div>
      <p className="mb-2">Your DID Document has been uploaded to:</p>
      <p className="mb-4"><code className="text-sm break-words">{ipfsUri}</code></p>

      <p className="mb-4">✅ Now inscribe this IPFS URI using <strong>Ordinals</strong> on the <strong>Bitcoin Testnet</strong>.</p>
      <p className="mb-4">After the inscription is confirmed, enter the transaction ID (txid) below:</p>

      <input
        className="input mb-4"
        placeholder="Enter Ordinals txid"
        value={txid}
        onChange={(e) => setTxid(e.target.value)}
      />

      {!submitted ? (
        <button className="btn-primary" onClick={handleSubmit}>
          📬 Submit txid
        </button>
      ) : (
        <p className="text-green-600">✅ txid stored! You can now resolve your DID.</p>
      )}
    </div>
  )
}

export default RegisterDIDBTC