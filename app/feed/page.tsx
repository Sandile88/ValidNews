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
  const { vote, isPending, isConfirming } = useValidNewsContract();
  const [stories, setStories] = useState<Story[]>([]);
  const [votedStories, setVotedStories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && userId) {
      fetchStories();
      fetchUserVotes();
    }
  }, [isConnected, userId]);

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

  const handleVote = async (storyId: string, isTrue: boolean): Promise<boolean> => {
    if (!userId || !address) {
      toast.error("Please connect your wallet");
      return false;
    }

    if (votedStories.has(storyId)) {
      toast.error("You have already voted on this story");
      return false;
    }

    const story = stories.find((s) => s.id === storyId);
    if (!story) return false;

    // const votingEndsAt = new Date(story.timestamp + 24 * 60 * 60 * 1000);
    // if (new Date() > votingEndsAt) {
    //   toast.error("Voting period has ended for this story");
    //   return false;
    // }

    // const totalVotes = story.votesTrue + story.votesFalse;
    // if (totalVotes >= MAX_VOTES_PER_STORY) {
    //   toast.error(`Maximum of ${MAX_VOTES_PER_STORY} votes reached for this story`);
    //   return false;
    // }

    try {
      // Get blockchain ID from Supabase
      const { data: storyData , error: storyError} = await supabase
        .from("stories")
        .select("blockchain_id")
        .eq("id", storyId)
        .single();

      if (storyError) {
        console.error("Error fetching story:", storyError);
        toast.error("Error finding story");
        return false;
     }

    console.log("Story blockchain_id:", storyData?.blockchain_id);
    console.log("Type of blockchain_id:", typeof storyData?.blockchain_id);

    // Check if blockchain_id is valid (not 0 or null)
    if (!storyData?.blockchain_id || storyData.blockchain_id === 0) {
      toast.error("Story not ready for voting yet. Blockchain ID missing.");
      return false;
    }


      // Submit vote to blockchain
      toast.info("Submitting vote...");
      
      await vote(storyData.blockchain_id, isTrue);
      
      toast.info("Waiting for confirmation...");
              
      await new Promise(resolve => setTimeout(resolve, 2000));


      // After blockchain confirmation, update Supabase
      const { error: voteError } = await supabase.from("votes").insert([
        {
          story_id: storyId,
          user_id: userId,
          vote: isTrue,
        },
      ]);

      if (voteError) throw voteError;

      const newVotesTrue = isTrue ? story.votesTrue + 1 : story.votesTrue;
      const newVotesFalse = isTrue ? story.votesFalse : story.votesFalse + 1;

      const { error: updateError } = await supabase
        .from("stories")
        .update({
          votes_true: newVotesTrue,
          votes_false: newVotesFalse,
          total_votes: newVotesTrue + newVotesFalse,
        })
        .eq("id", storyId);

      if (updateError) throw updateError;

      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId
            ? {
                ...s,
                votesTrue: newVotesTrue,
                votesFalse: newVotesFalse,
              }
            : s
        )
      );

      setVotedStories((prev) => new Set(prev).add(storyId));
      toast.success("Vote recorded!", {
        description: `You voted: ${isTrue ? "True" : "False"}`,
      });
          
    return true;    
  } catch (error: any) {
      console.error("Error voting:", error);
      toast.error(error?.message || "Failed to record vote. Please try again.");
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
