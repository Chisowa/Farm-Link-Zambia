/**
 * Weather router — uses Open-Meteo (free, no API key required).
 * https://open-meteo.com/en/docs
 *
 * Supports major Zambian cities by name; pass lat/lon for any other location.
 */
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

// ── Zambian city coordinates ──────────────────────────────────────────────────
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

function resolveLocation(location: string): { lat: number; lon: number; display: string } | null {
  return ZAMBIA_CITIES[location.toLowerCase().trim()] ?? null
}

function weatherCodeToCondition(code: number): string {
  if (code === 0) return 'clear'
  if (code <= 3) return 'partly_cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 82) return 'showers'
  if (code >= 95) return 'thunderstorm'
  return 'cloudy'
}

async function fetchOpenMeteo(lat: number, lon: number, days: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'Africa/Lusaka',
    forecast_days: days.toString(),
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`)
  return res.json() as Promise<{
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
      precipitation_sum: number[]
    }
  }>
}

export const weatherRouter = router({
  getForecast: publicProcedure
    .input(
      z.object({
        location: z.string().min(1),
        days: z.number().min(1).max(14).optional().default(7),
      })
    )
    .query(async ({ input }) => {
      const coords = resolveLocation(input.location)
      if (!coords) {
        throw new Error(
          `Location "${input.location}" not found. Try: ${Object.keys(ZAMBIA_CITIES).join(', ')}`
        )
      }

      const data = await fetchOpenMeteo(coords.lat, coords.lon, input.days)

      const forecast = data.daily.time.map((date, i) => ({
        date,
        condition: weatherCodeToCondition(data.daily.weather_code[i]),
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitation: data.daily.precipitation_sum[i],
      }))

      return {
        location: coords.display,
        current: {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          condition: weatherCodeToCondition(data.current.weather_code),
          windSpeed: data.current.wind_speed_10m,
          precipitation: data.current.precipitation,
        },
        forecast,
        lastUpdated: new Date(),
      }
    }),

  getCurrentWeather: publicProcedure
    .input(z.object({ location: z.string().min(1) }))
    .query(async ({ input }) => {
      const coords = resolveLocation(input.location)
      if (!coords) {
        throw new Error(`Location "${input.location}" not recognised`)
      }

      const data = await fetchOpenMeteo(coords.lat, coords.lon, 1)

      return {
        location: coords.display,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        condition: weatherCodeToCondition(data.current.weather_code),
        windSpeed: data.current.wind_speed_10m,
        timestamp: new Date(),
      }
    }),

  listSupportedCities: publicProcedure.query(() => {
    return Object.values(ZAMBIA_CITIES).map(c => c.display)
  }),
})
