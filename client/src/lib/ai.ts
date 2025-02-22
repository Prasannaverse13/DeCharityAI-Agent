import { mockRecommendations } from "./mock-data";
import type { Charity } from "@shared/schema";
import { getAlloraInference, processAlloraInference, ALLORA_CONFIG } from "@shared/allora";

interface RecommendedCharity extends Charity {
  score: number;
  reason: string;
  confidence?: number;
}

export async function getRecommendations(
  charities: Charity[],
  walletAddress: string,
  preferences: string[] = []
): Promise<RecommendedCharity[]> {
  const recommendedCharities = await Promise.all(charities.map(async charity => {
    const mockRec = mockRecommendations.find(r => r.id === charity.id);
    let score = mockRec?.score || Math.random();
    let reason = mockRec?.reason || "AI-matched based on your profile";
    let confidence = 0.8; // Default confidence

    try {
      // Get Allora predictions for this charity category
      const alloraInference = await getAlloraInference();
      const { score: alloraScore, confidence: alloraConfidence } = processAlloraInference(
        alloraInference,
        charity.category
      );

      // Combine Allora score with our base score
      score = (score + alloraScore) / 2;
      confidence = alloraConfidence;

      // Apply preference-based boosts
      if (preferences.length > 0) {
        const categoryMatches = preferences.some(pref => 
          charity.category.toLowerCase().includes(pref.toLowerCase())
        );
        const descriptionMatches = preferences.some(pref =>
          charity.description.toLowerCase().includes(pref.toLowerCase())
        );
        const impactMatches = preferences.some(pref =>
          charity.impact_metrics.toLowerCase().includes(pref.toLowerCase())
        );

        // Apply weighted boosts based on matches
        if (categoryMatches) score = Math.min(1, score + 0.3);
        if (descriptionMatches) score = Math.min(1, score + 0.2);
        if (impactMatches) score = Math.min(1, score + 0.2);

        // Generate detailed reason
        const matchTypes = [];
        if (categoryMatches) matchTypes.push(charity.category);
        if (descriptionMatches || impactMatches) matchTypes.push("impact goals");

        reason = matchTypes.length > 0
          ? `AI-powered match for your interests in ${matchTypes.join(" and ")}`
          : "Recommended by Allora AI based on blockchain activity";
      }

      // Normalize final score
      score = Math.min(1, score);

    } catch (error) {
      console.error("Error getting Allora inference:", error);
      // Fallback to base scoring if Allora fails
      // Add more detailed error information to help debugging
      console.error("Failed to get Allora prediction for charity:", {
        charityId: charity.id,
        category: charity.category,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return {
      ...charity,
      score,
      reason,
      confidence
    };
  }));

  // Sort by score descending
  return recommendedCharities.sort((a, b) => b.score - a.score);
}