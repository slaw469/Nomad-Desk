// components/SafePopularSpacesSection.tsx - COMPLETELY NEW COMPONENT
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";

// Simple static data to avoid any API calls during debugging
const STATIC_WORKSPACES = [
  {
    id: 'static-1',
    name: 'Central Public Library',
    type: 'Library',
    address: '123 Main Street, Downtown',
    price: 'Free',
    rating: 4.6,
    distance: '0.8 km'
  },
  {
    id: 'static-2', 
    name: 'The Study Café',
    type: 'Café',
    address: '456 Coffee Lane, Arts District',
    price: 'Purchase Recommended',
    rating: 4.4,
    distance: '1.2 km'
  },
  {
    id: 'static-3',
    name: 'Innovation Hub',
    type: 'Co-working Space', 
    address: '789 Tech Boulevard, Business District',
    price: 'Contact for Pricing',
    rating: 4.8,
    distance: '2.1 km'
  },
  {
    id: 'static-4',
    name: 'Barnes & Books Study Corner',
    type: 'Bookstore',
    address: '321 Reading Way, Literary Quarter', 
    price: 'Purchase Recommended',
    rating: 4.3,
    distance: '1.5 km'
  }
];

const SafePopularSpacesSection: React.FC = () => {
  const [workspaces] = useState(STATIC_WORKSPACES);
  const [loading, setLoading] = useState(true);

  // Simple initialization - no API calls
  useEffect(() => {
    console.log('🚀 SafePopularSpacesSection initializing...');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('✅ SafePopularSpacesSection loaded');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Create simple colored rectangles instead of images
  const createSimpleImage = (name: string, index: number) => {
    const colors = ['#4A6FDC', '#2DD4BF', '#F59E0B', '#EF4444'];
    const color = colors[index % colors.length];
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="400" height="320" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" style="word-wrap: break-word;">
          ${name}
        </text>
      </svg>
    `)}`;
  };

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces (Safe Mode)</h2>
        <p className={styles.sectionSubtitle}>
          {loading 
            ? "Loading workspaces..." 
            : "Curated workspaces perfect for studying and working"
          }
        </p>
        
        <div style={{ 
          background: '#e7f5e7', 
          padding: '10px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          color: '#2d5a2d',
          marginTop: '10px'
        }}>
          ✅ <strong>Safe Mode:</strong> No backend calls, no recursion risk
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '40px', 
            height: '40px', 
            border: '3px solid #E5E7EB',
            borderTop: '3px solid #4A6FDC',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>Loading workspaces...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div className={styles.spaceCards}>
          {workspaces.map((workspace, index) => (
            <div key={workspace.id} className={styles.spaceCard}>
              <Link to="/search">
                <img 
                  src={createSimpleImage(workspace.name, index)}
                  alt={workspace.name} 
                  className={styles.spaceImage}
                  style={{ objectFit: 'cover' }}
                />
              </Link>
              {(index === 0 || workspace.rating >= 4.5) && (
                <div className={styles.popularTag}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
                  </svg>
                  {workspace.rating >= 4.7 ? 'Top Rated' : 'Popular'}
                </div>
              )}
              <div className={styles.spaceInfo}>
                <div className={styles.spaceTitle}>
                  <Link to="/search" className={styles.spaceName}>
                    {workspace.name}
                  </Link>
                  <div className={styles.spaceRating}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                    </svg>
                    {workspace.rating.toFixed(1)}
                  </div>
                </div>
                <div className={styles.spaceDetails}>
                  {workspace.type} • {workspace.distance}
                </div>
                <div className={styles.spacePrice}>
                  {workspace.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.viewAll}>
        <Link to="/search" className={`${styles.ctaButton} ${styles.primaryButton}`}>
          Find Real Workspaces
        </Link>
      </div>
    </section>
  );
};

export default SafePopularSpacesSection;