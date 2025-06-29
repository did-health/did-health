// Favorites.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAccount } from 'wagmi';
import { useXmtp } from '../../hooks/useXmtp';
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs';
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument';

interface Favorite {
  did: string;
  name?: string;
  timestamp: number;
  fhirData?: any;
  encrypted?: boolean;
}

export interface FavoritesRef {
  addFavorite: (did: string, name?: string) => void;
}

export const Favorites = forwardRef<FavoritesRef, { onSelect: (did: string) => void }>((props, ref) => {
  const { onSelect } = props;
  const { address } = useAccount();
  const { xmtpClient } = useXmtp();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expandedDid, setExpandedDid] = useState<string | null>(null);
  const storageKey = `favorites_${address}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved favorites', e);
      }
    }
  }, [address, storageKey]);

  const addFavorite = async (did: string) => {
    if (!xmtpClient || !address) return;

    const newFavorite: Favorite = {
      did,
      timestamp: Date.now()
    };

    try {
      const result = await resolveDidHealthAcrossChains(did);
      if (!result) {
        throw new Error('No DID found for this address');
      }
      const doc = result.doc;
      const fhirUrl = doc?.ipfsUri || doc?.altIpfsUris?.[0];

      if (!fhirUrl) throw new Error('No FHIR URL found');

      const response = await fetch(fhirUrl);
      const json = await response.json();

      const isEncrypted = fhirUrl.endsWith('.enc') || fhirUrl.endsWith('.lit');
      const fhirData = isEncrypted
        ? await getLitDecryptedFHIR(json, { chain: 'ethereum' })
        : json;

      newFavorite.fhirData = fhirData;
      newFavorite.encrypted = isEncrypted;
    } catch (error) {
      console.error('Error resolving or decrypting FHIR data', error);
    }

    setFavorites(prev => {
      const updated = [newFavorite, ...prev.filter(f => f.did !== did)].slice(0, 10);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
    onSelect(did);
  };

  useImperativeHandle(ref, () => ({
    addFavorite
  }));

  const removeFavorite = (did: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.did !== did);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Favorites</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('didInput') as HTMLInputElement;
          const nameInput = form.elements.namedItem('nameInput') as HTMLInputElement;
          const did = input.value.trim();
          const name = nameInput.value.trim();
          if (did) {
            await addFavorite(did, name || undefined);
            input.value = '';
            nameInput.value = '';
          }
        }}
        className="mb-4 space-y-2"
      >
        <input
          type="text"
          name="didInput"
          placeholder="did:health:<chainId>:<name>"
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          ➕ Add to Favorites
        </button>
      </form>

      <div className="space-y-2">
        {favorites.map((f) => (
          <div key={f.did} className="bg-white rounded-lg shadow overflow-hidden">
            <div
              onClick={() => setExpandedDid(f.did === expandedDid ? null : f.did)}
              className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">⭐</span>
                <span className="font-medium">{f.name || f.did}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(f.did);
                }}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            {expandedDid === f.did && f.fhirData && (
              <div className="p-4 space-y-3 bg-gray-50">
                {f.fhirData.photo?.[0]?.url && (
                  <img
                    src={f.fhirData.photo[0].url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow"
                  />
                )}
                <div className="text-center">
                  <h4 className="text-lg font-semibold">
                    {f.fhirData.name?.[0]?.text || f.fhirData.name?.[0]?.given?.join(' ')}
                  </h4>
                  <p className="text-sm text-gray-600">{f.fhirData.resourceType}</p>
                  {f.encrypted && (
                    <p className="text-xs text-indigo-600 mt-1">🔐 Encrypted and Decrypted</p>
                  )}
                </div>
                <pre className="bg-white p-2 rounded text-xs overflow-x-auto max-h-60">
                  {JSON.stringify(f.fhirData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});