import { useEffect, useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { decryptFHIRFile } from '../../lib/litEncryptFile'
import { encryptFHIRFile } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash, storePlainFHIRFile } from '../../lib/storeFIleWeb3'
import { ConnectWalletBTC } from './WalletConnectBTC'
import { ConnectLit } from '../lit/ConnectLit'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import { SetEncryption } from '../lit/SetEncryption'

export default function UpdateDidBTC() {
  const {
    walletAddress,
    litClient,
    litConnected,
    accessControlConditions,
    encryptionSkipped,
    setFHIRResource,
  } = useOnboardingState()

  const [status, setStatus] = useState('')
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [fhir, setFhir] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [didIpfsUri, setDidIpfsUri] = useState<string | null>(null)
  const [txid, setTxid] = useState<string>('')

  const did = walletAddress ? `did:health:btc:${walletAddress}` : null

  useEffect(() => {
    const resolveDid = async () => {
      if (!did || !litConnected || !litClient) return

      setStatus('🔍 Resolving DID from Ordinals...')
      try {
        const res = await fetch(`https://open-api.unisat.io/v1/indexer/address/${walletAddress}/inscriptions`)
        const data = await res.json()
        const inscriptions = data?.data?.list ?? []

        for (const ins of inscriptions) {
          const inscriptionId = ins.inscriptionId
          const contentRes = await fetch(`https://ordinals.com/content/${inscriptionId}`)
          if (!contentRes.ok) continue

          const text = await contentRes.text()
          if (!text.startsWith('ipfs://')) continue

          const cid = text.replace('ipfs://', '')
          const docUrl = `https://w3s.link/ipfs/${cid}`
          const docRes = await fetch(docUrl)
          if (!docRes.ok) continue

          const json = await docRes.json()
          if (json?.id === did) {
            setDidDoc(json)

            const fhirEndpoint = json.service?.find((s: any) => s.type === 'FHIRResource')?.serviceEndpoint

            if (!fhirEndpoint) throw new Error('❌ No FHIR endpoint in DID document.')

            const fhirRes = await fetch(fhirEndpoint.replace('ipfs://', 'https://w3s.link/ipfs/'))
            const fhirJson = await fhirRes.json()

            if (fhirJson?.accessControlConditions) {
              const decrypted = await decryptFHIRFile({ encryptedJson: fhirJson, litClient, sessionSigs: { chain: 'bitcoin' } })
              setFhir(decrypted)
              setStatus('✅ Decrypted FHIR resource loaded')
            } else {
              setFhir(fhirJson)
              setStatus('✅ Plaintext FHIR resource loaded')
            }

            return
          }
        }

        setStatus('❌ DID not found in any inscriptions.')
      } catch (err: any) {
        console.error(err)
        setStatus(`❌ Error: ${err.message}`)
      }
    }

    resolveDid()
  }, [walletAddress, litConnected, litClient])

  const handleUpdate = async (updatedFHIR: any) => {
    try {
      setModalOpen(true)
      setStatus('📄 Preparing update...')

      const resourceType = updatedFHIR?.resourceType
      setFHIRResource(updatedFHIR)

      let fhirUri: string

      if (
        ['Practitioner', 'Organization'].includes(resourceType) ||
        encryptionSkipped
      ) {
        setStatus('📤 Uploading plaintext FHIR...')
        fhirUri = await storePlainFHIRFile(updatedFHIR, updatedFHIR.id || crypto.randomUUID(), resourceType)
      } else {
        setStatus('🔐 Encrypting FHIR...')
        const blob = new Blob([JSON.stringify(updatedFHIR)], { type: 'application/json' })

        if (!litClient) {
          throw new Error('Lit client is not initialized. Please connect to Lit first.');
        }

        const { encryptedJSON, hash } = await encryptFHIRFile({
          file: blob,
          litClient,
          chain: 'bitcoin',
          accessControlConditions,
        })

        const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
        setStatus('📤 Uploading encrypted FHIR...')
        fhirUri = await storeEncryptedFileByHash(encryptedBlob, hash, resourceType)
      }

      // Rebuild DID Document
      const newDidDoc = {
        id: did,
        controller: walletAddress,
        service: [
          {
            id: `${did}#fhir`,
            type: 'FHIRResource',
            serviceEndpoint: fhirUri,
          },
        ],
      }

      setStatus('📁 Uploading updated DID Document to IPFS...')
      const didDocUri = await storePlainFHIRFile(newDidDoc, `${updatedFHIR.id}-didDocument.json`, 'didDocument')
      setDidIpfsUri(didDocUri)
      setStatus(`✅ DID Document uploaded. Re-inscribe it manually at Unisat.`)
    } catch (err: any) {
      console.error(err)
      setStatus(`❌ Failed: ${err.message}`)
    }
  }

  const renderForm = () => {
    if (!fhir || typeof fhir.resourceType !== 'string') return null

    const props = {
      defaultValues: fhir,
      onSubmit: handleUpdate,
    }

    switch (fhir.resourceType) {
      case 'Patient':
        return <CreatePatientForm {...props} />
      case 'Organization':
        return <CreateOrganizationForm {...props} />
      case 'Practitioner':
        return <CreatePractitionerForm {...props} />
      case 'Device':
        return <CreateDeviceForm {...props} />
      default:
        return <p>❌ Unsupported resource type: {fhir.resourceType}</p>
    }
  }

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">✏️ Update Your <code>did:health:btc</code></h1>

      <ConnectWalletBTC />
      <ConnectLit />

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}

      {didDoc?.id && (
        <div className="p-3 bg-gray-50 rounded border border-gray-300 text-sm">
          <p className="font-medium text-gray-700">Resolved DID:</p>
          <code className="block break-words">{didDoc.id}</code>
        </div>
      )}

      {renderForm()}

      {fhir && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">🔐 Edit Access Control</h2>
          <SetEncryption />
        </div>
      )}

      {didIpfsUri && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-700">
            🔁 Re-inscribe this IPFS URI on Bitcoin using Ordinals (e.g. Unisat):
          </p>
          <code className="block break-words bg-gray-100 p-2 rounded text-xs">{didIpfsUri}</code>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={() =>
              window.open(`https://unisat.io/inscribe?tab=text&text=${encodeURIComponent(didIpfsUri)}`, '_blank')
            }
          >
            🪙 Open Unisat to Inscribe
          </button>

          <input
            className="input w-full mt-2"
            placeholder="Enter txid after inscription"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
          />
          <button
            className="btn btn-success w-full mt-1"
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
      )}
    </main>
  )
}
