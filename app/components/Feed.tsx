"use client";

import { ThumbsUp, ThumbsDown, ExternalLink, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Story } from "../types";

interface FeedProps {
  stories: Story[];
  onVote: (storyId: string, isTrue: boolean) => void;
}

export default function Feed({ stories, onVote }: FeedProps) {
  const handleVote = (storyId: string, isTrue: boolean) => {
    onVote(storyId, isTrue);
    toast.success(`Vote recorded!`, {
      description: `You voted: ${isTrue ? "True" : "False"}`,
    });
  };

  const getStatusColor = (status: Story["status"]) => {
    switch (status) {
      case "true":
        return "bg-[#22c55e] hover:bg-[#16a34a] text-white";
      case "false":
        return "bg-[#ef4444] hover:bg-[#dc2626] text-white";
      default:
        return "bg-[#facc15] hover:bg-[#eab308] text-[#111827]";
    }
  };

  const getStatusText = (status: Story["status"]) => {
    switch (status) {
      case "true":
        return "Verified True";
      case "false":
        return "Verified False";
      default:
        return "Pending";
    }
  };

  const calculatePercentage = (story: Story) => {
    const total = story.votesTrue + story.votesFalse;
    if (total === 0) return { truePercent: 0, falsePercent: 0 };
    const truePercent = Math.round((story.votesTrue / total) * 100);
    const falsePercent = Math.round((story.votesFalse / total) * 100);
    return { truePercent, falsePercent };
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (stories.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xl text-gray-500">No stories yet. Be the first to submit one!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#111827] mb-4">
            Community Feed
          </h2>
          <p className="text-lg text-gray-600">
            Vote on stories to help verify their authenticity
          </p>
        </div>

        <div className="space-y-6">
          {stories.map((story) => {
            const { truePercent, falsePercent } = calculatePercentage(story);
            const totalVotes = story.votesTrue + story.votesFalse;

            return (
              <Card
                key={story.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#111827] mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimestamp(story.timestamp)}
                        </span>
                        <span>By: {story.submittedBy}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(story.status)} px-3 py-1`}>
                      {getStatusText(story.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-[#22c55e]">True: {truePercent}%</span>
                      <span className="text-[#ef4444]">False: {falsePercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e] transition-all duration-300"
                        style={{ width: `${truePercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                    </p>
                  </div>

                  <a
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#2563eb] hover:text-[#1e40af] text-sm font-medium transition-colors"
                  >
                    View Source
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t pt-4">
                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={() => handleVote(story.id, true)}
                      className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white"
                      size="lg"
                    >
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      True ({story.votesTrue})
                    </Button>
                    <Button
                      onClick={() => handleVote(story.id, false)}
                      className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white"
                      size="lg"
                    >
                      <ThumbsDown className="mr-2 h-5 w-5" />
                      False ({story.votesFalse})
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
