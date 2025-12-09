import { useState } from 'react';
import type { GeoLocation, WeatherSnapshot, WeatherApiError } from './WeatherTypes';
import {
  searchLocations,
  fetchCurrentWeather,
  describeWeatherCode,
  normalizeWeatherError,
} from './WeatherApi';

interface WeatherSearchState {
  query: string;
  isSearching: boolean;
  isLoadingWeather: boolean;
  locations: GeoLocation[];
  selectedLocation: GeoLocation | null;
  snapshot: WeatherSnapshot | null;
  error: WeatherApiError | null;
}

/**
 * Hook that encapsulates search and current weather loading.
 */
export const useWeatherSearch = () => {
  const [state, setState] = useState<WeatherSearchState>({
    query: '',
    isSearching: false,
    isLoadingWeather: false,
    locations: [],
    selectedLocation: null,
    snapshot: null,
    error: null,
  });

  const setQuery = (value: string) => {
    setState((prev) => ({
      ...prev,
      query: value,
    }));
  };

  const runSearch = async () => {
    const query = state.query.trim();

    if (!query) {
      setState((prev) => ({
        ...prev,
        locations: [],
        error: { message: 'Введіть назву міста для пошуку.' },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isSearching: true,
      error: null,
      locations: [],
      selectedLocation: null,
      snapshot: null,
    }));

    try {
      const locations = await searchLocations(query);
      setState((prev) => ({
        ...prev,
        locations,
        isSearching: false,
        error: locations.length === 0 ? { message: 'Нічого не знайдено.' } : null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isSearching: false,
        locations: [],
        error: normalizeWeatherError(err),
      }));
    }
  };

  const selectLocationAndLoadWeather = async (location: GeoLocation) => {
    setState((prev) => ({
      ...prev,
      selectedLocation: location,
      isLoadingWeather: true,
      error: null,
      snapshot: null,
    }));

    try {
      const snapshot = await fetchCurrentWeather(location);
      setState((prev) => ({
        ...prev,
        isLoadingWeather: false,
        snapshot,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoadingWeather: false,
        error: normalizeWeatherError(err),
      }));
    }
  };

  const describeSnapshot = (snapshot: WeatherSnapshot | null): string | null => {
    if (!snapshot) {
      return null;
    }

    const label = describeWeatherCode(snapshot.current.weathercode);
    return `${label}, ${snapshot.current.temperature.toFixed(1)}°C`;
  };

  return {
    ...state,
    setQuery,
    runSearch,
    selectLocationAndLoadWeather,
    describeSnapshot,
  };
};
