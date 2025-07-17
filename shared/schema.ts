import { pgTable, text, serial, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sizeCalculations = pgTable("size_calculations", {
  id: serial("id").primaryKey(),
  lastType: varchar("last_type", { length: 50 }).notNull(),
  footLength: real("foot_length").notNull(),
  ballGirth: real("ball_girth").notNull(),
  recommendedSize: varchar("recommended_size", { length: 10 }).notNull(),
  recommendedWidth: varchar("recommended_width", { length: 5 }).notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSizeCalculationSchema = createInsertSchema(sizeCalculations).pick({
  lastType: true,
  footLength: true,
  ballGirth: true,
  recommendedSize: true,
  recommendedWidth: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SizeCalculation = typeof sizeCalculations.$inferSelect;
export type InsertSizeCalculation = z.infer<typeof insertSizeCalculationSchema>;
