import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FileText, Users, Shield } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useBlockNumber, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';


export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { isConnected } = useAccount();
  const chainId = useChainId();

   useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);


  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Verify Truth Together
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A decentralized platform where communities fact-check claims and build trust through transparent verification
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/submit">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg h-auto">
                Submit Claim
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg h-auto">
                Browse Claims
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-validnews-surface shadow-lg border-none">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Submit Claims</h3>
              <p className="text-gray-600 leading-relaxed">
                Share claims that need verification with supporting evidence stored on IPFS
              </p>
            </CardContent>
          </Card>

          <Card className="bg-validnews-surface shadow-lg border-none">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Community Voting</h3>
              <p className="text-gray-600 leading-relaxed">
                Vote on claims as true, false, or unsure to help determine their accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="bg-validnews-surface shadow-lg border-none">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Transparent Results</h3>
              <p className="text-gray-600 leading-relaxed">
                All votes are recorded on-chain for complete transparency and accountability
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
