// app/components/LandingPageComponents/components/LandingPage.tsx - FIXED IMPORT
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
// FIXED: Import the correct component
import PopularSpacesSection from './PopularSpacesSection'; // Use the enhanced version
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection from './NewsletterSection';
import Footer from './Footer';
import styles from '../../../styles/landing.module.css';

const LandingPage: React.FC = () => (
  <div className={styles.body}>
    <Header />
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      {/* FIXED: Use the correct component name */}
      <PopularSpacesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
