import React, { useState } from 'react';
import "./aboutstyles/Header.css";
import Logo from './Logo';

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo />
          <span className="header-logo-text">NOMAD DESK</span>
        </div>
        
        <nav className="header-nav">
          <a href="#" className="header-nav-link">Find Spaces</a>
          <a href="#" className="header-nav-link">How It Works</a>
          <a href="#" className="header-nav-link">Features</a>
          <a href="#" className="header-nav-link active">About Us</a>
        </nav>
        
        <div className="header-actions">
          <button className="btn btn-outline">Log in</button>
          <button className="btn btn-gradient">Sign up</button>
        </div>
        
        <button 
          className="header-mobile-toggle"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? (
            <svg className="header-mobile-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="header-mobile-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="header-mobile-menu">
          <a href="#" className="header-mobile-link">Find Spaces</a>
          <a href="#" className="header-mobile-link">How It Works</a>
          <a href="#" className="header-mobile-link">Features</a>
          <a href="#" className="header-mobile-link active">About Us</a>
          <div className="header-mobile-actions">
            <button className="btn btn-outline">Log in</button>
            <button className="btn btn-gradient">Sign up</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;