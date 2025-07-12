import React, { useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, SystemProgram, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'

export function RegisterDIDSolana() {
  const {
    walletAddress,
    litClient,
    encryptionSkipped,
    accessControlConditions,
    fhirResource,
    setFHIRResource,
    did,
    setDID,
  } = useOnboardingState()

  const { connection } = useConnection()
  const { publicKey: solanaPubKey, sendTransaction } = useWallet()

  const [status, setStatus] = useState('')
  const [didUri, setDidUri] = useState<string | null>(null)
  const [txSig, setTxSig] = useState<string>('')

  const handleRegister = async () => {
    try {
      if (!fhirResource || !solanaPubKey) {
        throw new Error('Missing FHIR resource or wallet not connected')
      }

      setStatus('📦 Preparing FHIR resource...')
      setFHIRResource(fhirResource)

      const resourceType = fhirResource.resourceType
      let fhirUri: string

      if (encryptionSkipped || ['Organization', 'Practitioner'].includes(resourceType)) {
        fhirUri = await storePlainFHIRFile(fhirResource, fhirResource.id || crypto.randomUUID(), resourceType)
      } else {
        const blob = new Blob([JSON.stringify(fhirResource)], { type: 'application/json' })
        if (!litClient) {
          throw new Error('LitNodeClient not initialized')
        }
        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: 'solana',
          accessControlConditions,
        })
        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        fhirUri = await storeEncryptedFileByHash(encryptedBlob, hash, resourceType)
      }

      const newDid = `did:health:solana:${solanaPubKey.toBase58()}`

      const didDoc = {
        id: newDid,
        controller: solanaPubKey.toBase58(),
        service: [
          {
            id: `${newDid}#fhir`,
            type: resourceType,
            serviceEndpoint: fhirUri,
          },
        ],
        verificationMethod: [
          {
            id: `${newDid}#controller`,
            type: 'SolanaVerificationKey2021',
            controller: newDid,
            publicKeyBase58: solanaPubKey.toBase58(),
          },
        ],
      }

      setStatus('📝 Uploading DID Document to IPFS...')
      const didDocUri = await storePlainFHIRFile(didDoc, `${fhirResource?.id || crypto.randomUUID()}-didDocument`, 'didDocument')
      const memoData = `ipfs://${didDocUri.split('://')[1]}`

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: solanaPubKey,
          toPubkey: solanaPubKey,
          lamports: 1, // self-transfer for validity
        }),
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'), // Solana Memo Program
          data: Buffer.from(memoData, 'utf-8'),
        })
      )

      setStatus('🚀 Sending transaction to Solana...')
      const sig = await sendTransaction(tx, connection)
      setTxSig(sig)
      setDID(newDid)
      setDidUri(`ipfs://${didDocUri.split('://')[1]}`)
      localStorage.setItem(`solana-tx-${newDid}`, sig)

      setStatus('✅ DID registered on Solana!')
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div className="space-y-4">
      {status && (
        <div className="border border-blue-300 bg-blue-50 p-4 rounded text-sm">
          <p className="text-blue-800">{status}</p>
        </div>
      )}

      {!didUri ? (
        <button
          onClick={handleRegister}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          disabled={!fhirResource || !solanaPubKey}
        >
          📬 Register DID on Solana
        </button>
      ) : (
        <div className="border border-green-300 bg-green-50 p-4 rounded space-y-2 text-sm">
          <p className="text-green-800 font-medium">✅ Your DID Document is live at:</p>
          <code className="block break-all text-xs">{didUri}</code>
          <p>Transaction Signature: <code className="break-all">{txSig}</code></p>
          <button
            className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify({ did: did, ipfsUri: didUri }, null, 2))
            }}
          >
            📋 Copy DID JSON
          </button>
        </div>
      )}
    </div>
  )
}
