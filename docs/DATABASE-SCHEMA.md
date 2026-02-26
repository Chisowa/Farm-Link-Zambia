# Farm-Link Zambia - Firestore Database Schema

## Overview

This document defines the complete Firestore database structure for Farm-Link Zambia. All collections are created in the `farmlink-zambia` Firebase project.

---

## Collections & Documents

### 1. **users** Collection

Stores user profiles and information.

**Document ID:** `{userId}` (Firebase Auth UID)

**Fields:**

```typescript
{
  id: string                    // Same as document ID (Firebase UID)
  email: string                 // User's email address
  name: string                  // User's full name
  location?: string             // Region/province (e.g., "Lusaka", "Eastern Province")
  createdAt: Timestamp          // Account creation date
  updatedAt: Timestamp          // Last profile update
  preferredLanguage?: string    // Language preference (default: "en")
  farmDetails?: {
    farmSize?: number           // Size in hectares
    cropTypes?: string[]        // IDs of crops they grow
  }
}
```

**Indexes:**

- None required (queries by document ID)

---

### 2. **crops** Collection

Static crop information for Zambia. Pre-populated with crop data.

**Document ID:** `{cropId}` (e.g., "corn", "soybean", "groundnuts")

**Fields:**

```typescript
{
  id: string                    // Unique crop identifier
  name: string                  // Common name (e.g., "Corn (Maize)")
  description: string           // Detailed description
  icon?: string                 // Emoji or icon reference
  plantingSeasons: string[]     // Months (e.g., ["November", "December"])
  harvestingPeriod?: string     // Typical harvest months
  optimalConditions: {
    temperature: {
      min: number               // Minimum temp in Celsius
      max: number               // Maximum temp in Celsius
    }
    rainfall: {
      min: number               // Minimum rainfall in mm
      max: number               // Maximum rainfall in mm
    }
    soilTypes: string[]         // Compatible soil types
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Sample Data:**

- Corn (Maize)
- Soybean
- Groundnuts
- Sorghum
- Cassava
- Tobacco
- Wheat
- Beans
- Vegetables (various)

---

### 3. **pests** Collection

Pest information and management strategies.

**Document ID:** `{pestId}` (e.g., "fall-armyworm", "weevil")

**Fields:**

```typescript
{
  id: string                    // Unique pest identifier
  name: string                  // Common name
  scientificName?: string       // Latin name
  description: string           // Overview
  affectedCrops: string[]       // Crop IDs this pest affects
  commonSymptoms: string[]      // Signs of infestation
  managementStrategies: {
    preventive?: string[]       // Prevention methods
    organic?: string[]          // Organic control options
    chemical?: string[]         // Chemical control (with warnings)
  }
  severity: "low" | "medium" | "high"
  images?: string[]            // URLs to pest images
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

### 4. **diseases** Collection

Disease information and management strategies.

**Document ID:** `{diseaseId}` (e.g., "leaf-spot", "powdery-mildew")

**Fields:**

```typescript
{
  id: string                    // Unique disease identifier
  name: string                  // Common name
  scientificName?: string       // Latin name
  description: string           // Overview
  affectedCrops: string[]       // Crop IDs this disease affects
  commonSymptoms: string[]      // Visible signs
  managementStrategies: {
    preventive?: string[]       // Prevention methods
    organic?: string[]          // Organic control options
    chemical?: string[]         // Chemical control (with warnings)
  }
  severity: "low" | "medium" | "high"
  images?: string[]            // URLs to disease images
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

### 5. **advice** Collection

History of AI-generated advice for users.

**Document ID:** `{auto-generated}`

**Fields:**

```typescript
{
  id: string                    // Document ID
  userId: string                // Reference to user
  queryText: string             // User's original question
  responseText: string          // AI-generated response
  category?: string             // Type of advice (crop, pest, weather, etc.)
  isHelpful?: boolean           // User feedback on response quality
  feedback?: string             // Detailed feedback from user
  cropContext?: string          // Crop ID if relevant
  timestamp: Timestamp          // When advice was given
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes:**

- Composite: `userId` + `timestamp` (descending)

---

### 6. **weatherData** Collection

Cached weather forecasts and historical data.

**Document ID:** `{location}-{date}` (e.g., "lusaka-2024-02-20")

**Fields:**

```typescript
{
  location: string              // Town/region name
  coordinates?: {
    latitude: number
    longitude: number
  }
  date: string                  // YYYY-MM-DD format
  currentWeather?: {
    temperature: number         // Current temp in Celsius
    humidity: number            // Humidity percentage
    rainfall: number            // Rainfall in mm
    windSpeed: number           // Wind speed in km/h
    condition: string           // "sunny", "rainy", "cloudy", etc.
  }
  forecast?: {
    date: string               // Forecast date
    high: number               // Max temp
    low: number                // Min temp
    rainfall: number           // Expected rainfall
    condition: string
  }[]
  source: string               // Data source (e.g., "OpenWeather")
  timestamp: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes:**

- Composite: `location` + `date` (descending)

---

### 7. **marketPrices** Collection

Aggregated market price data for crops.

**Document ID:** `{cropId}-{market}-{date}` (e.g., "corn-lusaka-market-2024-02-20")

**Fields:**

```typescript
{
  cropId: string                // Reference to crop
  cropName: string              // Crop name for easy reading
  market: string                // Market location
  date: string                  // YYYY-MM-DD format
  price: number                 // Price per unit
  unit: string                  // Unit (kg, bag, bunch, etc.)
  currency: string              // Currency code (ZMW, USD, etc.)
  trend?: "up" | "down" | "stable"  // Price trend
  source?: string               // Data source
  timestamp: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes:**

- Composite: `cropId` + `date` (descending)
- Composite: `market` + `date` (descending)

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to users only for their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow read access to crops (public reference data)
    match /crops/{cropId} {
      allow read: if request.auth != null;
    }

    // Allow read access to pests and diseases (public reference data)
    match /pests/{pestId} {
      allow read: if request.auth != null;
    }

    match /diseases/{diseaseId} {
      allow read: if request.auth != null;
    }

    // Allow users to read/write their own advice history
    match /advice/{adviceId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Allow read access to weather and market data (public data)
    match /weatherData/{weatherId} {
      allow read: if request.auth != null;
    }

    match /marketPrices/{priceId} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## Initialization Steps

1. **Create Collections:** Use Firebase Console or script to create all collections
2. **Seed Crop Data:** Run initialization script with crop data
3. **Set Security Rules:** Deploy the rules above
4. **Enable Firestore Persistence:** Configure in app initialization

---

## Next Steps (From TDD)

**Phase 1 (Current):** ✅ Authentication, users collection
**Phase 2:**

- [ ] Populate crops collection with Zambian crop data
- [ ] Create pests & diseases collections
- [ ] Integrate weather API and cache in weatherData
- [ ] Build market price aggregation

**Phase 3:**

- [ ] RAG Engine integration with Vertex AI
- [ ] Advice history storage and retrieval
- [ ] Advanced analytics and recommendations
