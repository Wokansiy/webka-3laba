import React from 'react';
import { loadFavorites, saveFavorites } from '../modules/weather/FavoritesStorage';
import type { FavoriteLocation } from '../modules/weather/FavoritesStorage';
import { fetchCurrentWeather, describeWeatherCode, normalizeWeatherError } from '../modules/weather/WeatherApi';
import type { WeatherSnapshot } from '../modules/weather/WeatherTypes';

// Favorites page that reuses localStorage entries.
const Favorites: React.FC = () => {
  const [favorites, setFavorites] = React.useState<FavoriteLocation[]>(() => loadFavorites());
  const [snapshots, setSnapshots] = React.useState<Record<string, WeatherSnapshot | null>>({});
  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [error, setError] = React.useState<string | null>(null);

  const refreshFavorite = async (favorite: FavoriteLocation) => {
    setError(null);
    setLoadingIds((prev) => new Set(prev).add(favorite.id));

    try {
      const snapshot = await fetchCurrentWeather({
        id: favorite.id,
        name: favorite.name,
        country: favorite.country,
        latitude: 0,
        longitude: 0,
        timezone: 'auto',
      } as any);
      setSnapshots((prev) => ({ ...prev, [favorite.id]: snapshot }));
    } catch (err) {
      const normalized = normalizeWeatherError(err);
      setError(normalized.message);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(favorite.id);
        return next;
      });
    }
  };

  const handleRemove = (favoriteId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((fav) => fav.id != favoriteId);
      saveFavorites(next);
      const nextSnapshots = { ...snapshots };
      delete nextSnapshots[favoriteId];
      setSnapshots(nextSnapshots);
      return next;
    });
  };

  React.useEffect(() => {
    // Initially just keep favorites list; snapshot loading can be triggered manually.
  }, []);

  return (
    <section className="page page-favorites">
      <header className="page-header">
        <h1>Обрані міста</h1>
        <p>
          Тут зберігаються міста, які ви додали на головній сторінці. Ви можете оновити
          дані або видалити непотрібні локації.
        </p>
      </header>

      <div className="stack gap-lg">
        {error && <p className="form-error">{error}</p>}
        {favorites.length === 0 && (
          <p className="muted">Поки що немає обраних міст. Додайте їх на головній сторінці.</p>
        )}

        <div className="favorites-list">
          {favorites.map((favorite) => {
            const snapshot = snapshots[favorite.id];
            const isLoading = loadingIds.has(favorite.id);

            return (
              <article key={favorite.id} className="favorite-card">
                <div className="favorite-main">
                  <h2>
                    {favorite.name}, {favorite.country}
                  </h2>
                  <p className="muted">
                    {snapshot
                      ? describeWeatherCode(snapshot.current.weathercode)
                      : 'Натисніть «Оновити», щоб завантажити поточну погоду.'}
                  </p>
                </div>
                <div className="favorite-meta">
                  {snapshot && (
                    <p className="favorite-temp">
                      {snapshot.current.temperature.toFixed(1)}
                      <span>°C</span>
                    </p>
                  )}
                  <div className="favorite-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        void refreshFavorite(favorite);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Оновлення...' : 'Оновити'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => handleRemove(favorite.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Favorites;
