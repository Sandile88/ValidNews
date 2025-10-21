"use client";

import { useState } from "react";
import Feed from "../components/Feed";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Story } from "../types";

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
  const [stories, setStories] = useState<Story[]>(DUMMY_STORIES);

  const handleVote = (storyId: string, isTrue: boolean) => {
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
  };

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
