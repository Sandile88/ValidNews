import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import ValidNewsABI from '@/contracts/validnews.json';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { baseSepolia } from 'viem/chains';

export function useValidNewsContract() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const submitStory = async (ipfsHash: string, summary: string) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.validnews as `0x${string}`,
      abi: ValidNewsABI,
      functionName: 'submitStory',
      args: [ipfsHash, summary],
      chainId: baseSepolia.id, // Force Base Sepolia chain ID
    });
  };

  const vote = async (storyId: number, decision: boolean) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.validnews as `0x${string}`,
      abi: ValidNewsABI,
      functionName: 'vote',
      args: [BigInt(storyId), decision],
      chainId: baseSepolia.id, // Force Base Sepolia chain ID
    });
  };

  const tallyVotes = async (storyId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.baseSepolia.validnews as `0x${string}`,
      abi: ValidNewsABI,
      functionName: 'tallyVotes',
      args: [BigInt(storyId)],
      chainId: baseSepolia.id, // Force Base Sepolia chain ID
    });
  };

  return {
    submitStory,
    vote,
    tallyVotes,
    isPending,
    isConfirming,
    isConfirmed,
    hash
  };
}

export function useReadStory(storyId: number) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.baseSepolia.validnews as `0x${string}`,
    abi: ValidNewsABI,
    functionName: 'getStory',
    args: [BigInt(storyId)],
    chainId: baseSepolia.id, // Force Base Sepolia chain ID
  });

  return { story: data, isLoading };
}