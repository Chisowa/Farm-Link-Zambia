import { FieldValue } from 'firebase-admin/firestore'
import { z } from 'zod'

import { db } from '../../rag/firebase.js'
import { askRag } from '../../rag/index.js'
import { authedProcedure, router } from '../trpc'

const ADVICE_COLLECTION = 'advice'

export const adviceRouter = router({
  askAI: authedProcedure
    .input(
      z.object({
        query: z
          .string()
          .min(3, 'Query must be at least 3 characters')
          .max(1000, 'Query must not exceed 1000 characters'),
        language: z.string().optional().default('en'),
        /** Optionally restrict retrieval to specific knowledge-base doc IDs */
        knowledgeBaseDocs: z.array(z.string()).optional().default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await askRag({
        query: input.query,
        userId: ctx.uid,
        language: input.language,
        knowledgeBaseDocs: input.knowledgeBaseDocs,
      })
    }),

  getAdviceHistory: authedProcedure.query(async ({ ctx }) => {
    const snapshot = await db
      .collection(ADVICE_COLLECTION)
      .where('userId', '==', ctx.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

    const advice = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data['userId'] as string,
        queryText: data['queryText'] as string,
        responseText: data['responseText'] as string,
        sourcedDocuments: (data['sourcedDocuments'] as string[]) ?? [],
        feedback: data['feedback'] as 'helpful' | 'not_helpful' | undefined,
        createdAt: (data['createdAt'] as { toDate(): Date })?.toDate() ?? new Date(),
      }
    })

    return { advice }
  }),

  submitFeedback: authedProcedure
    .input(
      z.object({
        adviceId: z.string().min(1),
        feedback: z.enum(['helpful', 'not_helpful']),
      })
    )
    .mutation(async ({ input }) => {
      await db.collection(ADVICE_COLLECTION).doc(input.adviceId).update({
        feedback: input.feedback,
        feedbackAt: FieldValue.serverTimestamp(),
      })
      return { success: true }
    }),

  clearHistory: authedProcedure.mutation(async ({ ctx }) => {
    const snapshot = await db.collection(ADVICE_COLLECTION).where('userId', '==', ctx.uid).get()

    const docs = snapshot.docs
    for (let i = 0; i < docs.length; i += 500) {
      const batch = db.batch()
      docs.slice(i, i + 500).forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    }

    return { deleted: docs.length }
  }),
})
