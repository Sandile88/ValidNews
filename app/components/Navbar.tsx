"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleCheck as CheckCircle2, Star, DollarSign, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAppWallet } from "../context/WalletContext";
import WalletWrapper from "./WalletWrapper";

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected, userData, isAdmin } = useAppWallet();

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
            {isConnected && userData && (
              <div className="hidden md:flex items-center space-x-3 mr-2">
                <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <Star className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">
                    {userData.reputation_points}
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">
                    {parseFloat(userData.earnings.toString()).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

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

            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant={pathname === "/admin" ? "default" : "ghost"}
                  className={pathname === "/admin" ? "bg-[#2563eb] hover:bg-[#1e40af] text-white" : "text-amber-600 hover:text-amber-700"}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}

            <WalletWrapper />
          </div>
        </div>
      </div>
    </nav>
  );
}
