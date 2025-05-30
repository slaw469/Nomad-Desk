// app/components/Support/ContactUs.tsx - FIXED VERSION
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Inter, sans-serif',
    } as React.CSSProperties,
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
    hero: {
      background: 'linear-gradient(135deg, #4A6FDC 0%, #2DD4BF 100%)',
      padding: '80px 40px',
      textAlign: 'center' as const,
      color: 'white',
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '15px',
    },
    heroSubtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      maxWidth: '500px',
      margin: '0 auto',
    },
    main: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'start',
    },
    contactInfo: {
      background: '#F8FAFC',
      padding: '40px',
      borderRadius: '16px',
    },
    infoTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '20px',
    },
    contactMethods: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    contactMethod: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: 'white',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
    },
    methodIcon: {
      width: '40px',
      height: '40px',
      background: 'rgba(74, 111, 220, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4A6FDC',
    },
    methodInfo: {
      flex: 1,
    },
    methodTitle: {
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '2px',
    },
    methodDetail: {
      color: '#4B5563',
      fontSize: '0.9rem',
    },
    form: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      fontFamily: 'Inter, sans-serif',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      fontFamily: 'Inter, sans-serif',
      minHeight: '120px',
      resize: 'vertical' as const,
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: 'white',
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#4A6FDC',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    faqSection: {
      marginTop: '80px',
      textAlign: 'center' as const,
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '40px',
    },
    faqGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '40px',
    },
    faqCard: {
      background: '#F8FAFC',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'left' as const,
    },
    faqQuestion: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2A3347',
      marginBottom: '10px',
    },
    faqAnswer: {
      color: '#4B5563',
      lineHeight: '1.5',
    },
  };

  if (isSubmitted) {
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

        <div style={{ ...styles.main, textAlign: 'center', paddingTop: '120px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
          <h1 style={{
            fontSize: '2rem', fontWeight: '600', color: '#2A3347', marginBottom: '15px',
          }}
          >
            Message Sent Successfully!
          </h1>
          <p style={{ color: '#4B5563', fontSize: '1.1rem', marginBottom: '30px' }}>
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Link to="/" style={{ ...styles.submitButton, maxWidth: '200px', margin: '0 auto' }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

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

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Contact Us</h1>
        <p style={styles.heroSubtitle}>
          Have questions? We're here to help. Reach out to us anytime.
        </p>
      </section>

      <main style={styles.main}>
        <div style={styles.contactGrid}>
          <div style={styles.contactInfo}>
            <h2 style={styles.infoTitle}>Get in Touch</h2>
            <div style={styles.contactMethods}>
              <div style={styles.contactMethod}>
                <div style={styles.methodIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={styles.methodInfo}>
                  <div style={styles.methodTitle}>Email Support</div>
                  <div style={styles.methodDetail}>support@nomaddesk.com</div>
                </div>
              </div>

              <div style={styles.contactMethod}>
                <div style={styles.methodIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 1.58 5.35 3.05 5.72 4.47C5.81 4.76 5.74 5.07 5.53 5.28L3.21 7.6C5.71 12.6 11.4 18.29 16.4 20.79L18.72 18.47C18.93 18.26 19.24 18.19 19.53 18.28C20.95 18.65 22.42 18.84 23.92 18.84C24.52 18.84 25 19.32 25 19.92Z" fill="currentColor" />
                  </svg>
                </div>
                <div style={styles.methodInfo}>
                  <div style={styles.methodTitle}>Phone Support</div>
                  <div style={styles.methodDetail}>+1 (555) 123-4567</div>
                </div>
              </div>

              <div style={styles.contactMethod}>
                <div style={styles.methodIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={styles.methodInfo}>
                  <div style={styles.methodTitle}>Response Time</div>
                  <div style={styles.methodDetail}>Within 24 hours</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.formTitle}>Send us a Message</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
                required
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="bug">Bug Report</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                style={styles.input}
                required
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                style={styles.textarea}
                required
                onFocus={(e) => e.target.style.borderColor = '#4A6FDC'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3B5BDB')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4A6FDC')}
            >
              {isSubmitting ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L2 8.67L9.01 12.01L12.35 19.02L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        <section style={styles.faqSection}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqGrid}>
            <div style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>How do I book a workspace?</h3>
              <p style={styles.faqAnswer}>
                Simply search for workspaces in your area, select one that fits your needs, and click "Book Now".
                You can filter by amenities, price, and availability.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>Are all workspaces free?</h3>
              <p style={styles.faqAnswer}>
                Many libraries and public spaces are free, while cafes may require a purchase and co-working
                spaces typically charge hourly or daily rates.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>Can I cancel my booking?</h3>
              <p style={styles.faqAnswer}>
                Yes, you can cancel most bookings up to 2 hours before your reserved time.
                Check the specific cancellation policy for each workspace.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>How do I add my workspace?</h3>
              <p style={styles.faqAnswer}>
                If you own or manage a workspace, contact us at partners@nomaddesk.com to learn
                about joining our network.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
