# Farm-Link Zambia - Firestore Setup Guide

## Current Status ✅❌

| Component               | Status        | Notes                                             |
| ----------------------- | ------------- | ------------------------------------------------- |
| Firebase Authentication | ✅ Complete   | Users can sign up and log in                      |
| Firestore Database      | ❌ Not Set Up | Collections need to be created                    |
| Crop Data               | ❌ Not Seeded | Crops exist in app code but not in database       |
| User Profiles           | ⚠️ Partial    | Profile page exists but saving to Firestore fails |

---

## The Problem You're Experiencing

### Issue 1: Profile Edit Shows "Loading" Forever

**Why it happens:**

- When you click "Save Changes", the app tries to save to Firestore
- Since Firestore collections don't exist yet, the request fails
- The loading state never completes

**Fixed in:** ProfilePage.tsx (improved error handling and loading states)

### Issue 2: Refresh Takes You Back to Landing Page

**Why it happens:**

- When you refresh, Firebase Auth checks if you're still logged in
- The AuthContext tries to fetch your user profile from Firestore
- Firestore doesn't exist, so this fails
- Navigation context defaults to 'landing' page

**Answer:** Firestore initialization will fix this

---

## Step-by-Step Setup Guide

### Step 1: Ensure Firebase Project Exists

```bash
# Check Firebase CLI is installed
firebase --version

# Check you're connected to the right project
firebase use
# Should show: farmlink-zambia

# If not, set it:
firebase use farmlink-zambia
```

### Step 2: Create Firestore Database

