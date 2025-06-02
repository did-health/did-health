import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './lib/wagmiConfig'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './lib/i18n'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
