# Parallel Development Roadmap: Frontend While RAG Engine Is Being Built

Based on your TDD and TODO, here's what you can implement in parallel while your teammate builds the RAG engine.

---

## ✅ Current Status

**Completed:**

- Frontend UI structure (Dashboard, Advisory, Crops, Weather, Profile pages)
- Authentication UI (Login, Signup pages)
- Form components & layouts
- **JUST ENABLED:** Firebase Authentication with real user persistence

**In Progress (Teammate):**

- RAG Engine (Vertex AI integration)
- Knowledge base ingestion
- Embedding generation

---

## 🚀 Recommended Parallel Work (Priority Order)

### Phase 1: Static Data & Firestore Integration (Week 1-2)

#### 1. Populate Firestore with Static Data

**Status:** Not Started | **Effort:** Low | **Impact:** High

Create seed data scripts to populate:

- **Crops Collection** - Zambian crop information (6+ crops)
  ```
  crops/
    ├── corn
    ├── soybean
    ├── groundnuts
    ├── sorghum
    ├── cassava
    └── tobacco
  ```
- **Pests Collection** - Common agricultural pests
- **Diseases Collection** - Common crop diseases
- **Weather Data** - Historical weather patterns

**Files to create:**

- `scripts/seedFirestore.ts` - Seed data loader
- `apps/functions/src/data/crops.json`
- `apps/functions/src/data/pests.json`
- `apps/functions/src/data/diseases.json`

---

#### 2. Implement tRPC Procedures for Static Data (Week 1-2)

**Status:** Partially Done (stubs exist) | **Effort:** Medium | **Impact:** High

Update these routers with real Firestore queries:

- **crops.ts**

  - `getCropDetails(cropId)` - Query specific crop
  - `listCrops(limit, offset)` - List all crops with pagination
  - `searchCrops(query)` - Search by name/description

- **pests.ts**

  - `getPestDetails(pestId)`
  - `listPests()`
  - `getPestsByAffectedCrop(cropId)` - Find pests for a crop

- **diseases.ts**
  - `getDiseaseDetails(diseaseId)`
  - `listDiseases()`
  - `getDiseasesByAffectedCrop(cropId)`

**Files to update:**

- `apps/functions/src/trpc/routers/crops.ts`
- `apps/functions/src/trpc/routers/pests.ts`
- `apps/functions/src/trpc/routers/diseases.ts`

---

### Phase 2: Frontend Integration (Week 2-3)

#### 3. Connect Frontend Pages to tRPC (Week 2)

**Status:** Not Started | **Effort:** Medium | **Impact:** High

Create custom hooks in `apps/web/src/hooks/`:

- `useCrops()` - Get all crops
- `useCropDetails(id)` - Get single crop
- `usePests()` - Get all pests
- `useDiseases()` - Get all diseases
- `usePestsByAffectedCrop(cropId)` - Get pests for crop

Update components to use real data:

- `CropsPage.tsx` - Replace mock crops with real data
- New `PestsPage.tsx` - Browse pests and management strategies
- New `DiseasesPage.tsx` - Browse diseases and treatment

---

#### 4. Add Search & Filter Features (Week 2-3)

**Status:** Not Started | **Effort:** Medium | **Impact:** Medium

- Search crops by name/season/soil type
- Filter pests by affected crop
- Filter diseases by crop
- Advanced filtering UI

---

### Phase 3: Weather Integration (Week 3)

#### 5. Integrate Weather API (Week 3)

**Status:** Not Started | **Effort:** Medium | **Impact:** Medium

Choose & integrate a weather API:

- Open-Meteo (Free, no API key)
- OpenWeather (Recommended for Zambia data)
- NOAA (US-focused)

Create Cloud Function in `apps/functions/src/trpc/routers/weather.ts`:

```typescript
weather.getForecast(location: string, days?: number)
weather.getHistorical(location: string, date: string)
```

---

### Phase 4: Data Validation & Error Handling (Week 4)

#### 6. Improve Zod Schemas (Week 4)

**Status:** Partially Done | **Effort:** Medium | **Impact:** Medium

