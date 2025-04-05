import React from 'react';
import { Link } from '@tanstack/react-router';

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 15H35V35H15V15Z" fill="white"/>
          <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC"/>
          <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF"/>
          <path d="M35 35L25 25L35 15V35Z" fill="white"/>
        </svg>
        <span className="logo-text">NOMAD DESK</span>
      </div>
      
      <div className="nav-links">
        <Link to="/workspaces">Find Spaces</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/features">Features</Link>
        <Link to="/about">About Us</Link>
      </div>
      
      <div className="cta-buttons">
        <Link to="/login" className="cta-button secondary-button">Log in</Link>
        <Link to="/signup" className="cta-button primary-button">Sign up</Link>
      </div>
    </header>
  );
};

export default Header;