"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronLeft, ChevronRight, Wallet, FileText, Users, CheckCircle, Shield } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Connect Your Wallet",
    description: "Start by connecting your wallet to access your account information and balances.",
    icon: Wallet,
  },
  {
    number: 2,
    title: "Submit a Story",
    description: "Share news articles or stories that need fact-checking by the community.",
    icon: FileText,
  },
  {
    number: 3,
    title: "Community Votes",
    description: "Members vote on whether the story is true or false based on evidence and sources.",
    icon: Users,
  },
  {
    number: 4,
    title: "Results Verified",
    description: "The community consensus determines the story's verification status on the blockchain.",
    icon: CheckCircle,
  },
  {
    number: 5,
    title: "Truth Preserved",
    description: "Verified results are permanently stored on-chain, creating an immutable record of truth.",
    icon: Shield,
  },
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const previousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple 5-step process for decentralized fact-checking
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between max-w-5xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -translate-y-1/2 hidden sm:block" />

            {steps.map((s, index) => (
              <button
                key={s.number}
                onClick={() => goToStep(index)}
                className={`relative z-10 flex flex-col items-center transition-all ${
                  index === currentStep ? "scale-110" : "scale-100"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all border-2 ${
                    index === currentStep
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-blue-500/50"
                      : index < currentStep
                      ? "bg-white text-[#2563eb] border-[#2563eb]"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                >
                  {s.number}
                </div>
                <span className={`text-sm mt-2 font-medium hidden sm:block ${
                  index === currentStep ? "text-[#2563eb]" : "text-gray-500"
                }`}>
                  Step {s.number}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card className="bg-white border-2 border-gray-200 shadow-lg p-8 sm:p-12 text-center min-h-[280px] flex flex-col justify-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <Icon className="h-10 w-10 text-[#2563eb]" />
            </div>
          </div>

          <h3 className="text-3xl font-bold text-[#111827] mb-4">
            {step.title}
          </h3>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {step.description}
          </p>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={previousStep}
            disabled={currentStep === 0}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            size="lg"
            className="bg-[#2563eb] hover:bg-[#1e40af] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {steps.map((s, index) => (
            <button
              key={s.number}
              onClick={() => goToStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "bg-[#2563eb] w-8" : "bg-gray-300 w-2"
              }`}
              aria-label={`Go to step ${s.number}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
