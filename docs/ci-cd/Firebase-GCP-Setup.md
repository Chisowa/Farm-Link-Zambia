# Firebase & Google Cloud Platform Setup Guide

## Overview

Farm-Link Zambia uses Firebase for authentication and data storage, and Google Cloud Platform (GCP) services for advanced features like Vertex AI-powered agricultural advisory.

## Prerequisites

- Google Cloud account
- Firebase account (part of GCP)
- `gcloud` CLI installed
- `firebase-tools` CLI installed
- Node.js 20+ and pnpm

### Installation

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Install Google Cloud CLI
# Follow: https://cloud.google.com/sdk/docs/install

# Verify installations
firebase --version
gcloud --version
```

---

## Phase 1: Google Cloud Project Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "NEW PROJECT"
3. Enter project name: `farm-link-zambia` (or `farm-link-staging` for staging)
4. Click "CREATE"

### Step 2: Enable Required APIs

In the Google Cloud Console, go to **APIs & Services** > **Library** and enable:

- **Cloud Functions API**
- **Cloud Firestore API**
- **Cloud Storage API**
- **Vertex AI API**
- **Cloud Build API**
- **Cloud Scheduler API** (for background tasks)
- **Cloud Logging API**

```bash
# Or use gcloud CLI
gcloud services list --available
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage-api.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable logging.googleapis.com
```

### Step 3: Set Your Project ID

```bash
gcloud config set project farm-link-zambia
```

---

## Phase 2: Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Select your Google Cloud project: `farm-link-zambia`
4. Accept the terms and create the project
5. Wait for the project to be created

### Step 2: Enable Firebase Services

#### Authentication (Email/Password Sign-up)

1. Go to **Authentication** in Firebase Console
2. Click **Get Started**
3. Enable "Email/Password" as a sign-in provider
4. Optionally enable "Google", "Phone", etc.

#### Firestore Database

1. Go to **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Select region: **us-central1** (or close to your users)
5. Create the database

#### Firebase Storage

1. Go to **Storage**
2. Click **Get Started**
3. Start in **Test Mode**
4. Create the bucket

### Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. In **Your Apps**, click **add app** (web icon `</>``)
3. Enter app name: `farm-link-web`
4. Register the app
5. Copy the Firebase config object (you'll need this for your `.env` file)

```javascript
// Example Firebase config from Google
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'farm-link-zambia',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}
```

---

## Phase 3: Service Account Setup (For Backend)

### Step 1: Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name: `firebase-admin`
4. Description: `Firebase Admin SDK access`
5. Click **Create and Continue**

### Step 2: Grant Roles

Assign these roles:

- **Firebase Admin SDK Administrator**
- **Cloud Datastore User**
- **Cloud Functions Developer** (for deploying functions)
- **Vertex AI User** (for RAG engine)
- **Storage Admin** (for file uploads)

### Step 3: Create and Download Keys

1. Go to the service account you created
2. Click **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON**
5. Download the key file and save it securely

This JSON key contains:

```javascript
{
  "type": "service_account",
  "project_id": "farm-link-zambia",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-admin@farm-link-zambia.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## Phase 4: Environment Configuration

### Frontend Environment Variables

Create `.env` file in `apps/web/`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=farm-link-zambia
VITE_FIREBASE_STORAGE_BUCKET=farm-link-zambia.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# tRPC API URL
VITE_TRPC_API_URL=http://localhost:3001
```

### Backend Environment Variables

Create `.env` file in `apps/functions/`:

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=farm-link-zambia
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-admin@farm-link-zambia.iam.gserviceaccount.com

# Google Cloud
GOOGLE_CLOUD_PROJECT=farm-link-zambia
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL_ID=gemini-pro

# Environment
NODE_ENV=development
```

### Setup `.env.local` from Service Account Key

```bash
# Copy the private_key value (with escaped newlines preserved)
# Copy the client_email value
```

---

## Phase 5: Firebase CLI Setup (Local Development)

### Initialize Firebase in Your Project

```bash
# Navigate to project root
cd /path/to/farm-link-zambia

# Initialize Firebase
firebase login  # Log in with your Google account

firebase init   # Follow the prompts:
# - Select: Functions, Firestore, Hosting, Storage
# - Use your project: farm-link-zambia
# - JavaScript/TypeScript for Functions
# - ESLint: Y
# - Install dependencies: Y
# - Overwrite existing files: N
```

### Configure Firebase Aliases (Development & Production)

```bash
# For staging
firebase use --add
# Select: farm-link-staging
# Alias: staging

# For production
firebase use --add
# Select: farm-link-production
# Alias: production

# Switch between projects
firebase use staging
firebase use production
```

---

## Phase 6: Firestore Data Structure

Initialize your Firestore collections and create the following structure:

### Collections to Create

#### 1. **users** Collection

```javascript
{
  uid: string (from Firebase Auth)
  email: string
  name: string
  location: string
  preferredLanguage: string
  farmDetails: {
    acreage: number
    cropTypes: string[]
    soilType: string
    region: string
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 2. **crops** Collection

```javascript
{
  id: string
  name: string
  description: string
  optimalConditions: {
    temperature: { min: number, max: number }
    rainfall: { min: number, max: number }
    soilType: string[]
  }
  plantingSeasons: string[]
  harvestingPeriod: string
  varieties: string[]
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. **advice** Collection

```javascript
{
  uid: string (user ID)
  queryText: string
  responseText: string
  sourcedDocuments: string[]
  feedback: "helpful" | "not_helpful" | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. **pests** Collection

```javascript
{
  id: string
  name: string
  commonName: string
  description: string
  commonSymptoms: string[]
  affectedCrops: string[]
  managementStrategies: string[]
  biologicalControl: string[]
  chemicalControl: string[]
  createdAt: timestamp
}
```

#### 5. **diseases** Collection

```javascript
{
  id: string
  name: string
  commonName: string
  description: string
  causative: string
  commonSymptoms: string[]
  affectedCrops: string[]
  managementStrategies: string[]
  preventiveMeasures: string[]
  createdAt: timestamp
}
```

#### 6. **weatherData** Collection

```javascript
{
  location: string
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  condition: string
  timestamp: timestamp
  forecast: [
    {
      date: timestamp
      temperature: number
      condition: string
      probabilityOfRain: number
    }
  ]
  createdAt: timestamp
}
```

#### 7. **marketPrices** Collection

```javascript
{
  cropId: string
  marketLocation: string
  price: number
  unit: string
  date: timestamp
  source: string
  updatedAt: timestamp
}
```

### Create Collections via Firestore UI

1. Go to **Firestore Database**
2. Click **Create Collection**
3. Enter collection name (e.g., `users`)
4. Add your first document manually or leave empty for now

---

## Phase 7: Vertex AI Setup (For RAG Engine)

### Enable Vertex AI API

Already enabled in Step 2, but ensure it's active.

### Create a Vector Store (Matching Engine)

```bash
# This will be configured in the RAG implementation
# For now, document this as a TODO in Phase 2 of development
```

---

## Phase 8: Cloud Functions (Deploy Backend)

### Structure

Cloud Functions will be deployed from `apps/functions/`:

```bash
apps/functions/
├── src/
│   ├── index.ts           # Cloud Functions entry point
│   ├── trpc/
│   │   ├── router.ts      # Main tRPC router
│   │   ├── trpc.ts        # tRPC initialization
│   │   └── routers/       # Individual routers
│   └── env.ts             # Environment variables
└── firebase.json          # Firebase config for functions
```

### Deploy Functions

```bash
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:api

# Deploy with staging
firebase use staging
firebase deploy --only functions
```

---

## Phase 9: GitHub Secrets (CI/CD)

For GitHub Actions deployment, add these secrets to your repository:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add new secrets:

```bash
GCP_SERVICE_ACCOUNT_STAGING = [entire JSON content from staging service account key]
GCP_SERVICE_ACCOUNT_PRODUCTION = [entire JSON content from production service account key]
FIREBASE_PROJECT_ID_STAGING = farm-link-staging
FIREBASE_PROJECT_ID_PRODUCTION = farm-link-production
```

---

## Phase 10: Local Development

### Start Development Servers

```bash
# Start emulator suite
firebase emulators:start

# In another terminal
pnpm dev

# Frontend: http://localhost:5173
# Functions: http://localhost:3001
# Firestore Emulator UI: http://localhost:4000
```

### Test Firebase Connection

```typescript
// In your app
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  /* your config */
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

console.log('Firebase initialized:', { auth, db })
```

---

## Troubleshooting

### Issue: "Permission denied" when accessing Firestore

**Solution**:

- Start with Test Mode (allow all reads/writes)
- Implement proper security rules in production
- Check service account has correct roles

### Issue: Firebase config not loading

**Solution**:

- Ensure `.env` file is in correct directory
- Restart development server after changing `.env`
- Check environment variable names match code

### Issue: Cloud Functions deployment fails

**Solution**:

- Check all required APIs are enabled
- Verify service account permissions
- Check `firebase.json` configuration
- Run `firebase deploy --debug` for verbose logging

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use Firestore Security Rules** in production (not Test Mode)
3. **Rotate service account keys** periodically
4. **Use separate projects** for staging and production
5. **Enable Cloud Audit Logs** to track all activities
6. **Implement rate limiting** on Cloud Functions

---

## Next Steps

1. Create Firestore collections with initial data
2. Implement Firebase Auth in the frontend
3. Deploy initial Cloud Functions
4. Set up Vertex AI Vector Database for RAG engine
5. Configure CI/CD pipeline with GitHub Actions

For more information, see:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Platform Documentation](https://cloud.google.com/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
