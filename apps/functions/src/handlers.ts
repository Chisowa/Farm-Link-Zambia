import type { Request, Response } from "express";
import { createContext, appRouter } from "@farm-link/api";
import * as trpcExpress from "@trpc/server/adapters/express";

const middleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

export const trpcContextHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
    return;
  }

  res.header("Access-Control-Allow-Origin", "*");
  await middleware(req, res);
};

export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
};
