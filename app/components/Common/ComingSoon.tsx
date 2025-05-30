// app/components/Common/ComingSoon.tsx
import React from 'react';
import { Link, useRouter } from '@tanstack/react-router';

interface ComingSoonProps {
  title?: string;
  description?: string;
  expectedDate?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Coming Soon',
  description = "We're working hard to bring you this feature. Stay tuned!",
  expectedDate = 'Q2 2025',
}) => {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  // Determine what page this is based on the path
  const getPageInfo = () => {
    switch (currentPath) {
      case '/careers':
        return {
          title: 'Careers',
          description: "We're building an amazing team! Career opportunities will be posted here soon.",
          icon: '👥',
          expectedDate: 'Q2 2025',
        };
      case '/blog':
        return {
          title: 'Blog',
          description: 'Get ready for insights, tips, and stories from the world of remote work and workspace discovery.',
          icon: '📝',
          expectedDate: 'Q1 2025',
        };
      case '/press':
        return {
          title: 'Press & Media',
          description: 'Press releases, media kits, and company news will be available here.',
          icon: '📰',
          expectedDate: 'Q2 2025',
        };
      case '/partners':
        return {
          title: 'Partners',
          description: 'Learn about our workspace partners and how to join our network.',
          icon: '🤝',
          expectedDate: 'Q1 2025',
        };
      default:
        return {
          title,
          description,
          icon: '🚀',
          expectedDate,
        };
    }
  };

  const pageInfo = getPageInfo();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#fff',
    },
    header: {
      padding: '20px 40px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4A6FDC',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    main: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    content: {
      textAlign: 'center' as const,
      maxWidth: '600px',
      margin: '0 auto',
    },
    icon: {
      fontSize: '4rem',
      marginBottom: '20px',
      display: 'block',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#2A3347',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #4A6FDC 0%, #2DD4BF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    description: {
      fontSize: '1.25rem',
      color: '#4B5563',
      lineHeight: '1.6',
      marginBottom: '30px',
    },
    expectedDate: {
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#4A6FDC',
      color: 'white',
      borderRadius: '25px',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '30px',
    },
    actions: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    primaryButton: {
      backgroundColor: '#4A6FDC',
      color: 'white',
      border: 'none',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#4A6FDC',
      border: '2px solid #4A6FDC',
    },
    newsletter: {
      marginTop: '40px',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    newsletterTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '10px',
    },
    newsletterDescription: {
      color: '#4B5563',
      marginBottom: '20px',
    },
    emailForm: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    emailInput: {
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '1rem',
      minWidth: '250px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    submitButton: {
      padding: '12px 24px',
      backgroundColor: '#4A6FDC',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle email submission
    alert('Thank you! We\'ll notify you when this feature is available.');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <span style={styles.icon}>{pageInfo.icon}</span>
          <h1 style={styles.title}>{pageInfo.title}</h1>
          <p style={styles.description}>{pageInfo.description}</p>

          <div style={styles.expectedDate}>
            Expected Launch:
            {' '}
            {pageInfo.expectedDate}
          </div>

          <div style={styles.actions}>
            <Link to="/search" style={{ ...styles.button, ...styles.primaryButton }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Find Workspaces
            </Link>

            <Link to="/dashboard" style={{ ...styles.button, ...styles.secondaryButton }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          <div style={styles.newsletter}>
            <h3 style={styles.newsletterTitle}>Get Notified</h3>
            <p style={styles.newsletterDescription}>
              Be the first to know when
              {' '}
              {pageInfo.title.toLowerCase()}
              {' '}
              launches!
            </p>
            <form onSubmit={handleEmailSubmit} style={styles.emailForm}>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.emailInput}
                required
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="submit"
                style={styles.submitButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3B5BDB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A6FDC'}
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
