"use client";

import { ArrowRight, Shield } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function LandingPage() {
  const scrollToVerify = () => {
    const verifySection = document.getElementById("verify-section");
    verifySection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-blue-50">
          <Shield className="h-8 w-8 text-[#2563eb]" />
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-[#111827] mb-6 leading-tight">
          Verify Truth Together
          <br />
          <span className="text-[#2563eb]">with ValidNews</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Decentralized fact-checking powered by blockchain.
          Submit stories, vote on authenticity, and build trust in journalism.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/submit">
            <Button
              size="lg"
              className="bg-[#2563eb] hover:bg-[#1e40af] text-white text-lg px-8 w-full sm:w-auto"
            >
              Submit a Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/feed">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-[#2563eb] text-[#2563eb] hover:bg-blue-50 w-full sm:w-auto"
            >
              View Feed
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="text-4xl font-bold text-[#2563eb] mb-2">100%</div>
            <div className="text-gray-600">Transparent</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-[#2563eb] mb-2">Web3</div>
            <div className="text-gray-600">Blockchain Powered</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-[#2563eb] mb-2">∞</div>
            <div className="text-gray-600">Community Driven</div>
          </div>
        </div>
      </div>
    </section>
  );
}
