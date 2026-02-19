# To-Do List (Markdown Style)

This detailed To-Do list outlines the initial development steps, incorporating the RAG engine and Vertex AI.
   Phase 1: Project Setup & Core Infrastructure (Weeks 1-2)
   ●Initialize Monorepo:
   ○ Create pnpm-workspace.yaml.
   ○ Set up apps/web (React + Vite) and apps/functions (Google Cloud Functions).
   ○ Configure Turborepo.
   ● Google Cloud Project Setup:
   ○ Create a new Google Cloud project.
   ○ Enable Firebase services (Authentication, Firestore, Storage).
   ○ Enable Cloud Functions API and Vertex AI API.
   ○ Configure Firebase CLI and project aliases.
   ● Shared tRPC & Zod Setup:
   ○ Create a packages/api workspace for tRPC router and Zod schemas.
   ○ Connect frontend to tRPC backend.
   ● Authentication Module:
   ○ Implement Firebase Auth for user registration and login.
   ○ Create basic user profile management (Firestore users collection).
   ● UI Kit Integration:
   ○ Set up Tailwind CSS in apps/web.
   ○ Integrate shadcn/ui components (e.g., Button, Input, Card).
   ● Environment Variables:
   ○ Configure T3 Env for type-safe environment variables.
   Phase 2: Core Farm-Link Zambia Functionality & RAG Engine (Weeks 3-6)
   ● Knowledge Base Ingestion Pipeline:
   ○ Develop a script/Cloud Function to parse and chunk agricultural documents (PDFs, text files from ZARI, Ministry of Agriculture).
   ○ Use Vertex AI's embedding models to generate vector embeddings for each chunk.
   ○ Populate a Vertex AI Vector Database (e.g., Matching Engine) with these embeddings and their corresponding text content.
   ● RAG Engine Implementation (Google Cloud Function):
   ○ Create a Google Cloud Function to serve as the RAG Engine.
   ○ Implement logic to take a farmer's query.
   ○ Call Vertex AI's embedding model to get the query's embedding.
   ○ Query the Vertex AI Vector Database to retrieve top-k relevant document chunks.
   ○ Construct a prompt for the LLM using the farmer's query and the retrieved context.
   ○ Call the Vertex AI Gemini API (LLM) with the augmented prompt.
   ○ Return the LLM's generated response.
   ● AI Advisory Integration (advice.askAI):
   ○ Implement tRPC procedure for advice.askAI that calls the RAG Engine Cloud Function.
   ○ Develop frontend UI for asking questions and displaying AI responses.
   ○ Store AI advice history in Firestore.
   ● Crop Information Display:
   ○ Populate initial crops data in Firestore (manual or script).
   ○ Create a frontend page to browse crops and view details.
   ○ Implement tRPC procedures for crops.getCropDetails.
   ● Basic Weather Display:
   ○ Integrate a commercial weather API in a Google Cloud Function.
   ○ Implement tRPC procedure for weather.getForecast.
   ○ Display current weather and a short-term forecast on the frontend.
   ● Simple Pest/Disease Lookup (Text-based):
   ○ Populate initial pests and diseases data in Firestore.
   ○ Implement tRPC procedures for pests.getPestDetails and diseases.getDiseaseDetails.
   ○ Create a search/lookup feature on the frontend.
   Phase 3: Testing & Refinement (Weeks 7-8)
   ● Unit/Component Testing:
   ○ Write Vitest tests for core utility functions and tRPC procedures.
   ○ Write Testing Library tests for key React components.
   ● Storybook Setup:
   ○ Configure Storybook for apps/web.
   ○ Create stories for shadcn/ui components and custom components.
   ○ Implement Storybook interaction tests.
   ● End-to-End Testing:
   ○ Set up Playwright.
   ○ Write basic E2E tests for user flows (e.g., login, ask AI, view crop).
   ● Linting & Formatting:
   ○ Ensure ESLint and Prettier are configured and integrated into the development workflow.
   ○ Address all linting and formatting issues.

---

3.Git Flow Setup
We will adopt a simplified Git Flow branching model, suitable for continuous delivery while maintaining stability.
● main branch: Represents the production-ready code. Only accepts merges from release branches. Tagged with version numbers for releases.
● develop branch: Integration branch for all new features. All feature branches are merged into develop. Represents the latest stable development version.
● feature/`<feature-name>` branches: Created from develop for each new feature or significant change. Merged back into develop upon completion.
● release/`<version>` branches: Created from develop when preparing for a new release. Used for final testing, bug fixes, and preparing release notes. Merged into main and develop upon release.
● hotfix/`<hotfix-name>` branches: Created from main to address critical bugs in production. Merged into main and develop upon completion.

---

4.CI/CD Pipeline (GitHub Actions)
The CI/CD pipeline will automate testing, building, and deployment processes using GitHub Actions, targeting Google Cloud environments.
4.1. Workflow Triggers
● on: push: Triggered on pushes to develop, main, release/_, hotfix/_ branches.
● on: pull_request: Triggered on PRs targeting develop, main.
4.2. Stages
● lint Job: Runs pnpm lint across all workspaces.
● test Job: Runs pnpm test (Vitest) across all workspaces.
● build Job: Runs pnpm build to build frontend and backend artifacts.
● deploy-staging Job: Deploys to Firebase Hosting and Google Cloud Functions in the staging Google Cloud project.
○ Trigger: push to develop branch.
○ Action: firebase deploy --only hosting,functions --project your-staging-project-id
● e2e-test Job: Runs Playwright end-to-end tests against the deployed staging environment.
○ Trigger: After deploy-staging completes successfully.
● deploy-production Job: Deploys to Firebase Hosting and Google Cloud Functions in the production Google Cloud project.
○ Trigger: push to main branch (after build and e2e-test on staging pass).
○ Action: firebase deploy --only hosting,functions --project your-production-project-id
4.3. Google Cloud / Firebase Project Setup for CI/CD

1. Create Google Cloud Projects: You'll typically have at least two Google Cloud projects: one for staging (e.g., farm-link-staging) and one for production (e.g., farm-link-prod).
2. Enable APIs: Ensure Cloud Functions API, Vertex AI API, Firebase Hosting API, Cloud Firestore API, and Cloud Storage API are enabled in both projects.
3. Generate Service Account Keys:
   ○ In each Google Cloud project, navigate to IAM & Admin > Service Accounts.
   ○ Create a new service account (e.g., github-actions-deployer) with roles like Cloud Functions Developer, Firebase Admin, Storage Admin, Vertex AI User, Service Account User.
   ○ Generate a new JSON key for each service account.
4. GitHub Secrets:
   ○ In your GitHub repository, go to Settings > Secrets and variables > Actions.
   ○ Create two new repository secrets:
   ■ GCP_SERVICE_ACCOUNT_STAGING: Paste the entire JSON content of your staging service account key file here.
   ■ GCP_SERVICE_ACCOUNT_PRODUCTION: Paste the entire JSON content of your production service account key file here.
5. Firebase CLI Aliases (Optional, for local development):
   Bash
   
   firebase use --add farm-link-staging staging
6. firebase use --add farm-link-prod production
7. 
