// project/frontend/src/components/ClientSideHeader.tsx
import React, { useEffect, useState } from 'react';
import Header from './Header';
import styles from "../../../styles/landing.module.css";
// This component only renders the Link-enabled Header on the client side
const ClientSideHeader: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This will only run in the browser, not during SSR
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    // Server-side or initial render - use regular anchor tags
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/">
            <svg className={styles.logoIcon} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15H35V35H15V15Z" fill="white"/>
              <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC"/>
              <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF"/>
              <path d="M35 35L25 25L35 15V35Z" fill="white"/>
            </svg>
            <span className={styles.logoText}>NOMAD DESK</span>
          </a>
        </div>
        
        <div className={styles.navLinks}>
          <a href="/workspaces">Find Spaces</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/features">Features</a>
          <a href="/about">About Us</a>
        </div>
        
        <div className={styles.ctaButtons}>
          <a href="/login" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Log in</a>
          <a href="/signup" className={`${styles.ctaButton} ${styles.primaryButton}`}>Sign up</a>
        </div>
      </header>
    );
  }
  
  // Client-side render - use the full Header with Link components
  return <Header />;
};

export default ClientSideHeader;