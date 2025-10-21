"use client";

import { useState } from "react";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Story } from "../types";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "../context/WalletContext";


const DUMMY_STORIES: Story[] = [
  {
    id: "1",
    title: "New Renewable Energy Initiative Launches in Major City",
    link: "https://example.com/renewable-energy",
    submittedBy: "0x1234...5678",
    timestamp: Date.now() - 3600000,
    status: "true",
    votesTrue: 24,
    votesFalse: 3,
  },
  {
    id: "2",
    title: "Breaking: Tech Company Announces Revolutionary AI Product",
    link: "https://example.com/ai-announcement",
    submittedBy: "0x8765...4321",
    timestamp: Date.now() - 7200000,
    status: "pending",
    votesTrue: 12,
    votesFalse: 8,
  },
  {
    id: "3",
    title: "Celebrity Endorses Questionable Investment Scheme",
    link: "https://example.com/celebrity-scam",
    submittedBy: "0xabcd...ef01",
    timestamp: Date.now() - 10800000,
    status: "false",
    votesTrue: 5,
    votesFalse: 31,
  },
];

export default function FeedPage() {
  const { isConnected } = useWallet();
  const [stories, setStories] = useState<Story[]>(
    DUMMY_STORIES.sort((a, b) => b.timestamp - a.timestamp)
  );
  const [votedStories, setVotedStories] = useState<Set<string>>(new Set());

  const handleVote = (storyId: string, isTrue: boolean) => {
    if (votedStories.has(storyId)) {
      toast.error("You have already voted on this story");
      return;
    }

    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          if (isTrue) {
            return { ...story, votesTrue: story.votesTrue + 1 };
          } else {
            return { ...story, votesFalse: story.votesFalse + 1 };
          }
        }
        return story;
      })
    );

    setVotedStories((prev) => new Set(prev).add(storyId));
    toast.success("Vote recorded successfully!");
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Alert className="border-2 border-[#2563eb] bg-blue-50">
              <AlertCircle className="h-5 w-5 text-[#2563eb]" />
              <AlertDescription className="text-base text-gray-700 ml-2">
                Please connect your wallet to be able to use the functionalities of this app.
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
      <div className="min-h-screen bg-gray-50">
        <Feed stories={stories} onVote={handleVote} />
      </div>
      <Footer />
    </>
  );
}
