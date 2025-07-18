import { useState, useEffect } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { chainIdToLitChain } from '../../lib/getChains'
import { SetAccessControl } from './SetAccessControl'



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
const { t } = useTranslation()
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
        {t('MissingFHIRResource')}
      </InfoCard>
    )
  }

  const resourceType = fhirResource.resourceType

  if (['Organization', 'Practitioner'].includes(resourceType)) {
    setEncryptionSkipped(true)
    return (
      <InfoCard title={t('EncryptionNotRequired')} type="warning">
        <p className="mb-4">
          <strong>{t('Note')}:</strong>did:health {resourceType}s <strong>{t('areNotEncrypted')}</strong>.
        </p>
      </InfoCard>
    )
  }


  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <div className="space-y-4">
        {walletAddress ? (
          <SetAccessControl
            onSetAccessConditions={setAccessControlConditions}
            connectedWallet={walletAddress}
            encryptionSkipped={encryptionSkipped}
            setEncryptionSkipped={setEncryptionSkipped}
            setShareError={setShareError}
          />
        ) : (
          <p className="text-red-600">Please connect your wallet first</p>
        )}
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
