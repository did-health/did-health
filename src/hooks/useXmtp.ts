import { Client, type SCWSigner } from '@xmtp/browser-sdk';
import { useWalletClient } from 'wagmi';
import { useState, useCallback } from 'react';

export const useXmtp = () => {
  const { data: walletClient } = useWalletClient();
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);

  const initXmtp = useCallback(async () => {
    if (!walletClient?.account?.address) return;

    try {
      const signer: SCWSigner = {
        getIdentifier: async () => {
          const address = walletClient.account!.address;
          return address;
        },
        signMessage: async (message: string | Uint8Array) => {
          const normalizedMessage = typeof message === 'string' ? message : new TextDecoder().decode(message);
          const signature = await walletClient.signMessage({
            message: normalizedMessage,
          });
          return new Uint8Array(Buffer.from(signature.slice(2), 'hex'));
        },
        getChainId: async () => {
          return BigInt(1); // Mainnet
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
