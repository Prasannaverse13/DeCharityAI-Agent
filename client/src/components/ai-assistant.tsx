import { useState } from "react";
import { CyberButton } from "./ui/cyber-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await apiRequest<{ message: string }>("POST", "/api/ai/chat", { message: userMessage });
      if (response?.message) {
        setMessages(prev => [...prev, { role: "assistant", content: response.message }]);
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/50 border-cyan-500/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-cyan-400">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 h-[400px] overflow-y-auto p-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center">
              Ask me anything about donations, charities, or blockchain!
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded whitespace-pre-wrap ${
                msg.role === "user" 
                  ? "bg-purple-500/20 ml-8" 
                  : "bg-cyan-500/20 mr-8"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="text-cyan-400 animate-pulse text-center">
              AI is thinking...
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about charities, donations, or blockchain..."
            className="bg-black/30 border-cyan-500/20"
          />
          <CyberButton type="submit" disabled={isLoading}>
            Send
          </CyberButton>
        </form>
      </CardContent>
    </Card>
  );
}