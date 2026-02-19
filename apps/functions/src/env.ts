import { z } from 'zod'

const EnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  GOOGLE_CLOUD_PROJECT: z.string(),
  VERTEX_AI_LOCATION: z.string().default('us-central1'),
  VERTEX_AI_MODEL_ID: z.string().default('gemini-pro'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = EnvSchema.parse(process.env)
