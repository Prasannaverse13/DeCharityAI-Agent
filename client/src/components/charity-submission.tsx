import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CyberButton } from "@/components/ui/cyber-button";
import { useToast } from "@/hooks/use-toast";

export function CharitySubmission() {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !email || !comment || !proofFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload a proof file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, just show a success message
      // In production, this would submit to a backend endpoint
      toast({
        title: "Submission Received",
        description: "We will review your charity submission and contact you via email.",
      });
      
      // Reset form
      setTitle("");
      setEmail("");
      setComment("");
      setProofFile(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-400">Submit a Charity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Charity Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/30 border-cyan-500/20"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Contact Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/30 border-cyan-500/20"
            />
          </div>
          <div>
            <Textarea
              placeholder="Please provide additional details and your role in the charity..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-black/30 border-cyan-500/20 min-h-[100px]"
            />
          </div>
          <div>
            <Input
              type="file"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="bg-black/30 border-cyan-500/20"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-sm text-gray-400 mt-1">
              Upload proof documents (PDF, DOC, DOCX)
            </p>
          </div>
          <CyberButton 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </CyberButton>
        </form>
      </CardContent>
    </Card>
  );
}
