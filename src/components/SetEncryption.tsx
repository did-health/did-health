import { useState, useEffect } from 'react'
import { useOnboardingState } from '../store/OnboardingState'
import {
  hashAccessControlConditions, validateAccessControlConditionsSchema
} from '@lit-protocol/access-control-conditions'
import { useChainId } from 'wagmi'
import { chainIdToLitChain } from '../lib/getChains'



const DID_HEALTH_DAO_ADDRESS = '0xYourDaoAddressHere' // Replace with real DAO contract

export function SetEncryption() {
  const {
    fhirResource,
    walletConnected,
    walletAddress,
    accessControlConditions,
    encryptionSkipped,
    setAccessControlConditions,
    setEncryptionSkipped,
  } = useOnboardingState()

  const [shareAddress, setShareAddress] = useState('')
  const [shareError, setShareError] = useState<string | null>(null)
const chainId = useChainId()
console.log('🔗 Connected Chain ID:', chainId)
const litChain = chainIdToLitChain[chainId] ?? 'ethereum' // default fallback
console.log('🔗 Lit Chain:', litChain)
  useEffect(() => {
    console.table({
      walletConnected,
      walletAddress,
      resourceType: fhirResource?.resourceType,
      accessControlConditions,
      encryptionSkipped,
    })
  }, [walletConnected, walletAddress, fhirResource, accessControlConditions, encryptionSkipped])

  if (!fhirResource) {
    return (
      <InfoCard title="Missing FHIR Resource" type="error">
        Please complete prior steps to define the resource.
      </InfoCard>
    )
  }

  const resourceType = fhirResource.resourceType

  if (['Organization', 'Practitioner'].includes(resourceType)) {
    return (
      <InfoCard title="Encryption Not Required" type="warning">
        <p className="mb-4">
          <strong>Note:</strong> {resourceType} records are <strong>not encrypted</strong>.
        </p>
        <p className="mb-4">
          To control access, apply for DAO membership to participate in record governance.
        </p>
        <div className="space-y-2">
          <button
            className="btn btn-outline btn-warning"
            onClick={() => {
              setEncryptionSkipped(true)
              console.log('✅ Skipped encryption for:', resourceType)
            }}
          >
            Confirm No Encryption Required
          </button>
          <a href="/dao/membership" className="btn btn-outline btn-secondary">
            Apply for DAO Membership
          </a>
        </div>
      </InfoCard>
    )
  }

  const applyAccessControl = async (conditions: any) => {
    const isValid = await validateAccessControlConditionsSchema(conditions)
    if (!isValid) {
      setShareError('Invalid access control condition')
      return
    }
    const hash = await hashAccessControlConditions(conditions)
    console.log('✅ ACC hash:', hash)

    setAccessControlConditions(conditions)
    setEncryptionSkipped(false)
    setShareError(null)
  }



  const handleSelfOnly = async () => {
    if (!walletAddress) return
    
    const acc = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: 'eth_getBalance',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>=',
          value: walletAddress,
        },
      },
    ]
    await applyAccessControl(acc)
  }

  const handleShareWithOther = async () => {
    if (!shareAddress || !/^0x[a-fA-F0-9]{40}$/.test(shareAddress)) {
      setShareError('Please enter a valid Wallet address.')
      return
    }
    const acc = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: 'eth_getBalance',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>=',
          value: '0',
        },
        walletAddress: shareAddress,
      },
    ]
    await applyAccessControl(acc)
  }

  const handleDaoShare = async () => {
    const acc = [
      {
        contractAddress: DID_HEALTH_DAO_ADDRESS,
        standardContractType: 'ERC721', // adjust if DAO uses different standard
        chain: litChain,
        method: 'balanceOf',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '>',
          value: '0',
        },
      },
    ]
    await applyAccessControl(acc)
  }

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 5. Set Access Control</h2>
      <p className="mb-4">Choose how this record should be encrypted.</p>

      <div className="space-y-4">
        <button className="btn btn-outline btn-accent w-full" onClick={handleSelfOnly}>
          🔒 Only I can decrypt
        </button>

        <div className="w-full space-y-2">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Enter another wallet address"
            value={shareAddress}
            onChange={(e) => setShareAddress(e.target.value)}
          />
          <button className="btn btn-primary w-full" onClick={handleShareWithOther}>
            🤝 Share with another wallet
          </button>
        </div>

        <button className="btn btn-outline btn-info w-full" onClick={handleDaoShare}>
          🏥 Share with did:health DAO
        </button>
      </div>

      {shareError && (
        <p className="text-red-600 mt-4 text-sm font-medium">{shareError}</p>
      )}

      <EncryptionStatus
        skipped={encryptionSkipped}
        conditions={accessControlConditions}
      />
    </div>
  )
}

// === Components ===

function InfoCard({ title, type, children }: { title: string; type: 'error' | 'warning'; children: React.ReactNode }) {
  const colors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
  }
  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className={`text-xl font-bold mb-4 ${colors[type]}`}>{title}</h2>
      {children}
    </div>
  )
}

function EncryptionStatus({
  skipped,
  conditions,
}: {
  skipped: boolean
  conditions: any
}) {
  if (!skipped && !conditions) return null
  return (
    <div className="mt-6 p-4 bg-gray-100 border rounded text-sm text-gray-700">
      {skipped ? (
        <p>🔓 <strong>Encryption Skipped</strong> — this record will not be encrypted.</p>
      ) : (
        <>
          <p>🔐 <strong>Encryption Enabled</strong> with the following access rules:</p>
          <ul className="mt-2 list-disc pl-6">
            {conditions?.map((cond: any, idx: number) => (
              <li key={idx}>
                <code>{cond.method}</code> on <strong>{cond.chain}</strong>{' '}
                → <code>{cond.returnValueTest.comparator} {cond.returnValueTest.value}</code>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
