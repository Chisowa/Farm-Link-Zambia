import { useState, useEffect } from 'react'

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  rainfall: number
  timestamp: Date
}

export interface WeatherForecast extends WeatherData {
  day: string
  date: string
  high: number
  low: number
  icon: string
}

// Open-Meteo API (free, no API key needed)
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

// Map WMO weather codes to descriptive text and emojis
const weatherCodeMap: Record<number, { text: string; emoji: string }> = {
  0: { text: 'Clear', emoji: '☀️' },
  1: { text: 'Mostly Clear', emoji: '🌤️' },
  2: { text: 'Partly Cloudy', emoji: '⛅' },
  3: { text: 'Cloudy', emoji: '☁️' },
  45: { text: 'Foggy', emoji: '🌫️' },
  48: { text: 'Foggy', emoji: '🌫️' },
  51: { text: 'Light Drizzle', emoji: '🌧️' },
  53: { text: 'Drizzle', emoji: '🌧️' },
  55: { text: 'Heavy Drizzle', emoji: '🌧️' },
  61: { text: 'Light Rain', emoji: '🌧️' },
  63: { text: 'Moderate Rain', emoji: '🌧️' },
  65: { text: 'Heavy Rain', emoji: '⛈️' },
  71: { text: 'Light Snow', emoji: '❄️' },
  73: { text: 'Snow', emoji: '❄️' },
  75: { text: 'Heavy Snow', emoji: '❄️' },
  77: { text: 'Snow Grains', emoji: '❄️' },
  80: { text: 'Light Showers', emoji: '🌧️' },
  81: { text: 'Showers', emoji: '🌧️' },
  82: { text: 'Heavy Showers', emoji: '⛈️' },
  85: { text: 'Light Snow Showers', emoji: '❄️' },
  86: { text: 'Snow Showers', emoji: '❄️' },
  95: { text: 'Thunderstorm', emoji: '⚡' },
  96: { text: 'Thunderstorm with Hail', emoji: '⛈️' },
  99: { text: 'Thunderstorm with Hail', emoji: '⛈️' },
}

export function useWeather(latitude: number, longitude: number) {
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [current, setCurrent] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,wind_speed_10m_max&timezone=Africa/Lusaka`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()

        // Parse current weather
        if (data.current) {
          const currentWeather = data.current
          const weatherInfo = weatherCodeMap[currentWeather.weather_code] || {
            text: 'Unknown',
            emoji: '🤔',
          }

          setCurrent({
            temperature: currentWeather.temperature_2m,
            condition: weatherInfo.text,
            humidity: currentWeather.relative_humidity_2m,
            windSpeed: currentWeather.wind_speed_10m,
            rainfall: currentWeather.precipitation || 0,
            timestamp: new Date(currentWeather.time),
          })
        }

        // Parse daily forecast
        if (data.daily) {
          const forecastData = data.daily
          const forecasts: WeatherForecast[] = []

          for (let i = 0; i < Math.min(7, forecastData.time.length); i++) {
            const date = new Date(forecastData.time[i])
            const weatherInfo = weatherCodeMap[forecastData.weather_code[i]] || {
              text: 'Unknown',
              emoji: '🤔',
            }

            const dayName =
              i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })

            forecasts.push({
              day: dayName,
              date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              temperature: Math.round(
                (forecastData.temperature_2m_max[i] + forecastData.temperature_2m_min[i]) / 2
              ),
              high: Math.round(forecastData.temperature_2m_max[i]),
              low: Math.round(forecastData.temperature_2m_min[i]),
              condition: weatherInfo.text,
              icon: weatherInfo.emoji,
              rainfall: Math.round(forecastData.precipitation_sum[i]),
              humidity: forecastData.relative_humidity_2m_max[i],
              windSpeed: Math.round(forecastData.wind_speed_10m_max[i]),
              timestamp: date,
            })
          }

          setForecast(forecasts)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather')
        console.error('Weather fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude])

  return { forecast, current, isLoading, error }
}
