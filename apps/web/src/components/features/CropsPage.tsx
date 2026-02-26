import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useNavigation } from '@/context/NavigationContext'
import { useAuth } from '@/context/AuthContext'
import { ProfileMenu } from '@/components/ProfileMenu'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { LoadingPage } from '@/components/forms/StateComponents'

interface Crop {
  id: string
  name: string
  symbol: string
  description: string
  overview: string
  seasons: string[]
  tempMin: number
  tempMax: number
  rainfallMin: number
  rainfallMax: number
  soilTypes: string[]
}

// Mock data as fallback
const MOCK_CROPS: Crop[] = [
  {
    id: 'maize',
    name: 'Maize',
    symbol: '▬',
    description: 'Primary grain crop',
    overview:
      "Maize is Zambia's primary staple crop and the foundation of food security. It's versatile, widely adapted, and essential for livestock feed and industrial use.",
    seasons: ['November', 'December', 'January'],
    tempMin: 18,
    tempMax: 32,
    rainfallMin: 450,
    rainfallMax: 900,
    soilTypes: ['Sandy Loam', 'Clay Loam', 'Volcanic'],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    symbol: '●',
    description: 'Legume crop',
    overview:
      'Soybean is a high-protein legume that improves soil fertility. Excellent for crop rotation and livestock feed.',
    seasons: ['November', 'December'],
    tempMin: 20,
    tempMax: 30,
    rainfallMin: 400,
    rainfallMax: 800,
    soilTypes: ['Well-drained', 'Sandy Loam'],
  },
  {
    id: 'potato',
    name: 'Potato',
    symbol: '◈',
    description: 'Root vegetable',
    overview: 'Potatoes are a reliable cash crop with high yield potential in Zambian conditions.',
    seasons: ['May', 'June'],
    tempMin: 15,
    tempMax: 25,
    rainfallMin: 500,
    rainfallMax: 750,
    soilTypes: ['Sandy Loam', 'Loam'],
  },
  {
    id: 'groundnuts',
    name: 'Groundnuts',
    symbol: '✓',
    description: 'Oil crop',
    overview: 'Groundnuts provide high oil content and protein. Important cash crop for farmers.',
    seasons: ['November', 'December'],
    tempMin: 20,
    tempMax: 30,
    rainfallMin: 500,
    rainfallMax: 1000,
    soilTypes: ['Sandy', 'Sandy Loam'],
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    symbol: '▲',
    description: 'Brassica crop',
    overview: 'Cabbage is a nutritious vegetable with good market demand year-round.',
    seasons: ['February', 'March', 'April'],
    tempMin: 15,
    tempMax: 25,
    rainfallMin: 400,
    rainfallMax: 600,
    soilTypes: ['Clay Loam', 'Loam'],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    symbol: '◆',
    description: 'Vegetable crop',
    overview: 'Tomatoes are high-value vegetables with strong market demand.',
    seasons: ['October', 'November'],
    tempMin: 20,
    tempMax: 35,
    rainfallMin: 400,
    rainfallMax: 600,
    soilTypes: ['Sandy Loam', 'Clay Loam'],
  },
  {
    id: 'pepper',
    name: 'Pepper',
    symbol: '✤',
    description: 'Spice crop',
    overview: 'Peppers are high-income crops with good export potential.',
    seasons: ['October', 'November'],
    tempMin: 22,
    tempMax: 30,
    rainfallMin: 400,
    rainfallMax: 700,
    soilTypes: ['Well-drained', 'Sandy Loam'],
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    symbol: '◊',
    description: 'Cucurbit crop',
    overview: 'Cucumbers are quick-growing vegetables perfect for market gardens.',
    seasons: ['October', 'November'],
    tempMin: 18,
    tempMax: 30,
    rainfallMin: 300,
    rainfallMax: 600,
    soilTypes: ['Sandy Loam', 'Loam'],
  },
]

