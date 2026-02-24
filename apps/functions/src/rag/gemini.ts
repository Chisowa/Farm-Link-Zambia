/**
 * Gemini 2.0 Flash response generation via @google-cloud/vertexai.
 *
 * Receives an augmented prompt (query + retrieved context) and returns
 * the model's grounded, agricultural-domain response.
 */
import { VertexAI } from '@google-cloud/vertexai'

import { env } from '../env.js'

const vertexAI = new VertexAI({
  project: env.GOOGLE_CLOUD_PROJECT,
  location: env.VERTEX_AI_LOCATION,
})

const GENERATION_CONFIG = {
  temperature: 0.3, // lower = more factual
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
}

/** Build the system instruction that primes Gemini for agricultural advice. */
function buildSystemInstruction(): string {
  return `You are FarmAdvisor, an expert agricultural advisor for Zambian smallholder farmers.
You provide practical, accurate advice grounded in Zambian agricultural knowledge
(ZARI research bulletins, Ministry of Agriculture publications, and proven farming manuals).

Guidelines:
- If CONTEXT documents are provided, base your answer on them and cite the source
- If no relevant context documents are available, use your expert agricultural knowledge to give the best possible advice for Zambian farming conditions
- Always provide a helpful, actionable answer — never refuse to answer a farming question
- Use simple, accessible language suitable for smallholder farmers
- Include specific quantities, timings, and actionable steps where available
- Mention which agro-ecological zone (Zone I, II, or III) the advice applies to where relevant
- Respond in the same language as the farmer's question (English or Nyanja)`
}

/** Build the full augmented prompt from query + retrieved context. */
function buildPrompt(query: string, context: string): string {
  const hasContext = context && context !== 'No relevant agricultural documents found.'

  return hasContext
    ? `CONTEXT (from Farm-Link Zambia agricultural knowledge base):
${context}

---

FARMER'S QUESTION:
${query}

---

Answer the farmer's question using the context above. Cite the source document where possible.`
    : `FARMER'S QUESTION:
${query}

---

No documents were found in the knowledge base for this topic.
Please answer using your expert knowledge of Zambian smallholder farming practices.`
}

export interface GeminiResponse {
  text: string
  modelUsed: string
}

/** Call Gemini and return the generated text. */
export async function generateAdvice(query: string, context: string): Promise<GeminiResponse> {
  const model = vertexAI.getGenerativeModel({
    model: env.VERTEX_AI_MODEL_ID,
    systemInstruction: buildSystemInstruction(),
    generationConfig: GENERATION_CONFIG,
  })

  const prompt = buildPrompt(query, context)

  const result = await model.generateContent(prompt)
  const response = result.response

  const candidate = response.candidates?.[0]
  if (!candidate) throw new Error('Gemini returned no candidates')

  const text = candidate.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Gemini returned an empty response')

  return { text, modelUsed: env.VERTEX_AI_MODEL_ID }
}
