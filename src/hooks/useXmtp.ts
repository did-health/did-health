import { useState, useCallback } from 'react';
import {
  Client,
  type Signer,
  type ClientOptions,
} from '@xmtp/browser-sdk';
import { useOnboardingState } from '../store/OnboardingState';

export interface UseXmtpResult {
  xmtpClient: Client<unknown> | null;
  initXmtp: (signer: Signer, options?: ClientOptions) => Promise<void>;
  isInitializing: boolean;
  error: string | null;
}

/**
 * useXmtp
 * Manages XMTP client lifecycle using a provided Signer (EOA or Smart Wallet)
 * and handles auto-cleanup of old installations if the 5/5 limit is hit.
 */
export const useXmtp = (): UseXmtpResult => {
  const [xmtpClient, setXmtpClient] = useState<Client<unknown> | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initXmtp = useCallback(
    async (signer: Signer, options?: ClientOptions) => {
      setIsInitializing(true);
      setError(null);

      try {
        const client = await Client.create(signer, {
          env: 'dev',
          ...options,
        });

        setXmtpClient(client);
        return;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('Initial XMTP init failed:', msg);

        // Handle installation limit error
        if (msg.includes('5/5 installations')) {
          try {
            const tempClient = await Client.create(signer, {
              env: 'dev',
              skipContactPublishing: true,
            });

            const installs = await tempClient.installations.list();
            const toDelete = installs.slice(0, installs.length - 1);
            await Promise.all(toDelete.map(i => i.delete()));

            console.warn(`🧹 Cleaned ${toDelete.length} XMTP installations`);

            // Retry init
            const retryClient = await Client.create(signer, {
              env: 'dev',
              ...options,
            });

            setXmtpClient(retryClient);
            return;
          } catch (cleanupErr: unknown) {
            const cleanMsg = cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr);
            console.error('Cleanup failed:', cleanMsg);
            setError(`Cleanup failed: ${cleanMsg}`);
            setXmtpClient(null);
          }
        } else {
          setError(msg);
          setXmtpClient(null);
        }
      } finally {
        setIsInitializing(false);
      }
    },
    []
  );

  return {
    xmtpClient,
    initXmtp,
    isInitializing,
    error,
  };
};
