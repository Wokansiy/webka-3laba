import React, { type ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

// Main application layout with header and centered content.
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
      <footer className="app-footer">
        <p> Звичайний футер</p>
      </footer>
    </div>
  );
};

export default Layout;
