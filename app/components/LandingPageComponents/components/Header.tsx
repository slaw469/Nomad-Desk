import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // Handle scrolling to section if on same page
  const scrollToSection = (sectionId: string, path: string) => {
    // Check if we're already on the home page
    if (window.location.pathname === '/' || window.location.pathname === '') {
      // We're on the home page, so just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // We're on a different page, navigate to home first and then scroll
      navigate({ to: path });
      // After navigation, scroll to the section (with a small delay to ensure the page loads)
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

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
        {/* Replace the Link with a button for sections on the same page */}
        <button 
          onClick={() => scrollToSection('how-it-works', '/')} 
          className="nav-link-button"
        >
          How It Works
        </button>
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