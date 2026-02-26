import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useNavigation } from '@/context/NavigationContext'
import { useAuth } from '@/context/AuthContext'
import { ProfileMenu } from '@/components/ProfileMenu'

interface ForecastDay {
  day: string
  date: string
  condition: string
  high: number
  low: number
  rainfall: number
  windSpeed: number
}

export function WeatherPage() {
  const { isDark } = useTheme()
  const { navigateTo } = useNavigation()
  useAuth() // ensure auth context is available
  const [selectedLocation, setSelectedLocation] = useState('Lusaka')
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; name: string } | null>(
    null
  )
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  const locations = ['Lusaka', 'Kitwe', 'Livingstone', 'Ndola', 'Kabwe']

  const handleGetGPSLocation = () => {
    setGpsLoading(true)
    setGpsError(null)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setGpsLocation({ lat: latitude, lng: longitude, name: 'Current Location' })
          setSelectedLocation('Current Location')
          setGpsLoading(false)
          console.log(`GPS Location: ${latitude}, ${longitude}`)
        },
        error => {
          setGpsError(`GPS Error: ${error.message}`)
          setGpsLoading(false)
          console.error('GPS Error:', error)
        }
      )
    } else {
      setGpsError('Geolocation is not supported by your browser')
      setGpsLoading(false)
    }
  }

  const forecast: ForecastDay[] = [
    {
      day: 'Today',
      date: 'Feb 24',
      condition: 'Partly Cloudy',
      high: 28,
      low: 18,
      rainfall: 3,
      windSpeed: 12,
    },
    {
      day: 'Tuesday',
      date: 'Feb 25',
      condition: 'Light Rain',
      high: 25,
      low: 16,
      rainfall: 12,
      windSpeed: 8,
    },
    {
      day: 'Wednesday',
      date: 'Feb 26',
      condition: 'Cloudy',
      high: 26,
      low: 17,
      rainfall: 5,
      windSpeed: 10,
    },
    {
      day: 'Thursday',
      date: 'Feb 27',
      condition: 'Sunny',
      high: 29,
      low: 19,
      rainfall: 0,
      windSpeed: 7,
    },
    {
      day: 'Friday',
      date: 'Feb 28',
      condition: 'Partly Cloudy',
      high: 27,
      low: 18,
      rainfall: 1,
      windSpeed: 9,
    },
    {
      day: 'Saturday',
      date: 'Mar 1',
      condition: 'Showers',
      high: 24,
      low: 15,
      rainfall: 8,
      windSpeed: 11,
    },
    {
      day: 'Sunday',
      date: 'Mar 2',
      condition: 'Cloudy',
      high: 25,
      low: 16,
      rainfall: 2,
      windSpeed: 6,
    },
  ]

  const tips = [
    {
      title: 'Avoid Spraying Today',
      symbol: '◆',
      description:
        'Rain expected tomorrow. Wait 24-48 hours after rainfall before applying pesticides.',
    },
    {
      title: 'Monitor Soil Moisture',
      symbol: '●',
      description:
        'With 12mm rain expected midweek, ensure proper drainage to prevent waterlogging.',
    },
    {
      title: 'Check for Fungal Issues',
      symbol: '▬',
      description: 'High humidity from upcoming rain creates conditions for fungal diseases.',
    },
    {
      title: 'Planting Window',
      symbol: '✓',
      description:
        'Friday-Saturday clear conditions are ideal for planting after Tuesday-Wednesday rain.',
    },
  ]

  return (
    <div
      className={`min-h-screen p-6 sm:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}
    >
      {/* Profile Menu - Fixed top-right */}
      <div className="fixed top-6 right-6 z-50">
        <ProfileMenu />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Weather Forecast
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Precise meteorological data for informed agricultural planning
          </p>
        </div>

        {/* Location Selector & GPS */}
        <div
          className="rounded-lg border p-6 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-end animate-in fade-in delay-100 transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#1a3a2e' : 'white',
            borderColor: isDark ? '#2d5a52' : '#e0d9d0',
          }}
        >
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-2 transition-colors duration-300"
              style={{ color: isDark ? 'white' : '#1a3a2e' }}
            >
              Select Location
            </label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-0"
              style={{
                backgroundColor: isDark ? '#0f2027' : 'white',
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
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleGetGPSLocation}
            disabled={gpsLoading}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-60"
            style={{
              backgroundColor: gpsLocation ? '#27ae60' : '#1a3a2e',
            }}
          >
            {gpsLoading ? 'Getting Location...' : gpsLocation ? '✓ GPS Active' : '📍 Use GPS'}
          </button>

          <div
            className="font-medium text-sm transition-colors duration-300"
            style={{ color: isDark ? '#bfaea3' : '#666' }}
          >
            {gpsLocation ? `${gpsLocation.name}` : `${selectedLocation}, Zambia`}
          </div>
        </div>

        {/* GPS Error Message */}
        {gpsError && (
          <div
            className="mb-4 p-3 rounded-lg text-sm animate-in fade-in duration-300"
            style={{
              backgroundColor: 'rgba(192, 57, 43, 0.1)',
              border: '1px solid rgba(192, 57, 43, 0.3)',
              color: '#c0392b',
            }}
          >
            {gpsError}
          </div>
        )}

        {/* Current Weather */}
        <div
          className="rounded-lg p-8 mb-8 text-white overflow-hidden relative animate-in fade-in duration-700 delay-150"
          style={{
            background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a52 100%)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite',
            }}
          ></div>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(30px); }
            }
          `}</style>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2
                className="text-lg font-light mb-3 text-white/90"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Current Conditions {gpsLocation && '(GPS)'}
              </h2>
              <div
                className="text-6xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                23°C
              </div>
              <p className="text-xl text-white/90">Partly Cloudy</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Humidity', value: '72%' },
                { label: 'Wind Speed', value: '12 km/h' },
                { label: 'Rainfall', value: '3mm' },
                { label: 'Updated', value: '14:30' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 transition-all duration-300 hover:bg-white/20"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <p className="text-xs text-white/70 mb-1">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <h2
          className="text-2xl font-bold mb-6 transition-colors duration-300 animate-in fade-in delay-200"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: isDark ? 'white' : '#1a3a2e',
          }}
        >
          7-Day Forecast
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {forecast.map((day, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 animate-in fade-in"
              style={{
                backgroundColor: isDark ? '#1a3a2e' : 'white',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                animationDelay: `${0.2 + i * 0.05}s`,
              }}
            >
              <p
                className="font-bold text-sm mb-1 transition-colors duration-300"
                style={{ color: isDark ? 'white' : '#1a3a2e' }}
              >
                {day.day}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{day.date}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{day.condition}</p>
              <div className="flex justify-center gap-1 mb-2 text-sm font-bold">
                <span style={{ color: '#1a3a2e' }}>{day.high}°</span>
                <span className="text-gray-500">{day.low}°</span>
              </div>
              <p className="text-xs" style={{ color: '#2c5aa0' }}>
                {day.rainfall}mm
              </p>
            </div>
          ))}
        </div>

        {/* Farming Tips */}
        <h2
          className="text-2xl font-bold mb-6 transition-colors duration-300 animate-in fade-in delay-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: isDark ? 'white' : '#1a3a2e',
          }}
        >
          Farming Tips Based on Weather
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 animate-in fade-in"
              style={{
                backgroundColor: isDark ? '#1a3a2e' : 'white',
                borderColor: isDark ? '#2d5a52' : '#e0d9d0',
                borderTop: '3px solid #d4af37',
                animationDelay: `${0.35 + i * 0.1}s`,
              }}
            >
              <div className="text-2xl mb-2 opacity-70">{tip.symbol}</div>
              <h3
                className="font-semibold mb-1 transition-colors duration-300"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: isDark ? 'white' : '#1a3a2e',
                }}
              >
                {tip.title}
              </h3>
              <p
                className="text-sm transition-colors duration-300"
                style={{ color: isDark ? '#bfaea3' : '#666' }}
              >
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Summary */}
        <div
          className="rounded-lg border p-6 animate-in fade-in delay-500 transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#1a3a2e' : 'white',
            borderColor: isDark ? '#2d5a52' : '#e0d9d0',
          }}
        >
          <h3
            className="text-xl font-bold mb-4 transition-colors duration-300"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: isDark ? 'white' : '#1a3a2e',
            }}
          >
            Weekly Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Average Temperature', value: '25.6°C', symbol: '◆' },
              { label: 'Total Expected Rainfall', value: '31mm', symbol: '●' },
              { label: 'Clear Days', value: '2 days', symbol: '▬' },
              { label: 'Rainy Days', value: '4 days', symbol: '✓' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: isDark ? '#0f2027' : '#faf8f6',
                  border: `1px solid ${isDark ? '#2d5a52' : '#e0d9d0'}`,
                }}
              >
                <div className="flex gap-3 items-start">
                  <div className="text-xl opacity-70">{stat.symbol}</div>
                  <div>
                    <p
                      className="text-xs transition-colors duration-300"
                      style={{ color: isDark ? '#bfaea3' : '#888' }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="font-bold text-lg transition-colors duration-300"
                      style={{ color: isDark ? 'white' : '#1a3a2e' }}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