Update `packages/shared/src/schemas/`:

- `crop.ts` - Add all crop fields
- `pest.ts` - Define pest schema
- `disease.ts` - Define disease schema
- `weather.ts` - Define weather schema

Example:

```typescript
export const PestSchema = z.object({
  id: z.string(),
  name: z.string(),
  commonSymptoms: z.array(z.string()),
  affectedCrops: z.array(z.string()),
  managementStrategies: z.array(z.string()),
  season: z.enum(['dry', 'wet', 'year-round']),
})
```

---

#### 7. Error Handling & User Feedback (Week 4)

**Status:** Partially Done | **Effort:** Low | **Impact:** High

- Add toast notifications for errors
- Improve error messages from tRPC
- Add retry logic for failed requests
- Loading skeletons for data tables

---

## 📋 Testing Requirements

### 8. Unit Tests (Week 4-5)

**Status:** Not Started | **Effort:** Medium | **Impact:** High

Write Vitest tests for:

- Crop CRUD operations
- Pest/Disease lookup
- Search/Filter logic
- Error handling

### 9. Component Tests (Week 4-5)

**Status:** Partially Done | **Effort:** Medium | **Impact:** Medium

Test React components:

- CropsPage data loading
- PestsPage search
- WeatherPage display
- Profile updates

---

## 🔌 When RAG Engine Is Ready

Once your teammate completes the RAG engine:

1. **Wire up `advice.askAI`** in AdvisoryPage

   - Replace placeholder response with real tRPC call
   - Add source attribution from RAG
   - Store queries in Firestore

2. **Add RAG-based recommendations**

   - "Recommended crops for your location"
   - "Pest management suggestions"
   - "Disease treatment advice"

3. **Context-aware advice**
   - Use user location from profile
   - Reference their crop choices
   - Personalized seasonal recommendations

---

## 📊 Firestore Structure

```
firestore/
├── users/
│   └── {uid}
│       ├── id: string
│       ├── email: string
│       ├── name: string
│       ├── location: string
│       └── createdAt: timestamp
│
├── crops/
│   ├── corn
│   │   ├── name: "Corn (Maize)"
│   │   ├── description: string
│   │   ├── plantingSeasons: ["Nov", "Dec"]
│   │   ├── optimalConditions: {...}
│   │   └── soilTypes: [...]
│   └── ...
│
├── pests/
│   └── {pestId}
│       ├── name: string
│       ├── affectedCrops: [...]
│       ├── commonSymptoms: [...]
│       └── managementStrategies: [...]
│
├── diseases/
│   └── {diseaseId}
│       ├── name: string
│       ├── affectedCrops: [...]
│       ├── symptoms: [...]
│       └── treatments: [...]
│
└── advice/
    └── {adviceId}
        ├── userId: string
        ├── queryText: string
        ├── responseText: string
        ├── sourcedDocuments: [...]
        └── createdAt: timestamp
```

---

## 🎯 Quick Start Checklist

- [ ] Run `pnpm install` to install Firebase SDK
- [ ] Test Firebase Auth (login/signup should work now)
- [ ] Create seed data script for Firestore
- [ ] Implement crop CRUD tRPC procedures
- [ ] Connect CropsPage to real data
- [ ] Add pest/disease pages
- [ ] Integrate weather API
- [ ] Write tests
- [ ] Wait for RAG engine, then integrate

---

## 💡 Key Tips

1. **Use Firestore Emulator** for local development (no cost)

   ```bash
   firebase emulators:start
   ```

2. **Start with crops** - Simplest data model, good template for pests/diseases

3. **Test tRPC procedures** in isolation before connecting to frontend

4. **Use Zod for validation** - Will catch bad data early

5. **Keep mocks until ready** - Weather page can still show mock data until API integrated

---

## 🤝 Sync Points with RAG Team

- **Week 2:** RAG engine should accept queries
- **Week 3:** RAG should return responses with sources
- **Week 4:** RAG integration into frontend
- **Final:** Combined testing & refinement

Good luck! 🌾
