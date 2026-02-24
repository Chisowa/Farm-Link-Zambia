/**
 * Pests router — queries the 'pests' Firestore collection.
 * Seed data via: scripts/seed/seed.ts
 */
import { z } from 'zod'
import { db } from '../../rag/firebase.js'
import { publicProcedure, router } from '../trpc'

const COLLECTION = 'pests'

export const pestsRouter = router({
  getPestDetails: publicProcedure
    .input(z.object({ pestId: z.string().min(1) }))
    .query(async ({ input }) => {
      const doc = await db.collection(COLLECTION).doc(input.pestId).get()
      if (!doc.exists) throw new Error(`Pest "${input.pestId}" not found`)
      return { id: doc.id, ...doc.data() }
    }),

  searchPests: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
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

  listPests: publicProcedure
    .input(z.object({ affectedCrop: z.string().optional() }))
    .query(async ({ input }) => {
      let query = db.collection(COLLECTION).limit(20)
      if (input.affectedCrop) {
        query = query.where('affectedCrops', 'array-contains', input.affectedCrop) as typeof query
      }
      const snap = await query.get()
      const pests = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { pests }
    }),

  identifyPest: publicProcedure
    .input(
      z.object({
        symptoms: z.string().array().min(1),
        affectedCrop: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      // Filter by affected crop and return candidates — for deeper identification use advice.askAI
      const snap = await db
        .collection(COLLECTION)
        .where('affectedCrops', 'array-contains', input.affectedCrop)
        .limit(5)
        .get()

      const possiblePests = snap.docs.map(d => {
        const data = d.data()
        const symptoms = (data['commonSymptoms'] as string[]) ?? []
        const matches = input.symptoms.filter(s =>
          symptoms.some(ps => ps.toLowerCase().includes(s.toLowerCase()))
        ).length
        return {
          id: d.id,
          name: data['name'] as string,
          commonName: data['commonName'] as string,
          confidence: Math.min(0.5 + matches * 0.15, 0.95),
        }
      })

      possiblePests.sort((a, b) => b.confidence - a.confidence)
      return { possiblePests }
    }),
})
