'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Wallet, LogOut, User } from 'lucide-react';

export default function WalletConnect({ fullWidth = false, size = 'md' }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [isLoading, setIsLoading] = useState(false);

  // Set frame ready when component mounts
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Try to connect with the first available connector (usually Farcaster)
      if (connectors.length > 0) {
        await connect({ connector: connectors[0], chainId: baseSepolia.id });
        try {
          await switchChainAsync({ chainId: baseSepolia.id });
        } catch (_) {}
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && chainId !== baseSepolia.id) {
      switchChainAsync({ chainId: baseSepolia.id }).catch(() => {});
    }
  }, [isConnected, chainId, switchChainAsync]);

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const sizeClass = size === 'lg' ? 'h-12 px-6 text-base' : 'px-6 py-2';

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">
              {formatAddress(address)}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-4 h-4" />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
} 