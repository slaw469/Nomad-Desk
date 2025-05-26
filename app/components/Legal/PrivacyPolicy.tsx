// app/components/Legal/PrivacyPolicy.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

const PrivacyPolicy: React.FC = () => {
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
      padding: '60px 40px',
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
      opacity: 0.9
    },
    main: {
      padding: '60px 40px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    lastUpdated: {
      color: '#6B7280',
      fontSize: '0.9rem',
      marginBottom: '40px',
      textAlign: 'center' as const
    },
    content: {
      lineHeight: '1.7',
      color: '#374151'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1F2937',
      marginTop: '40px',
      marginBottom: '20px'
    },
    subsectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#374151',
      marginTop: '30px',
      marginBottom: '15px'
    },
    paragraph: {
      marginBottom: '16px'
    },
    list: {
      paddingLeft: '20px',
      marginBottom: '16px'
    },
    listItem: {
      marginBottom: '8px'
    },
    contactInfo: {
      background: '#F9FAFB',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '40px'
    },
    contactTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '10px'
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
        <h1 style={styles.heroTitle}>Privacy Policy</h1>
        <p style={styles.heroSubtitle}>
          How we collect, use, and protect your personal information
        </p>
      </section>

      <main style={styles.main}>
        <p style={styles.lastUpdated}>Last updated: January 15, 2025</p>
        
        <div style={styles.content}>
          <p style={styles.paragraph}>
            At Nomad Desk, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our workspace discovery platform.
          </p>

          <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
          
          <h3 style={styles.subsectionTitle}>Personal Information</h3>
          <p style={styles.paragraph}>We may collect personal information that you provide to us, including:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Name and contact information (email, phone number)</li>
            <li style={styles.listItem}>Profile information (bio, interests, work preferences)</li>
            <li style={styles.listItem}>Account credentials and authentication information</li>
            <li style={styles.listItem}>Payment information (processed securely through third-party providers)</li>
            <li style={styles.listItem}>Communication preferences and settings</li>
          </ul>

          <h3 style={styles.subsectionTitle}>Usage Information</h3>
          <p style={styles.paragraph}>We automatically collect information about how you use our service:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Workspace searches, bookings, and preferences</li>
            <li style={styles.listItem}>Device information and IP address</li>
            <li style={styles.listItem}>Browser type and operating system</li>
            <li style={styles.listItem}>Pages visited and time spent on our platform</li>
            <li style={styles.listItem}>Location data (with your permission)</li>
          </ul>

          <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
          <p style={styles.paragraph}>We use the information we collect to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Provide and improve our workspace discovery services</li>
            <li style={styles.listItem}>Process bookings and facilitate workspace reservations</li>
            <li style={styles.listItem}>Personalize your experience and provide recommendations</li>
            <li style={styles.listItem}>Communicate with you about your account and bookings</li>
            <li style={styles.listItem}>Send you updates, newsletters, and promotional content (with consent)</li>
            <li style={styles.listItem}>Prevent fraud and enhance security</li>
            <li style={styles.listItem}>Analyze usage patterns to improve our platform</li>
          </ul>

          <h2 style={styles.sectionTitle}>3. Information Sharing</h2>
          <p style={styles.paragraph}>We may share your information in the following circumstances:</p>
          
          <h3 style={styles.subsectionTitle}>With Workspace Partners</h3>
          <p style={styles.paragraph}>
            We share necessary booking information with workspace owners to facilitate your reservations.
          </p>

          <h3 style={styles.subsectionTitle}>Service Providers</h3>
          <p style={styles.paragraph}>
            We work with trusted third-party service providers who help us operate our platform, 
            process payments, and provide customer support.
          </p>

          <h3 style={styles.subsectionTitle}>Legal Requirements</h3>
          <p style={styles.paragraph}>
            We may disclose your information if required by law or to protect our rights, 
            property, or safety of our users.
          </p>

          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <p style={styles.paragraph}>
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Encryption of data in transit and at rest</li>
            <li style={styles.listItem}>Regular security audits and vulnerability assessments</li>
            <li style={styles.listItem}>Access controls and authentication protocols</li>
            <li style={styles.listItem}>Secure data storage and backup procedures</li>
            <li style={styles.listItem}>Employee training on data protection practices</li>
          </ul>

          <h2 style={styles.sectionTitle}>5. Your Rights and Choices</h2>
          <p style={styles.paragraph}>You have the right to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Access and review your personal information</li>
            <li style={styles.listItem}>Update or correct your account information</li>
            <li style={styles.listItem}>Delete your account and associated data</li>
            <li style={styles.listItem}>Opt out of marketing communications</li>
            <li style={styles.listItem}>Control location data sharing</li>
            <li style={styles.listItem}>Request a copy of your data</li>
          </ul>

          <h2 style={styles.sectionTitle}>6. Cookies and Tracking</h2>
          <p style={styles.paragraph}>
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Essential cookies for platform functionality</li>
            <li style={styles.listItem}>Analytics cookies to understand usage patterns</li>
            <li style={styles.listItem}>Preference cookies to remember your settings</li>
            <li style={styles.listItem}>Marketing cookies for personalized content (with consent)</li>
          </ul>
          <p style={styles.paragraph}>
            You can control cookie preferences through your browser settings or our cookie consent tool.
          </p>

          <h2 style={styles.sectionTitle}>7. Data Retention</h2>
          <p style={styles.paragraph}>
            We retain your personal information only as long as necessary to provide our services 
            and comply with legal obligations. When you delete your account, we will remove your 
            personal information within 30 days, except where retention is required by law.
          </p>

          <h2 style={styles.sectionTitle}>8. Children's Privacy</h2>
          <p style={styles.paragraph}>
            Our service is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If we become aware that we have 
            collected such information, we will take steps to delete it immediately.
          </p>

          <h2 style={styles.sectionTitle}>9. International Data Transfers</h2>
          <p style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your information in accordance 
            with this Privacy Policy and applicable data protection laws.
          </p>

          <h2 style={styles.sectionTitle}>10. Changes to This Policy</h2>
          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new Privacy Policy on this page and updating the "Last updated" 
            date. We encourage you to review this Privacy Policy periodically.
          </p>

          <div style={styles.contactInfo}>
            <h3 style={styles.contactTitle}>Contact Us</h3>
            <p style={styles.paragraph}>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Email: privacy@nomaddesk.com</li>
              <li style={styles.listItem}>Phone: +1 (555) 123-4567</li>
              <li style={styles.listItem}>Address: 123 Privacy Street, San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;