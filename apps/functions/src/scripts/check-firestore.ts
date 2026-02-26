#!/usr/bin/env node

/**
 * Farm-Link Zambia - Firestore Quick Setup Checker
 *
 * This script checks your Firestore setup status and provides next steps.
 *
 * Usage: cd apps/functions && npx ts-node src/scripts/check-firestore.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

console.log(`\n${BLUE}🌾 Farm-Link Zambia - Firestore Setup Checker${RESET}\n`)

// Get project root (two levels up from this script)
const projectRoot = path.join(__dirname, '../../..')

// Check 1: Service account key
const serviceKeyPath = path.join(projectRoot, 'firebase-service-key.json')
const hasServiceKey = fs.existsSync(serviceKeyPath)

console.log(`${hasServiceKey ? GREEN + '✅' : RED + '❌'} ${RESET} Service Account Key`)
if (!hasServiceKey) {
  console.log(`   ${YELLOW}→${RESET} Download from Firebase Console:`)
  console.log(`     1. Go to https://console.firebase.google.com/`)
  console.log(`     2. Select "farmlink-zambia" project`)
  console.log(`     3. Settings ⚙️ > Service Accounts tab`)
  console.log(`     4. Click "Generate New Private Key"`)
  console.log(`     5. Save file as "firebase-service-key.json" in project root`)
}

console.log('')

// Check 2: Firestore configuration
const firebaseRulesPath = path.join(projectRoot, 'firestore.rules')
const hasRules = fs.existsSync(firebaseRulesPath)

console.log(`${hasRules ? GREEN + '✅' : RED + '❌'} ${RESET} Firestore Security Rules`)
if (!hasRules) {
  console.log(`   ${YELLOW}→${RESET} Missing firestore.rules file`)
}

console.log('')

// Check 3: Firebase JSON config
const firebaseJsonPath = path.join(projectRoot, 'firebase.json')
const hasConfig = fs.existsSync(firebaseJsonPath)

console.log(`${hasConfig ? GREEN + '✅' : RED + '❌'} ${RESET} Firebase Configuration`)
if (!hasConfig) {
  console.log(`   ${YELLOW}→${RESET} Missing firebase.json file`)
}

console.log('')
console.log(`${BLUE}📋 Setup Instructions:${RESET}\n`)

console.log(`${YELLOW}1. Create Firestore Database${RESET}`)
console.log(`   Go to Firebase Console > Firestore Database`)
console.log(`   - Click "Create Database"`)
console.log(`   - Region: us-central1`)
console.log(`   - Start in PRODUCTION mode`)
console.log(`   - Click "Create"`)
console.log(`   (Wait 2-3 minutes for initialization)\n`)

console.log(`${YELLOW}2. Deploy Firestore Rules${RESET}`)
console.log(`   firebase deploy --only firestore:rules\n`)

console.log(`${YELLOW}3. Download Service Account Key${RESET}`)
if (!hasServiceKey) {
  console.log(`   ${RED}REQUIRED - Do this first!${RESET}`)
  console.log(`   Firebase Console > Settings > Service Accounts`)
  console.log(`   Generate New Private Key and save as "firebase-service-key.json"\n`)
} else {
  console.log(`   ${GREEN}Already configured!${RESET}\n`)
}

console.log(`${YELLOW}4. Seed Initial Crop Data${RESET}`)
console.log(`   cd apps/functions`)
console.log(`   npx ts-node src/scripts/firestore-init.ts\n`)

console.log(`${YELLOW}5. Test It!${RESET}`)
console.log(`   npm run dev`)
console.log(`   1. Sign up with test account`)
console.log(`   2. Go to Dashboard > Profile`)
console.log(`   3. Edit name and save`)
console.log(`   4. Refresh - should stay on dashboard\n`)

console.log(`${BLUE}Status:${RESET}`)
console.log(`Service Key: ${hasServiceKey ? GREEN + 'Ready' : RED + 'Missing (REQUIRED)'}${RESET}`)
console.log(`Rules: ${hasRules ? GREEN + 'Ready' : RED + 'Missing'}${RESET}`)
console.log(`Config: ${hasConfig ? GREEN + 'Ready' : RED + 'Missing'}${RESET}`)
console.log('')

if (hasServiceKey && hasRules && hasConfig) {
  console.log(`${GREEN}✅ All prerequisites met! Ready to seed data.${RESET}\n`)
  console.log(`Next: npx ts-node src/scripts/firestore-init.ts\n`)
} else {
  console.log(`${RED}⚠️ Missing prerequisites.${RESET}`)
  console.log(`Please follow the setup instructions above.\n`)
}
