import { useState, useCallback, useEffect } from 'react';
import {
  Client,
  type ClientOptions,
  type Signer,
  type Client as XmtpClient,
} from '@xmtp/browser-sdk';

export interface UseXmtpResult {
  xmtpClient: XmtpClient<unknown> | null;
  initXmtp: (signer: Signer, options?: ClientOptions) => Promise<void>;
  isInitializing: boolean;
  error: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const log = (step: string, ...msg: any[]) =>
  console.log(`🟢 [XMTP] [${step}]`, ...msg);
const warn = (step: string, ...msg: any[]) =>
  console.warn(`🟡 [XMTP] [${step}]`, ...msg);
const errorLog = (step: string, ...msg: any[]) =>
  console.error(`🔴 [XMTP] [${step}]`, ...msg);

export const useXmtp = (): UseXmtpResult => {
  const [xmtpClient, setXmtpClient] = useState<XmtpClient<unknown> | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbLock, setDbLock] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Cleanup function to release any database locks
  useEffect(() => {
    return () => {
      if (dbLock) {
        log('cleanup', 'Releasing database lock');
        setDbLock(false);
      }
    };
  }, [dbLock]);

  const initXmtp = useCallback(
    async (signer: Signer, options?: ClientOptions) => {
      setIsInitializing(true);
      setError(null);
      const env = options?.env || 'dev';

      // Check if we already have a client
      if (xmtpClient) {
        log('init', 'Already have XMTP client, reusing...');
        setIsInitializing(false);
        return;
      }

      // Try to acquire database lock
      if (dbLock) {
        warn('db', 'Database lock already held, waiting...');
        await sleep(1000);
        return initXmtp(signer, options);
      }

      try {
        setDbLock(true);
        
        // Try to get existing client first
        const existingClient = await Client.create(signer, {
          env,
          ...options,
        });
        setXmtpClient(existingClient);
        log('init', 'Using existing XMTP client ✅');
        setIsInitializing(false);
        setDbLock(false);
        return;
      } catch (e) {
        log('init', 'No existing client found, creating new one...');
      }

      const tryCreate = async (skipInstall = false) => {
        log('init', `Creating XMTP client (skipInstall=${skipInstall})...`);
        try {
          const client = await Client.create(signer, {
            env,
            ...(skipInstall ? { skipInstallationRegistration: true } : {}),
            ...options,
          });
          return client;
        } catch (err) {
          throw new Error(`Failed to create client: ${err}`);
        }
      };

      try {
        // First try with skipInstall to avoid database conflicts
        try {
          const client = await tryCreate(true);
          setXmtpClient(client);
          log('init', 'XMTP client initialized with skipInstall ✅');
          setDbLock(false);
          return;
        } catch (e) {
          // If skipInstall fails, try regular init
          log('init', 'SkipInstall failed, trying regular init...');
        }

        const client = await tryCreate();
        setXmtpClient(client);
        log('init', 'XMTP client initialized ✅');
        setDbLock(false);
      } catch (e: any) {
        const msg = e.message || String(e);
        errorLog('init', msg);

        if (!msg.includes('5/5 installations')) {
          // Handle database access errors
          if (msg.includes('NoModificationAllowedError') || msg.includes('vfs error')) {
            warn('db', 'Database access error, retrying in 1 second...');
            setDbLock(false);
            await sleep(1000);
            return initXmtp(signer, options);
          }
          setError(msg);
          setIsInitializing(false);
          setDbLock(false);
          return;
        }

        warn('revoke', 'Install limit reached — attempting revocation');

        try {
          const failedClient = await tryCreate(true);

          const inboxId = failedClient.inboxId;
          if (!inboxId) {
            throw new Error('Failed to get inbox ID');
          }
          const inboxState = await Client.inboxStateFromInboxIds([inboxId], env);
          const firstState = inboxState?.[0];
          const installations = firstState?.installations || [];

          if (!installations.length) {
            throw new Error('No installations found to revoke.');
          }

          // Only revoke the oldest installation to avoid revoking all
          const oldestInstallation = installations[0];
          log('revoke', `Revoking oldest installation...`);
          await Client.revokeInstallations(
            signer,
            inboxId,
            [oldestInstallation.bytes],
            env
          );
          log('revoke', 'Revocation complete. Retrying init...');

          // Add exponential backoff for retries
          const backoffTime = Math.pow(2, retryCount) * 1000;
          log('revoke', `Waiting ${backoffTime}ms before retry...`);
          await sleep(backoffTime);
          setRetryCount(retryCount + 1);

          if (retryCount >= MAX_RETRIES) {
            throw new Error('Max retries reached');
          }

          const retryClient = await tryCreate();
          setXmtpClient(retryClient);
          log('init', 'Retried XMTP client initialized ✅');
        } catch (revErr) {
          errorLog('revoke', 'Revoke failed:', revErr);
          setError(revErr instanceof Error ? revErr.message : String(revErr));
        }
      } finally {
        setIsInitializing(false);
        setDbLock(false);
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
