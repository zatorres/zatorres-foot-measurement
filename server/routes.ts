import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSizeCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Size calculation endpoint
  app.post("/api/size-calculation", async (req, res) => {
    try {
      const validatedData = insertSizeCalculationSchema.parse({
        ...req.body,
        timestamp: new Date().toISOString(),
      });
      
      const calculation = await storage.createSizeCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all size calculations (for analytics/debugging)
  app.get("/api/size-calculations", async (req, res) => {
    try {
      const calculations = await storage.getSizeCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
