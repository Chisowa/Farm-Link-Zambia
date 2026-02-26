/**
 * Local development server — runs the tRPC router as a plain Express app.
 * Does NOT use firebase-functions; connects directly to real Firestore + Vertex AI via ADC.
 *
 * Usage (from repo root):
 *   pnpm --filter @repo/functions dev:server
 *
 * API available at: http://localhost:3001/trpc/<procedure>
 */
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load .env before any modules that read process.env at init time
dotenv.config({ path: path.resolve(import.meta.dirname, '../.env') })

import express from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './trpc/router.js'
import { createContext } from './trpc/trpc.js'

const PORT = process.env.PORT ?? 3001

const app = express()
app.use(cors({ origin: true }))

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`\n🌱 Farm-Link Zambia API server`)
  console.log(`   Listening on http://localhost:${PORT}`)
  console.log(`   tRPC endpoint: http://localhost:${PORT}/trpc`)
  console.log(`   Health check:  http://localhost:${PORT}/health\n`)
})
