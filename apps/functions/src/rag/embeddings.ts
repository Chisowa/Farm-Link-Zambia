/**
 * Vertex AI text embedding generation.
 *
 * Uses the Vertex AI REST API directly so we only depend on
 * google-auth-library (already a transitive dep of firebase-admin)
 * instead of pulling in the full @google-cloud/aiplatform SDK.
 *
 * Model: text-embedding-004  (768-dim, cost-optimised)
 */
import { GoogleAuth } from 'google-auth-library'

import { env } from '../env.js'

const EMBEDDING_MODEL = 'text-embedding-004'
const EMBEDDING_DIM = 768
const VERTEX_BASE = `https://${env.VERTEX_AI_LOCATION}-aiplatform.googleapis.com/v1`
const PREDICT_URL = `${VERTEX_BASE}/projects/${env.GOOGLE_CLOUD_PROJECT}/locations/${env.VERTEX_AI_LOCATION}/publishers/google/models/${EMBEDDING_MODEL}:predict`

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})

/** Generate one or more text embeddings in a single API call. */
export async function generateEmbeddings(
  texts: string[],
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_QUERY'
): Promise<number[][]> {
  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const token = tokenResponse.token

  if (!token) throw new Error('Could not obtain Google access token for Vertex AI')

  const body = {
    instances: texts.map(content => ({ content, task_type: taskType })),
    parameters: { outputDimensionality: EMBEDDING_DIM },
  }

  const response = await fetch(PREDICT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Vertex AI embeddings API error ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as {
    predictions: Array<{ embeddings: { values: number[] } }>
  }

  return data.predictions.map(p => p.embeddings.values)
}

/** Convenience wrapper for a single query string. */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const [embedding] = await generateEmbeddings([query], 'RETRIEVAL_QUERY')
  return embedding
}
