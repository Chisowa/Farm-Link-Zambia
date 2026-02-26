import { trpc } from '../lib/trpc'

/** Fetch a 5-day forecast for a Zambian city name. Only runs when location is non-empty. */
export function useWeatherForecast(location: string) {
  return trpc.weather.getForecast.useQuery(
    { location, days: 5 },
    { enabled: !!location, retry: false }
  )
}

/** Load the list of supported Zambian cities from the backend. */
export function useSupportedCities() {
  return trpc.weather.listSupportedCities.useQuery()
}
