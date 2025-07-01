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

export function useXmtp({ address, walletClient, isConnected }: XmtpConfig) {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize the signer to prevent recreation
  const signer = useMemo<Signer | null>(() => {
    if (!address || !walletClient) return null;
    
    const provider = new JsonRpcProvider(walletClient);
    const walletSigner = provider.getSigner(address);
    
    // First check if we can get the address
    try {
      walletSigner.getAddress().then(addr => {
        if (!addr) {
          throw new Error('No wallet address found');
        }
      }).catch(err => {
        console.error('Failed to get wallet address:', err);
        setError(`❌ Failed to get wallet address: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return null;
      });
    } catch (err) {
      console.error('Failed to get wallet address:', err);
      setError(`❌ Failed to get wallet address: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }

    const getIdentifier = async (): Promise<Identifier> => {
      try {
        const addr = await walletSigner.getAddress();
        return {
          identifier: addr.toLowerCase(),
          identifierKind: 'Ethereum' as const
        };
      } catch (err) {
        console.error('Failed to get wallet address:', err);
        throw new Error(`Failed to get wallet address: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    const signMessage = async (message: string | Uint8Array): Promise<Buffer> => {
      try {
        const signature = await walletSigner.signMessage(typeof message === 'string' ? message : Buffer.from(message).toString('hex'));
        return Buffer.from(signature.slice(2), 'hex');
      } catch (err) {
        console.error('Failed to sign message:', err);
        throw new Error(`Failed to sign message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    const getChainId = (): bigint => {
      try {
        return BigInt(provider._network.chainId);
      } catch (err) {
        console.error('Failed to get chain ID:', err);
        throw new Error(`Failed to get chain ID: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    return { 
      getIdentifier, 
      signMessage, 
      getChainId, 
      type: 'SCW' as const 
    } as Signer;
  }, [address, walletClient]);

  const initXmtp = useCallback(async (): Promise<Client> => {
    if (!signer) throw new Error('Wallet not ready');
    
    try {
      // First try to create client without revoking
      console.log('Attempting to initialize XMTP client...');
      const client = await Client.create(signer);
      console.log('XMTP client initialized successfully');
      setXmtpClient(client);
      setRetryCount(0);
      return client;
    } catch (err: any) {
      console.error('XMTP initialization error:', err);
      
      // Handle file system access errors
      if (err.message.includes('NoModificationAllowedError')) {
        console.log('Waiting for file system access...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit before retrying
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying XMTP initialization (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          return initXmtp();
        }
      }
      
      // Handle installation limit errors
      if (err.message.includes('already registered 5/5 installations')) {
        console.log('Attempting to reuse existing installation...');
        try {
          // First try to create a new client
          const newClient = await Client.create(signer);
          console.log('Successfully reused existing installation');
          setXmtpClient(newClient);
          return newClient;
        } catch (revokeErr: any) {
          console.error('Failed to reuse installation:', revokeErr);
          const errorMessage = `❌ Failed to initialize XMTP client. Error: ${revokeErr.message}

You've reached the maximum number of installations (5) for this XMTP inbox. Please follow these steps:

1. Go to https://community.xmtp.org to revoke an existing installation
2. After revoking an installation, refresh this page
3. Try connecting again

If you need help, contact XMTP support at community.xmtp.org`;
          setError(errorMessage);
          throw new Error(errorMessage);
        }
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
    if (isConnected && !xmtpClient && signer) {
      initXmtp().catch((err: any) => {
        console.error('Failed to initialize XMTP:', err);
        setError(err.message || 'Failed to initialize XMTP');
      });
    } else if (isConnected && xmtpClient) {
      console.log('XMTP client already initialized');
    }
  }, [isConnected, initXmtp, xmtpClient, signer]);

  return { xmtpClient, initXmtp, error };
}
