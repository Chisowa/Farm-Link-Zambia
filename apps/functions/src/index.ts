/**
 * Farm-Link Zambia - Firebase Cloud Functions Entry Point
 *
 * This file exports the tRPC API as a Cloud Function HTTP handler.
 * Deploy with: firebase deploy --only functions:api
 */

import * as functions from 'firebase-functions'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { appRouter } from './trpc/router.js'

export type { AppRouter } from './trpc/router.js'

// Create tRPC HTTP handler
const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
})

// Export as Cloud Function
export const api = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  // Route tRPC requests
  await trpcHandler(req, res)
})
