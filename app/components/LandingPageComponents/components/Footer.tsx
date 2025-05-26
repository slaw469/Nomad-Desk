// app/components/LandingPageComponents/components/Footer.tsx - UPDATED WITH PROPER ROUTING
import React from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <svg className={styles.logoIcon} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15H35V35H15V15Z" fill="#1C2536"/>
              <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC"/>
              <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF"/>
              <path d="M35 35L25 25L35 15V35Z" fill="#1C2536"/>
            </svg>
            <span className={styles.footerLogoText}>NOMAD DESK</span>
          </div>
          <p className={styles.footerDescription}>Find your perfect workspace anywhere. Nomad Desk connects students and remote workers with productive environments tailored to their needs.</p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22151 20.9723 6.94388 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9H2V21H6V9Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 6.5H17.51" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Explore</h3>
          <div className={styles.footerLinks}>
            {/* Real route - Find Spaces (Search page) */}
            <Link to="/search" className={styles.footerLink}>Find Spaces</Link>
            
            {/* Coming Soon - Create Study Group */}
            <Link to="/create-group" className={styles.footerLink}>Create Study Group</Link>
            
            {/* Coming Soon - Libraries (no specific page exists) */}
            <Link to="/workspaces" className={styles.footerLink}>Libraries</Link>
            
            {/* Coming Soon - Coffee Shops (no specific page exists) */}
            <Link to="/workspaces" className={styles.footerLink}>Coffee Shops</Link>
            
            {/* Coming Soon - Co-working Spaces (no specific page exists) */}
            <Link to="/workspaces" className={styles.footerLink}>Co-working Spaces</Link>
          </div>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Company</h3>
          <div className={styles.footerLinks}>
            {/* Real route - About Us */}
            <Link to="/about" className={styles.footerLink}>About Us</Link>
            
            {/* Coming Soon - Careers */}
            <Link to="/careers" className={styles.footerLink}>Careers</Link>
            
            {/* Coming Soon - Blog */}
            <Link to="/blog" className={styles.footerLink}>Blog</Link>
            
            {/* Coming Soon - Press */}
            <Link to="/press" className={styles.footerLink}>Press</Link>
            
            {/* Coming Soon - Partners */}
            <Link to="/partners" className={styles.footerLink}>Partners</Link>
          </div>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Support</h3>
          <div className={styles.footerLinks}>
            {/* Real route - Help Center */}
            <Link to="/help-center" className={styles.footerLink}>Help Center</Link>
            
            {/* Real route - Contact Us */}
            <Link to="/contact" className={styles.footerLink}>Contact Us</Link>
            
            {/* Real route - Privacy Policy */}
            <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
            
            {/* Real route - Terms of Service */}
            <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
            
            {/* Real route - Trust & Safety */}
            <Link to="/trust-safety" className={styles.footerLink}>Trust & Safety</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>© 2025 Nomad Desk. All rights reserved.</div>
        <div className={styles.footerBottomLinks}>
          {/* Real route - Privacy Policy */}
          <Link to="/privacy-policy" className={styles.footerBottomLink}>Privacy</Link>
          
          {/* Real route - Terms of Service */}
          <Link to="/terms-of-service" className={styles.footerBottomLink}>Terms</Link>
          
          {/* Coming Soon - Sitemap (no specific page exists) */}
          <a href="#" className={styles.footerBottomLink}>Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;