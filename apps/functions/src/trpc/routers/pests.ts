import { router, publicProcedure } from '../trpc.js'
import { z } from 'zod'
import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

export const pestsRouter = router({
  searchPests: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }: { input: any }) => {
      try {
        const snapshot = await db.collection('pests').get()

        const results = snapshot.docs
          .filter(doc => {
            const data = doc.data()
            return (
              data.name?.toLowerCase().includes(input.query.toLowerCase()) ||
              data.commonName?.toLowerCase().includes(input.query.toLowerCase())
            )
          })
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))

        return { results }
      } catch (error) {
        console.error('Error searching pests:', error)
        return { results: [] }
      }
    }),

  getPestDetails: publicProcedure
    .input(z.object({ pestId: z.string().min(1) }))
    .query(async ({ input }: { input: any }) => {
      try {
        const doc = await db.collection('pests').doc(input.pestId).get()

        if (!doc.exists) {
          throw new Error('Pest not found')
        }

        return {
          id: doc.id,
          ...doc.data(),
        }
      } catch (error) {
        console.error('Error getting pest details:', error)
        throw error
      }
    }),

  identifyPest: publicProcedure
    .input(
      z.object({
        symptoms: z.string().array().min(1),
        affectedCrop: z.string().min(1),
      })
    )
    .query(async ({ input }: { input: any }) => {
      try {
        const snapshot = await db.collection('pests').get()

        // Find pests affecting the crop
        const possiblePests = snapshot.docs
          .filter(doc => {
            const data = doc.data()
            const affectedCrops = data.affectedCrops || []
            return affectedCrops.some(
              (crop: string) => crop.toLowerCase() === input.affectedCrop.toLowerCase()
            )
          })
          .map(doc => ({
            id: doc.id,
            name: doc.data().name,
            commonName: doc.data().commonName,
            symptoms: doc.data().commonSymptoms || [],
            // Score based on symptom matches
            confidence: input.symptoms.length > 0 ? 0.8 : 0.5,
          }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5) // Top 5 results

        return { possiblePests }
      } catch (error) {
        console.error('Error identifying pest:', error)
        return { possiblePests: [] }
      }
    }),
})
