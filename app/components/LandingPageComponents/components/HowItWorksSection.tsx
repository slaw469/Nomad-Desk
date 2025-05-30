// components/HowItWorksSection.tsx
import React from 'react';
import styles from '../../../styles/landing.module.css';

const HowItWorksSection: React.FC = () => (
  <section id="how-it-works" className={styles.howItWorks}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <p className={styles.sectionSubtitle}>Finding your perfect study space is just a few clicks away. Our streamlined process makes it easy to discover, book, and enjoy productive environments.</p>
    </div>
    <div className={styles.steps}>
      <div className={styles.step}>
        <div className={styles.stepNumber}>1</div>
        <h3 className={styles.stepTitle}>Search</h3>
        <p className={styles.stepDescription}>Enter your location, date, and preferences to find available spaces near you.</p>
      </div>
      <div className={styles.step}>
        <div className={styles.stepNumber}>2</div>
        <h3 className={styles.stepTitle}>Compare</h3>
        <p className={styles.stepDescription}>Browse through reviews, amenities, and photos to find your perfect match.</p>
      </div>
      <div className={styles.step}>
        <div className={styles.stepNumber}>3</div>
        <h3 className={styles.stepTitle}>Book</h3>
        <p className={styles.stepDescription}>Reserve your spot instantly with our secure booking system.</p>
      </div>
      <div className={styles.step}>
        <div className={styles.stepNumber}>4</div>
        <h3 className={styles.stepTitle}>Work & Study</h3>
        <p className={styles.stepDescription}>Show up and enjoy your productive space with all the amenities you need.</p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
