import { Client, type Signer, type Identifier } from '@xmtp/browser-sdk';
import { JsonRpcProvider } from 'ethers';
import { Buffer } from 'buffer';
import { useState, useCallback, useEffect, useMemo } from 'react';

const MAX_RETRIES = 3;

interface XmtpConfig {
  address: string | null;
  walletClient: string | null; // RPC URL
  isConnected: boolean;
}

interface XmtpConfig {
  address: string | null;
  walletClient: string | null; // RPC URL
  isConnected: boolean;
  env?: 'dev' | 'production'; // Add environment option
}

let xmtpSingleton: Client | null = null;

export function useXmtp({ address, walletClient, isConnected, env = 'dev' }: XmtpConfig) {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);

  // Memoize the signer to prevent recreation
  const signer = useMemo<Signer | null>(() => {
    if (!address || !walletClient || !isConnected) return null;
    
    const provider = new JsonRpcProvider(walletClient);
    
    // Create the signer object
    return {
      async getIdentifier(): Promise<Identifier> {
        try {
          const addr = address.toLowerCase();
          if (!addr) {
            throw new Error('No wallet address found');
          }
          return {
            identifier: addr,
            identifierKind: 'Ethereum' as const
          };
        } catch (err: any) {
          console.error('Failed to get wallet address:', err);
          throw new Error(`Failed to get wallet address: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },

      async signMessage(message: string | Uint8Array): Promise<Buffer> {
        try {
          const providerSigner = await provider.getSigner();
          const signature = await providerSigner.signMessage(
            typeof message === 'string' ? message : Buffer.from(message).toString('hex')
          );
          return Buffer.from(signature, 'hex');
        } catch (err: any) {
          console.error('Failed to sign message:', err);
          throw new Error(`Failed to sign message: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },

      getChainId(): bigint {
        try {
          return BigInt(provider._network.chainId);
        } catch (err: any) {
          console.error('Failed to get chain ID:', err);
          throw new Error(`Failed to get chain ID: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },

      type: 'SCW' as const
    } as Signer;
  }, [address, walletClient, isConnected]);

  const initXmtp = useCallback(async (): Promise<Client> => {
    if (!signer) throw new Error('Wallet not ready');
    
    try {
      // First try to create client without revoking
      console.log('Attempting to initialize XMTP client...');
      
      // Check if we have a cached client
      if (xmtpSingleton) {
        console.log('Using cached XMTP client');
        return xmtpSingleton;
      }

      // Try to create new client
      const client = await Client.create(signer, {
        env: env,
        loggingLevel: 'info',
      });

      // Store in singleton
      xmtpSingleton = client;
      setXmtpClient(client);
      setRetryCount(0);
      
      // Check installation status
      try {
        const installationId = client.installationId;
        console.log('XMTP installation ID:', installationId);
      } catch (err: any) {
        console.warn('Failed to get installation ID:', err);
      }

      setIsInitializing(false);
      return client;
    } catch (err: any) {
      console.error('XMTP initialization error:', err);
      
      // Handle installation limit errors
      if (err.message.includes('already registered 5/5 installations')) {
        console.log('Reached maximum number of installations...');
        const errorMessage = `❌ Maximum number of installations reached

You've reached the maximum number of installations (5) for this XMTP inbox. Please follow these steps:

1. Go to https://community.xmtp.org to revoke an existing installation
2. After revoking an installation, refresh this page
3. Try connecting again

Important: Messages will be lost if you switch environments or lose your database.

If you need help, contact XMTP support at community.xmtp.org`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Handle file system access errors
      if (err.message.includes('NoModificationAllowedError')) {
        console.log('Waiting for file system access...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying XMTP initialization (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          return initXmtp();
        }
      }

      // Handle database deletion errors
      if (err.message.includes('database') || err.message.includes('storage')) {
        console.log('Database error detected...');
        const errorMessage = `❌ Database error

Your local XMTP database seems to be corrupted or deleted. This means:

1. All your messages will be lost
2. You will need to create a new installation
3. You will need to sync your message history again

To resolve this:
1. Go to https://community.xmtp.org to revoke an existing installation
2. Refresh this page
3. Try connecting again
4. Consider using the production environment for better message persistence

If you need help, contact XMTP support at community.xmtp.org`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle other errors
      const errorMessage = `❌ Failed to initialize XMTP client. Error: ${err.message}
Please try the following steps:
1. Make sure you are using the same wallet that created the original installations
2. Ensure you have sufficient gas in your wallet
3. If the problem persists, contact XMTP support at community.xmtp.org`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [signer, retryCount]);

  useEffect(() => {
    if (isConnected && !xmtpClient && signer && !isInitializing) {
      initXmtp().catch((err: any) => {
        console.error('Failed to initialize XMTP:', err);
        setError(err.message || 'Failed to initialize XMTP');
      });
    } else if (isConnected && xmtpClient) {
      console.log('XMTP client already initialized');
    }
  }, [isConnected, initXmtp, xmtpClient, signer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (xmtpClient) {
        try {
          // Close any open connections
          xmtpClient.close();
          if (xmtpClient === xmtpSingleton) {
            xmtpSingleton = null;
          }
        } catch (err) {
          console.error('Error closing XMTP client:', err);
        }
      }
    };
  }, [xmtpClient]);

  return { xmtpClient, initXmtp, error, isInitializing };
}
