import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './lib/wagmiConfig';
import '@rainbow-me/rainbowkit/styles.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

import App from './App';
import './index.css';
import './styles/fonts.css'
const queryClient = new QueryClient();
const endpoint = 'https://api.devnet.solana.com'; // or mainnet URL

const solanaWallets = [new PhantomWalletAdapter()];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={solanaWallets} autoConnect>
            <WagmiProvider config={wagmiConfig}>
              <RainbowKitProvider>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </RainbowKitProvider>
            </WagmiProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
