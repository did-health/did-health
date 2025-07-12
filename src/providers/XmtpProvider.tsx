import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client, type Signer, type Identifier } from '@xmtp/browser-sdk';
import { JsonRpcProvider } from 'ethers';
import { Buffer } from 'buffer';

interface XmtpContextType {
  xmtpClient: Client | null;
  initXmtp: (signer: Signer) => Promise<Client>;
  error: string | null;
  isInitializing: boolean;
}

const XmtpContext = createContext<XmtpContextType | undefined>(undefined);

let xmtpSingleton: Client | null = null;

export function XmtpProvider({ children }: { children: React.ReactNode }) {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initXmtp = useCallback(async (signer: Signer): Promise<Client> => {
    try {
      if (xmtpSingleton) {
        console.log('Using existing XMTP client singleton');
        setXmtpClient(xmtpSingleton);
        return xmtpSingleton;
      }

      setIsInitializing(true);
      console.log('Initializing new XMTP client...');

      const client = await Client.create(signer, {
        env: 'dev',
        loggingLevel: 'info',
      });

      // Store in singleton
      xmtpSingleton = client;
      setXmtpClient(client);
      setIsInitializing(false);

      // Check installation status
      try {
        const installationId = client.installationId;
        console.log('XMTP installation ID:', installationId);
      } catch (err: any) {
        console.warn('Failed to get installation ID:', err);
      }

      return client;
    } catch (err: any) {
      console.error('XMTP initialization error:', err);
      
      // Handle installation limit errors
      if (err.message.includes('already registered 5/5 installations')) {
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

      // Handle other errors
      const errorMessage = `❌ Failed to initialize XMTP client. Error: ${err.message}
Please try the following steps:
1. Make sure you are using the same wallet that created the original installations
2. Ensure you have sufficient gas in your wallet
3. If the problem persists, contact XMTP support at community.xmtp.org`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (xmtpClient) {
        try {
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

  return (
    <XmtpContext.Provider value={{ xmtpClient, initXmtp, error, isInitializing }}>
      {children}
    </XmtpContext.Provider>
  );
}

export function useXmtp() {
  const context = useContext(XmtpContext);
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider');
  }
  return context;
}
