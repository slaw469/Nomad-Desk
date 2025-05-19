// components/PopularSpacesSection.tsx
import React from 'react';
import styles from "../../../styles/landing.module.css";

const PopularSpacesSection: React.FC = () => {
  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces</h2>
        <p className={styles.sectionSubtitle}>Discover top-rated workspaces loved by our community of students and remote workers.</p>
      </div>
      <div className={styles.spaceCards}>
        <div className={styles.spaceCard}>
          <img src="/api/placeholder/400/320" alt="Modern Library Study Space" className={styles.spaceImage} />
          <div className={styles.popularTag}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
            </svg>
            Popular
          </div>
          <div className={styles.spaceInfo}>
            <div className={styles.spaceTitle}>
              <div className={styles.spaceName}>Central Library Workspace</div>
              <div className={styles.spaceRating}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.98
              </div>
            </div>
            <div className={styles.spaceDetails}>Quiet, spacious with natural light</div>
            <div className={styles.spacePrice}>Free Wi-Fi & Power Outlets</div>
          </div>
        </div>
        <div className={styles.spaceCard}>
          <img src="/api/placeholder/400/320" alt="Cozy Coffee Shop" className={styles.spaceImage} />
          <div className={styles.spaceInfo}>
            <div className={styles.spaceTitle}>
              <div className={styles.spaceName}>Artisan Coffee Study Hub</div>
              <div className={styles.spaceRating}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.85
              </div>
            </div>
            <div className={styles.spaceDetails}>Vibrant atmosphere with great coffee</div>
            <div className={styles.spacePrice}>Wi-Fi & Comfortable Seating</div>
          </div>
        </div>
        <div className={styles.spaceCard}>
          <img src="/api/placeholder/400/320" alt="Modern Coworking Space" className={styles.spaceImage} />
          <div className={styles.popularTag}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
            </svg>
            Popular
          </div>
          <div className={styles.spaceInfo}>
            <div className={styles.spaceTitle}>
              <div className={styles.spaceName}>Innovation Hub Coworking</div>
              <div className={styles.spaceRating}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.92
              </div>
            </div>
            <div className={styles.spaceDetails}>Professional environment with amenities</div>
            <div className={styles.spacePrice}>High-Speed Wi-Fi & Meeting Rooms</div>
          </div>
        </div>
        <div className={styles.spaceCard}>
          <img src="/api/placeholder/400/320" alt="University Study Room" className={styles.spaceImage} />
          <div className={styles.spaceInfo}>
            <div className={styles.spaceTitle}>
              <div className={styles.spaceName}>University Study Lounge</div>
              <div className={styles.spaceRating}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                </svg>
                4.79
              </div>
            </div>
            <div className={styles.spaceDetails}>Dedicated student environment</div>
            <div className={styles.spacePrice}>Group Rooms Available</div>
          </div>
        </div>
      </div>
      <div className={styles.viewAll}>
        <a href="#" className={`${styles.ctaButton} ${styles.primaryButton}`}>View All Spaces</a>
      </div>
    </section>
  );
};

export default PopularSpacesSection;