// components/TestimonialsSection.tsx
import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="testimonials">
      <div className="section-header">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">Hear from members of our community who have found their perfect productive spaces through Nomad Desk.</p>
      </div>
      <div className="testimonial-cards">
        <div className="testimonial-card">
          <p className="testimonial-content">"Nomad Desk changed my study routine completely. I found an amazing library workspace near my apartment that I didn't even know existed. Now I'm more productive than ever!"</p>
          <div className="testimonial-author">
            <div className="author-avatar">JS</div>
            <div className="author-info">
              <div className="author-name">Jordan Smith</div>
              <div className="author-title">Computer Science Student</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-content">"As a freelancer, finding quality workspaces was always a challenge until I discovered Nomad Desk. The filters for amenities make it so easy to find exactly what I need for my workday."</p>
          <div className="testimonial-author">
            <div className="author-avatar">AL</div>
            <div className="author-info">
              <div className="author-name">Aisha Lee</div>
              <div className="author-title">Graphic Designer</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-content">"My study group uses Nomad Desk weekly to find new places to collaborate. The group booking feature is perfect for our team projects and the real-time availability saves us so much time."</p>
          <div className="testimonial-author">
            <div className="author-avatar">MR</div>
            <div className="author-info">
              <div className="author-name">Miguel Rodriguez</div>
              <div className="author-title">MBA Student</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;