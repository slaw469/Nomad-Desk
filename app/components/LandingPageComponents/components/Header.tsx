// app/components/LandingPageComponents/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import styles from '../../../styles/landing.module.css';
import { useAuth } from '../../../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <svg className={styles.logoIcon} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15H35V35H15V15Z" fill="white" />
            <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC" />
            <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF" />
            <path d="M35 35L25 25L35 15V35Z" fill="white" />
          </svg>
          <span className={styles.logoText}>NOMAD DESK</span>
        </Link>
      </div>

      <div className={styles.navLinks}>
        <Link to="/workspaces">Find Spaces</Link>
        {/* Replace the Link with a button for sections on the same page */}
        <button
          onClick={() => scrollToSection('how-it-works', '/')}
          className={styles.navLinkButton}
        >
          How It Works
        </button>
        <Link to="/features">Features</Link>
        <Link to="/about">About Us</Link>
      </div>

      <div className={styles.ctaButtons}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Dashboard</Link>
            <button
              onClick={handleLogout}
              className={`${styles.ctaButton} ${styles.primaryButton}`}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Log in</Link>
            <Link to="/signup" className={`${styles.ctaButton} ${styles.primaryButton}`}>Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
