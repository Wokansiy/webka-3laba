export interface GeoLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface WeatherSnapshot {
  location: GeoLocation;
  current: CurrentWeather;
}

export interface WeatherApiError {
  message: string;
}
