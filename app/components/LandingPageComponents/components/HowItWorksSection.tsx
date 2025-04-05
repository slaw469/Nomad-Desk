import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Finding your perfect study space is just a few clicks away. Our streamlined process makes it easy to discover, book, and enjoy productive environments.</p>
      </div>
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3 className="step-title">Search</h3>
          <p className="step-description">Enter your location, date, and preferences to find available spaces near you.</p>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <h3 className="step-title">Compare</h3>
          <p className="step-description">Browse through reviews, amenities, and photos to find your perfect match.</p>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <h3 className="step-title">Book</h3>
          <p className="step-description">Reserve your spot instantly with our secure booking system.</p>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <h3 className="step-title">Work & Study</h3>
          <p className="step-description">Show up and enjoy your productive space with all the amenities you need.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;