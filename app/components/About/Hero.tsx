// app/components/About/Hero.tsx

import React from 'react';
import './aboutstyles/Hero.css';

const Hero: React.FC = () => (
  <section className="about-hero">
    <div className="about-hero-content">
      <div className="about-hero-text">
        <h1 className="about-hero-title">
          About
          {' '}
          <span className="highlight">Nomad Desk</span>
        </h1>
        <p className="about-hero-subtitle">Connecting people with perfect workspaces</p>
        <div className="about-hero-divider" />
        <p className="about-hero-description">
          Founded by Steven Law, a UT Dallas student with a passion for productive environments.
          Nomad Desk was born from the challenge of finding the right place to work and study.
        </p>
        <div className="about-hero-stats">
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
      <div className="about-hero-image">
        <div className="founder-image-container">
          <div className="founder-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div className="founder-label">Steven Law</div>
            <div className="founder-title">Founder, Nomad Desk</div>
          </div>
        </div>
      </div>
    </div>
    <div className="about-hero-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  </section>
);

export default Hero;
