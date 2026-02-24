/**
 * Diseases router — queries the 'diseases' Firestore collection.
 * Seed data via: scripts/seed/seed.ts
 */
import { z } from 'zod'
import { db } from '../../rag/firebase.js'
import { publicProcedure, router } from '../trpc'

const COLLECTION = 'diseases'

export const diseasesRouter = router({
  getDiseaseDetails: publicProcedure
    .input(z.object({ diseaseId: z.string().min(1) }))
    .query(async ({ input }) => {
      const doc = await db.collection(COLLECTION).doc(input.diseaseId).get()
      if (!doc.exists) throw new Error(`Disease "${input.diseaseId}" not found`)
      return { id: doc.id, ...doc.data() }
    }),

  searchDiseases: publicProcedure
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

  listDiseases: publicProcedure
    .input(z.object({ affectedCrop: z.string().optional() }))
    .query(async ({ input }) => {
      let query = db.collection(COLLECTION).limit(20)
      if (input.affectedCrop) {
        query = query.where('affectedCrops', 'array-contains', input.affectedCrop) as typeof query
      }
      const snap = await query.get()
      const diseases = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { diseases }
    }),

  identifyDisease: publicProcedure
    .input(
      z.object({
        symptoms: z.string().array().min(1),
        affectedCrop: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const snap = await db
        .collection(COLLECTION)
        .where('affectedCrops', 'array-contains', input.affectedCrop)
        .limit(5)
        .get()

      const possibleDiseases = snap.docs.map(d => {
        const data = d.data()
        const symptoms = (data['commonSymptoms'] as string[]) ?? []
        const matches = input.symptoms.filter(s =>
          symptoms.some(ds => ds.toLowerCase().includes(s.toLowerCase()))
        ).length
        return {
          id: d.id,
          name: data['name'] as string,
          commonName: data['commonName'] as string,
          confidence: Math.min(0.5 + matches * 0.15, 0.95),
        }
      })

      possibleDiseases.sort((a, b) => b.confidence - a.confidence)
      return { possibleDiseases }
    }),
})
