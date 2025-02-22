import { useWeb3 } from "@/lib/web3";
import { CyberButton } from "@/components/ui/cyber-button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Sparkles, Shield, Coins } from "lucide-react";

export default function Home() {
  const { connect, connected } = useWeb3();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLaunch = async () => {
    if (!connected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to access the app.",
        variant: "destructive",
      });
      return;
    }
    setLocation("/dashboard");
  };

  const handleConnect = async () => {
    await connect();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          DeCharity AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The future of charitable giving powered by AI and blockchain technology.
          Connect your wallet to start making a difference.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
            <CardHeader>
              <Zap className="w-8 h-8 text-cyan-400 mb-2" />
              <CardTitle>AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Our AI analyzes your preferences and transaction history to recommend
              charities that align with your values and interests.
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Blockchain Security</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              All donations are securely processed on the Sonic blockchain,
              ensuring transparency and immutability of transactions.
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
              <CardTitle>Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Real-time analysis of blockchain data helps identify trending and
              high-impact charitable causes.
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
            <CardHeader>
              <Coins className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle>Crypto Donations</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400">
              Make donations using cryptocurrency on the Sonic network, with
              real-time tracking and transparent fund allocation.
            </CardContent>
          </Card>
        </div>

        {/* Center the launch button */}
        <div className="flex justify-center">
          {connected ? (
            <CyberButton size="lg" onClick={handleLaunch} className="px-12">
              Launch App
            </CyberButton>
          ) : (
            <CyberButton size="lg" onClick={handleConnect} className="px-12">
              Connect Wallet
            </CyberButton>
          )}
        </div>
      </div>
    </div>
  );
}