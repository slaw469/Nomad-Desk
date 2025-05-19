import React from 'react';
import "./aboutstyles/Story.css";

const Story: React.FC = () => {
  return (
    <section className="story">
      <div className="container">
        <div className="story-grid">
          <div className="story-content">
            <h2 className="story-title">My Story</h2>
            <p className="story-paragraph">
              Nomad Desk was born from my own challenges as a computer science student at UT Dallas. I found myself constantly searching for the perfect study spot - somewhere quiet with good Wi-Fi, plenty of outlets, and just the right ambiance to stay focused.
            </p>
            <p className="story-paragraph">
              As I talked with fellow students and remote workers, I realized this was a common problem. In 2024, I started developing Nomad Desk as a solution to connect people with productive spaces. What began as a simple class project has evolved into my passion.
            </p>
            <p className="story-paragraph">
              I believe the right environment is crucial for productivity and creativity. As a solo developer, I'm committed to building a platform that helps students and professionals discover spaces that inspire their best work - whether it's a quiet library corner, a vibrant coffee shop, or a professional coworking space.
            </p>
          </div>
          <div className="story-image-container">
            <div className="story-image-decoration-1"></div>
            <div className="story-image-decoration-2"></div>
            <img 
              src="/api/placeholder/400/350?text=Steven+Law" 
              alt="Steven Law - Founder" 
              className="story-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;