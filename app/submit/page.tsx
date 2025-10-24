"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppWallet } from "../context/WalletContext";
import { useValidNewsContract } from "@/hooks/useValidNewsContract";
import { FileText, Link as LinkIcon, Upload, Loader as Loader2, CircleAlert as AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import ValidNewsABI from '@/contracts/validnews.json';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';

const SUBMISSION_FEE = 1.00;

export default function SubmitPage() {
  const router = useRouter();
  const { isConnected, userId, address } = useAppWallet();
  const { submitStory, isPending, isConfirming, isConfirmed, hash } = useValidNewsContract();
  
  // Add transaction receipt waiting
  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash,
  });

  // Read storyCount from blockchain
  const { data: storyCount, refetch: refetchStoryCount } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.validnews as `0x${string}`,
    abi: ValidNewsABI,
    functionName: 'storyCount',
  });

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedStoryData, setSubmittedStoryData] = useState<{title: string, link: string, userId: string} | null>(null);

  // Effect to handle post-transaction confirmation
  useEffect(() => {
    const saveStoryToSupabase = async () => {
      if (!receipt || !submittedStoryData) return;

      try {
        // Wait a bit for the blockchain state to update
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refetch the latest story count from blockchain
        const { data: newStoryCount } = await refetchStoryCount();
        const blockchainId = Number(newStoryCount) - 1; // The new story is at (count - 1)
        
        console.log("Transaction confirmed! New story count:", newStoryCount);
        console.log("Assigned blockchain ID:", blockchainId);

        // Store in Supabase with the correct blockchain ID
        const { data: story, error: storyError } = await supabase
          .from("stories")
          .insert([
            {
              title: submittedStoryData.title,
              link: submittedStoryData.link,
              submitted_by: submittedStoryData.userId,
              submission_fee: SUBMISSION_FEE,
              blockchain_id: blockchainId,
            },
          ])
          .select()
          .single();

        if (storyError) throw storyError;

        const { error: transactionError } = await supabase
          .from("transactions")
          .insert([
            {
              user_id: submittedStoryData.userId,
              story_id: story.id,
              amount: -SUBMISSION_FEE,
              type: "submission_fee",
            },
          ]);

        if (transactionError) throw transactionError;

        toast.success("Story submitted successfully!", {
          description: `Story ID: ${blockchainId}. $${SUBMISSION_FEE} submission fee applied.`,
        });

        setTitle("");
        setLink("");
        setSubmittedStoryData(null);

        setTimeout(() => {
          router.push("/feed");
        }, 1000);

      } catch (error: any) {
        console.error("Error saving story to database:", error);
        toast.error("Failed to save story to database: " + error.message);
        setSubmittedStoryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (receipt && submittedStoryData) {
      saveStoryToSupabase();
    }
  }, [receipt, submittedStoryData, refetchStoryCount, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !link.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!userId || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);

    try {
      // Store the story data for later use after transaction confirmation
      setSubmittedStoryData({
        title: title.trim(),
        link: link.trim(),
        userId
      });

      // Submit to blockchain
      toast.info("Please confirm the transaction in your wallet...");
      
      const ipfsHash = `ipfs://${Date.now()}`;
      const summary = title.trim();
      
      await submitStory(ipfsHash, summary);
      
      toast.info("Transaction submitted! Waiting for confirmation...");

    } catch (error: any) {
      console.error("Error submitting story:", error);
      setSubmittedStoryData(null);

      if (error?.message?.includes("User rejected") || error?.code === 4001) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error(error?.message || "Failed to submit story. Please try again.");  
      }  
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Alert className="border-2 border-[#2563eb] bg-blue-50">
              <AlertCircle className="h-5 w-5 text-[#2563eb]" />
              <AlertDescription className="text-base text-gray-700 ml-2">
                Please connect your wallet to submit stories.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#111827] mb-4">
            Submit a Story
          </h1>
          <p className="text-lg text-gray-600">
            Help verify truth by submitting news stories for community fact-checking
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mx-auto mb-4">
              <Upload className="h-8 w-8 text-[#2563eb]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#111827]">
              Story Details
            </CardTitle>
            <CardDescription className="text-base">
              Provide the headline and source link for verification
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Story Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter the headline or story title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-base font-semibold flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Story Link
                </Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com/news-article"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-[#2563eb] p-4 rounded space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Submission Fee:</strong> $1.00 - 60% distributed to correct voters, 40% to platform
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Community has 24 hours to vote. Up to 20 votes allowed per story.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || isPending || isConfirming || !!submittedStoryData}
                className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white text-lg h-12 disabled:opacity-50"
              >
                {(isLoading || isPending || isConfirming || !!submittedStoryData) ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isPending && "Confirm in wallet..."}
                    {(isConfirming || !!submittedStoryData) && "Confirming..."}
                    {isLoading && !isPending && !isConfirming && "Submitting..."}
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
}