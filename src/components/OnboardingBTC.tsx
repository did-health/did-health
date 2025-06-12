import React from 'react'
import { useTranslation } from 'react-i18next'
import { useOnboardingState } from '../store/OnboardingState'
import { CreateDIDForm } from './CreateDIDForm'
import { SelectDIDForm } from './SelectDIDForm'
import { SetEncryption } from './SetEncryption'
import { RegisterDID } from './RegisterDID'

export default function OnboardBitcoin() {
  const { t } = useTranslation()

  const {
    walletConnected,
    litConnected,
    storageReady,
    fhirResource,
    did,
    accessControlConditions,
    encryptionSkipped,
    setDID,
  } = useOnboardingState()

  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          🟧 {t('btcOnboarding') || 'Bitcoin DID:health Onboarding'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('btcInstructions') || 'Follow these steps to register your DID:health on Bitcoin Testnet using Ordinals + IPFS.'}
        </p>
      </div>

      <div className="space-y-8">
        {!fhirResource && (
          <StepCard step="1" title="Create FHIR Resource">
            <CreateDIDForm />
          </StepCard>
        )}

        {fhirResource && (
          <StepCard step="1" title="FHIR Resource Created">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ Created <strong>{fhirResource.resourceType}</strong>
            </p>
          </StepCard>
        )}

        {fhirResource && !accessControlConditions && !encryptionSkipped && (
          <StepCard step="2" title="Set Access Control">
            <SetEncryption />
          </StepCard>
        )}

        {fhirResource && (accessControlConditions || encryptionSkipped) && (
          <StepCard step="2" title="Access Control Configured">
            {encryptionSkipped ? (
              <>
                <p className="text-yellow-600 font-medium mb-4">⚠️ Encryption was skipped for this resource type.</p>
                <button
                  onClick={() => {
                    useOnboardingState.getState().setEncryptionSkipped(false)
                    useOnboardingState.getState().setAccessControlConditions(null)
                  }}
                  className="btn btn-outline btn-warning"
                >
                  🔄 Change Encryption Decision
                </button>
              </>
            ) : (
              <>
                <p className="text-green-600 font-medium mb-2">✅ Access Control Conditions have been set.</p>
                <pre className="bg-gray-900 text-white text-xs p-3 rounded max-h-64 overflow-auto mb-4">
                  {JSON.stringify(accessControlConditions, null, 2)}
                </pre>
                <button
                  onClick={() => {
                    useOnboardingState.getState().setAccessControlConditions(null)
                  }}
                  className="btn btn-outline btn-accent"
                >
                  🔄 Edit Access Control
                </button>
              </>
            )}
          </StepCard>
        )}

        {fhirResource && (accessControlConditions || encryptionSkipped) && !did && (
          <StepCard step="3" title="Choose DID">
            <SelectDIDForm onDIDAvailable={(did) => setDID(did)} />
          </StepCard>
        )}

        {fhirResource && (accessControlConditions || encryptionSkipped) && did && (
          <StepCard step="4" title="Register DID on Bitcoin">
            <RegisterDID />
          </StepCard>
        )}
      </div>
    </main>
  )
}

function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 transition-transform hover:scale-[1.01] hover:shadow-2xl group">
      <div className="absolute -top-5 left-6">
        <div className="bg-orange-600 dark:bg-orange-400 text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
          Step {step}
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 mt-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
        {title}
      </h2>

      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed">
        {children}
      </div>
    </section>
  )
}
