"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAccount } from "wagmi"; 
import { supabase, User } from "@/lib/supabase";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  userId: string | null;
  userData: User | null;
  isAdmin: boolean;
  refreshUserData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount(); // 👈 from wagmi
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchOrCreateUser(address);
    } else {
      setUserId(null);
      setUserData(null);
    }
  }, [isConnected, address]);

  const fetchOrCreateUser = async (walletAddress: string) => {
    try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .maybeSingle();

       if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return null;
    }

    if (existingUser) {
      setUserData(existingUser);
      setUserId(existingUser.id);
      return existingUser;
    }

    const { data: newUser,error: insertError } = await supabase
      .from("users")
      .insert([{ wallet_address: walletAddress }])
      .select()
      .single();

    
    if (insertError) {
      console.error("Error creating user:", {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code,
      });
      return null;
    }

    setUserData(newUser);
    setUserId(newUser.id);
    return newUser;
  } catch (err) {
    console.error("Unexpected error in fetchOrCreateUser:", err);
    return null;
  }
};

  const refreshUserData = async () => {
    if (!address) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", address)
      .maybeSingle();

    if (data) {
      setUserData(data);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address: address || null,
        isConnected: !!isConnected,
        userId,
        userData,
        isAdmin: userData?.is_admin || false,
        refreshUserData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useAppWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useAppWallet must be used within a WalletProvider");
  }
  return context;
}