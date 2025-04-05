// components/NewsletterSection.tsx
import React from 'react';

const NewsletterSection: React.FC = () => {
  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h2 className="newsletter-title">Join Our Community</h2>
        <p className="newsletter-description">Subscribe to receive updates on new spaces, exclusive offers, and productivity tips.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email address" className="newsletter-input" />
          <button type="submit" className="newsletter-button">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;