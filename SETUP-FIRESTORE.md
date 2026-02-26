# Firestore Setup - Complete Action Plan

## Quick Start (5 Steps, ~15 minutes)

### ✅ Step 1: Create Firestore Database

**Time: 2-3 minutes**

1. Open https://console.firebase.google.com/
2. Select **farmlink-zambia** project
3. Click **Firestore Database** (left sidebar)
4. Click blue **Create Database** button
5. Choose:
   - Location: `us-central1` (default)
   - Mode: `Production mode`
6. Click **Create**
7. **⏳ Wait for database to initialize (2-3 minutes)**

**✅ Verify:** You should see "Firebase Cloud Firestore" with empty collections list

---

### ✅ Step 2: Download Service Account Key

**Time: 2 minutes**

1. Still in Firebase Console
2. Click ⚙️ **Settings** (top right)
3. Click **Service Accounts** tab
4. Click blue **Generate New Private Key** button
5. A JSON file downloads automatically
6. **Move it to project root:**
   - Rename (if needed): `firebase-service-key.json`
   - Place in: `c:\Projects\Farm-Link-Zambia\` (same level as package.json, docs/, apps/)

**✅ Verify:** File exists at `C:\Projects\Farm-Link-Zambia\firebase-service-key.json`

---

### ✅ Step 3: Deploy Firestore Rules

**Time: 1 minute**

Open terminal in project root and run:

```bash
firebase deploy --only firestore:rules
```

Expected output:

```
i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file compiled successfully
i  firestore: uploading rules...
✔  firestore: released new rules to cloud.firestore
```

**✅ Verify:** Deployment successful

---

### ✅ Step 4: Seed Crop Data

**Time: 2 minutes**

Run the initialization script:

```bash
cd apps/functions
npx ts-node src/scripts/firestore-init.ts
```

Expected output:

```
🌾 Starting Firestore initialization for Farm-Link Zambia...

📚 Seeding crops collection...
  ✅ Created crop: Corn (Maize)
  ✅ Created crop: Soybean
  ✅ Created crop: Groundnuts
  ✅ Created crop: Sorghum
  ✅ Created crop: Cassava
  ✅ Created crop: Tobacco
  ✅ Created crop: Cotton
  ✅ Created crop: Wheat
  ✅ Created crop: Beans
  ✅ Created crop: Sweet Potato

✨ Successfully initialized Firestore!
📦 Collections created:
  - crops (10 crops seeded)
  - users (ready for user profiles)
  - advice (ready for advice history)
  - pests (ready for pest data)
  - diseases (ready for disease data)
  - weatherData (ready for weather caching)
  - marketPrices (ready for market data)
```

**✅ Verify:** Go to Firebase Console > Firestore > Crops collection should have 10 items

---

### ✅ Step 5: Test in App

**Time: 3 minutes**

1. Make sure dev server is running:

   ```bash
   npm run dev
   ```

2. **Create a test account:**

   - Go to http://localhost:5173
   - Click "Sign Up"
   - Enter: email, password, name
   - Click "Sign Up"

3. **Test profile editing:**

   - Should redirect to Dashboard
   - Click **Profile** in navigation
   - Change your **Full Name**
   - Click **Save Changes**
   - Should see: "Profile updated successfully!" ✅

4. **Test persistence:**

   - **Refresh the page** (Ctrl+R)
   - Should **stay on Dashboard** (NOT go to Landing) ✅
   - Your full name should be saved ✅

5. **Verify data in Firebase:**
   - Firebase Console > Firestore > Collections
   - Click **users** collection
   - Should see your user document with name, email, etc.

---

## Troubleshooting

### Error: "Cannot find module 'firebase-admin'"

```bash
cd apps/functions
npm install
```

### Error: "Permission denied" when saving profile

**Cause:** Security rules not deployed

**Fix:**

```bash
firebase deploy --only firestore:rules
```

### Error: "FIREBASE_CONFIG not found"

**Cause:** Missing service account key

**Fix:**

1. Download firebase-service-key.json from Firebase Console (described in Step 2)
2. Place in project root directory
3. Re-run the seed script

### Profile changes not saving

**Cause:** Firestore not initialized

**Check:**

1. Firebase Console > Firestore Database exists?
2. Collections exist (click "Collections" tab)?
3. Security rules deployed?

If unsure, start from Step 1 again.

### Still goes to Landing on refresh

**Cause:** User data not in Firestore

1. Check Firebase Console > Firestore > users collection
2. Should see your user document there
3. If empty, the auth state check is failing
4. Try: Delete user in Firebase Console and sign up again

---

## Files You've Created

| File                                           | Purpose                                              |
| ---------------------------------------------- | ---------------------------------------------------- |
| `firebase-service-key.json`                    | Service account credentials (download from Firebase) |
| `check-firestore.ts`                           | Status checker script                                |
| `firestore.rules`                              | Already exists - security rules                      |
| `apps/functions/src/scripts/firestore-init.ts` | Seed script - creates crops data                     |
| `docs/DATABASE-SCHEMA.md`                      | Database structure documentation                     |

---

## What Each Step Does

| Step | Creates                    | Purpose                                      |
| ---- | -------------------------- | -------------------------------------------- |
| 1    | Firestore Database         | Cloud storage for all app data               |
| 2    | Service Account Key        | Credentials to access Firestore from scripts |
| 3    | Security Rules             | Who can read/write what data                 |
| 4    | crops Collection           | 10 Zambian crops with details                |
| 5    | users & advice Collections | User profiles and advice history             |

---

## Next: What to Build After This

Once Firestore is working:

1. **Create tRPC endpoints** for data queries
2. **Build Weather Integration** with real API
3. **Add Pest/Disease Identification**
4. **Implement RAG Engine** with Vertex AI (Phase 2-3)

See TDD.MD and TODO.MD in docs/ci-cd/ for full roadmap.

---

## Quick Reference

```bash
# Check Firestore setup status
npx ts-node check-firestore.ts

# Deploy rules
firebase deploy --only firestore:rules

# Seed crop data
cd apps/functions && npx ts-node src/scripts/firestore-init.ts

# Start dev server
npm run dev

# View Firestore in browser
# https://console.firebase.google.com/ > farmlink-zambia > Firestore Database
```

---

**You're all set! Follow these 5 steps and your Firestore will be ready. 🚀**
