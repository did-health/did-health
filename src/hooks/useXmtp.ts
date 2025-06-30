import { Client, type SCWSigner, type Identifier } from '@xmtp/browser-sdk';
import { useWalletClient } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';

export const useXmtp = () => {
  const { data: walletClient } = useWalletClient();
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initXmtp = useCallback(async () => {
    if (!walletClient?.account?.address) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setError(null);
      console.log('Initializing XMTP client...');
      const signer: SCWSigner = {
        getIdentifier: async (): Promise<Identifier> => {
          const address = walletClient.account!.address;
          console.log('XMTP identifier:', address);
          // Ensure address is in lowercase without 0x prefix
          const cleanAddress = address.toLowerCase().replace('0x', '');
          console.log('Cleaned identifier:', cleanAddress);
          return {
            identifier: cleanAddress,
            identifierKind: 'Ethereum'
          };
        },
        signMessage: async (message: string | Uint8Array) => {
          const normalizedMessage = typeof message === 'string' ? message : new TextDecoder().decode(message);
          console.log('Signing message:', normalizedMessage);
          const signature = await walletClient.signMessage({
            message: normalizedMessage,
          });
          // Remove '0x' prefix and convert to raw hex bytes
          const hexSignature = signature.slice(2);
          console.log('Hex signature:', hexSignature);
          return Buffer.from(hexSignature, 'hex');
        },
        getChainId: () => {
          // Use the correct chain ID based on wallet connection
          const chainId = walletClient.chain?.id || 11155111;
          console.log('Using chain ID:', chainId);
          return BigInt(chainId);
        },
        type: 'SCW'
      };

      console.log('Creating XMTP client...');
      const client = await Client.create(signer);
      console.log('XMTP client created successfully');
      setXmtpClient(client);
      return client;
    } catch (err: any) {
      console.error('Failed to init XMTP:', err);
      setError(err.message || 'Failed to initialize XMTP');
      throw err;
    }
  }, [walletClient]);

  useEffect(() => {
    if (walletClient?.account?.address && !xmtpClient) {
      initXmtp();
    }
  }, [walletClient, initXmtp]);

  return { xmtpClient, initXmtp, error };
};
