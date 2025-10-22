"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WalletProvider } from "./context/WalletContext";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
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
  );
}
