import { useState } from "react";
import { CyberButton } from "./ui/cyber-button";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CATEGORIES = [
  { id: "education", label: "Education & Technology" },
  { id: "healthcare", label: "Healthcare & Biotech" },
  { id: "security", label: "Cybersecurity" },
  { id: "environment", label: "Environmental Tech" },
  { id: "ai", label: "AI Research" },
  { id: "blockchain", label: "Blockchain Innovation" },
];

interface PreferenceFormProps {
  onSubmit: (preferences: string[]) => void;
}

export function PreferenceForm({ onSubmit }: PreferenceFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedCategories);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-400">
          Customize Your Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-gray-400 mb-4">
            Select the causes you're passionate about to receive personalized AI recommendations.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(category => (
              <div
                key={category.id}
                className="flex items-center space-x-3 border border-cyan-500/20 p-3 rounded hover:bg-cyan-500/5"
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  className="border-cyan-400 data-[state=checked]:bg-cyan-400"
                />
                <label
                  htmlFor={category.id}
                  className="text-gray-300 cursor-pointer flex-1"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          <CyberButton
            type="submit"
            disabled={selectedCategories.length === 0}
            className="w-full"
          >
            Get AI Recommendations
          </CyberButton>
        </form>
      </CardContent>
    </Card>
  );
}
