import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LinkButton from './components/LinkButton';
import Footer from './components/Footer';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Public Home Component
// Public Home Component
const Home = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background Decor */}
      <div className="bg-decor bg-orb-1"></div>
      <div className="bg-decor bg-orb-2"></div>
      <div className="bg-decor bg-orb-3"></div>

      {/* Header Section */}
      <header className="header animate-fade-in">
        <div className="logo-container">
          <img
            src="/slimmetry-logo.png"
            alt="Slimmetry Logo"
            className="logo-img"
          />
          <div className="logo-glow"></div>
        </div>

        <h1 className="brand-name">
          Slimmetry
        </h1>
        <p className="brand-tagline">
          Your partner in the journey to confidence.
        </p>
        <p className="brand-tagline" style={{ marginTop: '0.25rem', fontSize: '0.9em' }}>
          glow. slim. transform.
        </p>
      </header>

      {/* Links Section */}
      <main className="links-container">
        {loading ? (
          <div style={{ color: 'var(--color-text-secondary)', marginTop: '2rem' }}>Loading links...</div>
        ) : (
          links.map((link, index) => (
            <LinkButton
              key={link.id}
              text={link.text}
              href={link.href}
              icon={link.icon}
              delay={0.1 + (index * 0.05)}
            />
          ))
        )}

        {/* Fallback for empty state if needed, though admin usually seeds data */}
        {!loading && links.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)' }}>No links available.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
