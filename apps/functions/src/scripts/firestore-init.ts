/**
 * Farm-Link Zambia - Firestore Initialization Script
 *
 * This script initializes Firestore collections and seeds initial data.
 *
 * Usage:
 *   cd apps/functions
 *   npx ts-node src/scripts/firestore-init.ts
 *
 * Prerequisites:
 *   - Firebase CLI installed and authenticated
 *   - GOOGLE_APPLICATION_CREDENTIALS env var set (or use Firebase emulator)
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Firebase Admin SDK
let app = getApps()[0]

if (!app) {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  const fallbackPath = path.join(__dirname, '../../..', 'firebase-service-key.json')

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    // Use explicit service account key if provided
    console.log(`Using service account from: ${serviceAccountPath}`)
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: 'farmlink-zambia',
    })
  } else if (fs.existsSync(fallbackPath)) {
    // Use service account key if it exists
    console.log(`Using service account from: ${fallbackPath}`)
    const serviceAccount = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'))
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: 'farmlink-zambia',
    })
  } else {
    // Use Application Default Credentials (ADC)
    console.log('📝 No service account key found. Using Application Default Credentials (ADC)...')
    console.log('   Make sure you are authenticated with: firebase login')

    // Initialize with ADC - Firebase Admin SDK will automatically use
    // credentials from gcloud/firebase CLI authentication
    app = initializeApp({
      projectId: 'farmlink-zambia',
    })
  }
}

const db = getFirestore(app)

/**
 * Crop data for Zambia
 */
const CROPS_DATA = [
  {
    id: 'corn',
    name: 'Corn (Maize)',
    description: 'Staple grain crop widely grown in Zambia for food and animal feed',
    icon: '🌽',
    plantingSeasons: ['November', 'December'],
    harvestingPeriod: 'April - May',
    optimalConditions: {
      temperature: { min: 15, max: 35 },
      rainfall: { min: 400, max: 800 },
      soilTypes: ['loamy', 'sandy-loam', 'clay-loam'],
    },
  },
  {
    id: 'soybean',
    name: 'Soybean',
    description: 'High-protein legume crop used for food and animal feed',
    icon: '🫘',
    plantingSeasons: ['November', 'December'],
    harvestingPeriod: 'April - May',
    optimalConditions: {
      temperature: { min: 18, max: 30 },
      rainfall: { min: 450, max: 800 },
      soilTypes: ['loamy', 'clay'],
    },
  },
  {
    id: 'groundnuts',
    name: 'Groundnuts',
    description: 'Important cash crop used for oil and food',
    icon: '🥜',
    plantingSeasons: ['October', 'November', 'December'],
    harvestingPeriod: 'March - April',
    optimalConditions: {
      temperature: { min: 20, max: 32 },
      rainfall: { min: 400, max: 600 },
      soilTypes: ['sandy', 'sandy-loam'],
    },
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    description: 'Drought-resistant grain crop suitable for dry regions',
    icon: '🌾',
    plantingSeasons: ['November', 'December'],
    harvestingPeriod: 'May - June',
    optimalConditions: {
      temperature: { min: 18, max: 35 },
      rainfall: { min: 300, max: 600 },
      soilTypes: ['sandy', 'loamy'],
    },
  },
  {
    id: 'cassava',
    name: 'Cassava',
    description: 'Root crop providing essential carbohydrates, tolerates poor soils',
    icon: '🥔',
    plantingSeasons: ['October', 'November', 'December', 'January'],
    harvestingPeriod: 'Year-round (8-12 months)',
    optimalConditions: {
      temperature: { min: 18, max: 30 },
      rainfall: { min: 600, max: 2000 },
      soilTypes: ['sandy-loam', 'loamy'],
    },
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    description: 'High-value cash crop with significant export potential',
    icon: '🚬',
    plantingSeasons: ['August', 'September', 'October'],
    harvestingPeriod: 'December - January',
    optimalConditions: {
      temperature: { min: 15, max: 28 },
      rainfall: { min: 600, max: 1000 },
      soilTypes: ['loamy', 'sandy-loam'],
    },
  },
  {
    id: 'cotton',
    name: 'Cotton',
    description: 'Major export crop requiring good soil management',
    icon: '☁️',
    plantingSeasons: ['October', 'November', 'December'],
    harvestingPeriod: 'April - June',
    optimalConditions: {
      temperature: { min: 15, max: 32 },
      rainfall: { min: 500, max: 900 },
      soilTypes: ['loamy', 'clay-loam'],
    },
  },
  {
    id: 'wheat',
    name: 'Wheat',
    description: 'Cool season crop grown in higher altitude regions',
    icon: '🌾',
    plantingSeasons: ['May', 'June', 'July'],
    harvestingPeriod: 'October - November',
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 400, max: 750 },
      soilTypes: ['loamy', 'clay-loam'],
    },
  },
  {
    id: 'beans',
    name: 'Beans',
    description: 'Nutritious legume crops (various types)',
    icon: '🫘',
    plantingSeasons: ['November', 'December'],
    harvestingPeriod: 'March - April',
    optimalConditions: {
      temperature: { min: 16, max: 28 },
      rainfall: { min: 400, max: 700 },
      soilTypes: ['loamy', 'sandy-loam'],
    },
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    description: 'Nutritious root crop rich in vitamins',
    icon: '🍠',
    plantingSeasons: ['September', 'October', 'November'],
    harvestingPeriod: 'February - April',
    optimalConditions: {
      temperature: { min: 18, max: 30 },
      rainfall: { min: 600, max: 1500 },
      soilTypes: ['sandy-loam', 'loamy'],
    },
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    description: 'Cool season vegetable crop',
    icon: '🥬',
    plantingSeasons: ['May', 'June', 'July', 'August'],
    harvestingPeriod: 'August - October',
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 400, max: 800 },
      soilTypes: ['loamy', 'clay-loam'],
    },
  },
]

