"use client";

import { CheckCircle2, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-[#2563eb]" />
              <span className="text-xl font-bold text-[#111827]">ValidNews</span>
            </div>
            <p className="text-gray-600 text-sm">
              Decentralized fact-checking powered by blockchain technology.
              Building trust in journalism through community verification.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111827] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-[#2563eb] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563eb] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563eb] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2563eb] transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#111827] mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#2563eb] hover:text-white flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#2563eb] hover:text-white flex items-center justify-center transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ValidNews. Built on Base.
          </p>
        </div>
      </div>
    </footer>
  );
}
