import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Navbar } from "../components_new/navbar";
// import { BottomBar } from "../components_new/bottom";
import { slide as Menu } from "react-burger-menu";
import { Sidebar } from "../components_new/Sidebar";
import { BottomBar } from "../components_new/bottom";
import { coinbaseWallet, embeddedWallet, metamaskWallet, rainbowWallet, smartWallet, trustWallet, walletConnect } from "@thirdweb-dev/react";
import '../components_new/Sidebar.css';
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const activeChain = "sepolia";


function MyApp({ Component, pageProps }: AppProps) {
  // const smartWalletConfig = {
  //   factoryAddress: "0xb073ab62195b46fd43ae74e86fb978f0a234d94b",
  //   gasless: true,
  // };
  
  return (
    <QueryClientProvider client={queryClient}>
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
              metamaskWallet(),
              coinbaseWallet(),
              walletConnect(),
              rainbowWallet(),
              trustWallet(),
            ]}
    >
      
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
        <BottomBar />
      </ChakraProvider>
    </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
