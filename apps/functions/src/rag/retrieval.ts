/**
 * Firestore retrieval + cosine similarity ranking.
 *
 * Embeddings are stored in Firestore by the Python ingestion pipeline.
 * We load all chunks for the requested knowledge-base documents, rank
 * them by cosine similarity against the query embedding, and return
 * the top-K most relevant chunks to use as RAG context.
 */
import { db } from './firebase.js'
import { generateQueryEmbedding } from './embeddings.js'

export const KNOWLEDGE_BASE_COLLECTION = 'knowledge_base'
const DEFAULT_TOP_K = 8

export interface RetrievedChunk {
  text: string
  page: number
  docName: string
  similarity: number
}

// ── Cosine similarity ─────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let magA = 0
  let magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

// ── Retrieval ─────────────────────────────────────────────────────────────────

/**
 * Load all chunk embeddings for one knowledge-base document.
 * Returns an empty array if the document doesn't exist.
 */
async function loadDocumentChunks(
  docName: string
): Promise<Array<{ text: string; page: number; embedding: number[] }>> {
  const docRef = db.collection(KNOWLEDGE_BASE_COLLECTION).doc(docName)
  const docSnap = await docRef.get()
  if (!docSnap.exists) return []

  const chunksSnap = await docRef.collection('chunks').get()
  return chunksSnap.docs.map(d => {
    const data = d.data()
    return {
      text: data['text'] as string,
      page: data['page'] as number,
      embedding: data['embedding'] as number[],
    }
  })
}

/**
 * Retrieve the top-K most relevant chunks across all knowledge-base documents
 * that match a given query string.
 *
 * @param query   - Farmer's natural-language question
 * @param docs    - Firestore document IDs to search (e.g. ['maize-guide', 'zari-2024'])
 *                  Pass an empty array to search ALL documents.
 * @param topK    - Number of chunks to return
 */
export async function retrieveRelevantChunks(
  query: string,
  docs: string[] = [],
  topK: number = DEFAULT_TOP_K
): Promise<RetrievedChunk[]> {
  // 1. Embed the query
  const queryEmbedding = await generateQueryEmbedding(query)

  // 2. Determine which documents to search
  let docNames = docs
  if (docNames.length === 0) {
    // Load all document IDs from the collection
    const snapshot = await db.collection(KNOWLEDGE_BASE_COLLECTION).get()
    docNames = snapshot.docs.map(d => d.id)
  }

  if (docNames.length === 0) {
    return []
  }

  // 3. Load chunks + compute similarity
  const scored: RetrievedChunk[] = []

  for (const docName of docNames) {
    const chunks = await loadDocumentChunks(docName)
    for (const chunk of chunks) {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding)
      scored.push({ text: chunk.text, page: chunk.page, docName, similarity })
    }
  }

  // 4. Sort descending and return top-K
  scored.sort((a, b) => b.similarity - a.similarity)
  return scored.slice(0, topK)
}

/** Format retrieved chunks into a context string for the LLM prompt. */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return 'No relevant agricultural documents found.'

  return chunks
    .map((c, i) => `[${i + 1}] Source: ${c.docName} (page ${c.page})\n${c.text}`)
    .join('\n\n')
}
