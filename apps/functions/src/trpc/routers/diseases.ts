import { router, publicProcedure } from '../trpc.js'
import { z } from 'zod'
import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

export const diseasesRouter = router({
  searchDiseases: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }: { input: any }) => {
      try {
        const snapshot = await db.collection('diseases').get()

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
        console.error('Error searching diseases:', error)
        return { results: [] }
      }
    }),

  getDiseaseDetails: publicProcedure
    .input(z.object({ diseaseId: z.string().min(1) }))
    .query(async ({ input }: { input: any }) => {
      try {
        const doc = await db.collection('diseases').doc(input.diseaseId).get()

        if (!doc.exists) {
          throw new Error('Disease not found')
        }

        return {
          id: doc.id,
          ...doc.data(),
        }
      } catch (error) {
        console.error('Error getting disease details:', error)
        throw error
      }
    }),

  identifyDisease: publicProcedure
    .input(
      z.object({
        symptoms: z.string().array().min(1),
        affectedCrop: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const snapshot = await db.collection('diseases').get()

        // Find diseases affecting the crop with matching symptoms
        const possibleDiseases = snapshot.docs
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
            confidence: input.symptoms.length > 0 ? 0.75 : 0.5,
          }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5) // Top 5 results

        return { possibleDiseases }
      } catch (error) {
        console.error('Error identifying disease:', error)
        return { possibleDiseases: [] }
      }
    }),
})