**Via Firebase Console (Recommended for First-Time Setup):**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select "farmlink-zambia" project
3. Click "Firestore Database" in left sidebar
4. Click "Create Database"
5. Choose location: **us-central1** (default is fine)
6. Select **Start in production mode** (we'll update rules)
7. Click "Create"

**Via Firebase CLI:**

```bash
# This is less common but works for automated setup
firebase firestore:create
```

### Step 3: Deploy Firestore Security Rules

Create/update your Firestore security rules:

```bash
# The rules should already be in your firebase.json or separate file
# Update firebase.json to include rules if needed

firebase deploy --only firestore:rules
```

**Required Rules:** (See docs/DATABASE-SCHEMA.md for complete rules)

### Step 4: Seed Initial Crop Data

**Option A: Using the Initialization Script (Recommended)**

```bash
# Install firebase-admin if not already
cd apps/functions
npm install firebase-admin

# Run the initialization script
npx ts-node src/scripts/firestore-init.ts
```

**Option B: Manual Upload via Firebase Console**

1. Go to Firestore in Firebase Console
2. Click "Create Collection" → name it "crops"
3. Click "Add Document" and manually add each crop
4. See docs/DATABASE-SCHEMA.md for the exact structure

**What Gets Created:**

- ✅ `crops` collection with 10 Zambian crops
- ✅ Proper schema with temperature, rainfall, soil types
- ✅ Planting seasons and harvesting periods
- ✅ Timestamps for each entry

### Step 5: Test the Setup

**Test 1: Sign Up / Login**

```
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Should redirect to Dashboard (no longer goes to Landing on refresh)
```

**Test 2: Edit Profile**

```
1. On Dashboard, click "Profile" in navigation
2. Change your name to "Test User"
3. Click "Save Changes"
4. Should show "Profile updated successfully!" message
5. Refresh page - changes should persist
```

**Test 3: Verify Firestore Data**

```
1. Go to Firebase Console > Firestore
2. Click "crops" collection
3. Should see 10 crops with full details
4. Check "users" collection
5. Should see your user with name and email
```

---

## Data Structure Explanation

### What Data Are We Storing?

#### 1. **Users Collection** (`/users/{userId}`)

```javascript
{
  id: "firebase-uid",
  email: "user@example.com",
  name: "John Farmer",
  location: "Lusaka",
  createdAt: <Timestamp>,
  updatedAt: <Timestamp>
}
```

**Purpose:** Store user profiles and preferences

#### 2. **Crops Collection** (`/crops/{cropId}`)

```javascript
{
  id: "corn",
  name: "Corn (Maize)",
  description: "Staple grain crop...",
  icon: "🌽",
  plantingSeasons: ["November", "December"],
  harvestingPeriod: "April - May",
  optimalConditions: {
    temperature: { min: 15, max: 35 },
    rainfall: { min: 400, max: 800 },
    soilTypes: ["loamy", "sandy-loam"]
  },
  createdAt: <Timestamp>,
  updatedAt: <Timestamp>
}
```

**Purpose:** Reference data for crop information displayed in the app

#### 3. **Pests/Diseases Collections** (to be added later)

```javascript
{
  id: "fall-armyworm",
  name: "Fall Armyworm",
  affectedCrops: ["corn", "sorghum"],
  commonSymptoms: ["Leaf damage", "Stripped foliage"],
  managementStrategies: { ... }
}
```

#### 4. **Advice Collection** (to be added later)

```javascript
{
  id: "auto-generated",
  userId: "user-uid",
  queryText: "How do I prevent fall armyworm on my corn?",
  responseText: "AI generated response...",
  timestamp: <Timestamp>
}
```

---

## What's Next? (Development Roadmap)

### Completed ✅

- [x] Project setup with Vite, React, TypeScript
- [x] Firebase Authentication (signup/login/logout)
- [x] Navigation system
- [x] Dark/Light mode theme
- [x] UI components (buttons, forms, cards)
- [x] Basic layouts (Landing, MainLayout)

### Currently Fixing ⚠️

- [x] Firestore schema design (docs/DATABASE-SCHEMA.md)
- [x] Profile editing (ProfilePage.tsx)
- [ ] **Run Firestore initialization script** ← YOU ARE HERE

### Next Phase 🔄

1. **Create tRPC procedures** for data operations

   - `crops.getCropList()`
   - `crops.getCropDetails()`
   - `users.getUserProfile()`
   - `advice.saveAdvice()`

2. **Integrate weather API**

   - Connect to OpenWeatherMap or similar
   - Cache weather data in Firestore
   - Display on Dashboard and WeatherPage

3. **Build Pest/Disease Identification**

   - Create pests and diseases collections
   - Implement search functionality
   - Add pest management strategies

4. **Implement RAG Engine** (Future)

   - Set up Vertex AI in Google Cloud
   - Create embedding and retrieval system
   - Connect to advice.askAI endpoint

5. **Add Market Prices** (Future)
   - Aggregate crop prices from markets
   - Display trends and forecasts

---

## Troubleshooting

### "Permission denied" Error When Saving Profile

**Cause:** Firestore Security Rules not deployed correctly

**Solution:**

```bash
firebase deploy --only firestore:rules
```

### "Firestore is not ready" Error

**Cause:** Collections haven't been created yet

**Solution:**

```bash
# Create the database first via Firebase Console, then:
cd apps/functions
npx ts-node src/scripts/firestore-init.ts
```

### Initialization Script Fails (firebase-admin not found)

**Solution:**

```bash
cd apps/functions
npm install firebase-admin
npx ts-node src/scripts/firestore-init.ts
```

### Still Getting "Loading" State Forever

**Debugging Steps:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red messages)
4. Check Firestore in Firebase Console for data
5. Verify security rules allow writes to `/users/{userId}`

---

## Files Modified/Created

| File                                           | Purpose                          | Status     |
| ---------------------------------------------- | -------------------------------- | ---------- |
| `docs/DATABASE-SCHEMA.md`                      | Define all Firestore collections | ✅ Created |
| `docs/FIRESTORE-SETUP.md`                      | This setup guide                 | ✅ Created |
| `apps/functions/src/scripts/firestore-init.ts` | Seed initial data                | ✅ Created |
| `apps/web/src/components/auth/ProfilePage.tsx` | Fixed profile editing            | ✅ Updated |
| `apps/web/src/context/AuthContext.tsx`         | Better error handling            | ✅ Updated |

---

## Summary

**The Issue:** Your Firestore database needs to be initialized with collections and data.

**The Solution:**

1. Create Firestore in Firebase Console
2. Run the `firestore-init.ts` script to seed crops data
3. Deploy security rules
4. Test profile editing - it should now work!

**Timeline:** ~15 minutes for complete setup

Need help? Check the troubleshooting section above! 🌾
