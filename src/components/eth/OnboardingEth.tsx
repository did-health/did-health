import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ConnectWallet } from './WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { SetupStorage } from '../SetupStorage'
import { CreateDIDForm } from '../fhir/CreateDIDType'
import { SelectDIDFormETH } from './SelectDIDFormETH'
import { RegisterDID } from './RegisterDIDETH'
import { useOnboardingState } from '../../store/OnboardingState'
import { SetEncryption } from '../lit/SetEncryption'
import logo from '../../assets/did-health.png'
import ethlogo from '../../assets/ethereum-eth-logo.svg'
import CreateDeviceForm from '../fhir/CreateDeviceForm'
import CreatePatientForm from '../fhir/CreatePatientForm'
import CreatePractitionerForm from '../fhir/CreatePractitionerForm'
import CreateOrganizationForm from '../fhir/CreateOrganizationForm'

type StepCardProps = {
  step: string
  title: string
  children: React.ReactNode
}

export default function OnboardingEth() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    walletConnected,
    litConnected,
    storageReady,
    fhirResource,
    did,
    accessControlConditions, // 
    setDid,
    encryptionSkipped, // <-- Add this line
    walletAddress, // <-- Add this line to get walletAddress from state
    setStorageReady,
  } = useOnboardingState()

  console.log('did', did)
  console.log('walletConnected', walletConnected)
  console.log('litConnected', litConnected)
  console.log('storageReady', storageReady)
  console.log('fhirResource', fhirResource)
  console.log('accessControlConditions', accessControlConditions)
  console.log('encryptionSkipped', encryptionSkipped)
  console.log('walletAddress', walletAddress)
  const handleSubmit = async (updatedFHIR: any) => {
    console.log('💾 Submitting updated FHIR:', updatedFHIR)
    useOnboardingState.getState().setFhirResource(updatedFHIR)
  }
  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          {/* DID:Health Logo */}
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
            <img
              src={logo}
              alt="did:health Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>+</div>
          {/* Chain Logo */}
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
            <img
              src={ethlogo} // Replace with actual path to Ethereum logo
              alt={`eth logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          🚀 {t('didHealthETHOnboarding')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
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
          <StepCard step="3" title={t('setupStorage.title')}>
            <SetupStorage onReady={(client) => {
              setStorageReady(true)
              console.log('Storage setup complete:', client)
            }} />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && !fhirResource && (
          <StepCard step="4" title={t('createFHIR')}>
            <CreateDIDForm />
          </StepCard>
        )}
        {fhirResource && (
          <StepCard step="4" title={t('fhirCreated')}>
            <div className="mt-2">
              {(() => {
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
                    return (
                      <p className="text-sm text-red-500">
                        ❌  {t('unsupportedFHIRResourceType')}
                      </p>
                    )
                }
              })()}

            </div>
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
            did
          })
        }

        {walletConnected && litConnected && storageReady && fhirResource && !accessControlConditions && !encryptionSkipped && (
          <StepCard step="5" title={t('setAccessControl')}>
            <SetEncryption />
          </StepCard>
        )}


        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && (
          <StepCard step="5" title={t('AccessControlConditions')}>
            {encryptionSkipped ? (
              <>
                <p className="text-yellow-600 font-medium mb-4">⚠️ {t('encryptionSkipped')}</p>
                <button
                  onClick={() => {
                    useOnboardingState.getState().setEncryptionSkipped(false)
                    useOnboardingState.getState().setAccessControlConditions([])
                  }}
                  className="btn btn-primary text-blue-600"
                >
                  🔄 {t('changeEncryptionDecision')}
                </button>
              </>
            ) : (
              <>
                <p className="text-green-600 font-medium mb-2">✅ {t('AccessControlConditionsSet')}</p>
                {accessControlConditions && accessControlConditions.map((cond: any, idx: number) => {
                  const isSelfOnly =
                    cond.returnValueTest?.comparator === '=' &&
                    String(cond.returnValueTest?.value).toLowerCase() === walletAddress?.toLowerCase();

                  return (
                    <div key={idx} className="bg-gray-100 rounded p-4 shadow">
                      <p className="font-semibold text-gray-700 mb-1">Condition #{idx + 1}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Chain:</span>{' '}
                          {String(cond.chain ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Parameters:</span>{' '}
                          {Array.isArray(cond.parameters)
                            ? cond.parameters.map((p: unknown) => String(p)).join(', ')
                            : 'N/A'}
                        </div>
                        <div>
                          <div className="ml-2">
                            {t('whoCanViewIt')}
                            <br />
                            {isSelfOnly && (
                              <p className="mt-2 text-green-600 font-medium">
                                ✅  {t('onlyViewableBy')} <span className="underline">{t('you')}</span>.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    useOnboardingState.getState().setAccessControlConditions([])
                  }}
                  className="btn btn-primary text-blue-600"
                >
                  🔄 {t('editAccessControl')}
                </button>
              </>
            )}
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && !did && (
          <StepCard step="6" title={t('chooseDID')}>
            <SelectDIDFormETH onDIDAvailable={(did) => setDid(did)} />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && did && (
          <StepCard step="6" title={t('chooseDID')}>
            <div  className="flex items-center gap-2">
              <div className="flex items-center gap-2">
              <span>{did}</span>
              <button className="btn btn-ghost btn-xs" onClick={() => {
                useOnboardingState.getState().setDid("")
            }}>
              {t('reset')}
            </button></div>
            <div>
              <button
                type="button"
                onClick={() => {
                  // Navigate or open DID view modal
                  // Example if using react-router-dom:
                  navigate(`/ethereum/did`)
                }}
                style={{ marginLeft: '1rem' }}
              >
                {t('selectBlockchain.checkDid')}
              </button>
              </div>
            </div>
          </StepCard>
        )}



        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && did && (
          <StepCard step="7" title={t('registerDID')}>
            <RegisterDID />
          </StepCard>
        )}

      </div>
    </main>
  )
}

export function StepCard({ step, title, children }: StepCardProps) {
  const { t } = useTranslation()
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 transition-transform hover:scale-[1.01] hover:shadow-2xl group">
      <div className="absolute -top-5 left-6">
        <div className="bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
          {t('step')} {step}
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
