import React from 'react';
import { NavLink } from 'react-router-dom';

// Application navigation bar with simple links.
const Navbar: React.FC = () => {
  const buildNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <span className="logo">SunnyWeather</span>
        <nav className="nav-links">
          <NavLink to="/" className={buildNavLinkClass}>
            Головна
          </NavLink>
          <NavLink to="/favorites" className={buildNavLinkClass}>
            Обране
          </NavLink>
          <NavLink to="/about" className={buildNavLinkClass}>
            Про застосунок
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
