import "dotenv/config";
import express from "express";
import cors from "cors";
import serverless from "serverless-http"; // Import this
import { handleDemo } from "./routes/demo";
import { handlePdfProxy } from "./routes/pdf-proxy";

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/pdf-proxy", handlePdfProxy);

  return app;
}

const app = createServer();

// Wrap the app with serverless-http for better Vercel compatibility
export default serverless(app);