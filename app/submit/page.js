'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUp, AlertCircle } from 'lucide-react';

// Mock data service
const mockDataService = {
  submitClaim: async (claimData) => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: { ...claimData, id: Date.now() },
      error: null
    };
  }
};

export default function SubmitClaim() {
  const router = useRouter();
  const { account } = useWeb3();
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setIpfsHash(mockHash);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!summary.trim()) {
      setError('Please enter a claim summary');
      return;
    }

    setLoading(true);

    try {
        const { data, error: submitError } = await mockDataService.submitClaim({
        summary: summary.trim(),
        ipfs_hash: ipfsHash || null,
        wallet_address: account,
      });
      if (submitError) throw submitError;

      router.push('/browse');
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-validnews-surface shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">
              Submit a Claim
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Share a claim that needs fact-checking with the community
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {!account && (
                <div className="bg-secondary/10 border border-secondary rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    Please connect your wallet to submit a claim
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="summary" className="text-base font-semibold">
                  Claim Summary
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Enter the claim you want to fact-check..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={6}
                  className="resize-none"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-base font-semibold">
                  Supporting Evidence (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    disabled={loading}
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <FileUp className="h-12 w-12 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload file'}
                    </span>
                    {ipfsHash && (
                      <span className="text-xs text-accent font-mono">
                        IPFS: {ipfsHash}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !account}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
              >
                {loading ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
