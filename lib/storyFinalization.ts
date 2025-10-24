// // lib/storyFinalization.ts
// import { supabase } from "@/lib/supabase";

// const BUILDER_WALLET = "0xYourBuilderWalletAddress"; // Replace with your actual wallet
// const PLATFORM_CUT = 0.40; // 40%
// const VOTERS_CUT = 0.60; // 60%
// const SUBMISSION_FEE = 1.00;
// const REPUTATION_POINTS = 10; // Points awarded to correct voters

// interface Story {
//   id: string;
//   title: string;
//   votes_true: number;
//   votes_false: number;
//   created_at: string;
//   final_result: string | null;
//   submitted_by: string;
//   blockchain_id: number;
// }

// interface Vote {
//   user_id: string;
//   vote: boolean;
// }

// export async function finalizeExpiredStories() {
//   try {
//     // Get all pending stories older than 24 hours
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
//     const { data: expiredStories, error: storiesError } = await supabase
//       .from("stories")
//       .select("*")
//       .is("final_result", null)
//       .lt("created_at", twentyFourHoursAgo);

//     if (storiesError) throw storiesError;
//     if (!expiredStories || expiredStories.length === 0) {
//       console.log("No expired stories to finalize");
//       return;
//     }

//     console.log(`Found ${expiredStories.length} stories to finalize`);

//     for (const story of expiredStories) {
//       await finalizeStory(story);
//     }

//   } catch (error) {
//     console.error("Error finalizing expired stories:", error);
//   }
// }

// async function finalizeStory(story: Story) {
//   try {
//     const totalVotes = story.votes_true + story.votes_false;
    
//     // Determine the result
//     let finalResult: "true" | "false" | "pending";
    
//     if (totalVotes === 0) {
//       // No votes - default to false
//       finalResult = "false";
//     } else {
//       finalResult = story.votes_true > story.votes_false ? "true" : "false";
//     }

//     console.log(`Finalizing story ${story.id}: ${finalResult}`);

//     // Update story status
//     const { error: updateError } = await supabase
//       .from("stories")
//       .update({
//         final_result: finalResult,
//         finalized_at: new Date().toISOString(),
//       })
//       .eq("id", story.id);

//     if (updateError) throw updateError;

//     // If there were votes, distribute rewards
//     if (totalVotes > 0) {
//       await distributeRewards(story, finalResult);
//     }

//   } catch (error) {
//     console.error(`Error finalizing story ${story.id}:`, error);
//   }
// }

// async function distributeRewards(story: Story, finalResult: "true" | "false") {
//   try {
//     // Get all votes for this story
//     const { data: votes, error: votesError } = await supabase
//       .from("votes")
//       .select("user_id, vote")
//       .eq("story_id", story.id);

//     if (votesError) throw votesError;
//     if (!votes || votes.length === 0) return;

//     // Filter correct voters
//     const correctVotes = votes.filter((v: Vote) => 
//       (finalResult === "true" && v.vote === true) || 
//       (finalResult === "false" && v.vote === false)
//     );

//     const correctVoterCount = correctVotes.length;
//     console.log(`Story ${story.id}: ${correctVoterCount} correct voters out of ${votes.length} total`);

//     if (correctVoterCount === 0) {
//       // No correct voters - all fees go to platform
//       await distributeToPlatform(story.id, SUBMISSION_FEE, story.submitted_by);
//       return;
//     }

//     // Calculate distributions
//     const platformAmount = SUBMISSION_FEE * PLATFORM_CUT;
//     const votersPool = SUBMISSION_FEE * VOTERS_CUT;
//     const rewardPerVoter = votersPool / correctVoterCount;

//     // Distribute to platform
//     await distributeToPlatform(story.id, platformAmount, story.submitted_by);

//     // Distribute to correct voters and award reputation
//     for (const vote of correctVotes) {
//       await distributeToVoter(story.id, vote.user_id, rewardPerVoter);
//       await awardReputationPoints(vote.user_id, REPUTATION_POINTS);
//     }

//   } catch (error) {
//     console.error(`Error distributing rewards for story ${story.id}:`, error);
//   }
// }

// async function distributeToPlatform(storyId: string, amount: number, submitterId: string) {
//   try {
//     // Record transaction for platform
//     const { error } = await supabase
//       .from("transactions")
//       .insert([
//         {
//           user_id: BUILDER_WALLET,
//           story_id: storyId,
//           amount: amount,
//           type: "platform_fee",
//           description: `Platform fee from story ${storyId}`,
//         },
//       ]);

//     if (error) throw error;
//     console.log(`Platform received $${amount.toFixed(2)} from story ${storyId}`);
//   } catch (error) {
//     console.error("Error distributing to platform:", error);
//   }
// }

// async function distributeToVoter(storyId: string, userId: string, amount: number) {
//   try {
//     // Record transaction for voter
//     const { error } = await supabase
//       .from("transactions")
//       .insert([
//         {
//           user_id: userId,
//           story_id: storyId,
//           amount: amount,
//           type: "voting_reward",
//           description: `Reward for correct vote on story ${storyId}`,
//         },
//       ]);

//     if (error) throw error;
//     console.log(`Voter ${userId} received $${amount.toFixed(2)} from story ${storyId}`);
//   } catch (error) {
//     console.error(`Error distributing to voter ${userId}:`, error);
//   }
// }

// async function awardReputationPoints(userId: string, points: number) {
//   try {
//     // Get current reputation
//     const { data: user, error: fetchError } = await supabase
//       .from("users")
//       .select("reputation_points")
//       .eq("id", userId)
//       .single();

//     if (fetchError) throw fetchError;

//     const currentPoints = user?.reputation_points || 0;
//     const newPoints = currentPoints + points;

//     // Update reputation
//     const { error: updateError } = await supabase
//       .from("users")
//       .update({ reputation_points: newPoints })
//       .eq("id", userId);

//     if (updateError) throw updateError;
//     console.log(`Awarded ${points} reputation points to user ${userId} (total: ${newPoints})`);
//   } catch (error) {
//     console.error(`Error awarding reputation to user ${userId}:`, error);
//   }
// }