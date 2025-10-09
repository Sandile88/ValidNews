'use client';

import Link from 'next/link';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-validnews-surface shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ValidNews</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/submit"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Submit
            </Link>
            <Link
              href="/browse"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Browse
            </Link>

            {account ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">
                  {formatAddress(account)}
                </span>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
