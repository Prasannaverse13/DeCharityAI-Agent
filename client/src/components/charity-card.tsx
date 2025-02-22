import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CyberButton } from "@/components/ui/cyber-button";
import { Link } from "wouter";
import type { Charity } from "@shared/schema";

interface CharityCardProps {
  charity: Charity & { score?: number; reason?: string };
}

export function CharityCard({ charity }: CharityCardProps) {
  const progress = (charity.raised / charity.goal) * 100;

  return (
    <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-cyan-400">{charity.name}</CardTitle>
        {charity.score && (
          <div className="text-xs text-purple-400">
            AI Match: {Math.round(charity.score * 100)}% - {charity.reason}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">{charity.description}</p>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>Raised: ${charity.raised.toLocaleString()}</span>
          <span>Goal: ${charity.goal.toLocaleString()}</span>
        </div>
        <Link href={`/charity/${charity.id}`}>
          <CyberButton className="w-full">View Details</CyberButton>
        </Link>
      </CardContent>
    </Card>
  );
}
