"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
      {children}
    </OnchainKitProvider>
    </ThemeProvider>
  );
}
