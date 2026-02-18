import { z } from "zod";

// Health check schema
export const healthCheckSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.date(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;

// User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["admin", "farmer", "agent"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// Farm schema
export const farmSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  location: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Farm = z.infer<typeof farmSchema>;
