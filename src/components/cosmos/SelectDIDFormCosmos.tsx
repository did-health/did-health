import { useState } from 'react';
import { useOnboardingState } from '../../store/OnboardingState';
import { useChainWallet } from '@cosmos-kit/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { dhealthChain } from '../../generated/cosmosChains';

type Props = {
  onDIDAvailable: (did: string) => void;
};

export function SelectDIDFormCosmos({ onDIDAvailable }: Props) {
  const { fhirResource } = useOnboardingState();
  const [didInput, setDidInput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const chainName = 'dhealth';
  const fullDID = `did:health:${chainName}:${didInput}`;

  const {
    address,
    getSigningCosmWasmClient,
    chain,
  } = useChainWallet(chainName, 'keplr');

  const handleCheckAvailability = async () => {
    if (!didInput || !address) return;

    if (!/^[a-z0-9-]+$/.test(didInput.trim())) {
      setStatus('❌ Invalid DID: only lowercase letters, numbers, and dashes allowed.');
      return;
    }

    setChecking(true);
    setIsAvailable(null);
    setStatus('Checking on-chain DID availability...');

    try {
      const client: SigningCosmWasmClient = await getSigningCosmWasmClient();

      const contractAddress = dhealthChain.contracts?.HealthDIDRegistry;
      if (!contractAddress) throw new Error('No contract address configured for dhealth');

      const result = await client.queryContractSmart(contractAddress, {
        get_health_did: { id: `${chainName}:${didInput}` },
      });

      if (result?.owner && result.owner !== 'cosmos1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp3gx4e') {
        setIsAvailable(false);
        setStatus('❌ DID is already registered.');
      } else {
        setIsAvailable(true);
        setStatus('✅ DID is available!');
        onDIDAvailable(fullDID);
      }
    } catch (err: any) {
      if (err.message?.includes('not found') || err.message?.includes('no data')) {
        setIsAvailable(true);
        setStatus('✅ DID is available!');
        onDIDAvailable(fullDID);
      } else {
        console.error(err);
        setStatus(`⚠️ Could not check availability: ${err.message}`);
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {checking && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="loader mb-3 border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin" />
            <p className="text-sm text-gray-700">Checking DID availability...</p>
          </div>
        </div>
      )}

      {fhirResource && (
        <div className="bg-green-100 text-green-800 text-sm p-3 rounded shadow">
          ✅ FHIR record created: <strong>{fhirResource.resourceType}</strong>
        </div>
      )}

      <div className="space-y-2">
        <input
          type="text"
          placeholder="e.g. johndoe123"
          className="input input-bordered w-full"
          value={didInput}
          onChange={(e) => {
            const trimmed = e.target.value.trim().toLowerCase();
            setDidInput(trimmed);
            setIsAvailable(null);
            setStatus(null);
          }}
        />
        <p className="text-sm text-gray-500">
          Full DID: <code>{fullDID}</code>
        </p>
      </div>

      <div className="space-y-2">
        <button
          className="btn btn-primary"
          onClick={handleCheckAvailability}
          disabled={!didInput || checking}
        >
          {checking ? 'Checking...' : 'Check Availability'}
        </button>

        {status && <p className="text-sm text-gray-800">{status}</p>}
      </div>
    </div>
  );
}
