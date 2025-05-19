// app/routes/workspaces/$workspaceId/components/WorkspaceDetails.tsx
import React, { useState } from 'react';
import styles from '../../workspace.module.css';
import AmenityList from './AmenityList';
import RulesList from './RulesList';
import ReviewSection from './ReviewSection';
import TabNavigation from './TabNavigation';

interface WorkspaceDetailsProps {
  description: string;
  amenities: Array<{
    name: string;
    icon: string;
  }>;
  houseRules: Array<{
    text: string;
  }>;
  photos: Array<{
    url: string;
    alt: string;
  }>;
  reviews: Array<{
    id: string;
    reviewer: {
      name: string;
      avatar: string;
    };
    date: string;
    rating: number;
    text: string;
    photos?: Array<{
      url: string;
      alt: string;
    }>;
  }>;
}

export default function WorkspaceDetails({
  description,
  amenities,
  houseRules,
  photos,
  reviews
}: WorkspaceDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'photos', label: 'Photos' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'location', label: 'Location' }
  ];
  
  return (
    <div className={styles.workspaceDetails}>
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={(tab) => setActiveTab(tab)} 
      />
      
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <>
            <div className={styles.tabSection}>
              <h2 className={styles.sectionTitle}>About this space</h2>
              <p className={styles.sectionContent}>{description}</p>
            </div>
            
            <div className={styles.tabSection}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <AmenityList amenities={amenities} />
            </div>
            
            <div className={styles.tabSection}>
              <h2 className={styles.sectionTitle}>House Rules</h2>
              <RulesList rules={houseRules} />
            </div>
          </>
        )}
        
        {activeTab === 'photos' && (
          <div className={styles.tabSection}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.photoGallery}>
              {photos.map((photo, index) => (
                <div key={index} className={styles.photoItem}>
                  <img src={photo.url} alt={photo.alt} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className={styles.tabSection}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            <ReviewSection reviews={reviews} />
          </div>
        )}
        
        {activeTab === 'location' && (
          <div className={styles.tabSection}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <p className={styles.sectionContent}>
              Location details will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}