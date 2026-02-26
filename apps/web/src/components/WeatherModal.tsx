import { useState } from 'react'

interface WeatherModalProps {
  onClose: () => void
}

// ── Zambian cities ─────────────────────────────────────────────────────────────
const ZAMBIA_CITIES: Record<string, { lat: number; lon: number; display: string }> = {
  lusaka: { lat: -15.4167, lon: 28.2833, display: 'Lusaka' },
  ndola: { lat: -12.9683, lon: 28.6337, display: 'Ndola' },
  kitwe: { lat: -12.8024, lon: 28.2132, display: 'Kitwe' },
  livingstone: { lat: -17.8608, lon: 25.8542, display: 'Livingstone' },
  kabwe: { lat: -14.4469, lon: 28.4464, display: 'Kabwe' },
  chipata: { lat: -13.65, lon: 32.65, display: 'Chipata' },
  solwezi: { lat: -12.1833, lon: 26.4, display: 'Solwezi' },
  kasama: { lat: -10.2167, lon: 31.1833, display: 'Kasama' },
  mongu: { lat: -15.25, lon: 23.15, display: 'Mongu' },
  mazabuka: { lat: -15.856, lon: 27.76, display: 'Mazabuka' },
  choma: { lat: -16.8, lon: 26.9667, display: 'Choma' },
  chingola: { lat: -12.5333, lon: 27.8833, display: 'Chingola' },
  luanshya: { lat: -13.1333, lon: 28.4167, display: 'Luanshya' },
  kafue: { lat: -15.77, lon: 28.18, display: 'Kafue' },
  petauke: { lat: -14.25, lon: 31.3333, display: 'Petauke' },
}

const ALL_CITIES = Object.values(ZAMBIA_CITIES).map(c => c.display)

// ── Weather helpers ────────────────────────────────────────────────────────────
function codeToCondition(code: number): string {
  if (code === 0) return 'clear'
  if (code <= 3) return 'partly_cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 82) return 'showers'
  if (code >= 95) return 'thunderstorm'
  return 'cloudy'
}

const CONDITION_EMOJI: Record<string, string> = {
  clear: '☀️',
  partly_cloudy: '⛅',
  foggy: '🌫️',
  rainy: '🌧️',
  snowy: '🌨️',
  showers: '🌦️',
  thunderstorm: '⛈️',
  cloudy: '☁️',
}

