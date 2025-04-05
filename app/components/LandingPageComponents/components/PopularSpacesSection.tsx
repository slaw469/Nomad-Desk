// components/PopularSpacesSection.tsx
import React from 'react';

const PopularSpacesSection: React.FC = () => {
  return (
    <section className="popular-spaces">
      <div className="section-header">
        <h2 className="section-title">Popular Spaces</h2>
        <p className="section-subtitle">Discover top-rated workspaces loved by our community of students and remote workers.</p>
      </div>
      <div className="space-cards">
        <div className="space-card">
          <img src="/api/placeholder/400/320" alt="Modern Library Study Space" className="space-image" />
          <div className="popular-tag">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
            </svg>
            Popular
          </div>
          <div className="space-info">
            <div className="space-title">
              <div className="space-name">Central Library Workspace</div>
              <div className="space-rating">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.98
              </div>
            </div>
            <div className="space-details">Quiet, spacious with natural light</div>
            <div className="space-price">Free Wi-Fi & Power Outlets</div>
          </div>
        </div>
        <div className="space-card">
          <img src="/api/placeholder/400/320" alt="Cozy Coffee Shop" className="space-image" />
          <div className="space-info">
            <div className="space-title">
              <div className="space-name">Artisan Coffee Study Hub</div>
              <div className="space-rating">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.85
              </div>
            </div>
            <div className="space-details">Vibrant atmosphere with great coffee</div>
            <div className="space-price">Wi-Fi & Comfortable Seating</div>
          </div>
        </div>
        <div className="space-card">
          <img src="/api/placeholder/400/320" alt="Modern Coworking Space" className="space-image" />
          <div className="popular-tag">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
            </svg>
            Popular
          </div>
          <div className="space-info">
            <div className="space-title">
              <div className="space-name">Innovation Hub Coworking</div>
              <div className="space-rating">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.92
              </div>
            </div>
            <div className="space-details">Professional environment with amenities</div>
            <div className="space-price">High-Speed Wi-Fi & Meeting Rooms</div>
          </div>
        </div>
        <div className="space-card">
          <img src="/api/placeholder/400/320" alt="University Study Room" className="space-image" />
          <div className="space-info">
            <div className="space-title">
              <div className="space-name">University Study Lounge</div>
              <div className="space-rating">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.79
              </div>
            </div>
            <div className="space-details">Dedicated student environment</div>
            <div className="space-price">Group Rooms Available</div>
          </div>
        </div>
      </div>
      <div className="view-all">
        <a href="#" className="cta-button primary-button">View All Spaces</a>
      </div>
    </section>
  );
};

export default PopularSpacesSection;