import { useState, useCallback } from 'react';
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

  const initXmtp = useCallback(
    async (signer: Signer, options?: ClientOptions) => {
      setIsInitializing(true);
      setError(null);
      const env = options?.env || 'dev';

      const tryCreate = async (skipInstall = false) => {
        log('init', `Creating XMTP client (skipInstall=${skipInstall})...`);
        return await Client.create(signer, {
          env,
          ...(skipInstall ? { skipInstallationRegistration: true } : {}),
          ...options,
        });
      };

      try {
        const client = await tryCreate();
        setXmtpClient(client);
        log('init', 'XMTP client initialized ✅');
      } catch (e: any) {
        const msg = e.message || String(e);
        errorLog('init', msg);

        if (!msg.includes('5/5 installations')) {
          setError(msg);
          setIsInitializing(false);
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

          log('revoke', `Revoking ${installations.length} installations...`);
          await Client.revokeInstallations(
            signer,
            inboxId,
            installations.map((i) => i.bytes),
            env
          );
          log('revoke', 'Revocation complete. Retrying init...');

          const retryClient = await tryCreate();
          setXmtpClient(retryClient);
          log('init', 'Retried XMTP client initialized ✅');
        } catch (revErr) {
          errorLog('revoke', 'Revoke failed:', revErr);
          setError(revErr instanceof Error ? revErr.message : String(revErr));
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
