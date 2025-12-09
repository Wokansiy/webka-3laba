import React from 'react';
import { useWeatherSearch } from '../modules/weather/useWeatherSearch';
import { snapshotToFavorite, loadFavorites, saveFavorites } from '../modules/weather/FavoritesStorage';
import type { FavoriteLocation } from '../modules/weather/FavoritesStorage';

// Home page with search, current result and quick add to favorites.
const Home: React.FC = () => {
  const {
    query,
    setQuery,
    runSearch,
    isSearching,
    locations,
    selectLocationAndLoadWeather,
    isLoadingWeather,
    snapshot,
    error,
    describeSnapshot,
  } = useWeatherSearch();

  const [favorites, setFavorites] = React.useState<FavoriteLocation[]>(() => loadFavorites());
  const [info, setInfo] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSearch();
  };

  const handleAddFavorite = () => {
    if (!snapshot) {
      return;
    }

    const favorite = snapshotToFavorite(snapshot);

    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === favorite.id);
      if (exists) {
        setInfo('Це місто вже в обраному.');
        return prev;
      }

      const next = [...prev, favorite];
      saveFavorites(next);
      setInfo('Додано до обраного.');
      return next;
    });

    setTimeout(() => {
      setInfo(null);
    }, 2000);
  };

  return (
    <section className="page page-home">
      <header className="page-header">
        <h1>SunnyWeather</h1>
        <p>
          Перевіряйте погоду у будь-якому місті світу в кілька кліків. Світлий, спокійний інтерфейс
          для щоденної перевірки прогнозу.
        </p>
      </header>

      <div className="home-layout">
        <section className="home-search">
          <form className="card card-soft form" onSubmit={handleSubmit}>
            <h2>Знайти погоду</h2>
            <p className="muted">
              Введіть назву міста українською або англійською. Наприклад: Kyiv, Lviv, London.
            </p>

            <div className="form-field">
              <label htmlFor="city">Місто</label>
              <input
                id="city"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Введіть назву міста"
              />
            </div>

            {error && <p className="form-error">{error.message}</p>}
            {info && !error && <p className="form-success">{info}</p>}

            <button type="submit" className="btn btn-primary" disabled={isSearching}>
              {isSearching ? 'Пошук...' : 'Знайти'}
            </button>
          </form>

          <section className="card card-soft home-locations">
            <h2>Результати пошуку</h2>
            {locations.length === 0 && !isSearching && (
              <p className="muted">Результати з&apos;являться після пошуку.</p>
            )}
            {locations.length > 0 && (
              <ul className="list list-locations">
                {locations.map((location) => (
                  <li key={location.id}>
                    <button
                      type="button"
                      className="location-pill"
                      onClick={() => {
                        void selectLocationAndLoadWeather(location);
                      }}
                    >
                      <span className="location-name">
                        {location.name}, {location.country}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>

        <section className="home-current">
          <div className="weather-orb">
            <div className="weather-orb-inner">
              {isLoadingWeather && <p>Завантаження погоди...</p>}
              {!isLoadingWeather && !snapshot && (
                <p className="muted">
                  Оберіть місто з результатів, щоб побачити поточні погодні умови.
                </p>
              )}
              {!isLoadingWeather && snapshot && (
                <>
                  <h2>
                    {snapshot.location.name}, {snapshot.location.country}
                  </h2>
                  <p className="weather-temp">
                    {snapshot.current.temperature.toFixed(1)}
                    <span>°C</span>
                  </p>
                  <p className="weather-label">{describeSnapshot(snapshot)}</p>
                  <p className="weather-meta">
                    Вітер {snapshot.current.windspeed.toFixed(1)} км/год · Напрямок{' '}
                    {snapshot.current.winddirection.toFixed(0)}°
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddFavorite}
                  >
                    Додати в обране
                  </button>
                </>
              )}
            </div>
          </div>

          {favorites.length > 0 && (
            <section className="card card-soft favorites-preview">
              <h2>Обрані міста</h2>
              <p className="muted">Швидкий перегляд збережених локацій.</p>
              <div className="favorites-chips">
                {favorites.map((fav) => (
                  <span key={fav.id} className="favorite-chip">
                    {fav.name}, {fav.country}
                  </span>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </section>
  );
};

export default Home;
