// app/components/Legal/TermsOfService.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';

const TermsOfService: React.FC = () => {
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
    },
    important: {
      background: '#FEF3C7',
      border: '1px solid #F59E0B',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      color: '#92400E'
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
        <h1 style={styles.heroTitle}>Terms of Service</h1>
        <p style={styles.heroSubtitle}>
          The rules and guidelines for using Nomad Desk
        </p>
      </section>

      <main style={styles.main}>
        <p style={styles.lastUpdated}>Last updated: January 15, 2025</p>
        
        <div style={styles.content}>
          <div style={styles.important}>
            <strong>Important:</strong> By using Nomad Desk, you agree to these terms. 
            Please read them carefully before using our services.
          </div>

          <p style={styles.paragraph}>
            Welcome to Nomad Desk! These Terms of Service ("Terms") govern your use of our 
            workspace discovery platform and services. By accessing or using Nomad Desk, 
            you agree to be bound by these Terms.
          </p>

          <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
          <p style={styles.paragraph}>
            By creating an account or using our services, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms and our Privacy Policy. If you 
            do not agree to these Terms, you may not use our services.
          </p>

          <h2 style={styles.sectionTitle}>2. Description of Service</h2>
          <p style={styles.paragraph}>
            Nomad Desk is a platform that helps users discover and book workspaces including 
            libraries, cafés, co-working spaces, and other work-friendly locations. We connect 
            users with workspace providers but are not responsible for the actual workspace services.
          </p>

          <h2 style={styles.sectionTitle}>3. User Accounts</h2>
          
          <h3 style={styles.subsectionTitle}>Account Creation</h3>
          <p style={styles.paragraph}>To use our services, you must:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Be at least 13 years old</li>
            <li style={styles.listItem}>Provide accurate and complete information</li>
            <li style={styles.listItem}>Maintain the security of your account credentials</li>
            <li style={styles.listItem}>Notify us immediately of any unauthorized access</li>
          </ul>

          <h3 style={styles.subsectionTitle}>Account Responsibilities</h3>
          <p style={styles.paragraph}>You are responsible for:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>All activities that occur under your account</li>
            <li style={styles.listItem}>Keeping your account information current and accurate</li>
            <li style={styles.listItem}>Maintaining the confidentiality of your login credentials</li>
            <li style={styles.listItem}>Complying with all applicable laws and regulations</li>
          </ul>

          <h2 style={styles.sectionTitle}>4. Booking and Payments</h2>
          
          <h3 style={styles.subsectionTitle}>Booking Process</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Bookings are subject to availability and workspace policies</li>
            <li style={styles.listItem}>You must provide accurate information when making bookings</li>
            <li style={styles.listItem}>Confirmation emails serve as proof of your reservation</li>
            <li style={styles.listItem}>You are responsible for arriving on time and following workspace rules</li>
          </ul>

          <h3 style={styles.subsectionTitle}>Cancellation Policy</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Free cancellation is typically available up to 2 hours before your booking</li>
            <li style={styles.listItem}>Late cancellations may result in charges for paid workspaces</li>
            <li style={styles.listItem}>No-shows may be charged the full booking amount</li>
            <li style={styles.listItem}>Specific cancellation policies vary by workspace</li>
          </ul>

          <h3 style={styles.subsectionTitle}>Payment Terms</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>Payment is processed through secure third-party providers</li>
            <li style={styles.listItem}>All prices are displayed in USD unless otherwise specified</li>
            <li style={styles.listItem}>You authorize us to charge your payment method for bookings</li>
            <li style={styles.listItem}>Refunds are subject to our refund policy and workspace terms</li>
          </ul>

          <h2 style={styles.sectionTitle}>5. User Conduct</h2>
          <p style={styles.paragraph}>When using our services, you agree not to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Violate any laws or regulations</li>
            <li style={styles.listItem}>Harass, abuse, or harm other users or workspace staff</li>
            <li style={styles.listItem}>Use the platform for illegal or unauthorized purposes</li>
            <li style={styles.listItem}>Attempt to gain unauthorized access to our systems</li>
            <li style={styles.listItem}>Submit false or misleading information</li>
            <li style={styles.listItem}>Interfere with the proper functioning of the platform</li>
            <li style={styles.listItem}>Use automated systems to access our services</li>
          </ul>

          <h2 style={styles.sectionTitle}>6. Intellectual Property</h2>
          <p style={styles.paragraph}>
            All content on Nomad Desk, including text, graphics, logos, images, and software, 
            is the property of Nomad Desk or its licensors and is protected by copyright, 
            trademark, and other intellectual property laws.
          </p>

          <h2 style={styles.sectionTitle}>7. Third-Party Services</h2>
          <p style={styles.paragraph}>
            Our platform may contain links to third-party websites or integrate with third-party 
            services. We are not responsible for the content, privacy policies, or practices of 
            these third parties.
          </p>

          <h2 style={styles.sectionTitle}>8. Disclaimers and Limitations</h2>
          
          <h3 style={styles.subsectionTitle}>Service Availability</h3>
          <p style={styles.paragraph}>
            We strive to provide uninterrupted service but cannot guarantee 100% uptime. 
            We may temporarily suspend or restrict access for maintenance or other reasons.
          </p>

          <h3 style={styles.subsectionTitle}>Workspace Quality</h3>
          <p style={styles.paragraph}>
            While we verify our workspace partners, we cannot guarantee the quality, safety, 
            or suitability of any workspace. Users should exercise their own judgment when 
            selecting and using workspaces.
          </p>

          <h3 style={styles.subsectionTitle}>Limitation of Liability</h3>
          <p style={styles.paragraph}>
            To the maximum extent permitted by law, Nomad Desk shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages arising from 
            your use of our services.
          </p>

          <h2 style={styles.sectionTitle}>9. Termination</h2>
          <p style={styles.paragraph}>
            We may terminate or suspend your account and access to our services at any time, 
            with or without notice, for any reason, including violation of these Terms. 
            You may also terminate your account at any time through your account settings.
          </p>

          <h2 style={styles.sectionTitle}>10. Changes to Terms</h2>
          <p style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. We will notify you of 
            material changes by posting the updated Terms on our platform and updating the 
            "Last updated" date. Your continued use of our services after changes become 
            effective constitutes acceptance of the new Terms.
          </p>

          <h2 style={styles.sectionTitle}>11. Governing Law</h2>
          <p style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of 
            the State of California, without regard to its conflict of law provisions.
          </p>

          <h2 style={styles.sectionTitle}>12. Dispute Resolution</h2>
          <p style={styles.paragraph}>
            Any disputes arising out of or relating to these Terms or our services shall be 
            resolved through binding arbitration in accordance with the rules of the American 
            Arbitration Association, except where prohibited by law.
          </p>

          <div style={styles.contactInfo}>
            <h3 style={styles.contactTitle}>Contact Us</h3>
            <p style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Email: legal@nomaddesk.com</li>
              <li style={styles.listItem}>Phone: +1 (555) 123-4567</li>
              <li style={styles.listItem}>Address: 123 Legal Street, San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;