/**
 * Diseases data for Zambia
 */
const DISEASES_DATA = [
  {
    id: 'corn-leaf-rust',
    name: 'Corn Leaf Rust',
    commonName: 'Common Rust',
    description: 'A fungal disease causing rusty spots on corn leaves',
    causative: 'Puccinia polysora',
    commonSymptoms: [
      'Brown/rust-colored spots on leaves',
      'Pustules on leaf undersides',
      'Early leaf senescence',
    ],
    affectedCrops: ['Corn', 'Wheat'],
    managementStrategies: [
      'Plant resistant varieties',
      'Apply fungicides (Mancozeb, Propiconazole)',
      'Crop rotation with legumes',
      'Remove infected plants early',
    ],
  },
  {
    id: 'cassava-brown-streak',
    name: 'Cassava Brown Streak',
    commonName: 'CBSD',
    description: 'Viral disease causing brown streaks on cassava roots and stems',
    causative: 'Cassava brown streak virus (CBSV)',
    commonSymptoms: ['Brown streaks on stems', 'Root discoloration', 'Leaf mosaic'],
    affectedCrops: ['Cassava'],
    managementStrategies: [
      'Plant certified disease-free cuttings',
      'Rogue infected plants',
      'Control whitefly vectors',
      'Grow tolerant varieties',
    ],
  },
  {
    id: 'bean-anthracnose',
    name: 'Bean Anthracnose',
    commonName: 'Pod and Stem Anthracnose',
    description: 'Fungal disease affecting bean pods and stems',
    causative: 'Colletotrichum lindemuthianum',
    commonSymptoms: ['Dark lesions on pods and stems', 'Seed discoloration', 'Pre-harvest pod rot'],
    affectedCrops: ['Beans', 'Groundnuts'],
    managementStrategies: [
      'Use disease-free seeds',
      'Rotate crops with non-host plants',
      'Apply copper fungicides',
      'Avoid overhead irrigation',
    ],
  },
  {
    id: 'sorghum-smut',
    name: 'Sorghum Head Smut',
    commonName: 'Loose Smut',
    description: 'Fungal disease destroying sorghum panicles',
    causative: 'Sphacelotheca sorghi',
    commonSymptoms: ['Black mass replacing grain', 'Destroyed panicles', 'Sooty appearance'],
    affectedCrops: ['Sorghum'],
    managementStrategies: [
      'Plant resistant varieties',
      'Seed treatment with fungicides',
      'Sanitation of harvesting equipment',
      'Crop rotation',
    ],
  },
  {
    id: 'cotton-boll-rot',
    name: 'Cotton Boll Rot',
    commonName: 'Gossypium Rot',
    description: 'Disease causing premature softening and decay of cotton bolls',
    causative: 'Alternaria, Fusarium, and Colletotrichum species',
    commonSymptoms: ['Soft, water-soaked bolls', 'Premature boll drop', 'Fiber discoloration'],
    affectedCrops: ['Cotton'],
    managementStrategies: [
      'Improve field drainage',
      'Prune lower branches for air circulation',
      'Apply protective fungicides during boll stage',
      'Harvest at optimal moisture levels',
    ],
  },
]

/**
 * Pests data for Zambia
 */
