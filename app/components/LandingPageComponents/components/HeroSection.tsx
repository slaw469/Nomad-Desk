import React from 'react';
import { Link } from '@tanstack/react-router';

const HeroSection: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Find your perfect <span className="highlight">study space</span> anywhere</h1>
        <p className="hero-subtitle">Discover and book productive work environments. From cozy cafes to quiet libraries, find your ideal space to focus, create, and collaborate.</p>
        <div className="hero-cta">
          <Link to="/workspaces" className="cta-button primary-button">Find Spaces</Link>
          <Link to="/create-group" className="cta-button secondary-button">Create Study Group</Link>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Workspaces</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3M+</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">150+</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src="/api/placeholder/800/600" alt="Students working in a modern workspace" />
      </div>
    </section>
  );
};

export default HeroSection;