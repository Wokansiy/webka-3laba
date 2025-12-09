import type {
  GeoLocation,
  CurrentWeather,
  WeatherSnapshot,
  WeatherApiError,
} from './WeatherTypes';

const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoGeoResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
}

/**
 * Search for locations by name using Open-Meteo geocoding API.
 */
export const searchLocations = async (query: string): Promise<GeoLocation[]> => {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const url = new URL(GEO_BASE_URL);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '5');
  url.searchParams.set('language', 'uk');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Не вдалося знайти локації. Спробуйте ще раз.');
  }

  const data = (await response.json()) as OpenMeteoGeoResponse;

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((item) => ({
    id: String(item.id),
    name: item.name,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }));
};

/**
 * Fetch current weather for a given location using Open-Meteo forecast API.
 */
export const fetchCurrentWeather = async (location: GeoLocation): Promise<WeatherSnapshot> => {
  const url = new URL(WEATHER_BASE_URL);
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', location.timezone || 'auto');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Не вдалося завантажити погоду. Спробуйте ще раз.');
  }

  const data = (await response.json()) as OpenMeteoWeatherResponse;

  if (!data.current_weather) {
    throw new Error('Поточні дані погоди відсутні для цієї локації.');
  }

  const current: CurrentWeather = {
    temperature: data.current_weather.temperature,
    windspeed: data.current_weather.windspeed,
    winddirection: data.current_weather.winddirection,
    weathercode: data.current_weather.weathercode,
    time: data.current_weather.time,
  };

  return {
    location,
    current,
  };
};

/**
 * Map WMO weather code to human readable description in Ukrainian.
 */
export const describeWeatherCode = (code: number): string => {
  if (code === 0) return 'Ясно';
  if (code === 1 || code === 2) return 'Переважно ясно';
  if (code === 3) return 'Хмарно';
  if (code === 45 || code === 48) return 'Туман';
  if (code === 51 || code === 53 || code === 55) return 'Мряка';
  if (code === 61 || code === 63 || code === 65) return 'Дощ';
  if (code === 71 || code === 73 || code === 75) return 'Сніг';
  if (code === 80 || code === 81 || code === 82) return 'Злива';
  if (code === 95) return 'Гроза';
  if (code === 96 || code === 99) return 'Гроза з градом';
  return 'Погодні умови невідомі';
};

/**
 * Convert error to a user-friendly shape.
 */
export const normalizeWeatherError = (error: unknown): WeatherApiError => {
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Сталася невідома помилка при завантаженні погоди.' };
};