const PESTS_DATA = [
  {
    id: 'african-armyworm',
    name: 'African Armyworm',
    commonName: 'Spodoptera exempta',
    description: 'Highly destructive caterpillar pest causing severe crop damage',
    commonSymptoms: [
      'Ragged holes in leaves',
      'Defoliation of plants',
      'Damaged grain/fruit',
      'Wilting of young plants',
    ],
    affectedCrops: ['Corn', 'Sorghum', 'Wheat', 'Beans'],
    managementStrategies: [
      'Monitor fields regularly during night',
      'Handpick egg clusters and larvae',
      'Use pheromone traps for monitoring',
      'Apply Bt (Bacillus thuringiensis) insecticides',
      'Spray with pyrethroids at egg-hatch stage',
      'Encourage natural enemies (birds, wasps)',
    ],
  },
  {
    id: 'cotton-bollworm',
    name: 'Cotton Bollworm',
    commonName: 'Helicoverpa armigera',
    description: 'Major pest of cotton and other crops, feeds on developing bolls and fruits',
    commonSymptoms: [
      'Holes in cotton bolls',
      'Damaged seeds inside bolls',
      'Frass (insect droppings) in bolls',
      'Flowering buds damaged',
    ],
    affectedCrops: ['Cotton', 'Groundnuts', 'Corn'],
    managementStrategies: [
      'Scout fields during peak flowering',
      'Remove and destroy infested bolls',
      'Use entomopathogenic fungi (Beauveria)',
      'Apply selective insecticides during critical period',
      'Intercrop with non-host plants',
      'Collect larvae by hand in early morning',
    ],
  },
  {
    id: 'cassava-mealybug',
    name: 'Cassava Mealybug',
    commonName: 'Phenacoccus manihoti',
    description: 'Sucking pest that causes severe cassava damage by feeding on leaves and stems',
    commonSymptoms: [
      'Yellowing and wilting of leaves',
      'Stunting of plants',
      'Honeydew and sooty mold',
      'Reduced tuber production',
    ],
    affectedCrops: ['Cassava'],
    managementStrategies: [
      'Plant resistant cassava varieties',
      'Remove affected plant parts',
      'Release natural enemies (Encyrtus wasp)',
      'Spray with insecticidal soap',
      'Prune heavily infested branches',
      'Rotate to non-host crops',
    ],
  },
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm',
    commonName: 'Spodoptera frugiperda',
    description: 'Invasive pest that feeds on corn, sorghum, and other grains and vegetables',
    commonSymptoms: [
      'Ragged holes in leaves',
      'Damage to corn whorls',
      'Tunneling in corn ears',
      'Leaf skeletonization',
    ],
    affectedCrops: ['Corn', 'Sorghum', 'Wheat'],
    managementStrategies: [
      'Early detection and monitoring',
      'Spray Bt during early larval stages',
      'Use pheromone traps',
      'Remove affected plant parts',
      'Apply approved insecticides (spinosad, pyrethroids)',
      'Plant trap crops (cowpea) around fields',
    ],
  },
  {
    id: 'aphids',
    name: 'Aphids',
    commonName: 'Aphis sp.',
    description: 'Small sucking insects that transmit viruses and cause plant stunting',
    commonSymptoms: [
      'Curled and distorted leaves',
      'Yellow mottling on leaves',
      'Stunted growth',
      'Sooty mold on honeydew',
    ],
    affectedCrops: ['Beans', 'Groundnuts', 'Cassava', 'Cabbage'],
    managementStrategies: [
      'Spray with water to dislodge aphids',
      'Use insecticidal soap or oil',
      'Release ladybugs and parasitic wasps',
      'Avoid excessive nitrogen fertilizer',
      'Plant early-maturing varieties',
      'Remove weeds that harbor aphids',
    ],
  },
]

/**
 * Initialize Firestore collections
 */
async function initializeFirestore() {
  console.log('🌾 Starting Firestore initialization for Farm-Link Zambia...\n')

  try {
    // Seed crops collection
    console.log('📚 Seeding crops collection...')
    for (const crop of CROPS_DATA) {
      const now = Timestamp.now()
      await db
        .collection('crops')
        .doc(crop.id)
        .set({
          ...crop,
          createdAt: now,
          updatedAt: now,
        })
      console.log(`  ✅ Created crop: ${crop.name}`)
    }

    // Seed diseases collection
    console.log('\n🦠 Seeding diseases collection...')
    for (const disease of DISEASES_DATA) {
      const now = Timestamp.now()
      await db
        .collection('diseases')
        .doc(disease.id)
        .set({
          ...disease,
          createdAt: now,
          updatedAt: now,
        })
      console.log(`  ✅ Created disease: ${disease.name}`)
    }

    // Seed pests collection
    console.log('\n🐛 Seeding pests collection...')
    for (const pest of PESTS_DATA) {
      const now = Timestamp.now()
      await db
        .collection('pests')
        .doc(pest.id)
        .set({
          ...pest,
          createdAt: now,
          updatedAt: now,
        })
      console.log(`  ✅ Created pest: ${pest.name}`)
    }

    console.log(`\n✨ Successfully initialized Firestore!`)
    console.log(`📦 Collections seeded:`)
    console.log(`  - crops (${CROPS_DATA.length} crops)`)
    console.log(`  - diseases (${DISEASES_DATA.length} diseases)`)
    console.log(`  - pests (${PESTS_DATA.length} pests)`)
    console.log(`  - users (ready for user profiles)`)
    console.log(`  - advice (ready for advice history)`)
    console.log(`  - weatherData (ready for weather caching)`)
    console.log(`  - marketPrices (ready for market data)`)

    console.log(`\n📋 Next steps:`)
    console.log(`  1. Deploy functions: firebase deploy --only functions`)
    console.log(`  2. Test APIs from the web app`)
    console.log(`  3. Add weather API integration`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error)
    process.exit(1)
  }
}

// Run initialization
initializeFirestore()
