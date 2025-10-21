"use client";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";


export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingPage />
        <HowItWorks/>
      </main>
      <Footer />
    </div>
  );
}
