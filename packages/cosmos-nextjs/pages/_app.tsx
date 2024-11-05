import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig, useAccount, useNetwork } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";
import "@interchain-ui/react/styles";
import { SignerOptions, wallets, WalletStatus } from 'cosmos-kit';
import { ChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import {
  Box,
  ThemeProvider,
  useColorModeValue,
  useTheme,
} from '@interchain-ui/react';
import { GasPrice } from "@cosmjs/stargate";
import { Chain, AssetList } from '@chain-registry/types';

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  const { themeClass } = useTheme();
  const signerOptions: SignerOptions = {
    // signingStargate: () => {
    //   return getSigningCosmosClientOptions();
    // }
    signingCosmwasm: (chain: any) => {
      return {
        gasPrice: GasPrice.fromString("0.0025udhp"),
      };
    },
    preferredSignType: (chain: any) => {
      return 'amino';
    },
    
  };

  return (
    <SessionProvider session={pageProps.session}>
      <WagmiConfig config={wagmiConfig}>
        <NextNProgress />
        <RainbowKitProvider
          chains={appChains.chains}
          avatar={BlockieAvatar}
          theme={isDarkTheme ? darkTheme() : lightTheme()}
        >
          <ThemeProvider>
            <ChainProvider
              chains={chains}
              assetLists={assets}
              wallets={wallets}
              walletConnectOptions={{
                signClient: {
                  projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
                  relayUrl: 'wss://relay.walletconnect.org',
                  metadata: {
                    name: 'Cosmos Kit dApp',
                    description: 'Cosmos Kit dApp built by Create Cosmos App',
                    url: 'https://docs.cosmology.zone/cosmos-kit/',
                    icons: [],
                  },
                },
              }}
              // @ts-ignore
              signerOptions={signerOptions}
            >
              <Box
                className={themeClass}
                // minHeight="100dvh"
                backgroundColor={useColorModeValue('$white', '$background')}
              >
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="relative flex flex-col flex-1 bg-white">
                    <Component {...pageProps} />
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </Box>
            </ChainProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

export default ScaffoldEthApp;
