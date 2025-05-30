// components/NewsletterSection.tsx
import React from 'react';
import styles from '../../../styles/landing.module.css';

const NewsletterSection: React.FC = () => (
  <section className={styles.newsletter}>
    <div className={styles.newsletterContent}>
      <h2 className={styles.newsletterTitle}>Join Our Community</h2>
      <p className={styles.newsletterDescription}>Subscribe to receive updates on new spaces, exclusive offers, and productivity tips.</p>
      <form className={styles.newsletterForm}>
        <input type="email" placeholder="Enter your email address" className={styles.newsletterInput} />
        <button type="submit" className={styles.newsletterButton}>Subscribe</button>
      </form>
    </div>
  </section>
);

export default NewsletterSection;
