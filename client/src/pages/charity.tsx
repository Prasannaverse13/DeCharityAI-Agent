import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { CyberButton } from "@/components/ui/cyber-button";
import { useWeb3 } from "@/lib/web3";
import { sendTransaction } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import type { Charity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, TrendingUp, Shield } from "lucide-react";

export default function CharityDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { connected, address } = useWeb3();

  const { data: charity, isLoading } = useQuery<Charity>({
    queryKey: [`/api/charities/${id}`],
  });

  const donation = useMutation({
    mutationFn: async (amount: number) => {
      if (!address || !id || !charity) throw new Error("Missing required data");
      const txHash = await sendTransaction(amount, charity.walletAddress);
      return apiRequest("POST", "/api/donations", {
        charityId: parseInt(id),
        walletAddress: address,
        amount,
        transactionHash: txHash,
      });
    },
    onSuccess: () => {
      toast({
        title: "Donation successful!",
        description: "Thank you for your contribution to the blockchain future.",
      });
      setLocation("/history");
    },
  });

  if (!connected) {
    setLocation("/");
    return null;
  }

  if (isLoading || !charity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyan-400">Initializing neural link...</div>
      </div>
    );
  }

  const progress = (charity.raised / charity.goal) * 100;
  const impactMetrics = charity.impact_metrics.split("|").map(m => m.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-cyan-400 glow">{charity.name}</h1>
        <p className="text-gray-400 text-lg">{charity.description}</p>
      </div>

      <div className="bg-black/50 border border-cyan-500/20 p-6 rounded-lg space-y-4 backdrop-blur">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Fund Allocation</h2>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm">
          <span className="text-cyan-400">
            {charity.raised.toLocaleString()} S raised
          </span>
          <span className="text-purple-400">
            Goal: {charity.goal.toLocaleString()} S
          </span>
        </div>
      </div>

      <div className="bg-black/50 border border-cyan-500/20 p-6 rounded-lg backdrop-blur">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Impact Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 border border-cyan-500/20 rounded"
            >
              {index === 0 ? (
                <Zap className="w-5 h-5 text-cyan-400" />
              ) : index === 1 ? (
                <Target className="w-5 h-5 text-purple-400" />
              ) : index === 2 ? (
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              ) : (
                <Shield className="w-5 h-5 text-purple-400" />
              )}
              <span className="text-gray-400">{metric}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <CyberButton
          size="lg"
          onClick={() => donation.mutate(10)}
          disabled={donation.isPending}
        >
          Donate 10 S
        </CyberButton>
        <CyberButton
          size="lg"
          variant="secondary"
          onClick={() => donation.mutate(50)}
          disabled={donation.isPending}
        >
          Donate 50 S
        </CyberButton>
        <CyberButton
          size="lg"
          variant="secondary"
          onClick={() => donation.mutate(100)}
          disabled={donation.isPending}
        >
          Donate 100 S
        </CyberButton>
      </div>
    </div>
  );
}