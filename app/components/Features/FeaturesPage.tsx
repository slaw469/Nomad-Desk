// app/components/Features/FeaturesPage.tsx

import React from 'react';
import Header from '../LandingPageComponents/components/Header';
import Footer from '../LandingPageComponents/components/Footer';
import styles from '../../styles/landing.module.css';

const FeaturesPage: React.FC = () => (
  <div className={styles.body}>
    <Header />

    <main>
      {/* Hero Section */}
      <section className={styles.hero} style={{ minHeight: '50vh' }}>
        <div className={styles.heroContent} style={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
          <h1 className={styles.heroTitle}>
            Powerful
            {' '}
            <span className={styles.highlight}>Features</span>
            {' '}
            for Modern Remote Workers
          </h1>
          <p className={styles.heroSubtitle}>
            Discover how NomadDesk transforms the way you find and book productive workspaces around the world.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className={styles.features} style={{ paddingTop: '60px' }}>
        <div className={styles.featureCards} style={{ gridTemplateColumns: '1fr', gap: '50px' }}>
          <div
            className={styles.featureCard}
            style={{
              display: 'flex', padding: '40px', alignItems: 'center', gap: '30px',
            }}
          >
            <div style={{ flex: '0 0 40%' }}>
              <div className={styles.featureIcon} style={{ width: '80px', height: '80px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className={styles.featureTitle} style={{ fontSize: '1.8rem', marginTop: '20px' }}>Smart Workspace Discovery</h3>
            </div>
            <div style={{ flex: '1' }}>
              <p className={styles.featureDescription} style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Our advanced search algorithm helps you find the perfect workspace based on your specific needs. Filter by location, WiFi speed, noise level, availability of power outlets, meeting rooms, and more. Whether you need a quiet place for important calls or a vibrant environment to spark creativity, NomadDesk has you covered.
              </p>
              <ul style={{
                marginTop: '20px', fontSize: '1.1rem', color: '#4B5563', paddingLeft: '20px',
              }}
              >
                <li>Location-based search with interactive maps</li>
                <li>Detailed filtering options for specific workspace needs</li>
                <li>Real-time availability updates</li>
                <li>Personalized recommendations based on your preferences</li>
              </ul>
            </div>
          </div>

          <div
            className={styles.featureCard}
            style={{
              display: 'flex', padding: '40px', alignItems: 'center', gap: '30px', flexDirection: 'row-reverse',
            }}
          >
            <div style={{ flex: '0 0 40%' }}>
              <div className={styles.featureIcon} style={{ width: '80px', height: '80px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.featureTitle} style={{ fontSize: '1.8rem', marginTop: '20px' }}>Verified Community & Reviews</h3>
            </div>
            <div style={{ flex: '1' }}>
              <p className={styles.featureDescription} style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Join a global community of remote workers, digital nomads, and freelancers who share your work style. All workspaces on NomadDesk are verified and include authentic reviews from real users. Connect with like-minded professionals, participate in community events, and find workspaces trusted by people with similar needs.
              </p>
              <ul style={{
                marginTop: '20px', fontSize: '1.1rem', color: '#4B5563', paddingLeft: '20px',
              }}
              >
                <li>Verified workspace listings with detailed photos and amenities</li>
                <li>Authentic reviews from the remote work community</li>
                <li>Community events and networking opportunities</li>
                <li>Direct messaging with workspace hosts</li>
              </ul>
            </div>
          </div>

          <div
            className={styles.featureCard}
            style={{
              display: 'flex', padding: '40px', alignItems: 'center', gap: '30px',
            }}
          >
            <div style={{ flex: '0 0 40%' }}>
              <div className={styles.featureIcon} style={{ width: '80px', height: '80px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3 className={styles.featureTitle} style={{ fontSize: '1.8rem', marginTop: '20px' }}>Seamless Booking & Payments</h3>
            </div>
            <div style={{ flex: '1' }}>
              <p className={styles.featureDescription} style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                Book and pay for workspaces instantly with our secure, hassle-free system. Choose from flexible booking options - by the hour, day, week, or month - to match your schedule and budget. Manage all your bookings in one place and receive instant confirmations and reminders.
              </p>
              <ul style={{
                marginTop: '20px', fontSize: '1.1rem', color: '#4B5563', paddingLeft: '20px',
              }}
              >
                <li>Instant booking with secure payment processing</li>
                <li>Flexible duration options (hourly, daily, weekly, monthly)</li>
                <li>Digital check-in and access instructions</li>
                <li>Easy cancellation and rebooking options</li>
                <li>Exclusive discounts for frequent users</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Features */}
      <section className={styles.popularSpaces} style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Even More
            <span className={styles.highlight}>Features</span>
          </h2>
          <p className={styles.sectionSubtitle}>Designed to enhance your remote work experience at every step</p>
        </div>

        <div className={styles.featureCards} style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '50px' }}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Trust & Safety</h3>
            <p className={styles.featureDescription}>
              Every workspace is thoroughly verified for security and authenticity. Work with confidence knowing we prioritize your safety and privacy.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>24/7 Support</h3>
            <p className={styles.featureDescription}>
              Our customer support team is available around the clock to assist with any questions or issues. Get help whenever you need it, wherever you are.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Special Rates</h3>
            <p className={styles.featureDescription}>
              Enjoy exclusive discounts and promotions for loyal NomadDesk users. Save more when you book frequently or for longer durations.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Workspace Quality Guarantee</h3>
            <p className={styles.featureDescription}>
              If a workspace doesn't meet our advertised standards, we'll provide a refund or alternative solution - your satisfaction is guaranteed.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Smart Work Profiles</h3>
            <p className={styles.featureDescription}>
              Create custom work profiles for different needs - focused work, team collaboration, or client meetings - to quickly find matching workspaces.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Calendar Integration</h3>
            <p className={styles.featureDescription}>
              Sync your bookings with Google Calendar, Outlook, or Apple Calendar to keep your schedule organized and receive timely reminders.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.newsletter} style={{ padding: '100px 80px' }}>
        <div className={styles.newsletterContent}>
          <h2 className={styles.newsletterTitle}>Ready to transform your remote work experience?</h2>
          <p className={styles.newsletterDescription}>Join thousands of remote workers who have discovered their perfect workspace with NomadDesk.</p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px',
          }}
          >
            <a href="/signup" className={`${styles.ctaButton} ${styles.primaryButton}`} style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
              Sign Up Free
            </a>
            <a href="/workspaces" className={`${styles.ctaButton} ${styles.secondaryButton}`} style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
              Browse Spaces
            </a>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default FeaturesPage;
