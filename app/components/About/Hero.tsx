import React from 'react';
import "./aboutstyles/Hero.css";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">About Nomad Desk</h1>
        <p className="hero-description">
          I'm Steven Law, a UT Dallas student building a platform to help everyone find their perfect workspace.
        </p>
      </div>
    </section>
  );
};

export default Hero;