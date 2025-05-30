import React from 'react';
import './Contact.tsx';

const Contact: React.FC = () => (
  <section className="contact">
    <div className="container">
      <h2 className="contact-title">Get In Touch</h2>
      <p className="contact-description">
        I'm always looking for feedback, collaboration opportunities, or just to chat about productivity and workspace design. Feel free to reach out!
      </p>
      <div className="contact-buttons">
        <button className="contact-btn primary">Contact Me</button>
        <button className="contact-btn secondary">View My Other Projects</button>
      </div>
    </div>
  </section>
);

export default Contact;
