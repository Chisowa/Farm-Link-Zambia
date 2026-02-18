import { onRequest } from "@google-cloud/functions-framework";
import express from "express";
import { trpcContextHandler, healthCheck } from "./handlers";

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", healthCheck);

// tRPC endpoint
app.use("/trpc", trpcContextHandler);

// Default export for Google Cloud Functions
export const farmLinkApi = onRequest(app);

// For local development
const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`tRPC: http://localhost:${PORT}/trpc`);
  });
}
