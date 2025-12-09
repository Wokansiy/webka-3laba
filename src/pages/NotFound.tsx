import React from 'react';
import { NavLink } from 'react-router-dom';

// Simple 404 page.
const NotFound: React.FC = () => {
  return (
    <section className="page">
      <header className="page-header">
        <h1>Сторінку не знайдено</h1>
        <p>Можливо, ви помилилися в адресі або сторінка була змінена.</p>
      </header>
      <NavLink to="/" className="btn btn-primary">
        На головну
      </NavLink>
    </section>
  );
};

export default NotFound;
