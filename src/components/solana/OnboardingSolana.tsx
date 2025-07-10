import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useOnboardingState } from '../../store/OnboardingState';
import { ConnectSolanaWallet } from './WalletConnectSolana';
import { ConnectLit } from '../lit/ConnectLit';
import { SetupStorage } from '../SetupStorage';
import { CreateDIDForm } from '../fhir/CreateDIDType';
import { SetEncryption } from '../lit/SetEncryption';
import { SelectDIDFormSolana } from './SelectDIDFormSolana';
import { RegisterDIDSolana } from './RegisterDIDSolana';
import logo from '../../assets/did-health.png';
import sollogo from '../../assets/solana-sol-logo.svg';
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4';

type FHIRResource = Patient | Practitioner | Organization | Device;

// Remove this type since we're using the global OnboardingState type directly
// type OnboardingState = {
//   walletConnected: boolean;
//   litConnected: boolean;
//   storageReady: boolean;
//   fhirResource: FHIRResource | null;
//   did: string | null;
//   accessControlConditions: any[] | null;
//   encryptionSkipped: boolean;
//   walletAddress: string | null;
//   setDID: (did: string) => void;
//   setFHIRResource: (resource: FHIRResource) => void;
//   setW3upClient: (client: any) => void;
// };

export default function OnboardingSolana() {
  const { t } = useTranslation();
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
    setW3upClient,
    setAccessControlConditions,
  } = useOnboardingState();

  const handleSubmit = async (updatedFHIR: FHIRResource) => {
    console.log('💾 Submitting updated FHIR:', updatedFHIR);
    setFHIRResource(updatedFHIR);
  };

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      {/* Header */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
            <img src={logo} alt="did:health Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">+</div>
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
            <img src={sollogo} alt="Solana Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('welcomeTo')} did:health Solana</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{t('connectYourSolanaWalletToStart')}</p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        <StepCard step="1" title={t('connectWallet')}>
          <ConnectSolanaWallet />
        </StepCard>

        {walletConnected && (
          <StepCard step="2" title={t('connectLit')}>
            <ConnectLit />
          </StepCard>
        )}

        {walletConnected && litConnected && (
          <StepCard step="3" title={t('setupStorage')}>
            <SetupStorage onReady={setW3upClient} />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && !fhirResource && (
          <StepCard step="4" title={t('createFHIR')}>
            <CreateDIDForm onSubmit={handleSubmit} />
          </StepCard>
        )}

        {fhirResource && (
          <StepCard step="4" title={t('fhirCreated')}>
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ {t('created')} <strong>{fhirResource.resourceType}</strong>
            </p>
            <div className="mt-2">
              <Link
                to={`/create/${fhirResource.resourceType.toLowerCase()}`}
                className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                ✏️ {t('edit')} {fhirResource.resourceType}
              </Link>
            </div>
          </StepCard>
        )}

        {fhirResource && !accessControlConditions && !encryptionSkipped && (
          <StepCard step="5" title={t('setAccessControl')}>
            <SetEncryption />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && (
          <StepCard step="5" title={t('accessControlConfigured')}>
            {encryptionSkipped ? (
              <>
                <p className="text-yellow-600 font-medium mb-4">⚠️ Encryption was skipped for this resource type.</p>
                <button
                  onClick={() => {
                    useOnboardingState.getState().setEncryptionSkipped(false);
                    useOnboardingState.getState().setAccessControlConditions(null);
                  }}
                  className="btn btn-outline btn-warning"
                >
                  🔄 {t('changeEncryptionDecision')}
                </button>
              </>
            ) : (
              <>
                <p className="text-green-600 font-medium mb-2">✅ {t('accessControlSet')}</p>
                {accessControlConditions?.map((cond: any, idx: number) => {
                  const isSelfOnly =
                    cond.returnValueTest?.comparator === '=' &&
                    String(cond.returnValueTest?.value).toLowerCase() === walletAddress?.toLowerCase();

                  return (
                    <div key={idx} className="bg-gray-100 rounded p-4 shadow">
                      <p className="font-semibold text-gray-700 mb-1">Condition #{idx + 1}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="font-medium text-gray-600">Chain:</span> {String(cond.chain ?? 'N/A')}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Parameters:</span>{' '}
                          {Array.isArray(cond.parameters)
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
                  );
                })}
                <button
                  onClick={() => {
                    useOnboardingState.getState().setAccessControlConditions(null);
                  }}
                  className="btn btn-outline btn-accent"
                >
                  🔄 {t('editAccessControl')}
                </button>
              </>
            )}
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && !did && (
          <StepCard step="6" title={t('chooseDID')}>
            <SelectDIDFormSolana onDIDAvailable={setDID} />
          </StepCard>
        )}

        {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && did && (
          <StepCard step="7" title={t('registerDID')}>
            <RegisterDIDSolana />
          </StepCard>
        )}
      </div>
    </div>
  );
}

export function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
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
      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-[16px] leading-relaxed">{children}</div>
    </section>
  );
}
