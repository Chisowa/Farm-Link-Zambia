/**
 * RAG Engine — main orchestrator
 * ================================
 * Ties together embedding, retrieval, and generation into a single
 * `askRag()` function that the tRPC advice router calls.
 *
 * Flow:
 *   1. Embed user query  (Vertex AI text-embedding-004)
 *   2. Retrieve top-K relevant chunks from Firestore knowledge_base
 *   3. Format context string
 *   4. Generate grounded answer  (Gemini 2.0 Flash)
 *   5. Persist the advice record in Firestore
 *   6. Return structured response
 */
import { db } from './firebase.js'
import { generateAdvice } from './gemini.js'
import { formatContext, retrieveRelevantChunks } from './retrieval.js'

const ADVICE_COLLECTION = 'advice'

export interface RagRequest {
  query: string
  userId?: string
  language?: string
  /** Optional: restrict retrieval to specific knowledge-base doc IDs */
  knowledgeBaseDocs?: string[]
}

export interface RagResponse {
  id: string
  userId: string
  queryText: string
  responseText: string
  sourcedDocuments: string[]
  modelUsed: string
  createdAt: Date
}

export async function askRag(request: RagRequest): Promise<RagResponse> {
  const { query, userId = 'anonymous', language, knowledgeBaseDocs = [] } = request

  // ── Step 1 & 2: Retrieve relevant chunks ─────────────────────────────────
  const chunks = await retrieveRelevantChunks(query, knowledgeBaseDocs, 8)
  console.log(
    `Retrieved ${chunks.length} chunks, sources: ${[...new Set(chunks.map(c => c.docName))]}`
  )
  if (chunks.length > 0) {
    console.log(
      `Top chunk similarity: ${chunks[0].similarity.toFixed(3)}, doc: ${chunks[0].docName}`
    )
  }

  // ── Step 3: Format context ────────────────────────────────────────────────
  const context = formatContext(chunks)
  const sourcedDocuments = [...new Set(chunks.map(c => c.docName))]

  // ── Step 4: Generate answer ───────────────────────────────────────────────
  const { text: responseText, modelUsed } = await generateAdvice(query, context, language)

  // ── Step 5: Persist advice record ─────────────────────────────────────────
  const createdAt = new Date()
  const adviceRef = db.collection(ADVICE_COLLECTION).doc()
  await adviceRef.set({
    userId,
    queryText: query,
    responseText,
    sourcedDocuments,
    modelUsed,
    createdAt,
  })

  // ── Step 6: Return ────────────────────────────────────────────────────────
  return {
    id: adviceRef.id,
    userId,
    queryText: query,
    responseText,
    sourcedDocuments,
    modelUsed,
    createdAt,
  }
}
