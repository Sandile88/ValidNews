"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import WalletWrapper from "./WalletWrapper";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();


  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <CheckCircle2 className="h-8 w-8 text-[#2563eb]" />
            <span className="text-2xl font-bold text-[#111827]">
              ValidNews
            </span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/submit">
              <Button
                variant={pathname === "/submit" ? "default" : "ghost"}
                className={pathname === "/submit" ? "bg-[#2563eb] hover:bg-[#1e40af] text-white" : ""}
              >
                Submit
              </Button>
            </Link>

            <Link href="/feed">
              <Button
                variant={pathname === "/feed" ? "default" : "ghost"}
                className={pathname === "/feed" ? "bg-[#2563eb] hover:bg-[#1e40af] text-white" : ""}
              >
                Feed
              </Button>
            </Link>

            <WalletWrapper />
          </div>
        </div>
      </div>
    </nav>
  );
}
