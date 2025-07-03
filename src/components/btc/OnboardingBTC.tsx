import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ConnectWalletBTC } from './WalletConnectBTC'
import { ConnectLit } from '../lit/ConnectLit'
import { useOnboardingState } from '../../store/OnboardingState'
import { SetupStorage } from '../SetupStorage'
import { CreateDIDForm } from '../fhir/CreateDIDType'

import RegisterDIDBTC from './RegisterDIDBTC'
import { SetEncryption } from '../lit/SetEncryption'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import logo from '../../assets/did-health.png'
import btclogo from '../../assets/bitcoin-btc-logo.svg'
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4'

type FHIRResource = Patient | Practitioner | Organization | Device

type OnboardingState = {
  walletConnected: boolean
  walletAddress: string | null
  litConnected: boolean
  storageReady: boolean
  fhirResource: FHIRResource | null
  did: string | null
  litClient: any | null
  email: string | null
  web3SpaceDid: string | null
  sessionSigs?: any | null
  accessControlConditions: any | null
  encryptionSkipped: boolean
  ipfsUri: string | null
  chainId: number | string | null
  w3upClient: any | null

  setWalletConnected: (value: boolean) => void
  setWalletAddress: (address: string) => void
  setLitConnected: (value: boolean) => void
  setStorageReady: (value: boolean) => void
  setFHIRResource: (resource: FHIRResource) => void
  setDID: (did: string) => void
  setLitClient: (client: any) => void
  setEmail: (email: string) => void
  setWeb3SpaceDid: (did: string) => void
  setAccessControlConditions: (value: any) => void
  setEncryptionSkipped: (value: boolean) => void
  setIpfsUri: (uri: string | null) => void
  setChainId: (chainId: number | string | null) => void
  setW3upClient: (client: any) => void
}
type StepCardProps = {
  step: string
  title: string
  children: React.ReactNode
}

export default function OnboardingEth() {
  const { t } = useTranslation()

  const {
    walletConnected,
    litConnected,
    storageReady,
    fhirResource,
    did,
    accessControlConditions,
    setDID,
    encryptionSkipped,
    walletAddress,
    setFHIRResource,
    setW3upClient
  } = useOnboardingState() as OnboardingState

  const handleSubmit = async (updatedFHIR: any) => {
    console.log('💾 Submitting updated FHIR:', updatedFHIR)
    setFHIRResource(updatedFHIR)
  }

  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8 text-center flex flex-col items-center">
  {/* Logos Row */}
  <div className="flex items-center gap-4 mb-6">
    {/* DID:Health Logo */}
    <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
      <img
        src={logo}
        alt="did:health Logo"
        className="w-full h-full object-contain"
      />
    </div>

    {/* + Symbol */}
    <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">+</div>

    {/* Chain Logo */}
    <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
      <img
        src={btclogo} // or ethlogo, btclogo, etc.
        alt="Cosmos Logo"
        className="w-full h-full object-contain"
      />
    </div>
  </div>

  {/* Header and Description */}
  <h1 className="text-4xl font-extrabold tracking-tight mb-2">
    🚀 {t('didHealthBTCOnboarding')}
  </h1>
  <p className="text-gray-600 dark:text-gray-400 max-w-xl">
    {t('onboardingInstructions')}
  </p>
</div>


      <div className="space-y-8">
        <StepCard step="1" title={t('connectWallet')}>
          <ConnectWalletBTC />
        </StepCard>

        {walletConnected && (
          <StepCard step="2" title={t('connectLit')}>
            <ConnectLit />
          </StepCard>
        )}

        {walletConnected && litConnected && (
          <StepCard step="3" title={t('setupStorage')}>
            <SetupStorage onReady={(client) => setW3upClient(client)} />
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
            <div className="mt-2">
              {(() => {
                if (!fhirResource) {
                  return null
                }
                
                // Type guard to ensure resourceType is a valid FHIR resource type
                const isFHIRResource = (resource: FHIRResource): resource is FHIRResource => {
                  return resource.resourceType === 'Patient' || 
                         resource.resourceType === 'Organization' ||
                         resource.resourceType === 'Practitioner' ||
                         resource.resourceType === 'Device'
                }

                if (!isFHIRResource(fhirResource)) {
                  return (
                    <p className="text-sm text-red-500">
                      ❌ Unsupported FHIR resource type
                    </p>
                  )
                }

                switch (fhirResource.resourceType) {
                  case 'Patient':
                    return <CreatePatientForm defaultValues={fhirResource} onSubmit={handleSubmit} />
                  case 'Organization':
                    return <CreateOrganizationForm defaultValues={fhirResource} onSubmit={handleSubmit} />
                  case 'Practitioner':
                    return <CreatePractitionerForm defaultValues={fhirResource} onSubmit={handleSubmit} />
                  case 'Device':
                    return <CreateDeviceForm defaultValues={fhirResource} onSubmit={handleSubmit} />
                  default:
                    return null
                }
              })()}
            </div>
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && !accessControlConditions && !encryptionSkipped && (
          <StepCard step="5" title={t('setAccessControl')}>
            <SetEncryption />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && (
          <StepCard step="5" title="Access Control Configured">
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
                {accessControlConditions.map((cond: any, idx: number) => {
                  const isSelfOnly =
                    cond.returnValueTest?.comparator === '=' &&
                    String(cond.returnValueTest?.value).toLowerCase() === walletAddress?.toLowerCase()

                  return (
                    <div key={idx} className="bg-gray-100 rounded p-4 shadow">
                      <p className="font-semibold text-gray-700 mb-1">Condition #{idx + 1}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Chain:</span> {String(cond.chain ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Parameters:</span> {
                            Array.isArray(cond.parameters)
                              ? cond.parameters.map((p: unknown) => String(p)).join(', ')
                              : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Return Value Test:</span>
                          <div className="ml-2">
                            Who Can View it:
                            <br />
                            {isSelfOnly && (
                              <p className="mt-2 text-green-600 font-medium">
                                ✅ Only viewable by <span className="underline">you</span>.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && (
          <StepCard step="6" title={t('chooseDID')}>
            <div className="space-y-4">
              <p className="text-gray-600">
                Your DID is automatically generated from your Bitcoin wallet address:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono">did:health:btc:{walletAddress}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(`did:health:btc:${walletAddress}`)}
                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
                    title="Copy DID"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && did && (
          <StepCard step="7" title={t('registerDID')}>
            <RegisterDIDBTC />
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
