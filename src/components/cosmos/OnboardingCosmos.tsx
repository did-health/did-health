import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChainProvider } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';

import { Wallet as WalletModal, dhealthChain } from './WalletConnectCosmos';
import { ConnectLit } from '../lit/ConnectLit';
import { SetupStorage } from '../SetupStorage';
import { CreateDIDForm } from '../fhir/CreateDIDType';
import { SelectDIDFormCosmos } from './SelectDIDFormCosmos';
import { RegisterDIDCosmos } from './RegisterDIDCosmos';
import { SetEncryption } from '../lit/SetEncryption';
import { useOnboardingState } from '../../store/OnboardingState';
import logo from '../../assets/did-health.png';
import coslogo from '../../assets/cosmos-atom-logo.svg';

interface StepCardProps {
  step: string;
  title: string;
  children: React.ReactNode;
}

function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{step}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function OnboardingCosmos() {
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
  } = useOnboardingState();

  return (
    <ChainProvider
      chains={[dhealthChain]}
      walletModal={WalletModal}
      throwErrors={false}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-red-400/40 hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="did:health Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">+</div>
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-4 ring-yellow-400/30 hover:rotate-6 hover:scale-110 transition-all duration-300">
                <img src={coslogo} alt="Cosmos Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {t('welcomeTo')} DID:Health Cosmos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              {t('connectYourCosmosWalletToStart')}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            <StepCard step="1" title={t('connectWallet')}>
              <WalletModal />
            </StepCard>

            {walletConnected && (
              <StepCard step="2" title={t('connectLit')}>
                <ConnectLit />
              </StepCard>
            )}

            {walletConnected && litConnected && (
              <StepCard step="3" title={t('setupStorage')}>
                <SetupStorage onReady={(client) => {
                  console.log('Storage client ready');
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
                        useOnboardingState.getState().setEncryptionSkipped(false);
                        useOnboardingState.getState().setAccessControlConditions(null);
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
                      🔄 Edit Access Control
                    </button>
                  </>
                )}
              </StepCard>
            )}

            {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && !did && (
              <StepCard step="6" title={t('chooseDID')}>
                <SelectDIDFormCosmos onDIDAvailable={setDID} />
              </StepCard>
            )}

            {walletConnected && litConnected && storageReady && fhirResource && (accessControlConditions || encryptionSkipped) && did && (
              <StepCard step="7" title={t('registerDID')}>
                <RegisterDIDCosmos />
              </StepCard>
            )}
          </div>
        </div>
      </div>
    </ChainProvider>
  );
}
