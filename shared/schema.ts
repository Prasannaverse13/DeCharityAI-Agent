import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const charities = pgTable("charities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  goal: integer("goal").notNull(),
  raised: integer("raised").notNull(),
  category: text("category").notNull(),
  impact_metrics: text("impact_metrics").notNull(),
  walletAddress: text("wallet_address").notNull(), // Added wallet address field
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  charityId: integer("charity_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  amount: integer("amount").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertCharitySchema = createInsertSchema(charities).omit({ id: true });
export const insertDonationSchema = createInsertSchema(donations).omit({ id: true });

export type Charity = typeof charities.$inferSelect;
export type InsertCharity = z.infer<typeof insertCharitySchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;