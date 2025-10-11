'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';


// Mock data service
const mockDataService = {
  getClaim: async (id) => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      summary: "Example claim summary",
      created_at: new Date().toISOString(),
      wallet_address: "0x1234567890abcdef",
      ipfs_hash: "QmXyz123",
      status: "pending",
      true_votes: 10,
      false_votes: 5,
      unsure_votes: 3
    };
  },

  getUserVote: async (claimId, walletAddress) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return null; // Initially no vote
  },

  saveVote: async (claimId, walletAddress, voteType) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { id: Date.now(), vote_type: voteType };
  },

  deleteVote: async (voteId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};

export default function ClaimDetail() {
  const params = useParams();
  const router = useRouter();
  const { account } = use();
  const [claim, setClaim] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchClaim();
      if (account) {
        fetchUserVote();
      }
    }
  }, [params.id, account]);

  const fetchClaim = async () => {
    try {
      const data = await mockDataService.getClaim(params.id);
      if (!data) {
        router.push('/browse');
        return;
      }
      
      setClaim(data);
    } catch (error) {
      console.error('Error fetching claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async () => {
    if (!account) return;

    try {
      const data = await mockDataService.getUserVote(params.id, account);
      setUserVote(data);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (voteType) => {
    setError('');

    if (!account) {
      setError('Please connect your wallet to vote');
      return;
    }

    setVoting(true);

    try {
      if (userVote) {
        await mockDataService.deleteVote(userVote.id);

      }

      if (!userVote || userVote.vote_type !== voteType) {
        const newVote = await mockDataService.saveVote(params.id, account, voteType);
        setUserVote(newVote);

      }

      await fetchClaim();
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to record vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-accent hover:bg-accent text-white flex items-center gap-1 text-base px-4 py-1">
            <CheckCircle className="h-4 w-4" />
            Verified
          </Badge>
        );
      case 'false':
        return (
          <Badge className="bg-destructive hover:bg-destructive text-white flex items-center gap-1 text-base px-4 py-1">
            <XCircle className="h-4 w-4" />
            False
          </Badge>
        );
      default:
        return (
          <Badge className="bg-secondary hover:bg-secondary text-white flex items-center gap-1 text-base px-4 py-1">
            <Clock className="h-4 w-4" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading claim...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return null;
  }

  const totalVotes = claim.true_votes + claim.false_votes + claim.unsure_votes;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/browse"
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>

        <Card className="bg-validnews-surface shadow-lg border-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-gray-900 leading-relaxed flex-1">
                {claim.summary}
              </CardTitle>
              {getStatusBadge(claim.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <span>Submitted {formatDate(claim.created_at)}</span>
              <span>•</span>
              <span className="font-mono text-xs">
                {claim.wallet_address.slice(0, 6)}...{claim.wallet_address.slice(-4)}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {claim.ipfs_hash && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Supporting Evidence</h3>
                <a
                  href={`https://ipfs.io/ipfs/${claim.ipfs_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  View on IPFS
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-xs text-gray-500 font-mono mt-1">{claim.ipfs_hash}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Vote on this claim</h3>
              {!account && (
                <div className="bg-secondary/10 border border-secondary rounded-lg p-4 mb-4">
                  <p className="text-gray-700 text-sm">
                    Please connect your wallet to vote on this claim
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleVote('true')}
                  disabled={voting || !account}
                  className={`py-6 text-lg ${
                    userVote?.vote_type === 'true'
                      ? 'bg-accent hover:bg-accent/90 text-white'
                      : 'bg-gray-100 hover:bg-accent hover:text-white text-gray-700'
                  }`}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  True
                </Button>
                <Button
                  onClick={() => handleVote('false')}
                  disabled={voting || !account}
                  className={`py-6 text-lg ${
                    userVote?.vote_type === 'false'
                      ? 'bg-destructive hover:bg-destructive/90 text-white'
                      : 'bg-gray-100 hover:bg-destructive hover:text-white text-gray-700'
                  }`}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  False
                </Button>
                <Button
                  onClick={() => handleVote('unsure')}
                  disabled={voting || !account}
                  className={`py-6 text-lg ${
                    userVote?.vote_type === 'unsure'
                      ? 'bg-secondary hover:bg-secondary/90 text-white'
                      : 'bg-gray-100 hover:bg-secondary hover:text-white text-gray-700'
                  }`}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Unsure
                </Button>
              </div>
              {userVote && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  You voted: <span className="font-semibold capitalize">{userVote.vote_type}</span>
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Voting Results</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-accent font-medium">True</span>
                    <span className="text-gray-600">
                      {claim.true_votes} ({totalVotes > 0 ? Math.round((claim.true_votes / totalVotes) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full transition-all"
                      style={{ width: `${totalVotes > 0 ? (claim.true_votes / totalVotes) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-destructive font-medium">False</span>
                    <span className="text-gray-600">
                      {claim.false_votes} ({totalVotes > 0 ? Math.round((claim.false_votes / totalVotes) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-destructive h-3 rounded-full transition-all"
                      style={{ width: `${totalVotes > 0 ? (claim.false_votes / totalVotes) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary font-medium">Unsure</span>
                    <span className="text-gray-600">
                      {claim.unsure_votes} ({totalVotes > 0 ? Math.round((claim.unsure_votes / totalVotes) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-secondary h-3 rounded-full transition-all"
                      style={{ width: `${totalVotes > 0 ? (claim.unsure_votes / totalVotes) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Total votes: <span className="font-semibold">{totalVotes}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
