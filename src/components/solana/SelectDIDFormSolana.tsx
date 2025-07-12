import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useOnboardingState } from '../../store/OnboardingState';

type Props = {
  onDIDAvailable: (did: string) => void;
};

export function SelectDIDFormSolana({ onDIDAvailable }: Props) {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const { fhirResource } = useOnboardingState();
  const [didInput, setDidInput] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fullDID = `did:health:sol:${publicKey?.toString()}`;

  const handleCheckAvailability = async () => {
    if (!publicKey) {
      setStatus('❌ Please connect your Solana wallet first.');
      return;
    }

    setChecking(true);
    setIsAvailable(null);
    setStatus('Checking on-chain DID availability...');

    try {
      const accountInfo = await connection.getAccountInfo(publicKey);

      if (!accountInfo || !accountInfo.data || accountInfo.data.length === 0) {
        setIsAvailable(true);
        setStatus('✅ DID is available!');
        onDIDAvailable(fullDID);
      } else {
        setIsAvailable(false);
        setStatus('❌ DID already exists on Solana.');
      }
    } catch (err: any) {
      console.error('Error checking Solana DID', err);
      setIsAvailable(null);
      setStatus(`⚠️ Could not verify DID: ${err.message}`);
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
          placeholder="Base58 public key (e.g. 3v1t8k...)"
          className="input input-bordered w-full"
          value={didInput}
          onChange={(e) => {
            const trimmed = e.target.value.trim();
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
