import type { WeatherSnapshot } from './WeatherTypes';

const FAVORITES_KEY = 'sunnyweather_favorites';

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
}

/**
 * Load favorite locations from localStorage.
 */
export const loadFavorites = (): FavoriteLocation[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as FavoriteLocation[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

/**
 * Persist favorite locations to localStorage.
 */
export const saveFavorites = (favorites: FavoriteLocation[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

/**
 * Convert snapshot into a favorite location entry.
 */
export const snapshotToFavorite = (snapshot: WeatherSnapshot): FavoriteLocation => ({
  id: snapshot.location.id,
  name: snapshot.location.name,
  country: snapshot.location.country,
});
