# RAG Engine Setup Guide

## Overview

The RAG (Retrieval Augmented Generation) Engine is the core intelligence of Farm-Link Zambia. It uses Vertex AI to:

1. **Retrieve** relevant agricultural knowledge from a vector database
2. **Augment** user queries with this context
3. **Generate** precise responses using the Gemini API

## Architecture

```plaintext
User Query
    ↓
Query Embedding (Vertex AI Embedding Model)
    ↓
Vector Search (Matching Engine / Vector Database)
    ↓
Retrieve Top-K Documents
    ↓
Construct Augmented Prompt
    ↓
LLM Call (Gemini API)
    ↓
Response Generation
    ↓
Store in Firestore
```

## Phase 1: Vector Database Setup

### Option A: Vertex AI Matching Engine

Vertex AI Matching Engine is Google's managed vector search service.

#### 1. Create an Index Endpoint

```bash
gcloud ai index-endpoints create \
  --display-name="farm-link-index-endpoint" \
  --region=us-central1
```

#### 2. Create an Index

```bash
# First, create a GCS bucket for your embeddings
gsutil mb gs://farm-link-embeddings

# Create the index
gcloud ai indexes create \
  --display-name="farm-link-index" \
  --region=us-central1 \
  --index=your-index-definition.json
```

### Option B: Firestore Vector Search (Simpler Alternative)

For MVP, use Firestore directly:

```javascript
// In Firestore, store documents with embeddings
{
  content: string,
  embedding: number[],  // Vector from embedding model
  source: string,
  docId: string,
  section: string
}
```

## Phase 2: Document Ingestion Pipeline

### Prepare Your Knowledge Base

Gather source documents:

- ZARI research bulletins
- Ministry of Agriculture PDFs
- Farmer manuals
- Crop guides
- Market reports

### Cloud Function: Document Ingestion

Create `apps/functions/src/rag/ingestDocuments.ts`:

```typescript
import * as admin from 'firebase-admin'
import { VertexAI } from '@google-cloud/vertexai'

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.VERTEX_AI_LOCATION,
})

interface Document {
  filename: string
  content: string
  source: string
}

export async function ingestDocument(doc: Document) {
  // 1. Chunk the document
  const chunks = chunkDocument(doc.content, 500) // 500 char chunks with overlap

  // 2. Generate embeddings for each chunk
  const db = admin.firestore()
  const batch = db.batch()

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk)

    const docRef = db.collection('knowledge_base').doc()
    batch.set(docRef, {
      content: chunk,
      embedding: embedding,
      source: doc.source,
      filename: doc.filename,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        topicArea: extractTopic(doc.content),
        language: 'en',
      },
    })
  }

  await batch.commit()
  console.log(`Ingested ${chunks.length} chunks from ${doc.filename}`)
}

function chunkDocument(content: string, chunkSize: number = 500): string[] {
  const chunks: string[] = []
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.substring(i, i + chunkSize + 100)) // 100 char overlap
  }
  return chunks
}

async function generateEmbedding(text: string): Promise<number[]> {
  const model = vertexAI.getGenerativeModel({
    model: 'textembedding-gecko@001',
  })

  const result = await model.embedContent({
    content: {
      role: 'user',
      parts: [{ text }],
    },
  })

  const embedding = result.embedding.values
  if (!embedding || typeof embedding === 'string') {
    throw new Error('Failed to generate embedding')
  }
  return embedding
}

function extractTopic(text: string): string {
  // Simple heuristic - improve this
  if (text.includes('maize') || text.includes('corn')) return 'maize'
  if (text.includes('wheat')) return 'wheat'
  if (text.includes('soybean')) return 'soybean'
  return 'general'
}
```

### Deploy Ingestion Cloud Function

```bash
firebase deploy --only functions:ingestDocuments
```

## Phase 3: RAG Query Endpoint

### Cloud Function: RAG Engine

Create `apps/functions/src/rag/queryRag.ts`:

