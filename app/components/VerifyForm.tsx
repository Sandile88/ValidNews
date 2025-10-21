"use client";

import { useState } from "react";
import { FileText, Link as LinkIcon, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { Story } from "../types";

interface VerifyFormProps {
  onSubmit: (story: Omit<Story, "id" | "timestamp" | "votesTrue" | "votesFalse">) => void;
}

export default function VerifyForm({ onSubmit }: VerifyFormProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !link.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newStory = {
      title: title.trim(),
      link: link.trim(),
      submittedBy: "0x0000...0000",
      status: "pending" as const,
    };

    onSubmit(newStory);

    toast.success("Story submitted successfully!", {
      description: "Your submission is now pending community verification.",
    });

    setTitle("");
    setLink("");
  };

  return (
    <section id="verify-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mx-auto mb-4">
              <Upload className="h-6 w-6 text-[#2563eb]" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#111827]">
              Submit a Story
            </CardTitle>
            <CardDescription className="text-base">
              Help verify truth by submitting news stories for community fact-checking
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
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white text-lg h-12"
              >
                Submit for Verification
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
