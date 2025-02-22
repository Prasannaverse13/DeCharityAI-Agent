import { useQuery } from "@tanstack/react-query";
import { CharityCard } from "@/components/charity-card";
import { useWeb3 } from "@/lib/web3";
import { getRecommendations } from "@/lib/ai";
import type { Charity } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { PreferenceForm } from "@/components/preference-form";
import { CharitySubmission } from "@/components/charity-submission";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { connected, address } = useWeb3();
  const [, setLocation] = useLocation();
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!connected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to access the dashboard.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [connected, setLocation, toast]);

  // First fetch charities
  const { data: charities, isLoading: isLoadingCharities } = useQuery<Charity[]>({
    queryKey: ["/api/charities"],
    enabled: connected,
  });

  // Then fetch recommendations based on charities
  const { data: recommendedCharities, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/recommendations", address, userPreferences],
    enabled: !!charities && !!address,
    queryFn: async () => {
      if (!charities || !address) return [];
      return getRecommendations(charities, address, userPreferences);
    }
  });

  const handlePreferences = (preferences: string[]) => {
    setUserPreferences(preferences);
    setShowPreferences(false);
  };

  if (!connected) return null;

  const isLoading = isLoadingCharities || isLoadingRecommendations;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-cyan-400">Loading charities...</div>
      </div>
    );
  }

  if (!charities?.length) {
    return (
      <div className="text-center text-gray-400">
        No charities available at the moment.
      </div>
    );
  }

  if (showPreferences) {
    return (
      <div className="max-w-2xl mx-auto">
        <PreferenceForm onSubmit={handlePreferences} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          AI-Recommended Charities
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCharities?.map((charity) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <CharitySubmission />
      </div>
    </div>
  );
}