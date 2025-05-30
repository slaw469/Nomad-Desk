// components/TestimonialsSection.tsx
import React from 'react';
import styles from '../../../styles/landing.module.css';

const TestimonialsSection: React.FC = () => (
  <section className={styles.testimonials}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>What Our Users Say</h2>
      <p className={styles.sectionSubtitle}>Hear from members of our community who have found their perfect productive spaces through Nomad Desk.</p>
    </div>
    <div className={styles.testimonialCards}>
      <div className={styles.testimonialCard}>
        <p className={styles.testimonialContent}>"Nomad Desk changed my study routine completely. I found an amazing library workspace near my apartment that I didn't even know existed. Now I'm more productive than ever!"</p>
        <div className={styles.testimonialAuthor}>
          <div className={styles.authorAvatar}>JS</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>Jordan Smith</div>
            <div className={styles.authorTitle}>Computer Science Student</div>
          </div>
        </div>
      </div>
      <div className={styles.testimonialCard}>
        <p className={styles.testimonialContent}>"As a freelancer, finding quality workspaces was always a challenge until I discovered Nomad Desk. The filters for amenities make it so easy to find exactly what I need for my workday."</p>
        <div className={styles.testimonialAuthor}>
          <div className={styles.authorAvatar}>AL</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>Aisha Lee</div>
            <div className={styles.authorTitle}>Graphic Designer</div>
          </div>
        </div>
      </div>
      <div className={styles.testimonialCard}>
        <p className={styles.testimonialContent}>"My study group uses Nomad Desk weekly to find new places to collaborate. The group booking feature is perfect for our team projects and the real-time availability saves us so much time."</p>
        <div className={styles.testimonialAuthor}>
          <div className={styles.authorAvatar}>MR</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>Miguel Rodriguez</div>
            <div className={styles.authorTitle}>MBA Student</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