const CONDITION_LABEL: Record<string, string> = {
  clear: 'Clear',
  partly_cloudy: 'Partly Cloudy',
  foggy: 'Foggy',
  rainy: 'Rainy',
  snowy: 'Snowy',
  showers: 'Showers',
  thunderstorm: 'Thunderstorm',
  cloudy: 'Cloudy',
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface WeatherData {
  location: string
  current: {
    temperature: number
    humidity: number
    condition: string
    windSpeed: number
    precipitation: number
  }
  forecast: Array<{ date: string; condition: string; tempMax: number; tempMin: number }>
}

// ── Direct Open-Meteo fetch (no backend required) ─────────────────────────────
async function fetchWeather(cityName: string): Promise<WeatherData> {
  const coords = ZAMBIA_CITIES[cityName.toLowerCase().trim()]
  if (!coords) throw new Error(`City "${cityName}" not recognised`)

  const params = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'Africa/Lusaka',
    forecast_days: '5',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)

  const data = (await res.json()) as {
    current: {
      temperature_2m: number
      relative_humidity_2m: number
      wind_speed_10m: number
      weather_code: number
      precipitation: number
    }
    daily: {
      time: string[]
      weather_code: number[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
    }
  }

  return {
    location: coords.display,
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      condition: codeToCondition(data.current.weather_code),
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
    },
    forecast: data.daily.time.map((date, i) => ({
      date,
      condition: codeToCondition(data.daily.weather_code[i]),
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
    })),
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function WeatherModal({ onClose }: WeatherModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<WeatherData | null>(null)

  const filteredCities = ALL_CITIES.filter(c =>
    c.toLowerCase().startsWith(inputValue.toLowerCase())
  )

  const handleSearch = async (cityName?: string) => {
    const city = (cityName ?? inputValue).trim()
    if (!city) return
    setShowSuggestions(false)
    setError('')
    setLoading(true)
    try {
      const result = await fetchWeather(city)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCity = (city: string) => {
    setInputValue(city)
    setShowSuggestions(false)
    handleSearch(city)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌤️</span>
            <h2
              className="font-bold text-gray-900 text-[15px]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Weather Insights
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Search */}
          <div className="relative mb-5">
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
              style={{ borderColor: '#e2e8f0' }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = '#2d6a19')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <svg
                className="w-4 h-4 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
                placeholder="Enter a city (e.g. Lusaka, Kitwe…)"
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
              />
              <button
                onClick={() => handleSearch()}
                disabled={!inputValue.trim() || loading}
                className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor: inputValue.trim() && !loading ? '#2d6a19' : '#d1d5db',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {loading ? '…' : 'Search'}
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                {filteredCities.slice(0, 6).map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left text-sm px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: '#2d6a19', borderTopColor: 'transparent' }}
              />
              <p className="text-sm text-gray-500">Fetching weather data…</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="rounded-xl p-4 text-sm text-center"
              style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}
            >
              <p className="font-semibold mb-1">City not recognised</p>
              <p className="text-xs text-red-400">
                Try: Lusaka, Kitwe, Ndola, Livingstone, Chipata, Kabwe…
              </p>
            </div>
          )}

          {/* Weather data */}
          {data && !loading && (
            <div className="space-y-4">
              {/* Current weather */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#1a3d0a' }}>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#7ed957', fontFamily: "'Montserrat', sans-serif" }}
                >
                  {data.location} — Now
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-white font-black leading-none"
                      style={{ fontSize: '3.5rem', fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {Math.round(data.current.temperature)}°
                    </p>
                    <p className="text-green-300 text-sm mt-1">
                      {CONDITION_LABEL[data.current.condition] ?? data.current.condition}
                    </p>
                  </div>
                  <span style={{ fontSize: '3.5rem' }}>
                    {CONDITION_EMOJI[data.current.condition] ?? '🌡️'}
                  </span>
                </div>
                <div
                  className="flex gap-5 mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>💧</span>
                    <span className="text-xs text-green-300">
                      {data.current.humidity}% humidity
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>💨</span>
                    <span className="text-xs text-green-300">
                      {Math.round(data.current.windSpeed)} km/h wind
                    </span>
                  </div>
                  {data.current.precipitation > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>🌧️</span>
                      <span className="text-xs text-green-300">
                        {data.current.precipitation} mm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5-day forecast */}
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  5-Day Forecast
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {data.forecast.map(day => (
                    <div
                      key={day.date}
                      className="flex flex-col items-center gap-1 rounded-xl py-3 px-1"
                      style={{ backgroundColor: '#f8fdf4' }}
                    >
                      <p className="text-[10px] font-semibold text-gray-500">
                        {formatDay(day.date)}
                      </p>
                      <span className="text-xl">{CONDITION_EMOJI[day.condition] ?? '🌡️'}</span>
                      <p
                        className="text-[11px] font-bold text-gray-800"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {Math.round(day.tempMax)}°
                      </p>
                      <p className="text-[10px] text-gray-400">{Math.round(day.tempMin)}°</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farming tip */}
              {['rainy', 'thunderstorm', 'showers'].includes(data.current.condition) ? (
                <div
                  className="rounded-xl p-3 flex gap-2.5 text-xs"
                  style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}
                >
                  <span className="shrink-0">💡</span>
                  <p>
                    <span className="font-semibold">Farming tip:</span> Avoid spraying pesticides or
                    herbicides today — rain will wash them off before they take effect.
                  </p>
                </div>
              ) : data.current.condition === 'clear' ? (
                <div
                  className="rounded-xl p-3 flex gap-2.5 text-xs"
                  style={{ backgroundColor: '#fefce8', color: '#854d0e' }}
                >
                  <span className="shrink-0">💡</span>
                  <p>
                    <span className="font-semibold">Farming tip:</span> Good conditions for field
                    spraying and harvesting today.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Empty state */}
          {!data && !loading && !error && (
            <div className="text-center py-8">
              <span className="text-5xl block mb-3">🌍</span>
              <p className="text-sm text-gray-500">
                Enter a Zambian city to see the current weather and 5-day forecast.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
