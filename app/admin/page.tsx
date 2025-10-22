"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppWallet } from "../context/WalletContext";
import { CircleAlert as AlertCircle, Loader as Loader2, Trophy, CircleCheck as CheckCircle, CircleX as XCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminPage() {
  const router = useRouter();
  const { isConnected, isAdmin, userId } = useAppWallet();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingStoryId, setProcessingStoryId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && isAdmin) {
      fetchPendingStories();
    } else if (isConnected && !isAdmin) {
      router.push("/");
    }
  }, [isConnected, isAdmin]);

  const fetchPendingStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .in("status", ["voting", "tallied"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const canTally = (story: any) => {
    const votingEndsAt = new Date(story.voting_ends_at);
    return new Date() > votingEndsAt && story.status === "voting";
  };

  const tallyVotes = async (storyId: string) => {
    setProcessingStoryId(storyId);

    try {
      const story = stories.find((s) => s.id === storyId);
      if (!story) return;

      const finalResult = story.votes_true > story.votes_false ? "true" : "false";

      const { error } = await supabase
        .from("stories")
        .update({
          status: "tallied",
          final_result: finalResult,
        })
        .eq("id", storyId);

      if (error) throw error;

      toast.success(`Votes tallied! Result: ${finalResult.toUpperCase()}`);
      fetchPendingStories();
    } catch (error) {
      console.error("Error tallying votes:", error);
      toast.error("Failed to tally votes");
    } finally {
      setProcessingStoryId(null);
    }
  };

  const distributeRewards = async (storyId: string) => {
    setProcessingStoryId(storyId);

    try {
      const story = stories.find((s) => s.id === storyId);
      if (!story || story.status !== "tallied") {
        toast.error("Story must be tallied first");
        return;
      }

      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("*")
        .eq("story_id", storyId);

      if (votesError) throw votesError;

      const correctVote = story.final_result === "true";
      const correctVoters = votes.filter((v: any) => v.vote === correctVote);
      const incorrectVoters = votes.filter((v: any) => v.vote !== correctVote);

      const submissionFee = story.submission_fee;
      const votersPool = submissionFee * 0.6;
      const adminFee = submissionFee * 0.4;
      const rewardPerVoter = correctVoters.length > 0 ? votersPool / correctVoters.length : 0;

      for (const voter of correctVoters) {
        const { data: userData } = await supabase
          .from("users")
          .select("reputation_points, earnings")
          .eq("id", voter.user_id)
          .single();

        if (userData) {
          await supabase
            .from("users")
            .update({
              reputation_points: userData.reputation_points + 2,
              earnings: parseFloat(userData.earnings) + rewardPerVoter,
            })
            .eq("id", voter.user_id);

          await supabase.from("transactions").insert([
            {
              user_id: voter.user_id,
              story_id: storyId,
              amount: rewardPerVoter,
              type: "vote_reward",
            },
          ]);
        }
      }

      for (const voter of incorrectVoters) {
        const { data: userData } = await supabase
          .from("users")
          .select("reputation_points")
          .eq("id", voter.user_id)
          .single();

        if (userData && userData.reputation_points >= 5) {
          await supabase
            .from("users")
            .update({
              reputation_points: userData.reputation_points - 1,
            })
            .eq("id", voter.user_id);
        }
      }

      const { data: adminData } = await supabase
        .from("users")
        .select("earnings")
        .eq("id", userId)
        .single();

      if (adminData) {
        await supabase
          .from("users")
          .update({
            earnings: parseFloat(adminData.earnings) + adminFee,
          })
          .eq("id", userId);

        await supabase.from("transactions").insert([
          {
            user_id: userId!,
            story_id: storyId,
            amount: adminFee,
            type: "admin_fee",
          },
        ]);
      }

      await supabase
        .from("stories")
        .update({ status: "distributed" })
        .eq("id", storyId);

      toast.success("Rewards distributed successfully!", {
        description: `${correctVoters.length} correct voters rewarded`,
      });

      fetchPendingStories();
    } catch (error) {
      console.error("Error distributing rewards:", error);
      toast.error("Failed to distribute rewards");
    } finally {
      setProcessingStoryId(null);
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
                Please connect your wallet to access the admin dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Alert className="border-2 border-red-500 bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-base text-red-700 ml-2">
                Access denied. This page is only accessible to administrators.
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
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#2563eb] mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Trophy className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-[#111827] mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Tally votes and distribute rewards</p>
          </div>

          {stories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No pending stories to process</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {stories.map((story) => {
                const votingEndsAt = new Date(story.voting_ends_at);
                const hasEnded = new Date() > votingEndsAt;
                const timeLeft = votingEndsAt.getTime() - new Date().getTime();
                const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
                const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

                return (
                  <Card key={story.id} className="border-2">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                          <CardDescription>
                            Submitted: {new Date(story.created_at).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            story.status === "distributed"
                              ? "bg-green-100 text-green-800"
                              : story.status === "tallied"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {story.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-700">{story.votes_true}</span>
                          </div>
                          <p className="text-sm text-gray-600">True Votes</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="text-2xl font-bold text-red-700">{story.votes_false}</span>
                          </div>
                          <p className="text-sm text-gray-600">False Votes</p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span className="text-2xl font-bold text-blue-700">{story.total_votes}</span>
                          </div>
                          <p className="text-sm text-gray-600">Total Votes</p>
                        </div>
                      </div>

                      {!hasEnded && story.status === "voting" && (
                        <Alert className="bg-amber-50 border-amber-200">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="ml-2 text-amber-800">
                            Voting ends in {hoursLeft}h {minutesLeft}m
                          </AlertDescription>
                        </Alert>
                      )}

                      {story.final_result && (
                        <Alert className={story.final_result === "true" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                          <AlertDescription className={story.final_result === "true" ? "text-green-800" : "text-red-800"}>
                            Final Result: <strong>{story.final_result.toUpperCase()}</strong>
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-3">
                        {canTally(story) && (
                          <Button
                            onClick={() => tallyVotes(story.id)}
                            disabled={processingStoryId === story.id}
                            className="flex-1 bg-[#2563eb] hover:bg-[#1e40af]"
                          >
                            {processingStoryId === story.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Tallying...
                              </>
                            ) : (
                              "Tally Votes"
                            )}
                          </Button>
                        )}

                        {story.status === "tallied" && (
                          <Button
                            onClick={() => distributeRewards(story.id)}
                            disabled={processingStoryId === story.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {processingStoryId === story.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Distributing...
                              </>
                            ) : (
                              "Distribute Rewards"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
