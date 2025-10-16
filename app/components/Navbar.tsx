"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import WalletWrapper from "./WalletWrapper";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-8 w-8 text-[#2563eb]" />
            <span className="text-2xl font-bold text-[#111827]">
              ValidNews
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              className="hidden sm:flex border border-gray-300"
              onClick={() => {}}
            >
              About
            </Button>
            <WalletWrapper/>
            {/* <Button
              className="bg-[#2563eb] hover:bg-[#1e40af] text-white"
              onClick={() => {}}
            >
              Connect Wallet
            </Button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
