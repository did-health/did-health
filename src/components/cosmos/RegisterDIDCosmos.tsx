import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useChainWallet } from '@cosmos-kit/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { useOnboardingState } from '../../store/OnboardingState';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storePlainFHIRFile, storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';

const chainName = 'dhealth';
const contractAddress = 'tdh021657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3svzwyq7';
const gasPrice = GasPrice.fromString('0.0025utdhp');

export function RegisterDIDCosmos() {
  const {
    fhirResource,
    did,
    litClient,
    accessControlConditions,
    encryptionSkipped,
    ipfsUri,
    setDID,
    setIpfsUri,
  } = useOnboardingState();

  const {
    wallet,
    status,
    address,
    getSigningCosmWasmClient,
  } = useChainWallet(chainName, 'keplr');

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [finalDid, setFinalDid] = useState<string | null>(null);

  const steps = [
    'Validating FHIR Resource',
    encryptionSkipped ? 'Skipping Encryption' : 'Encrypting with Lit Protocol',
    'Uploading to Web3.Storage',
    'Executing Smart Contract',
    'Registered Successfully',
  ];

  const handleRegister = async () => {
    if (!fhirResource || !did || !address || (!encryptionSkipped && !litClient)) {
      setError('Missing required information (FHIR, DID, wallet, or Lit client)');
      return;
    }

    const parts = did.split(':');
    if (parts.length !== 4 || !/^[a-z0-9-]+$/.test(parts[3])) {
      setError('Invalid DID format. Use only lowercase letters, numbers, and dashes');
      return;
    }

    setOpen(true);
    setError(null);

    try {
      setActiveStep(0);

      // Inject DID into FHIR resource
      const didIdentifier = {
        system: 'https://www.w3.org/ns/did',
        value: did,
      };
      const fhirWithDid = {
        ...fhirResource,
        identifier: Array.isArray(fhirResource.identifier)
          ? fhirResource.identifier.some(id => id.system === didIdentifier.system)
            ? fhirResource.identifier.map(id =>
                id.system === didIdentifier.system ? { ...id, value: didIdentifier.value } : id
              )
            : [...fhirResource.identifier, didIdentifier]
          : [didIdentifier],
      };

      let finalIpfsUri = ipfsUri;
      if (!finalIpfsUri) {
        const resourceBlob = new Blob(
          [JSON.stringify(fhirWithDid, null, 2)],
          { type: 'application/json' }
        );

        const fileName = fhirResource.id || crypto.randomUUID();

        setActiveStep(1);
        if (encryptionSkipped) {
          finalIpfsUri = await storePlainFHIRFile(fhirResource, fileName, fhirResource.resourceType);
        } else {
          const { encryptedJSON, hash } = await encryptFHIRFile({
            file: resourceBlob,
            litClient: litClient!,
            chain: 'cosmos',
            accessControlConditions,
          });
          const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' });
          setActiveStep(2);
          finalIpfsUri = await storeEncryptedFileByHash(encryptedBlob, hash, fhirResource.resourceType);
        }
        if (!finalIpfsUri) throw new Error('Failed to upload to IPFS');
        setIpfsUri(finalIpfsUri);
      }

      // Prepare to execute smart contract
      setActiveStep(3);
      const client: SigningCosmWasmClient = await getSigningCosmWasmClient();
      const msg = {
        RegisterDID: {
          health_did: did,
          uri: finalIpfsUri,
        },
      };

      const result = await client.execute(
        address,
        contractAddress,
        msg,
        'auto'
      );

      console.log('📤 TX result:', result);

      setTxHash(result.transactionHash);
      setActiveStep(4);
      setFinalDid(did);
      setDID(did);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    did && (
      <div className="space-y-4">
        <button className="btn btn-primary" onClick={handleRegister}>
          Register DID
        </button>

        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6 shadow">
              <Dialog.Title className="text-lg font-bold mb-4">Registering DID</Dialog.Title>
              <ol className="space-y-3">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    {index < activeStep ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : index === activeStep ? (
                      <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 1010 10h-4l3 3 3-3h-4a8 8 0 01-8 8z"
                        />
                      </svg>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300" />
                    )}
                    <span className={index === activeStep ? 'font-semibold' : 'text-gray-500'}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

              {activeStep === 4 && txHash && (
                <div className="mt-6 space-y-4">
                  <p><strong>DID:</strong> <code>{finalDid}</code></p>
                  <a
                    href={`https://explorer.dhealth.dev/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    🔎 View Transaction
                  </a>
                </div>
              )}

              <div className="mt-6 text-center">
                <button className="btn btn-sm btn-outline" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    )
  );
}
