/**
 * Farm-Link Zambia - Manual Firestore Setup Guide
 *
 * If the automatic initialization script doesn't work, follow these steps.
 */

// Step 1: Prepare Firebase Project
// ================================

// Make sure you have Firebase CLI installed:
// npm install -g firebase-tools

// Login to Firebase:
// firebase login

// Set the project:
// firebase use farmlink-zambia

// Step 2: Create Firestore Database
// ==================================

// Option A: Via Firebase Console (Recommended for first-time setup)
// 1. Go to https://console.firebase.google.com/
// 2. Select "farmlink-zambia" project
// 3. Click "Firestore Database" in left sidebar
// 4. Click "Create Database"
// 5. Choose region: us-central1 (default)
// 6. Select "Start in test mode" (we'll update rules)
// 7. Click "Create"
// 8. Wait for database to initialize (2-3 minutes)

// Option B: Via Firebase CLI
// firebase firestore:create --region us-central1

// Step 3: Deploy Security Rules
// ==============================

// Run this command:
// firebase deploy --only firestore:rules

// This deploys the rules from firestore.rules file

// Step 4: Seed Initial Data
// =========================

// The crops and other reference data are created using the script at:
// apps/functions/src/scripts/firestore-init.ts

// If firestore-admin is already installed, run:
// cd apps/functions
// npx ts-node src/scripts/firestore-init.ts

// If you get errors about credentials, either:
// A. Download service account key from Firebase Console:
//    - Settings > Service Accounts > Generate New Private Key
//    - Save as firebase-service-key.json in project root
//
// B. Or use Firebase Emulator (for local development):
//    - firebase emulators:start
//    - Then run the init script pointed to localhost

// Step 5: Deploy Firestore Indexes (Optional)
// ============================================

// If you have custom indexes defined:
// firebase deploy --only firestore:indexes

// Step 6: Test the Setup
// ======================

// 1. Start the dev server:
//    npm run dev

// 2. Open http://localhost:5173

// 3. Create a test account

// 4. Go to Dashboard > Profile

// 5. Edit your name and click "Save Changes"
//    - Should work now (no infinite loading)
//    - Should show "Profile updated successfully!"

// 6. Refresh the page
//    - Should stay on Dashboard
//    - Should NOT go to Landing page

// 7. Check Firestore in Firebase Console:
//    - You should see:
//      - users collection with your user document
//      - crops collection with 10 crops
//      - Both populated with data

// Verify Data Structure
// =====================

// In Firebase Console > Firestore:

// users collection:
// {
//   id: "firebase-uid",
//   email: "user@example.com",
//   name: "Your Name",
//   location: "Your Location",
//   createdAt: <Timestamp>,
//   updatedAt: <Timestamp>
// }

// crops collection (10 documents):
// {
//   id: "corn",
//   name: "Corn (Maize)",
//   description: "...",
//   icon: "🌽",
//   plantingSeasons: ["November", "December"],
//   harvestingPeriod: "April - May",
//   optimalConditions: {
//     temperature: { min: 15, max: 35 },
//     rainfall: { min: 400, max: 800 },
//     soilTypes: ["loamy", "sandy-loam", "clay-loam"]
//   },
//   createdAt: <Timestamp>,
//   updatedAt: <Timestamp>
// }

export {}
