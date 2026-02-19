import { z } from 'zod'

export const AdviceSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  queryText: z.string().min(1),
  responseText: z.string(),
  sourcedDocuments: z.string().array().optional(),
  feedback: z.enum(['helpful', 'not_helpful']).optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export const CreateAdviceSchema = z.object({
  userId: z.string().min(1),
  queryText: z.string().min(1),
})

export const AdviceQuerySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  language: z.string().optional().default('en'),
  maxResults: z.number().min(1).max(10).optional().default(5),
})

export type Advice = z.infer<typeof AdviceSchema>
export type CreateAdvice = z.infer<typeof CreateAdviceSchema>
export type AdviceQuery = z.infer<typeof AdviceQuerySchema>
