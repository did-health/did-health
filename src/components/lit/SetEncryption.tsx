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