```typescript
import * as admin from 'firebase-admin'
import { VertexAI } from '@google-cloud/vertexai'
import { publicProcedure } from '../trpc/trpc'
import { z } from 'zod'

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.VERTEX_AI_LOCATION,
})

export const ragQueryProcedure = publicProcedure
  .input(
    z.object({
      query: z.string().min(5),
      topK: z.number().min(1).max(20).default(5),
      userId: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      // 1. Generate embedding for the query
      const queryEmbedding = await generateEmbedding(input.query)

      // 2. Retrieve relevant documents from Firestore
      const relevantDocs = await retrieveRelevantDocuments(queryEmbedding, input.topK)

      // 3. Build augmented prompt
      const augmentedPrompt = buildAugmentedPrompt(input.query, relevantDocs)

      // 4. Call Gemini API
      const response = await callGeminiAPI(augmentedPrompt)

      // 5. Store advice in Firestore
      const db = admin.firestore()
      const adviceRef = db.collection('advice').doc()

      await adviceRef.set({
        userId: input.userId || 'anonymous',
        queryText: input.query,
        responseText: response,
        sourcedDocuments: relevantDocs.map(doc => doc.id),
        model: 'gemini-pro',
        temperature: 0.7,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          topKRetrieved: input.topK,
          relevanceScores: relevantDocs.map(doc => doc.score),
        },
      })

      return {
        id: adviceRef.id,
        response: response,
        sourcedDocuments: relevantDocs.map(doc => ({
          id: doc.id,
          content: doc.content,
          source: doc.source,
          score: doc.score,
        })),
      }
    } catch (error) {
      console.error('RAG query failed:', error)
      throw new Error('Failed to generate agricultural advice')
    }
  })

async function generateEmbedding(text: string): Promise<number[]> {
  const model = vertexAI.getGenerativeModel({
    model: 'textembedding-gecko@001',
  })

  const result = await model.embedContent({
    content: {
      role: 'user',
      parts: [{ text }],
    },
  })

  const embedding = result.embedding.values
  if (!embedding || typeof embedding === 'string') {
    throw new Error('Failed to generate embedding')
  }
  return embedding
}

interface RetrievedDoc {
  id: string
  content: string
  source: string
  score: number
}

async function retrieveRelevantDocuments(
  queryEmbedding: number[],
  topK: number
): Promise<RetrievedDoc[]> {
  const db = admin.firestore()

  // Get all documents from knowledge base
  const snapshot = await db.collection('knowledge_base').get()
  const documents: RetrievedDoc[] = []

  // Simple cosine similarity (in production, use proper vector search)
  snapshot.forEach(doc => {
    const data = doc.data()
    const docEmbedding = data.embedding as number[]
    const score = cosineSimilarity(queryEmbedding, docEmbedding)

    documents.push({
      id: doc.id,
      content: data.content,
      source: data.source,
      score,
    })
  })

  // Sort by score and return top K
  return documents.sort((a, b) => b.score - a.score).slice(0, topK)
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

function buildAugmentedPrompt(query: string, relevantDocs: RetrievedDoc[]): string {
  const context = relevantDocs.map((doc, idx) => `[Source ${idx + 1}]\n${doc.content}`).join('\n\n')

  return `You are an expert agricultural advisor for Zambian farmers. 
Based on the following agricultural knowledge, answer the farmer's question.
Be specific, practical, and based on the provided information.

Agricultural Knowledge:
${context}

Farmer's Question: ${query}

Please provide a detailed, practical answer that a farmer in Zambia can implement.`
}

async function callGeminiAPI(prompt: string): Promise<string> {
  const model = vertexAI.getGenerativeModel({
    model: 'gemini-pro',
  })

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  })

  const response = result.response.candidates?.[0]?.content.parts[0]
  if (!response || response.text === undefined) {
    throw new Error('No response from Gemini API')
  }

  return response.text
}
```

## Phase 4: Firestore Knowledge Base Schema

```javascript
// Collection: knowledge_base
{
  docId: string,
  content: string,
  embedding: number[],  // 768-dimensional vector
  source: string,       // e.g., "ZARI Bulletin 2024"
  filename: string,
  metadata: {
    topicArea: string,  // maize, wheat, soybean, pest, disease, weather
    language: string,
    confidence: number
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Phase 5: Frontend Integration

### Hook: useAskAI

Create `apps/web/src/hooks/useAskAI.ts`:

```typescript
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'

export function useAskAI() {
  return useMutation({
    mutationFn: async (query: string) => {
      return trpc.advice.askAI.mutate({
        query,
        userId: 'user-123', // Get from auth context
      })
    },
  })
}
```

### Component: Question Form

```typescript
import { useState } from 'react';
import { useAskAI } from '@/hooks/useAskAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AskAIForm() {
  const [query, setQuery] = useState('');
  const { mutate, isPending, data } = useAskAI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(query);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask about crops, pests, diseases, weather..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !query.trim()}>
          {isPending ? 'Thinking...' : 'Ask AI'}
        </Button>
      </form>

      {data && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold mb-2">Agricultural Advice:</p>
          <p className="text-gray-700">{data.response}</p>
          {data.sourcedDocuments.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-semibold mb-2">Sources:</p>
              {data.sourcedDocuments.map((doc) => (
                <div key={doc.id} className="text-gray-600">
                  <p>- {doc.source} (confidence: {doc.score.toFixed(2)})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Testing the RAG Engine

```bash
# Test embedding generation
curl -X POST https://FUNCTION_URL/generateEmbedding \
  -H "Content-Type: application/json" \
  -d '{"text": "How do I grow better maize?"}'

# Test RAG query
curl -X POST https://FUNCTION_URL/queryRAG \
  -H "Content-Type: application/json" \
  -d '{
    "query": "My crops have brown spots. What should I do?",
    "topK": 5
  }'
```

## Optimization Tips

1. **Caching**: Cache frequently asked questions
2. **Context Window**: Limit retrieved documents to stay within API limits
3. **Batch Processing**: Ingest documents in batches
4. **Monitoring**: Log all queries for improvement feedback

## Costs

**Vertex AI Pricing** (as of 2024):

- Text Embeddings: $0.0001 per 1K vectors
- Gemini API: $0.0005/1K input tokens, $0.0015/1K output tokens
- Matching Engine: $0.25 per 1M queries

**Estimate for 1000 farmers, 10 queries/month**:

- ~10,000 embeddings: $1/month
- ~100,000 API calls: ~$50/month
- **Total: ~$50-100/month**

## References

- [Vertex AI Embedding Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings)
- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart)
- [Firestore Vector Search](https://cloud.google.com/firestore/docs/vector-search)
