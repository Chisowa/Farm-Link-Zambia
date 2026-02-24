import { z } from 'zod'

const EnvSchema = z.object({
  // ── Firebase Admin ────────────────────────────────────────────────────────
  FIREBASE_PROJECT_ID: z.string().default('farmlink-zambia'),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),

  // ── Google Cloud / Vertex AI ──────────────────────────────────────────────
  GOOGLE_CLOUD_PROJECT: z.string().default('farmlink-zambia'),
  VERTEX_AI_LOCATION: z.string().default('us-central1'),
  /** Gemini model — gemini-2.0-flash-001 for speed/cost balance */
  VERTEX_AI_MODEL_ID: z.string().default('gemini-2.0-flash-001'),

  // ── GCS bucket ────────────────────────────────────────────────────────────
  GCS_BUCKET: z.string().default('famlinkdocs'),

  // ── Runtime ───────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = EnvSchema.parse(process.env)
