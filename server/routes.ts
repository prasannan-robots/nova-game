import type { Express } from "express";
import { storage } from "./storage";

// Register application routes on the provided Express app.
// This function intentionally does not start an HTTP server. The caller
// (local server or serverless wrapper) should create/listen on a server
// when needed.
export async function registerRoutes(app: Express): Promise<void> {
  // Example health route useful for deployments and monitoring
  app.get("/api/ping", (_req, res) => {
    res.json({ pong: true });
  });

  // TODO: add your real API routes here, e.g.
  // app.post('/api/login', async (req, res) => { ... })

  // You may use `storage` to perform CRUD operations, for example:
  // const user = await storage.getUserByUsername(username);
}
