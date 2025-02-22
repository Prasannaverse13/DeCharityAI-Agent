import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "@/lib/web3";
import { useLocation } from "wouter";
import type { Donation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function History() {
  const { connected, address } = useWeb3();
  const [, setLocation] = useLocation();

  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: [`/api/donations/${address}`],
    enabled: !!address,
  });

  if (!connected) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Donation History</h1>
      <div className="space-y-4">
        {donations?.map((donation) => (
          <Card key={donation.id} className="bg-black/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400">
                Donation of ${donation.amount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                <p>Transaction: {donation.transactionHash}</p>
                <p>Date: {new Date(donation.timestamp).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}