export function CropsPage() {
  const { isDark } = useTheme()
  const { navigateTo } = useNavigation()
  useAuth() // ensure auth context is available
  const [selectedCropId, setSelectedCropId] = useState<string>('maize')
  const [searchTerm, setSearchTerm] = useState('')
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch crops from Firestore
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true)
        setError(null)

        const querySnapshot = await getDocs(collection(db, 'crops'))

        if (querySnapshot.docs.length > 0) {
          // Firestore data found, validate and map it
          const cropsData = querySnapshot.docs
            .map(doc => {
              const data = doc.data()
              return {
                id: doc.id,
                name: data.name || '',
                symbol: data.symbol || '◆',
                description: data.description || '',
                overview: data.overview || '',
                seasons: Array.isArray(data.seasons) ? data.seasons : [],
                tempMin: typeof data.tempMin === 'number' ? data.tempMin : 15,
                tempMax: typeof data.tempMax === 'number' ? data.tempMax : 30,
                rainfallMin: typeof data.rainfallMin === 'number' ? data.rainfallMin : 400,
                rainfallMax: typeof data.rainfallMax === 'number' ? data.rainfallMax : 800,
                soilTypes: Array.isArray(data.soilTypes) ? data.soilTypes : [],
              } as Crop
            })
            .filter((crop): crop is Crop => crop.name !== '')

          if (cropsData.length > 0) {
            setCrops(cropsData)
            console.log(`✓ Loaded ${cropsData.length} crops from Firestore`)
          } else {
            console.log('No valid crops in Firestore, using mock data')
            setCrops(MOCK_CROPS)
          }
        } else {
          // No data in Firestore, use mock data
          console.log('No crops collection in Firestore, using mock data')
          setCrops(MOCK_CROPS)
        }
      } catch (error) {
        console.error('Error fetching crops from Firestore:', error)
        setError('Using mock data. Firestore connection failed.')
        // Fallback to mock data on error
        setCrops(MOCK_CROPS)
      } finally {
        setLoading(false)
      }
    }

    fetchCrops()
  }, [])

  const selectedCrop = crops.find(c => c.id === selectedCropId)
  const filteredCrops = crops.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div
      className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}
    >
      {/* Profile Menu - Fixed top-right */}
      <div className="fixed top-6 right-6 z-50">
        <ProfileMenu />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 animate-in fade-in duration-600">
          <button
            onClick={() => navigateTo('dashboard')}
            className="mb-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isDark ? '#1a3a2e' : '#f5f3f0',
              color: isDark ? '#d4af37' : '#1a3a2e',
              border: `1px solid ${isDark ? '#2d5a52' : '#e0d9d0'}`,
            }}
          >
            ← Back to Dashboard
          </button>

          <h1
            className="text-4xl font-bold mb-2 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? 'white' : '#1a3a2e',
            }}
          >
            Crops Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive guides for optimal Zambian crop cultivation
          </p>

          {error && (
            <div
              className="mt-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: 'rgba(192, 57, 43, 0.04)',
                border: '1px solid rgba(192, 57, 43, 0.15)',
                color: '#c0392b',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 animate-in fade-in duration-700 delay-100">
            {/* Search */}
            <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">◆</span>
              <input
                type="text"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-0"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                  color: isDark ? 'white' : '#3d3d3d',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#d4af37'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = isDark ? '#2d5a52' : '#e0d9d0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Crop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
              {filteredCrops.map((crop, i) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className="rounded-lg border p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 animate-in fade-in"
                  style={{
                    backgroundColor:
                      selectedCropId === crop.id ? '#e8dcc4' : isDark ? '#1a3a2e' : 'white',
                    borderColor:
                      selectedCropId === crop.id ? '#d4af37' : isDark ? '#2d5a52' : '#e0d9d0',
                    borderWidth: selectedCropId === crop.id ? '2px' : '1px',
                    animationDelay: `${0.1 + i * 0.05}s`,
                  }}
                >
                  <div
                    className="text-3xl mb-2 opacity-80"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {crop.symbol}
                  </div>
                  <h3
                    className="font-bold text-xs sm:text-sm transition-colors duration-300"
                    style={{
                      color: isDark
                        ? selectedCropId === crop.id
                          ? '#1a3a2e'
                          : 'white'
                        : '#1a3a2e',
                    }}
                  >
                    {crop.name}
                  </h3>
                  <p
                    className="text-xs transition-colors duration-300"
                    style={{
                      color: isDark ? (selectedCropId === crop.id ? '#1a3a2e' : '#bfaea3') : '#888',
                    }}
                  >
                    {crop.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'General Growing Tips',
                  items: [
                    'Prepare soil adequately before planting',
                    'Monitor soil moisture regularly',
                    'Apply fertilizer at recommended rates',
                    'Scout fields for pests weekly',
                  ],
                },
                {
                  title: 'Water Management',
                  items: [
                    'Proper irrigation is crucial for all crops',
                    'Amount needed varies by crop type',
                    'Most crops require 400-600mm during growing season',
                    'Adjust based on rainfall and soil type',
                  ],
                },
                {
                  title: 'Common Issues',
                  items: [
                    'Monitor for Fall Armyworm',
                    'Watch for leaf spot diseases',
                    'Check for stem borers regularly',
                    'Manage weeds timely',
                  ],
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-4 animate-in fade-in transition-colors duration-300"
                  style={{
                    backgroundColor: isDark ? '#1a3a2e' : 'white',
                    borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                    borderTop: '3px solid #d4af37',
                    animationDelay: `${0.4 + i * 0.1}s`,
                  }}
                >
                  <h3
                    className="font-bold text-sm mb-3 transition-colors duration-300"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: isDark ? 'white' : '#1a3a2e',
                    }}
                  >
                    {card.title}
                  </h3>
                  <ul className="space-y-1">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-xs flex gap-2 transition-colors duration-300"
                        style={{ color: isDark ? '#bfaea3' : '#666' }}
                      >
                        <span style={{ color: '#d4af37' }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Detail Panel */}
          <div className="animate-in fade-in duration-700 delay-200">
            {selectedCrop ? (
              <div
                className="rounded-lg border p-6 sticky top-6 transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                }}
              >
                <div
                  className="text-4xl mb-3 opacity-70"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedCrop.symbol}
                </div>
                <h2
                  className="text-2xl font-bold mb-6 transition-colors duration-300"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: isDark ? 'white' : '#1a3a2e',
                  }}
                >
                  {selectedCrop.name}
                </h2>

                {/* Overview */}
                <div
                  className="mb-6 pb-6 border-b transition-colors duration-300"
                  style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
                >
                  <h3
                    className="text-xs font-semibold uppercase letter-spacing mb-2 transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e', letterSpacing: '0.5px' }}
                  >
                    Overview
                  </h3>
                  <p
                    className="text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: isDark ? '#bfaea3' : '#666' }}
                  >
                    {selectedCrop.overview}
                  </p>
                </div>

                {/* Seasons */}
                <div
                  className="mb-6 pb-6 border-b transition-colors duration-300"
                  style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
                >
                  <h3
                    className="text-xs font-semibold uppercase letter-spacing mb-2 transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e', letterSpacing: '0.5px' }}
                  >
                    Planting Seasons
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrop.seasons.map(season => (
                      <span
                        key={season}
                        className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: '#e8dcc4',
                          color: '#1a3a2e',
                          border: '1px solid #d4af37',
                        }}
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div
                  className="mb-6 pb-6 border-b transition-colors duration-300"
                  style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
                >
                  <h3
                    className="text-xs font-semibold uppercase letter-spacing mb-2 transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e', letterSpacing: '0.5px' }}
                  >
                    Temperature Range
                  </h3>
                  <p
                    className="text-sm font-bold transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e' }}
                  >
                    {selectedCrop.tempMin}°C - {selectedCrop.tempMax}°C
                  </p>
                  <p
                    className="text-xs transition-colors duration-300"
                    style={{ color: isDark ? '#bfaea3' : '#999', marginTop: '0.25rem' }}
                  >
                    Optimal for growth and grain development
                  </p>
                </div>

                {/* Rainfall */}
                <div
                  className="mb-6 pb-6 border-b transition-colors duration-300"
                  style={{ borderColor: isDark ? '#2d5a52' : '#e0d9d0' }}
                >
                  <h3
                    className="text-xs font-semibold uppercase letter-spacing mb-2 transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e', letterSpacing: '0.5px' }}
                  >
                    Rainfall Requirements
                  </h3>
                  <p
                    className="text-sm font-bold transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e' }}
                  >
                    {selectedCrop.rainfallMin}mm - {selectedCrop.rainfallMax}mm
                  </p>
                  <p
                    className="text-xs transition-colors duration-300"
                    style={{ color: isDark ? '#bfaea3' : '#999', marginTop: '0.25rem' }}
                  >
                    Well distributed during growing season
                  </p>
                </div>

                {/* Soil Types */}
                <div className="mb-6">
                  <h3
                    className="text-xs font-semibold uppercase letter-spacing mb-2 transition-colors duration-300"
                    style={{ color: isDark ? 'white' : '#1a3a2e', letterSpacing: '0.5px' }}
                  >
                    Suitable Soil Types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrop.soilTypes.map(soil => (
                      <span
                        key={soil}
                        className="px-2 py-1 text-xs rounded transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: '#e8dcc4',
                          color: '#1a3a2e',
                          border: '1px solid #d4af37',
                        }}
                      >
                        {soil}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#1a3a2e',
                  }}
                >
                  Ask AI About This Crop
                </button>
              </div>
            ) : (
              <div
                className="rounded-lg border p-6 text-center transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? '#1a3a2e' : 'white',
                  borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                }}
              >
                <p
                  className="text-sm transition-colors duration-300"
                  style={{ color: isDark ? '#bfaea3' : '#888' }}
                >
                  Select a crop to view detailed information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
