// app/components/Legal/TrustSafety.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

const TrustSafety: React.FC = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Inter, sans-serif'
    } as React.CSSProperties,
    header: {
      padding: '20px 40px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4A6FDC',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    hero: {
      background: 'linear-gradient(135deg, #4A6FDC 0%, #2DD4BF 100%)',
      padding: '80px 40px',
      textAlign: 'center' as const,
      color: 'white'
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '15px'
    },
    heroSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto'
    },
    main: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    introSection: {
      textAlign: 'center' as const,
      marginBottom: '60px'
    },
    introText: {
      fontSize: '1.1rem',
      color: '#4B5563',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto'
    },
    safetyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      marginBottom: '60px'
    },
    safetyCard: {
      background: '#F8FAFC',
      padding: '30px',
      borderRadius: '16px',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease'
    },
    cardIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
      display: 'block'
    },
    cardTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '15px'
    },
    cardDescription: {
      color: '#4B5563',
      lineHeight: '1.6'
    },
    guidelinesSection: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '20px',
      textAlign: 'center' as const
    },
    guidelinesList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    guideline: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      padding: '15px',
      background: '#F8FAFC',
      borderRadius: '8px'
    },
    guidelineIcon: {
      color: '#10B981',
      marginTop: '2px',
      flexShrink: 0
    },
    guidelineText: {
      color: '#4B5563',
      lineHeight: '1.5'
    },
    reportingSection: {
      background: '#FEF2F2',
      border: '2px solid #FECACA',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center' as const,
      marginBottom: '40px'
    },
    reportingTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#DC2626',
      marginBottom: '15px'
    },
    reportingText: {
      color: '#7F1D1D',
      marginBottom: '20px',
      lineHeight: '1.6'
    },
    reportButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#DC2626',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    resourcesSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    },
    resourceCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      textAlign: 'center' as const
    },
    resourceIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px',
      display: 'block'
    },
    resourceTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '10px'
    },
    resourceText: {
      color: '#4B5563',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      marginBottom: '15px'
    },
    resourceLink: {
      color: '#4A6FDC',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Trust & Safety</h1>
        <p style={styles.heroSubtitle}>
          Building a safe and trustworthy community for everyone to work and study
        </p>
      </section>

      <main style={styles.main}>
        <section style={styles.introSection}>
          <p style={styles.introText}>
            At Nomad Desk, safety and trust are our top priorities. We work hard to create a secure 
            environment where everyone can focus on their work and studies with peace of mind. 
            Our comprehensive safety measures protect both workspace users and providers.
          </p>
        </section>

        <div style={styles.safetyGrid}>
          <div style={styles.safetyCard}>
            <span style={styles.cardIcon}>🛡️</span>
            <h3 style={styles.cardTitle}>Verified Workspaces</h3>
            <p style={styles.cardDescription}>
              All workspace partners undergo thorough verification including business license checks, 
              safety inspections, and quality assessments before joining our platform.
            </p>
          </div>

          <div style={styles.safetyCard}>
            <span style={styles.cardIcon}>👥</span>
            <h3 style={styles.cardTitle}>Community Standards</h3>
            <p style={styles.cardDescription}>
              We maintain clear community guidelines and actively enforce them to ensure respectful 
              interactions and professional behavior across our platform.
            </p>
          </div>

          <div style={styles.safetyCard}>
            <span style={styles.cardIcon}>🔒</span>
            <h3 style={styles.cardTitle}>Secure Payments</h3>
            <p style={styles.cardDescription}>
              All payment processing is handled through industry-leading secure payment providers 
              with bank-level encryption and fraud protection.
            </p>
          </div>

          <div style={styles.safetyCard}>
            <span style={styles.cardIcon}>📞</span>
            <h3 style={styles.cardTitle}>24/7 Support</h3>
            <p style={styles.cardDescription}>
              Our safety team is available around the clock to address concerns, investigate issues, 
              and provide assistance when you need it most.
            </p>
          </div>
        </div>

        <section style={styles.guidelinesSection}>
          <h2 style={styles.sectionTitle}>Community Guidelines</h2>
          <p style={{textAlign: 'center', color: '#4B5563', marginBottom: '30px'}}>
            These guidelines help create a positive environment for everyone in our community.
          </p>

          <div style={styles.guidelinesList}>
            <div style={styles.guideline}>
              <div style={styles.guidelineIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={styles.guidelineText}>
                <strong>Honor Your Bookings:</strong> Arrive on time for your reservations and 
                cancel with appropriate notice if plans change.
              </p>
            </div>

            <div style={styles.guideline}>
              <div style={styles.guidelineIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={styles.guidelineText}>
                <strong>Provide Accurate Information:</strong> Keep your profile and booking 
                information up to date and truthful.
              </p>
            </div>

            <div style={styles.guideline}>
              <div style={styles.guidelineIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={styles.guidelineText}>
                <strong>Protect Privacy:</strong> Respect others' privacy and personal space. 
                Don't photograph or record others without consent.
              </p>
            </div>

            <div style={styles.guideline}>
              <div style={styles.guidelineIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={styles.guidelineText}>
                <strong>Leave Reviews Honestly:</strong> Share genuine feedback to help other 
                users make informed decisions about workspaces.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.reportingSection}>
          <h2 style={styles.reportingTitle}>Report Safety Concerns</h2>
          <p style={styles.reportingText}>
            If you encounter harassment, unsafe conditions, or violations of our community guidelines, 
            please report them immediately. We take all reports seriously and investigate promptly.
          </p>
          <Link to="/contact" style={styles.reportButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 12L3 21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Report an Issue
          </Link>
        </section>

        <section>
          <h2 style={{...styles.sectionTitle, textAlign: 'left', marginBottom: '30px'}}>Safety Resources</h2>
          <div style={styles.resourcesSection}>
            <div style={styles.resourceCard}>
              <span style={styles.resourceIcon}>📋</span>
              <h3 style={styles.resourceTitle}>Safety Tips</h3>
              <p style={styles.resourceText}>
                Best practices for staying safe while using workspaces and meeting other users.
              </p>
              <Link to="/help-center" style={styles.resourceLink}>
                View Safety Guide →
              </Link>
            </div>

            <div style={styles.resourceCard}>
              <span style={styles.resourceIcon}>🚨</span>
              <h3 style={styles.resourceTitle}>Emergency Contacts</h3>
              <p style={styles.resourceText}>
                Important phone numbers and resources for emergency situations.
              </p>
              <Link to="/help-center" style={styles.resourceLink}>
                Emergency Info →
              </Link>
            </div>

            <div style={styles.resourceCard}>
              <span style={styles.resourceIcon}>💬</span>
              <h3 style={styles.resourceTitle}>Conflict Resolution</h3>
              <p style={styles.resourceText}>
                How to resolve disputes and communicate effectively with other users.
              </p>
              <Link to="/help-center" style={styles.resourceLink}>
                Learn More →
              </Link>
            </div>

            <div style={styles.resourceCard}>
              <span style={styles.resourceIcon}>🔒</span>
              <h3 style={styles.resourceTitle}>Privacy Protection</h3>
              <p style={styles.resourceText}>
                Understanding your privacy rights and how to protect your personal information.
              </p>
              <Link to="/privacy-policy" style={styles.resourceLink}>
                Privacy Policy →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrustSafety;