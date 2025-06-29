import { Client, type Signer } from '@xmtp/xmtp-js';
import { useWalletClient } from 'wagmi';
import { useState, useCallback } from 'react';

export const useXmtp = () => {
  const { data: walletClient } = useWalletClient();
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);

  const initXmtp = useCallback(async () => {
    if (!walletClient?.account?.address) return;

    try {
      const signer: Signer = {
        signMessage: async (message: string | Uint8Array) => {
          const normalizedMessage = typeof message === 'string' ? message : new TextDecoder().decode(message);
          const signature = await walletClient.signMessage({
            message: normalizedMessage,
          });
          return signature;
        },
        getAddress: async () => {
          if (!walletClient.account) {
            throw new Error('walletClient.account is undefined');
          }
          return walletClient.account.address;
        }
      };

      const client = await Client.create(signer);
      setXmtpClient(client);
      return client;
    } catch (err) {
      console.error('Failed to init XMTP:', err);
      throw err;
    }
  }, [walletClient]);

  return { xmtpClient, initXmtp };
};
