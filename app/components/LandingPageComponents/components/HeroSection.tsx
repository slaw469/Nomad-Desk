// components/HeroSection.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';
import styles from '../../../styles/landing.module.css';
import SpaceFinderAnimation from './SpaceFinderAnimation';

const HeroSection: React.FC = () => (
  <section className={styles.hero}>
    <div className={styles.heroContent}>
      <h1 className={styles.heroTitle}>
        Find your perfect
        <span className={styles.highlight}>study space</span>
        {' '}
        anywhere
      </h1>
      <p className={styles.heroSubtitle}>Discover and book productive work environments. From cozy cafes to quiet libraries, find your ideal space to focus, create, and collaborate.</p>
      <div className={styles.heroCta}>
        <Link to="/workspaces" className={`${styles.ctaButton} ${styles.primaryButton}`}>Find Spaces</Link>
        <Link to="/create-group" className={`${styles.ctaButton} ${styles.secondaryButton}`}>Create Study Group</Link>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>5000+</span>
          <span className={styles.statLabel}>Workspaces</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>3M+</span>
          <span className={styles.statLabel}>Users</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>150+</span>
          <span className={styles.statLabel}>Cities</span>
        </div>
      </div>
    </div>
    <div className={styles.heroImage}>
      <SpaceFinderAnimation />
    </div>
  </section>
);

export default HeroSection;
