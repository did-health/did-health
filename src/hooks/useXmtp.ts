import { Client, type SCWSigner, type Identifier } from '@xmtp/browser-sdk';
import { useAccount, useWalletClient } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';

export function useXmtp() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Check if wallet is ready before using it
  const isWalletReady = Boolean(walletClient && walletClient.account && walletClient.signMessage);

  const getIdentifier = useCallback(async (): Promise<Identifier> => {
    if (!address) throw new Error('Wallet not connected');
    const addr = address.toLowerCase();
    if (!addr.startsWith('0x') || addr.length !== 42) {
      throw new Error(`Invalid address format: ${addr}`);
    }
    console.log('XMTP identifier:', addr);
    return {
      identifier: addr,
      identifierKind: 'Ethereum' as const
    };
  }, [address]);

  const signMessage = useCallback(async (message: string | Uint8Array): Promise<Buffer> => {
    if (!isWalletReady) {
      throw new Error('Wallet not ready');
    }
    const normalizedMessage = typeof message === 'string' ? message : new TextDecoder().decode(message);
    const signature = await walletClient.signMessage({ message: normalizedMessage });
    const hexSignature = signature.slice(2);
    if (hexSignature.length !== 64) {
      throw new Error(`Invalid signature length: ${hexSignature.length}`);
    }
    return Buffer.from(hexSignature, 'hex');
  }, [walletClient]);

  const getChainId = useCallback((): bigint => {
    if (!walletClient?.chain?.id) {
      return BigInt(11155111); // Default to Sepolia testnet
    }
    return BigInt(walletClient.chain.id);
  }, [walletClient]);

  const signer: SCWSigner = {
    getIdentifier,
    signMessage,
    getChainId,
    type: 'SCW' as const
  };

  const initXmtp = useCallback(async (): Promise<Client> => {
    if (!isWalletReady) {
      throw new Error('Wallet not ready');
    }

    console.log('Initializing XMTP client...');
    console.log('Creating XMTP client...');
    try {
      // First try to create client without revoking
      const client = await Client.create(signer);
      console.log('XMTP client created successfully');
      setXmtpClient(client);
      return client;
    } catch (err: any) {
      if (err.message.includes('already registered 5/5 installations')) {
        console.log('Attempting to revoke other installations...');
        try {
          // First create client to get access to revoke method
          const client = await Client.create(signer);
          // Revoke all other installations
          await client.revokeAllOtherInstallations();
          // Now create a new client
          const newClient = await Client.create(signer);
          console.log('Other installations revoked successfully and new client created');
          setXmtpClient(newClient);
          return newClient;
        } catch (revokeErr: any) {
          console.error('Failed to revoke installations:', revokeErr);
          setError('❌ Failed to revoke other installations. Please try manually revoking them in the XMTP portal.');
          throw revokeErr;
        }
      } else if (err.message.includes('NoModificationAllowedError')) {
        // Handle file system access error
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying XMTP initialization (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit before retrying
          return initXmtp(); // Retry
        } else {
          setError('❌ Failed to initialize XMTP: Could not access file system');
          throw new Error('Failed to access file system after multiple attempts');
        }
      } else {
        setError(err.message || 'Failed to initialize XMTP');
        throw err;
      }
    }
  }, [signer, retryCount, walletClient]);

  useEffect(() => {
    if (isConnected && !xmtpClient) {
      initXmtp().catch((err: any) => {
        console.error('Failed to initialize XMTP:', err);
        setError(err.message || 'Failed to initialize XMTP');
      });
    }
  }, [isConnected, initXmtp, xmtpClient]);

  return { xmtpClient, initXmtp, error };
}
