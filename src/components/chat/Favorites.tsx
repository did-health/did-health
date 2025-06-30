// Favorites.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import didLogo from '../../assets/did-health.png';
import deployedContracts from '../../generated/deployedContracts';
import { decryptFHIRFile } from '../../lib/litEncryptFile';
import type { ILitNodeClient } from '@lit-protocol/types';
import { parseDidHealth } from '../../utils/did';

interface Favorite {
  did: string;
  timestamp: number;
  chainId: string;
  name: string;
  fhirData?: any;
  encrypted?: boolean;
}

export interface FavoritesRef {
  addFavorite: (did: string) => void;
}

export const Favorites = forwardRef<FavoritesRef, { 
  onSelect: (did: string) => void,
  litClient?: ILitNodeClient
}>((props, ref) => {
  const { onSelect } = props;
  const { address } = useAccount();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expandedDid, setExpandedDid] = useState<string | null>(null);
  const [didInput, setDidInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!address) {
      console.error('Missing wallet address');
      setError('Please connect your wallet first');
      return;
    }

    console.log('Adding favorite for DID:', did);

    setIsLoading(true);
    setError(null);

    try {
      // Validate DID format
      const parts = did.split(':');
      if (parts.length !== 4 || !did.startsWith('did:health:')) {
        throw new Error('Invalid DID format. Expected format: did:health:<chainId>:<name>');
      }

      const newFavorite: Favorite = {
        did,
        timestamp: Date.now(),
        chainId: parts[2],
        name: parts[3],
        fhirData: null,
        encrypted: false
      };

      console.log('New favorite created:', newFavorite);

      setFavorites(prev => {
        const updated = [newFavorite, ...prev.filter(f => f.did !== did)].slice(0, 10);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        console.log('Favorites updated:', updated);
        return updated;
      });
      onSelect(did);
    } catch (error: any) {
      setError(error.message || 'Failed to add favorite');
      console.error('Error adding favorite', error);
    } finally {
      setIsLoading(false);
    }
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

      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="did:health:<chainId>:<name>"
          className="w-full border px-3 py-2 rounded text-sm"
          required
          onChange={(e) => setDidInput(e.target.value)}
          value={didInput}
        />
        <div className="flex flex-col space-y-2">
          <button
            disabled={isLoading || !didInput.trim()}
            onClick={async (e) => {
              e.preventDefault();
              if (didInput.trim()) {
                try {
                  console.log('Attempting to add favorite with DID:', didInput.trim());
                  await addFavorite(didInput.trim());
                  setDidInput('');
                  console.log('Successfully added favorite');
                } catch (err) {
                  console.error('Error adding favorite:', err);
                  setError('Failed to add favorite. Please check the console for more details.');
                }
              }
            }}
            className={`w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded`}
          >
            {isLoading ? '⏳ Adding...' : '➕ Add to Favorites'}
          </button>
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {favorites.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            No favorites added yet
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((f) => (
              <div key={f.did} className="bg-white rounded-lg shadow overflow-hidden hover:bg-gray-50 transition-colors duration-200 relative">
                <div
                  onClick={() => {
                    onSelect(f.did);
                    setExpandedDid(f.did === expandedDid ? null : f.did);
                  }}
                  className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={didLogo}
                      alt="DID Health"
                      className="w-5 h-5"
                    />
                    <span className="font-medium truncate">{f.did}</span>
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
                {expandedDid === f.did && (
                  <div className="p-4 space-y-3 bg-gray-50">
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Chain ID:</span>
                        <span className="font-medium">{f.chainId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Name:</span>
                        <span className="font-medium">{f.name}</span>
                      </div>
                      {f.fhirData ? (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(f.fhirData, null, 2)}</pre>
                        </div>
                      ) : (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-gray-500">
                          <p className="text-xs">No FHIR data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-200 hover:opacity-100 bg-white/90 rounded-lg pointer-events-none"
                  onMouseEnter={async () => {
                    try {
                      const { chainId, name } = parseDidHealth(f.did);
                      const env = 'testnet';
                      const network = Object.values(deployedContracts[env]).find(
                        (net: any) => {
                          const dao = net?.DidHealthDAO;
                          return dao && typeof dao.chainId === 'number' && dao.chainId.toString() === chainId;
                        }
                      );
                      if (!network) throw new Error(`No registry for chain ${chainId}`);
                      const registryEntry = network.DidHealthDAO as any;
                      if (!registryEntry) throw new Error(`No registry for chain ${chainId}`);
                      
                      const provider = new ethers.JsonRpcProvider(registryEntry.rpcUrl);
                      const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider);
                      const data = await contract.getHealthDID(`${chainId}:${name}`);
                      
                      // Try to decrypt FHIR data if available
                      if (data.fhirData && props.litClient) {
                        try {
                          const blob = new Blob([data.fhirData], { type: 'application/json' });
                          const decrypted = await decryptFHIRFile({
                            file: blob,
                            litClient: props.litClient,
                            chain: 'ethereum'
                          } as any);
                          setFavorites(prev => prev.map(fav => 
                            fav.did === f.did ? { ...fav, fhirData: decrypted } : fav
                          ));
                        } catch (err) {
                          console.error('Failed to decrypt FHIR data:', err);
                          setFavorites(prev => prev.map(fav => 
                            fav.did === f.did ? { ...fav, fhirData: { error: 'Failed to decrypt FHIR data' } } : fav
                          ));
                        }
                      }
                    } catch (err) {
                      console.error('Error fetching DID info:', err);
                      setFavorites(prev => prev.map(fav => 
                        fav.did === f.did ? { ...fav, fhirData: { error: 'Failed to fetch DID info' } } : fav
                      ));
                    }
                  }}
                  onMouseLeave={() => {
                    setFavorites(prev => prev.map(fav => 
                      fav.did === f.did ? { ...fav, fhirData: null } : fav
                    ));
                  }}
                >
                  {f.fhirData && !f.fhirData.error && (
                    <div className="p-4">
                      <h4 className="text-sm font-semibold mb-2">DID Information</h4>
                      <div className="text-xs text-gray-600">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(f.fhirData, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});