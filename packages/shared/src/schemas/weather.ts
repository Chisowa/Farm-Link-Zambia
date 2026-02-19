import { z } from "zod";

export const WeatherDataSchema = z.object({
  id: z.string().min(1),
  location: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.date(),
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  rainfall: z.number().min(0),
  windSpeed: z.number().min(0),
  condition: z.enum(["sunny", "cloudy", "rainy", "stormy", "partly-cloudy"]),
  forecast: z.object({
    date: z.date(),
    temperature: z.number(),
    condition: z.string(),
    probabilityOfRain: z.number().min(0).max(100),
  }).array().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const WeatherQuerySchema = z.object({
  location: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;
