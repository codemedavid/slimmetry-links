import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { supabase } from './lib/supabase'; // Unused in static layout
import LinkButton from './components/LinkButton';
import Footer from './components/Footer';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Public Home Component
// Public Home Component
const Home = () => {
  // Static layout only for now per user request


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
        {/* Group 1: Main Actions */}
        <LinkButton text="Products & Pricelist" href="#" icon="📋" delay={0.1} />
        <LinkButton text="Place an Order" href="https://tiny.cc/paureorder" icon="🛒" delay={0.15} />
        <LinkButton text="Proofs & Testimonials" href="#" icon="✨" delay={0.2} />

        <div className="section-divider"></div>

        {/* Group 2: Info & Contact */}
        <LinkButton text="Guidelines & Safety Information" href="https://tiny.cc/paureguide" icon="🛡️" delay={0.25} />
        <LinkButton text="Contact Us — Slimmetry Manila" href="https://tiny.cc/paurecontactus" icon="💬" delay={0.3} />

        <div className="section-divider"></div>

        {/* Group 3: Branches */}
        <LinkButton text="Slimmetry Davao" href="#" icon="📍" delay={0.35} />
        <LinkButton text="Slimmetry Bacolod" href="#" icon="📍" delay={0.4} />

        <div className="section-divider"></div>

        {/* Group 4: Community */}
        <div className="w-full flex flex-col items-center">
          <LinkButton text="Join Our Telegram Community" href="#" icon="✈️" delay={0.45} />
          <p className="telegram-subtext">2,000+ members</p>
          <p className="telegram-note">Please send us a DM before joining.</p>
        </div>
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
