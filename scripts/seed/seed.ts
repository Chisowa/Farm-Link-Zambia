/**
 * Farm-Link Zambia — Firestore Seed Script
 * ==========================================
 * Seeds the 'crops', 'pests', and 'diseases' Firestore collections
 * with Zambian agricultural data.
 *
 * Prerequisites:
 *   1. Install tsx globally:  npm install -g tsx
 *   2. Set up .env file in apps/functions/ with Firebase credentials
 *   3. Run: npx tsx scripts/seed/seed.ts
 *
 * Or with env vars inline:
 *   FIREBASE_PROJECT_ID=farmlink-zambia \
 *   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." \
 *   FIREBASE_CLIENT_EMAIL="..." \
 *   npx tsx scripts/seed/seed.ts
 */

import * as admin from 'firebase-admin'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load .env from apps/functions/
dotenv.config({ path: path.resolve(process.cwd(), 'apps/functions/.env') })

import { CROPS } from './data/crops.js'
import { PESTS } from './data/pests.js'
import { DISEASES } from './data/diseases.js'

// ── Firebase Admin init ───────────────────────────────────────────────────────
const projectId = process.env.FIREBASE_PROJECT_ID ?? 'farmlink-zambia'
const privateKey = process.env.FIREBASE_PRIVATE_KEY
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

if (!admin.apps.length) {
  if (privateKey && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    })
    console.log('✓ Initialized Firebase Admin with service account credentials')
  } else {
    // Fall back to Application Default Credentials (gcloud auth application-default login)
    admin.initializeApp({ projectId })
    console.log('✓ Initialized Firebase Admin with Application Default Credentials')
  }
}

const db = admin.firestore()

// ── Seeder ────────────────────────────────────────────────────────────────────
async function seedCollection<T extends { id: string }>(
  collectionName: string,
  records: T[]
): Promise<void> {
  console.log(`\n[→] Seeding '${collectionName}' (${records.length} records)...`)
  const batch = db.batch()

  for (const record of records) {
    const { id, ...data } = record
    const ref = db.collection(collectionName).doc(id)
    batch.set(ref, {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
  console.log(`[✓] '${collectionName}' seeded with ${records.length} records`)
}

async function main(): Promise<void> {
  console.log('\n=== Farm-Link Zambia Firestore Seeder ===')
  console.log(`Project: ${projectId}\n`)

  try {
    await seedCollection('crops', CROPS)
    await seedCollection('pests', PESTS)
    await seedCollection('diseases', DISEASES)

    console.log('\n=== Seeding complete! ===')
    console.log('Collections seeded:')
    console.log(`  crops    → ${CROPS.length} records`)
    console.log(`  pests    → ${PESTS.length} records`)
    console.log(`  diseases → ${DISEASES.length} records`)
    console.log('\nYou can now view data at:')
    console.log(`  https://console.firebase.google.com/project/${projectId}/firestore`)
  } catch (error) {
    console.error('\n[✗] Seeding failed:', error)
    process.exit(1)
  }
}

main()
