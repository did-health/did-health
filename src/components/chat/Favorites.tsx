// Favorites.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAccount } from 'wagmi';
import didLogo from '../../assets/did-health.png';

interface Favorite {
  did: string;
  timestamp: number;
  fhirData?: any;
  encrypted?: boolean;
}

export interface FavoritesRef {
  addFavorite: (did: string) => void;
}

export const Favorites = forwardRef<FavoritesRef, { onSelect: (did: string) => void }>((props, ref) => {
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
      if (!did.startsWith('did:health:') || did.split(':').length !== 4) {
        throw new Error('Invalid DID format. Expected format: did:health:<chainId>:<name>');
      }

      const newFavorite: Favorite = {
        did,
        timestamp: Date.now(),
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
              <div key={f.did} className="bg-white rounded-lg shadow overflow-hidden hover:bg-gray-50 transition-colors duration-200">
                <div
                  onClick={() => setExpandedDid(f.did === expandedDid ? null : f.did)}
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
                      {f.did.split(':').slice(2).join(':')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});