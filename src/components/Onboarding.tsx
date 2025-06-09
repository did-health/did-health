import React from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectWallet } from '../components/WalletConnect'
import { ConnectLit } from '../components/ConnectLit'
import { SetupStorage } from '../components/SetupStorage'
import { CreateDIDForm } from '../components/CreateDIDForm'
import { SelectDIDForm } from './SelectDIDForm'
import { RegisterDID } from './RegisterDID'
import { useOnboardingState } from '../store/OnboardingState'
import { SetEncryption } from './SetEncryption'
type StepCardProps = {
  step: string
  title: string
  children: React.ReactNode
}

export default function Onboarding() {
  const { t } = useTranslation()

  const {
    walletConnected,
    litConnected,
    storageReady,
    fhirResource,
    did,
    accessControlConditions, // ✅ Add this
    setDID,
    encryptionSkipped, // <-- Add this line
  } = useOnboardingState()


  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          🚀 {t('didHealthOnboarding')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('onboardingInstructions')}
        </p>
      </div>

      <div className="space-y-8">
        <StepCard step="1" title={t('connectWallet')}>
          <ConnectWallet />
        </StepCard>

        {walletConnected && (
          <StepCard step="2" title={t('connectLit')}>
            <ConnectLit />
          </StepCard>
        )}

        {walletConnected && litConnected && (
          <StepCard step="3" title={t('setupStorage')}>
            <SetupStorage />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && !fhirResource && (
          <StepCard step="4" title={t('createFHIR')}>
            <CreateDIDForm />
          </StepCard>
        )}

        {fhirResource && (
          <StepCard step="4" title={t('fhirCreated')}>
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ {t('created')} <strong>{fhirResource.resourceType}</strong>
            </p>
          </StepCard>
        )}

      {
      console.log('🧪 Step 5 Check:', {
        walletConnected,
        litConnected,
        storageReady,
        fhirResource,
        accessControlConditions,
        encryptionSkipped,
      })
      }

        {walletConnected && litConnected && storageReady && fhirResource && !accessControlConditions && (
          <StepCard step="5" title={t('setAccessControl')}>
            <SetEncryption />
          </StepCard>
        )}


        {walletConnected && litConnected && storageReady && fhirResource && accessControlConditions && !did && (
          <StepCard step="6" title={t('chooseDID')}>
            <SelectDIDForm onDIDAvailable={(did) => setDID(did)} />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && accessControlConditions && did && (
          <StepCard step="7" title={t('registerDID')}>
            <RegisterDID />
          </StepCard>
        )}

      </div>
    </main>
  )
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 transition-transform hover:scale-[1.01] hover:shadow-2xl group">
      <div className="absolute -top-5 left-6">
        <div className="bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
          Step {step}
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 mt-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
        {title}
      </h2>

      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed">
        {children}
      </div>
    </section>
  )
}
