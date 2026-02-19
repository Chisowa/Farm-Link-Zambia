# Farm-Link Zambia App: Technical Design Document & Development Plan

Here's the technical design document and development plan for your Farm-Link Zambia application, presented in Markdown style. This document details the architecture, data model, and development roadmap, specifically incorporating the Retrieval Augmented Generation (RAG) engine and its integration with Vertex AI in Google Cloud.

---

1.Technical Design Document
This section outlines the architecture and core components of the Farm-Link Zambia, emphasizing the RAG implementation.
1.1. Architecture Overview
The Agri-Advisor application will feature a modern, full-stack architecture built on Google Cloud, with a strong focus on serverless components and end-to-end type safety.
● Frontend (Client): A React application built with Vite, utilizing shadcn/ui for a consistent and accessible UI, styled with Tailwind CSS. TanStack Query will handle data fetching and state, while React Hook Form and Zod manage forms and validation.
● Backend (API & Services): Google Cloud Functions (Node.js/TypeScript) will serve as the serverless backend, providing the API layer via tRPC. These functions will orchestrate interactions with Firebase services (Firestore, Firebase Auth, Firebase Storage) and the Vertex AI-powered RAG engine.
● RAG Engine (Vertex AI): This is the core intelligence component. When a user asks a question, the RAG Engine will:
1.Take the farmer's query.
2.Generate an embedding of the query using Vertex AI's embedding models.
3.Query a Vertex AI Vector Database (e.g., Vertex AI Matching Engine) containing embeddings of all agricultural knowledge documents (ZARI bulletins, Ministry of Agriculture PDFs, farmer manuals, etc.) to retrieve the most semantically relevant context.
4.Construct an augmented prompt, combining the farmer's original query with the retrieved context.
5.Send this augmented prompt to the Vertex AI Gemini API (LLM) for generating a precise, grounded, and relevant response.
● Shared Logic: Zod schemas will ensure type safety for data validation across both client and server.
● Monorepo: The entire project will be managed as a monorepo using PNPM workspaces and Turborepo for efficient build orchestration.
1.2. Key Technologies (Golden Path Stack)
● Runtime: Node.js (Google Cloud Functions)
● Language: TypeScript (strict)
● Frontend Framework: React + Vite
● UI Kit: shadcn/ui (Radix + Tailwind source-copy model)
● Styling: Tailwind CSS (design-token file)
● State / Data Fetching: TanStack Query
● Forms & Validation: React Hook Form + Zod resolver
● Shared Validation: Zod (client & server)
● API Layer: tRPC (typed RPC)
● Backend Services: Firebase Auth, Firestore, Storage, Google Cloud Functions, Vertex AI (Vector Database, Gemini API)
● Package Manager / Monorepo: PNPM workspaces
● Build Orchestration: Turborepo (remote caching)
● Component Workshop: Storybook (UI in isolation)
● Unit / Component Tests: Vitest + Testing Library
● Visual / Interaction Tests: Storybook + @storybook/testing-library
● End-to-End Tests: Playwright
● Linting: ESLint (typescript-eslint) + eslint-plugin-perfectionist
● Formatting: Prettier
● Type-safe Env Vars: T3 Env (Zod-validated)
● Versioning / Publishing: Changesets (monorepo changelogs & releases)
1.3. Data Model (High-Level)
The core data will be stored in Firestore, with the vector database handling the embeddings of knowledge documents.
● users Collection: User profiles (id, name, location, farmDetails, preferredLanguage).
● crops Collection: Static crop information (id, name, description, optimalConditions, plantingSeasons).
● advice Collection: History of AI-generated advice (id, userId, queryText, responseText, feedback, timestamp).
● pests Collection: Pest details (id, name, commonSymptoms, affectedCrops, managementStrategies).
● diseases Collection: Disease details (id, name, commonSymptoms, affectedCrops, managementStrategies).
● weatherData Collection: Cached weather forecasts and historical data (location, timestamp, temperature, rainfall, forecast).
● marketPrices Collection: Aggregated market price data (cropId, marketLocation, price, unit, date).
● Knowledge Base (for Vector DB): This is where your ZARI bulletins, Ministry of Agriculture PDFs, farmer manuals, etc., will be ingested. Each document/chunk will be processed into a vector embedding and stored in the Vertex AI Vector Database along with a reference to the original text.
1.4. API Design (tRPC)
tRPC will provide a fully type-safe API.
● Procedures:
○ auth.login, auth.register, auth.getUserProfile
○ crops.getRecommendedCrops, crops.getCropDetails
○ advice.askAI: This procedure will trigger the RAG engine within a Google Cloud Function.
○ advice.getAdviceHistory, advice.submitFeedback
○ weather.getForecast, weather.getHistorical
○ pests.identifyPest, pests.getPestDetails
○ diseases.identifyDisease, diseases.getDiseaseDetails
○ market.getPrices
