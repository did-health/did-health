import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useXmtp } from '../../lib/useXmtp';
import { Client, type Signer, type Conversation, type Installation, type SafeInboxState } from '@xmtp/browser-sdk';

export const XmtpInstallationsPage = () => {
  const [status, setStatus] = useState('');
  const [installations, setInstallations] = useState<string[]>([]);
  const { xmtpClient, initXmtp } = useXmtp();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (walletClient && address) {
      const signer: Signer = {
        type: 'SCW' as const,
        getIdentifier: async () => ({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum' as const,
        }),
        signMessage: async (message: string) => {
          const signature = await walletClient.signMessage({ message });
          // Convert hex string to Uint8Array
          const hex = signature.slice(2); // Remove '0x' prefix
          const bytes = new Uint8Array(hex.length / 2);
          for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
          }
          return bytes;
        },
        getChainId: () => {
          // We need to return a bigint synchronously
          // Since we're using wagmi, we can get the chainId from the walletClient
          return BigInt(walletClient.chain?.id || 1);
        }
      };
      initXmtp(signer);
    }
  }, [walletClient, initXmtp, address]);

  const [inboxId, setInboxId] = useState(address?.toLowerCase() || '');

  const fetchInstallations = async () => {
    if (!xmtpClient || !address) {
      setStatus('⚠️ XMTP client or address not available');
      return;
    }

    try {
      setStatus('🔍 Fetching...');
      try {
        // Validate and clean the address
        const cleanAddress = address.toLowerCase();
        if (!/^0x[0-9a-f]{40}$/.test(cleanAddress)) {
          throw new Error(`Invalid Ethereum address format: ${address}`);
        }

        console.log('Fetching inbox state for address:', cleanAddress);
        if (!xmtpClient) {
          throw new Error('XMTP client not initialized');
        }

        // Get inbox state using the properly initialized client
        const inboxId = xmtpClient.inboxId;
        if (!inboxId) {
          throw new Error('Failed to get inbox ID');
        }

        const inboxStates = await Client.inboxStateFromInboxIds([inboxId], 'production');
        const inboxState = inboxStates[0] as SafeInboxState;
        if (!inboxState) {
          throw new Error('Failed to get inbox state');
        }
        console.log('Raw inbox state:', inboxState);
        const installations = inboxState.installations as Installation[];
        console.log('Raw installations:', installations);

        const items = await Promise.all(
          installations.map(async (install: Installation, index: number) => {
            console.log(`Processing installation ${index}:`, install);
            if (!install.id) {
              console.error('Invalid installation ID:', install.id);
              return null;
            }

            // Validate that the ID is a valid hexadecimal string
            if (typeof install.id !== 'string' || !/^0x[0-9a-fA-F]+$/.test(install.id)) {
              console.error('Invalid hexadecimal installation ID:', install.id);
              return null;
            }

            console.log('Valid installation ID:', install.id);
            return install.id;
          })
        );
        const filteredItems = items.filter((item: string | null): item is string => item !== null);
        setInstallations(filteredItems);
        setStatus(`✅ Found ${filteredItems.length} valid installation(s)`);
      } catch (err: any) {
        console.error('Detailed error fetching installations:', {
          error: err,
          message: err.message,
          stack: err.stack,
          address
        });
        setStatus(`❌ Fetch failed: ${err.message}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Fetch failed: ${err.message}`);
    }
  };

  const revokeAll = async () => {
    if (!walletClient || !xmtpClient || !address) {
      setStatus('⚠️ No signer or XMTP client available');
      return;
    }

    try {
      setStatus('⛔ Revoking...');
      
      // First ensure we have a properly initialized client
      // Create signer
      const signer: Signer = {
        type: 'SCW' as const,
        getIdentifier: async () => ({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum' as const,
        }),
        signMessage: async (message: string) => {
          const signature = await walletClient.signMessage({ message });
          const hex = signature.slice(2); // Remove '0x' prefix
          const bytes = new Uint8Array(hex.length / 2);
          for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
          }
          return bytes;
        },
        getChainId: () => {
          return BigInt(walletClient.chain?.id || 1);
        }
      };

      // Initialize XMTP client
      await Client.create(signer, {
        env: 'dev'
      });

      // Get the inbox state
      const inboxStates = await Client.inboxStateFromInboxIds([address.toLowerCase()], 'production');
      if (!inboxStates || inboxStates.length === 0) {
        setStatus('⚠️ No inbox state found for this address.');
        return;
      }

      const validInstallations = (inboxStates[0].installations as Installation[]).filter(install => {
        try {
          if (!install.bytes) return false;
          Buffer.from(install.bytes);
          return true;
        } catch (e) {
          console.error('Invalid installation bytes:', install.bytes);
          return false;
        }
      });

      if (validInstallations.length === 0) {
        throw new Error('No valid installations to revoke');
      }

      await Client.revokeInstallations(
        xmtpClient.signer as Signer,
        address.toLowerCase(),
        validInstallations.map(install => install.bytes)
      );
      setInstallations([]);
      setStatus('✅ All installations revoked');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Revoke failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">XMTP Installation Manager</h2>

      <label className="block mb-2 font-medium">Inbox ID:</label>
      <input
        type="text"
        value={inboxId}
        onChange={(e) => setInboxId(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
        placeholder="Enter inboxId (e.g. 0x...)"
      />

      <div className="flex gap-2 mb-4">
        <button onClick={fetchInstallations}>🔍 View Installations</button>
        <button onClick={revokeAll} disabled={installations.length === 0}>
          ❌ Revoke All
        </button>
      </div>

      {status && <div className="mb-4 text-sm">{status}</div>}

      {installations.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Installations:</h4>
          <ul className="list-disc pl-6 text-sm">
            {installations.map((inst, idx) => (
              <li key={idx}>
              {Buffer.from(inst).toString('hex')}
              <span className="ml-2 text-xs text-gray-500">
                ({inst.length} bytes)
              </span>
            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
