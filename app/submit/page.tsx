"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/WalletContext";
import { FileText, Link as LinkIcon, Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



export default function SubmitPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !link.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast.success("Story submitted successfully!", {
        description: "Your submission is now pending community verification.",
      });

      setTitle("");
      setLink("");
      setIsLoading(false);

      setTimeout(() => {
        router.push("/feed");
      }, 500);
    }, 2000);
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

              <div className="bg-blue-50 border-l-4 border-[#2563eb] p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Your submission will be stored on IPFS and verified by the community through blockchain-powered voting.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white text-lg h-12 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
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
