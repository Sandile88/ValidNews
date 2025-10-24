"use client";

import { useState, useEffect } from "react";
import { useAppWallet } from "../context/WalletContext";
import { CircleAlert as AlertCircle, Loader as Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Story } from "../types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useValidNewsContract } from "@/hooks/useValidNewsContract";

const MAX_VOTES_PER_STORY = 20;

export default function FeedPage() {
  const { isConnected, userId, address } = useAppWallet();
  const { vote, isPending, isConfirming, hash } = useValidNewsContract();

  const [stories, setStories] = useState<Story[]>([]);
  const [votedStories, setVotedStories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentVote, setCurrentVote] = useState<{
    storyId: string;
    isTrue: boolean;
  } | null>(null);

  useEffect(() => {
    if (isConnected && userId) {
      fetchStories();
      fetchUserVotes();
    }
  }, [isConnected, userId]);

  useEffect(() => {
    if (currentVote && hash && !isPending && !isConfirming) {
      handleTransactionConfirmed(currentVote.storyId, currentVote.isTrue);
      setCurrentVote(null);
    }
  }, [currentVote, hash, isPending, isConfirming]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedStories = (data || []).map((story: any) => ({
        id: story.id,
        title: story.title,
        link: story.link,
        submittedBy: story.submitted_by,
        timestamp: new Date(story.created_at).getTime(),
        status: story.final_result || "pending",
        votesTrue: story.votes_true,
        votesFalse: story.votes_false,
      }));

      setStories(formattedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("votes")
        .select("story_id")
        .eq("user_id", userId);

      if (error) throw error;

      const votedIds: Set<string> = new Set((data || []).map((v: any) => String(v.story_id)));
      setVotedStories(votedIds);
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const handleTransactionConfirmed = async (storyId: string, isTrue: boolean) => {
    try {
      toast.success("Blockchain confirmation received!");

      const { error: voteError } = await supabase.from("votes").insert([
        {
          story_id: storyId,
          user_id: userId,
          vote: isTrue,
        },
      ]);

      if (voteError) {
        // Check if vote already exists 
        if (voteError.code === "23505") {
          toast.error("You have already voted on this story");
          return;
        }
        throw voteError;
      }

      const { data: currentStory, error: fetchError } = await supabase
        .from("stories")
        .select("votes_true, votes_false")
        .eq("id", storyId)
        .single();

      if (fetchError) throw fetchError;

      const newVotesTrue = isTrue ? currentStory.votes_true + 1 : currentStory.votes_true;
      const newVotesFalse = isTrue ? currentStory.votes_false : currentStory.votes_false + 1;

      const { error: updateError } = await supabase
        .from("stories")
        .update({
          votes_true: newVotesTrue,
          votes_false: newVotesFalse,
          total_votes: newVotesTrue + newVotesFalse,
        })
        .eq("id", storyId);

      if (updateError) throw updateError;

      await fetchStories();
      await fetchUserVotes();

      toast.success("Vote recorded!", {
        description: `You voted: ${isTrue ? "True" : "False"}`,
      });
    } catch (error: any) {
      console.error("Error recording vote:", error);
      toast.error(error?.message || "Failed to record vote");
    }
  };

  const handleVote = async (storyId: string, isTrue: boolean): Promise<boolean> => {
    if (!userId || !address) {
      toast.error("Please connect your wallet");
      return false;
    }

    if (votedStories.has(storyId)) {
      toast.error("You have already voted on this story");
      return false;
    }

    if (currentVote) {
      toast.error("Please wait for the current vote to complete");
      return false;
    }

    const story = stories.find((s) => s.id === storyId);
    if (!story) return false;

    try {
      // Get blockchain ID
      const { data: storyData, error: storyError } = await supabase
        .from("stories")
        .select("blockchain_id")
        .eq("id", storyId)
        .single();

      if (storyError) {
        console.error("Error fetching story:", storyError);
        toast.error("Error finding story");
        return false;
      }

      if (!storyData?.blockchain_id || storyData.blockchain_id === 0) {
        toast.error("Story not ready for voting yet. Blockchain ID missing.");
        return false;
      }

      // Submit vote to blockchain
      toast.info("Submitting vote to blockchain...");
      
      await vote(storyData.blockchain_id, isTrue);
      
      // Store current vote info
      setCurrentVote({
        storyId,
        isTrue,
      });

      toast.info("Waiting for blockchain confirmation...");
      
      return true;
    } catch (error: any) {
      console.error("Error voting:", error);
      
      // Check if it's a blockchain rejection
      if (error?.message?.includes("rejected") || error?.code === 4001) {
        toast.error("Transaction was rejected");
      } else {
        toast.error(error?.message || "Failed to submit vote. Please try again.");
      }
      
      setCurrentVote(null);
      return false;
    }
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#2563eb] mx-auto mb-4" />
            <p className="text-gray-600">Loading stories...</p>
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