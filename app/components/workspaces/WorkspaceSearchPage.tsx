// app/components/workspaces/WorkspaceSearchPage.tsx
import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './workspace.module.css';
import WorkspaceSearch from './WorkspaceSearch';
import GoogleMap from '../Common/GoogleMap';
import { Location } from '../../services/mapsService';

const WorkspaceSearchPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  
  // Google Maps API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Handle location selection
  const handleLocationSelected = (location: Location, address: string) => {
    setSelectedLocation(location);
    setLocationAddress(address);
    setMapVisible(true);
  };

  // Toggle map visibility
  const toggleMap = () => {
    setMapVisible(!mapVisible);
  };

  return (
    <div className={styles.workspaceSearchPageContainer}>
      <div className={styles.searchPageHeader}>
        <h1>Find Your Perfect Workspace</h1>
        <p>Discover quiet, comfortable spaces to focus and be productive.</p>
      </div>

      <div className={styles.searchPageContent}>
        <div className={styles.searchColumn}>
          <WorkspaceSearch onLocationSelected={handleLocationSelected} />
        </div>

        {selectedLocation && (
          <div className={`${styles.mapColumn} ${mapVisible ? styles.mapVisible : ''}`}>
            <div className={styles.mapToggle} onClick={toggleMap}>
              <span>{mapVisible ? 'Hide Map' : 'Show Map'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d={mapVisible ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {mapVisible && (
              <div className={styles.mapContainer}>
                <GoogleMap
                  apiKey={googleMapsApiKey}
                  center={selectedLocation}
                  zoom={14}
                  markerTitle="Selected Location"
                  address={locationAddress}
                  height="100%"
                  width="100%"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.popularFilters}>
        <h2>Popular Categories</h2>
        <div className={styles.filterButtons}>
          <button className={styles.filterButton}>Libraries</button>
          <button className={styles.filterButton}>Cafés</button>
          <button className={styles.filterButton}>Co-working Spaces</button>
          <button className={styles.filterButton}>Free Wi-Fi</button>
          <button className={styles.filterButton}>Quiet Spaces</button>
          <button className={styles.filterButton}>Open Late</button>
        </div>
      </div>

      <div className={styles.popularWorkspaces}>
        <h2>Popular Workspaces</h2>
        <div className={styles.workspaceGrid}>
          {/* Example static workspaces - in a real app, these would be fetched from the backend */}
          <div className={styles.workspaceCard}>
            <div className={styles.cardImage}>
              <Link to="/workspaces/1">
                <img src="/api/placeholder/400/250?text=Central+Library" alt="Central Library" />
              </Link>
              <div className={styles.cardFavorite}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.cardContent}>
              <Link to="/workspaces/1" className={styles.cardTitle}>
                Central Library
              </Link>
              <p className={styles.cardLocation}>Downtown • 2.1 miles away</p>
              <div className={styles.cardAmenities}>
                <span className={styles.cardAmenity}>Library</span>
                <span className={styles.cardAmenity}>Free Wi-Fi</span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>Free</div>
                <div className={styles.cardRating}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  4.8
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workspaceCard}>
            <div className={styles.cardImage}>
              <Link to="/workspaces/2">
                <img src="/api/placeholder/400/250?text=Coffee+House" alt="Coffee House" />
              </Link>
              <div className={styles.cardFavorite}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.cardContent}>
              <Link to="/workspaces/2" className={styles.cardTitle}>
                Coffee House
              </Link>
              <p className={styles.cardLocation}>University District • 0.8 miles away</p>
              <div className={styles.cardAmenities}>
                <span className={styles.cardAmenity}>Café</span>
                <span className={styles.cardAmenity}>Free Wi-Fi</span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>$5/hr min</div>
                <div className={styles.cardRating}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  4.6
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workspaceCard}>
            <div className={styles.cardImage}>
              <Link to="/workspaces/3">
                <img src="/api/placeholder/400/250?text=Innovation+Hub" alt="Innovation Hub" />
              </Link>
              <div className={styles.cardFavorite}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.cardContent}>
              <Link to="/workspaces/3" className={styles.cardTitle}>
                Innovation Hub
              </Link>
              <p className={styles.cardLocation}>Business District • 1.2 miles away</p>
              <div className={styles.cardAmenities}>
                <span className={styles.cardAmenity}>Co-working</span>
                <span className={styles.cardAmenity}>High-Speed Wi-Fi</span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>$15/hr</div>
                <div className={styles.cardRating}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  4.9
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSearchPage;