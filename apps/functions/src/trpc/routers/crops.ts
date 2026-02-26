import { router, publicProcedure } from '../trpc.js'
import { z } from 'zod'
import { getFirestore, Query, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore'

const db = getFirestore()

export const cropsRouter = router({
  listCrops: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const snapshot = await db.collection('crops').limit(input.limit).offset(input.offset).get()

        const crops = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        return {
          crops,
          total: crops.length,
        }
      } catch (error) {
        console.error('Error listing crops:', error)
        return {
          crops: [],
          total: 0,
        }
      }
    }),

  getCropDetails: publicProcedure
    .input(z.object({ cropId: z.string().min(1) }))
    .query(async ({ input }: { input: any }) => {
      try {
        const doc = await db.collection('crops').doc(input.cropId).get()

        if (!doc.exists) {
          throw new Error('Crop not found')
        }

        return {
          id: doc.id,
          ...doc.data(),
        }
      } catch (error) {
        console.error('Error getting crop details:', error)
        throw error
      }
    }),

  getRecommendedCrops: publicProcedure
    .input(
      z.object({
        location: z.string().optional(),
        season: z.string().optional(),
      })
    )
    .query(async ({ input }: { input: any }) => {
      try {
        let query: Query<DocumentData> = db.collection('crops')

        // If season is provided, filter crops by planting season
        if (input.season) {
          query = query.where('plantingSeasons', 'array-contains', input.season)
        }

        const snapshot = await query.get()
        const crops = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        }))

        return { crops }
      } catch (error) {
        console.error('Error getting recommended crops:', error)
        return { crops: [] }
      }
    }),
})
