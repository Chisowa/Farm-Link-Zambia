/**
 * Crops router — queries the 'crops' Firestore collection.
 * Seed data via: scripts/seed/seed.ts
 */
import { z } from 'zod'
import { db } from '../../rag/firebase.js'
import { publicProcedure, router } from '../trpc'

const COLLECTION = 'crops'

export const cropsRouter = router({
  listCrops: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        season: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      let query = db.collection(COLLECTION).limit(input.limit)
      if (input.season) {
        query = query.where('plantingSeasons', 'array-contains', input.season) as typeof query
      }
      const snap = await query.get()
      const crops = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { crops }
    }),

  getCropDetails: publicProcedure
    .input(z.object({ cropId: z.string().min(1) }))
    .query(async ({ input }) => {
      const doc = await db.collection(COLLECTION).doc(input.cropId).get()
      if (!doc.exists) throw new Error(`Crop "${input.cropId}" not found`)
      return { id: doc.id, ...doc.data() }
    }),

  getRecommendedCrops: publicProcedure
    .input(
      z.object({
        location: z.string().optional(),
        season: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      let query = db.collection(COLLECTION).limit(6)
      if (input.season) {
        query = query.where('plantingSeasons', 'array-contains', input.season) as typeof query
      }
      const snap = await query.get()
      const crops = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { crops }
    }),

  searchCrops: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      // Simple prefix search on name field — use Algolia/Typesense for full-text in production
      const snap = await db
        .collection(COLLECTION)
        .orderBy('name')
        .startAt(input.query)
        .endAt(input.query + '\uf8ff')
        .limit(10)
        .get()
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { results }
    }),
})
