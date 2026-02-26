/**
 * Farm-Link Zambia — Firebase Cloud Functions entry point
 *
 * Exposes the tRPC router as an HTTP Cloud Function named `api`.
 * URL: https://us-central1-farmlink-zambia.cloudfunctions.net/api/trpc/<procedure>
 *
 * Local development:
 *   firebase emulators:start --only functions
 *   → http://localhost:5001/farmlink-zambia/us-central1/api/trpc
 */

// Re-export router types so apps/web can import them
export { appRouter, type AppRouter } from './trpc/router'

// ── Firebase Cloud Function — tRPC HTTP endpoint ─────────────────────────────
// Requires: pnpm --filter @repo/functions add firebase-functions express cors
//           pnpm --filter @repo/functions add -D @types/express @types/cors
// Both packages are in package.json; run `pnpm install` after network is stable.
//
// URL patterns:
//   Emulator:   http://localhost:5001/farmlink-zambia/us-central1/api/trpc/<procedure>
//   Production: https://farmlink-zambia.web.app/api/trpc/<procedure>
//               (Firebase Hosting rewrites /api/trpc/** → this function)
import { onRequest } from 'firebase-functions/v2/https'
import express from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './trpc/router'
import { createContext } from './trpc/trpc'

const app = express()
app.use(cors({ origin: true }))
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

export const api = onRequest(
  { cors: true, region: 'us-central1', memory: '512MiB', timeoutSeconds: 300 },
  app
)
