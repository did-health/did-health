import { useState, useCallback } from 'react';
import { Client, type Signer, type ClientOptions, type Client as XmtpClient } from '@xmtp/browser-sdk';
import { useOnboardingState } from '../store/OnboardingState';

export interface UseXmtpResult {
  xmtpClient: Client | null;
  initXmtp: (signer: Signer, options?: ClientOptions) => Promise<void>;
  isInitializing: boolean;
  error: string | null;
}

/**
 * useXmtp
 * Manages XMTP client lifecycle using a provided Signer (EOA or Smart Wallet)
 */
export const useXmtp = (): UseXmtpResult => {
  const [xmtpClient, setXmtpClient] = useState<XmtpClient<any> | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initXmtp = useCallback(
    async (signer: Signer, options?: ClientOptions) => {
      setIsInitializing(true);
      setError(null);

      try {
        // Initialize the client
        const client = await Client.create(signer, {
          env: 'dev', // change to 'production' for mainnet
          ...options,
        }) as XmtpClient<any>;

        setXmtpClient(client);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('❌ XMTP initialization failed:', msg);
        setError(msg);
        setXmtpClient(null);
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
