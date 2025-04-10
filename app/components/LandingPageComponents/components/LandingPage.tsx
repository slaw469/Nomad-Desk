// components/LandingPage.tsx
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PopularSpacesSection from './PopularSpacesSection';
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection from './NewsletterSection';
import Footer from './Footer';
import styles from "../../../styles/landing.module.css";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.body}>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PopularSpacesSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;