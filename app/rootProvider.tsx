"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
// import { baseSepolia } from "wagmi/chains";
import { baseSepolia } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WalletProvider } from "./context/WalletContext";
import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { coinbaseWallet } from 'wagmi/connectors';

// Create Wagmi config that ONLY supports Base Sepolia
const wagmiConfig = createConfig({
  chains: [baseSepolia], // Only Base Sepolia is available
  connectors: [
    coinbaseWallet({
      appName: 'ValidNews',
      preference: 'all',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
  return (
  <WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
  <ThemeProvider 
   attribute="class" 
      defaultTheme="light" 
      enableSystem={false}  
      disableTransitionOnChange 
      >
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: "auto",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
      }}
    >
      <WalletProvider>
        {children}
      </WalletProvider>
    </OnchainKitProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </WagmiProvider>
  );
}
