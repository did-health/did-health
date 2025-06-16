import React, { useState } from 'react'
import { useOnboardingState } from '../store/OnboardingState'

export function RegisterDIDSolana() {
  const {
    did,
    ipfsUri,
    setDID,
  } = useOnboardingState()

  const [txSig, setTxSig] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!txSig || txSig.trim().length < 10) {
      alert('❌ Please enter a valid Solana transaction signature.')
      return
    }
    localStorage.setItem(`solana-tx-${did}`, txSig.trim())
    setSubmitted(true)
  }

  if (!did || !ipfsUri) {
    return <p className="text-yellow-600">⚠️ DID and IPFS URI are required. Go back and complete prior steps.</p>
  }

  return (
    <div>
      <p className="mb-2">Your DID Document has been uploaded to:</p>
      <p className="mb-4"><code className="text-sm break-words">{ipfsUri}</code></p>

      <p className="mb-4">✅ Now create a transaction on Solana mainnet/testnet that stores or anchors this IPFS URI (e.g., in a memo or PDA).</p>
      <p className="mb-4">Once the transaction is confirmed, enter the transaction signature below:</p>

      <input
        className="input mb-4"
        placeholder="Enter Solana transaction signature"
        value={txSig}
        onChange={(e) => setTxSig(e.target.value)}
      />

      {!submitted ? (
        <button className="btn-primary" onClick={handleSubmit}>
          📬 Submit Transaction Signature
        </button>
      ) : (
        <p className="text-green-600">✅ Signature stored! You can now resolve your DID.</p>
      )}
    </div>
  )
}

export default RegisterDIDSolana
