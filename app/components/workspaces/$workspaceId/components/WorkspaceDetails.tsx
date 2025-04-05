// app/routes/workspaces/$workspaceId/components/WorkspaceDetails.tsx
import React, { useState } from 'react';
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
    <div className="workspace-details">
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={(tab) => setActiveTab(tab)} 
      />
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <>
            <div className="tab-section">
              <h2 className="section-title">About this space</h2>
              <p className="section-content">{description}</p>
            </div>
            
            <div className="tab-section">
              <h2 className="section-title">Amenities</h2>
              <AmenityList amenities={amenities} />
            </div>
            
            <div className="tab-section">
              <h2 className="section-title">House Rules</h2>
              <RulesList rules={houseRules} />
            </div>
          </>
        )}
        
        {activeTab === 'photos' && (
          <div className="tab-section">
            <h2 className="section-title">Photos</h2>
            <div className="photo-gallery">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo.url} alt={photo.alt} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="tab-section">
            <h2 className="section-title">Reviews</h2>
            <ReviewSection reviews={reviews} />
          </div>
        )}
        
        {activeTab === 'location' && (
          <div className="tab-section">
            <h2 className="section-title">Location</h2>
            <p className="section-content">
              Location details will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}