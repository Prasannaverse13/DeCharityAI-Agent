import { z } from "zod";

export const ALLORA_CONFIG = {
  API_ENDPOINT: "https://api.upshot.xyz/v2/allora/consumer/price/ethereum-11155111",
  API_KEY: "UP-b9e891f7c69c4d9497430e8a" // Using first API key from the list
};

// Schema for Allora Network inference response based on new API format
export const AlloraInferenceSchema = z.object({
  network_inference_normalized: z.string(),
  confidence_interval_percentiles_normalized: z.array(z.string()),
  confidence_interval_values_normalized: z.array(z.string()),
  topic_id: z.string()
});

export type AlloraInference = z.infer<typeof AlloraInferenceSchema>;

// Function to fetch AI inferences from Allora Network
export async function getAlloraInference(interval: string = "5m"): Promise<AlloraInference> {
  try {
    const response = await fetch(`${ALLORA_CONFIG.API_ENDPOINT}/ETH/${interval}`, {
      headers: {
        'accept': 'application/json',
        'x-api-key': ALLORA_CONFIG.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Allora API error: ${response.statusText}`);
    }

    const data = await response.json();
    return AlloraInferenceSchema.parse(data);
  } catch (error) {
    console.error("Error fetching Allora inference:", error);
    throw error;
  }
}

// Process Allora inference data for charity matching
export function processAlloraInference(inference: AlloraInference, charityCategory: string): {
  score: number;
  confidence: number;
} {
  // Parse prediction value and normalize to 0-1 range
  const rawValue = parseFloat(inference.network_inference_normalized);
  const normalizedScore = Math.min(Math.max(rawValue / 10000, 0), 1);

  // Calculate confidence from confidence intervals
  const confidenceValues = inference.confidence_interval_values_normalized
    .map(v => parseFloat(v));

  // Calculate confidence based on the spread of confidence intervals
  const confidenceRange = Math.abs(confidenceValues[confidenceValues.length - 1] - confidenceValues[0]);
  const confidence = 1 - (confidenceRange / rawValue);

  return {
    score: normalizedScore,
    confidence: Math.max(0, Math.min(1, confidence))
  };
}