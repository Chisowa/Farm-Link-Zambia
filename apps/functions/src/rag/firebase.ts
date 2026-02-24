/**
 * Firebase Admin singleton for the RAG engine.
 * Initialises once and reuses the same app across hot-reloads.
 */
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

import { env } from '../env.js'

if (!getApps().length) {
  if (env.FIREBASE_PRIVATE_KEY && env.FIREBASE_CLIENT_EMAIL) {
    // Service account credentials (production / CI)
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
      }),
    })
  } else {
    // Application Default Credentials (local dev: gcloud auth application-default login)
    initializeApp({
      credential: applicationDefault(),
      projectId: env.FIREBASE_PROJECT_ID,
    })
  }
}

export const db = getFirestore()
