import React, { useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'

export default function RegisterDIDBTC() {
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

  const [status, setStatus] = useState('')
  const [didUri, setDidUri] = useState<string | null>(null)
  const [txid, setTxid] = useState<string>('')

  const feeAddress = 'bc1qrvjycdcvhmaxkvwrtwypcpg9ycfwcce0hg2du7'
  const feeAmountSats = 118000
  const estimatedUsd = '$10.00'

  const handleRegister = async () => {
    try {
      if (!fhirResource) {
        throw new Error('No FHIR resource selected')
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
          throw new Error('LitNodeClient is not initialized');
        }
        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: 'bitcoin',
          accessControlConditions,
        })
        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        fhirUri = await storeEncryptedFileByHash(encryptedBlob, hash, resourceType)
      }

      // Generate DID from wallet address
      const did = `did:health:btc:${walletAddress}`;
      
      // Create DID document
      const didDoc = {
        id: did,
        controller: walletAddress,
        service: [
          {
            id: `${did}#fhir`,
            type: 'FHIRResource',
            serviceEndpoint: fhirUri,
          },
        ],
        verificationMethod: [
          {
            id: `${did}#controller`,
            type: 'BitcoinAddress2021',
            controller: did,
            bitcoinAddress: walletAddress
          }
        ]
      }

      // Upload DID document to IPFS
      setStatus('📝 Uploading DID Document to IPFS...')
      const didDocUri = await storePlainFHIRFile(didDoc, `${fhirResource?.id || crypto.randomUUID()}-didDocument`, 'didDocument')
      setDidUri(didDocUri)
      setDID(did)

      // Create inscription payload with full JSON structure
      const inscriptionPayload = {
        did: did,
        ipfsUri: `ipfs://${didDocUri.split('://')[1]}`,
        metadata: {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          chain: 'bitcoin',
          network: 'mainnet',
          type: 'did-registration',
          walletAddress: walletAddress
        }
      }

      setStatus('✅ DID Document uploaded. Please inscribe it on Bitcoin using Ordinals.')
      return inscriptionPayload
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Error: ${err.message}`)
      return null
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {status && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Registration Status</h1>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{status}</p>
              {didUri && (
                <div className="border border-green-300 bg-green-50 p-4 rounded text-sm">
                  <p className="font-medium text-green-800">✅ Your DID Document is live at:</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="block break-all text-xs">{didUri}</code>
                    <button
                      onClick={() => {
                        const didData = {
                          did: did,
                          ipfsUri: didUri
                        }
                        navigator.clipboard.writeText(JSON.stringify(didData, null, 2))
                      }}
                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                      title="Copy DID and IPFS URI as JSON"
                    >
                      📋 Copy JSON
                    </button>
                  </div>
                  <p className="mt-2 text-green-700">
                    Please inscribe this <code>ipfs://</code> URI on Bitcoin via:
                    <div className="flex gap-2 mt-2">
                      <a 
                        className="text-blue-700 underline hover:text-blue-800"
                        target="_blank" 
                        href={`https://unisat.io/inscribe?tab=text&text=${encodeURIComponent(didUri)}`}
                      >
                        Unisat
                      </a>
                      <a 
                        className="text-blue-700 underline hover:text-blue-800"
                        target="_blank" 
                        href="https://ordinals.com/inscribe"
                      >
                        Ordinals.com
                      </a>
                    </div>
                    <div className="mt-4">
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter txid after inscription"
                        value={txid}
                        onChange={(e) => setTxid(e.target.value)}
                      />
                      <button
                        className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          if (did && txid.trim().length > 10) {
                            localStorage.setItem(`btc-txid-${did}`, txid.trim())
                            setStatus('✅ txid saved locally.')
                          } else {
                            setStatus('❌ Invalid txid or DID.')
                          }
                        }}
                      >
                        📬 Save txid
                      </button>
                    </div>

                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold">🪙 Register Your <code>did:health:btc</code></h1>



      <div className="border border-yellow-300 bg-yellow-50 p-4 rounded space-y-2">
        <p className="font-semibold text-yellow-800">💸 One-Time Registration Fee</p>
        <p className="text-sm text-yellow-700">
          Please send <strong>{feeAmountSats.toLocaleString()} sats</strong> (~{estimatedUsd}) to the address below before proceeding:
        </p>
        <code className="block p-2 text-xs bg-white border border-yellow-200 rounded break-all">
          {feeAddress}
        </code>
        <p className="text-xs text-yellow-600">
          This fee supports decentralized health identity infrastructure. You may continue registration after sending the payment.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRegister}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!fhirResource || !walletAddress}
        >
          Register DID:health:btc
        </button>
      </div>

      {didUri && (
        <div className="mt-6 border border-green-300 bg-green-50 p-4 rounded text-sm">
          <p className="font-medium text-green-800">✅ Your DID Document is live at:</p>
          <div className="flex items-center gap-2 mt-2">
            <code className="block break-all text-xs">{didUri}</code>
            <button
              onClick={() => navigator.clipboard.writeText(didUri)}
              className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
              title="Copy URL"
            >
              📋 Copy
            </button>
          </div>
          <p className="mt-2 text-green-700">
            Please inscribe this <code>ipfs://</code> URI on Bitcoin via <a className="text-blue-700 underline" target="_blank" href={`https://unisat.io/inscribe?tab=text&text=${encodeURIComponent(didUri)}`}>Unisat</a> or your preferred Ordinals wallet.
          </p>
        </div>
      )}
    </div>
  )
}
