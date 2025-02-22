import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema } from "@shared/schema";
import { ZodError } from "zod";
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function getAIResponse(message: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{
        role: "system",
        content: "You are a helpful AI assistant for a DeFi charity platform. Help users understand how to make donations, choose charities, and use blockchain technology."
      }, {
        role: "user",
        content: message
      }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error('AI response error:', error);
    return "I apologize, but I'm having trouble processing requests right now. Please try again later.";
  }
}

async function getAIRecommendation(donationHistory: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{
        role: "user",
        content: `Based on this donation history, suggest a charity category and explain why: ${JSON.stringify(donationHistory)}`
      }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('AI recommendation error:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const message = req.body.message;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await getAIResponse(message);
      res.json({ message: response });
    } catch (error) {
      console.error('Chat endpoint error:', error);
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  app.get("/api/charities", async (_req, res) => {
    const charities = await storage.getCharities();
    res.json(charities);
  });

  app.get("/api/charities/:id", async (req, res) => {
    const charity = await storage.getCharity(parseInt(req.params.id));
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }
    res.json(charity);
  });

  app.get("/api/donations/:wallet", async (req, res) => {
    const donations = await storage.getDonationsByWallet(req.params.wallet);
    res.json(donations);
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const donation = insertDonationSchema.parse(req.body);
      const created = await storage.createDonation(donation);

      const userDonations = await storage.getDonationsByWallet(donation.walletAddress);
      const aiRecommendation = await getAIRecommendation(userDonations);

      res.status(201).json({ 
        donation: created,
        aiRecommendation 
      });
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: "Invalid donation data" });
      }
      throw e;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}