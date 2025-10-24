"use client";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import { MiniAppReady } from "./components/MiniAppReady";


export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <MiniAppReady/>
        <LandingPage />
        <HowItWorks/>
      </main>
      <Footer />
    </div>
  );
}

// Create app/.well-known/farcaster.json/route.ts:
