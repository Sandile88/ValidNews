'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react';

// Mock data service
const mockDataService = {
  getClaims: async () => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        summary: "Example claim 1",
        created_at: new Date().toISOString(),
        status: "pending",
        true_votes: 5,
        false_votes: 2,
        unsure_votes: 1,
        ipfs_hash: "QmXyz123"
      },
      // Add more mock claims as needed
    ];
  }
};

export default function BrowseClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await mockDataService.getClaims();
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-accent hover:bg-accent text-white flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case 'false':
        return (
          <Badge className="bg-destructive hover:bg-destructive text-white flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            False
          </Badge>
        );
      default:
        return (
          <Badge className="bg-secondary hover:bg-secondary text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading claims...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Browse Claims</h1>
          <p className="text-gray-600 text-lg">
            Review and vote on fact-checking claims from the community
          </p>
        </div>

        {claims.length === 0 ? (
          <Card className="bg-validnews-surface shadow-lg border-none">
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No claims yet. Be the first to submit one!
              </p>
              <Link
                href="/submit"
                className="text-primary hover:underline font-medium mt-2 inline-block"
              >
                Submit a claim
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Link key={claim.id} href={`/claim/${claim.id}`}>
                <Card className="bg-validnews-surface shadow-md border-none hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <p className="text-gray-900 text-lg leading-relaxed">
                          {claim.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDate(claim.created_at)}</span>
                          <span>•</span>
                          <span>
                            {claim.true_votes + claim.false_votes + claim.unsure_votes} votes
                          </span>
                          {claim.ipfs_hash && (
                            <>
                              <span>•</span>
                              <span className="text-accent">Evidence attached</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(claim.status)}
                      </div>
                    </div>

                    {(claim.true_votes > 0 || claim.false_votes > 0 || claim.unsure_votes > 0) && (
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <span className="text-accent font-medium">
                          ✓ {claim.true_votes} True
                        </span>
                        <span className="text-destructive font-medium">
                          ✗ {claim.false_votes} False
                        </span>
                        <span className="text-gray-500 font-medium">
                          ? {claim.unsure_votes} Unsure
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
