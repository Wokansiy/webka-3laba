import React from 'react';

// Static page describing the app and the used weather API.
const About: React.FC = () => {
  return (
    <section className="page page-about">
      <header className="page-header">
        <h1>Про SunnyWeather</h1>
        <p>
          Це навчальний застосунок, створений на React + TypeScript, який показує поточну погоду
          для будь-якого міста світу.
        </p>
      </header>

      <div className="stack gap-lg">
        <div className="card card-soft">
          <h2>Як це працює?</h2>
          <p>
            При пошуку міста використовується безкоштовний сервіс геокодування від{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>
            , щоб отримати координати. Потім запит на погоду надсилається до їхнього API прогнозу.
          </p>
        </div>

        <div className="card card-soft">
          <h2>Чому світлий інтерфейс?</h2>
          <p>
            SunnyWeather задуманий як легкий, повітряний інтерфейс, що нагадує ранкове небо: м&apos;які
            відтінки, округлі форми і мінімум візуального шуму.
          </p>
        </div>


      </div>
    </section>
  );
};

export default About;
