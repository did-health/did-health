import { useState } from 'react';
import { useOnboardingState } from '../../store/OnboardingState';

// For demonstration, assumes Ordinals txids are stored with key `btc-txid-did:health:0:{name}` in localStorage
const BITCOIN_CHAIN_ID = '0';

interface SelectDIDFormBTCProps {
  onDIDAvailable: (did: string) => void;
}

export function SelectDIDFormBTC({ onDIDAvailable }: SelectDIDFormBTCProps) {
  const { fhirResource } = useOnboardingState();
  const [didInput, setDidInput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fullDID = `did:health:${BITCOIN_CHAIN_ID}:${didInput}`;

  const handleCheckAvailability = async () => {
    if (!didInput || !/^[a-z0-9-]+$/.test(didInput.trim())) {
      setStatus('❌ Invalid DID: only lowercase letters, numbers, and dashes allowed.');
      return;
    }

    setChecking(true);
    setStatus('Checking Ordinals inscription...');
    setIsAvailable(null);

    try {
      const key = `btc-txid-${fullDID}`;
      const storedTx = localStorage.getItem(key);

      if (storedTx) {
        setIsAvailable(false);
        setStatus('❌ DID already registered on Bitcoin.');
      } else {
        setIsAvailable(true);
        setStatus('✅ DID is available!');
        onDIDAvailable(fullDID);
      }
    } catch (err) {
      console.error('⚠️ Error checking DID availability:', err);
      setStatus('⚠️ Could not verify DID availability.');
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
          placeholder="e.g. satoshi123"
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

export default SelectDIDFormBTC;
