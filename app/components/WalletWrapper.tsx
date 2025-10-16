"use client";

import { Wallet } from "@coinbase/onchainkit/wallet";

export default function WalletWrapper() {
   return (
      <div className="wallet-wrapper">
      <Wallet />
    </div>
   )
}
