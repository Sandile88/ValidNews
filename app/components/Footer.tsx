"use client";

import { CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-[#2563eb]" />
            <span className="text-xl font-bold text-[#111827]">ValidNews</span>
          </div>
          <p className="text-gray-600 text-sm max-w-md">
            Decentralized fact-checking powered by blockchain technology.
            Building trust in journalism through community verification.
          </p>
          <p className="text-sm text-gray-500 pt-4">
            &copy; {new Date().getFullYear()} ValidNews. Built on Base.
          </p>
        </div>
      </div>
    </footer>
  );
}
