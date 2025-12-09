import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './modules/layout/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Root application component with routing configuration.
const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
