// components/PopularSpacesSection.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";
import workspaceService, { Workspace } from '../../../services/workspaceService';
import mapsService from '../../../services/mapsService';

const PopularSpacesSection: React.FC = () => {
  const [popularWorkspaces, setPopularWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get photo URL helper function
  const getPhotoUrl = (photoReference: string) => {
    return mapsService.getPhotoUrl(photoReference);
  };

  // Get user's current location and load popular workspaces
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            loadPopularWorkspaces(location);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Fallback to default location (e.g., city center)
            const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
            setUserLocation(defaultLocation);
            loadPopularWorkspaces(defaultLocation);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        console.warn('Geolocation not supported');
        // Fallback to default location
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
        setUserLocation(defaultLocation);
        loadPopularWorkspaces(defaultLocation);
      }
    };

    getCurrentLocation();
  }, []);

  // Load popular workspaces based on location
  const loadPopularWorkspaces = async (location: {lat: number, lng: number}) => {
    setLoading(true);
    try {
      // Search for workspaces
      const searchParams = {
        location,
        radius: 5000, // 5km radius for popular workspaces
      };

      const results = await workspaceService.searchWorkspaces(searchParams);
      
      // Sort by rating and limit to top workspaces
      const sortedResults = results
        .filter(workspace => workspace.rating && workspace.rating >= 4.0) // Only highly rated
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4); // Limit to 4 popular workspaces for the landing page

      // Add distance information
      const workspacesWithDistance = sortedResults.map(workspace => {
        const distance = workspaceService.calculateDistance(location, workspace.coordinates);
        return {
          ...workspace,
          distance: workspaceService.formatDistance(distance)
        };
      });

      setPopularWorkspaces(workspacesWithDistance);
    } catch (error) {
      console.error('Error loading popular workspaces:', error);
      // Keep empty array on error - fallback to hardcoded data if needed
      setPopularWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces</h2>
        <p className={styles.sectionSubtitle}>Discover top-rated workspaces loved by our community of students and remote workers.</p>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Finding popular workspaces near you...</p>
        </div>
      ) : (
        <div className={styles.spaceCards}>
          {popularWorkspaces.length > 0 ? (
            popularWorkspaces.map((workspace, index) => (
              <div key={workspace.id} className={styles.spaceCard}>
                <Link to={`/workspaces/map/${workspace.id}`}>
                  <img 
                    src={workspace.photos && workspace.photos.length > 0 
                      ? getPhotoUrl(workspace.photos[0])
                      : `http://localhost:5001/api/placeholder/400/320?text=${encodeURIComponent(workspace.name)}`} 
                    alt={workspace.name} 
                    className={styles.spaceImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `http://localhost:5001/api/placeholder/400/320?text=${encodeURIComponent(workspace.name)}`;
                    }}
                  />
                </Link>
                {index === 0 && (
                  <div className={styles.popularTag}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
                    </svg>
                    Popular
                  </div>
                )}
                <div className={styles.spaceInfo}>
                  <div className={styles.spaceTitle}>
                    <Link to={`/workspaces/map/${workspace.id}`} className={styles.spaceName}>
                      {workspace.name}
                    </Link>
                    <div className={styles.spaceRating}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                      </svg>
                      {workspace.rating?.toFixed(1) || '4.5'}
                    </div>
                  </div>
                  <div className={styles.spaceDetails}>
                    {workspace.type} • {workspace.distance || 'Nearby'}
                  </div>
                  <div className={styles.spacePrice}>
                    {workspace.price || 'Free'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to static content if no workspaces found
            <>
              <div className={styles.spaceCard}>
                <img src="http://localhost:5003/api/placeholder/400/320?text=Central+Library" alt="Central Library" className={styles.spaceImage} />
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
                      4.8
                    </div>
                  </div>
                  <div className={styles.spaceDetails}>Quiet, spacious with natural light</div>
                  <div className={styles.spacePrice}>Free Wi-Fi & Power Outlets</div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <img src="http://localhost:5003/api/placeholder/400/320?text=Coffee+House" alt="Coffee House" className={styles.spaceImage} />
                <div className={styles.spaceInfo}>
                  <div className={styles.spaceTitle}>
                    <div className={styles.spaceName}>Artisan Coffee Study Hub</div>
                    <div className={styles.spaceRating}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                      </svg>
                      4.6
                    </div>
                  </div>
                  <div className={styles.spaceDetails}>Vibrant atmosphere with great coffee</div>
                  <div className={styles.spacePrice}>Wi-Fi & Comfortable Seating</div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <img src="http://localhost:5003/api/placeholder/400/320?text=Innovation+Hub" alt="Innovation Hub" className={styles.spaceImage} />
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
                      4.7
                    </div>
                  </div>
                  <div className={styles.spaceDetails}>Professional environment with amenities</div>
                  <div className={styles.spacePrice}>High-Speed Wi-Fi & Meeting Rooms</div>
                </div>
              </div>
              <div className={styles.spaceCard}>
                <img src="http://localhost:5003/api/placeholder/400/320?text=University+Library" alt="University Library" className={styles.spaceImage} />
                <div className={styles.spaceInfo}>
                  <div className={styles.spaceTitle}>
                    <div className={styles.spaceName}>University Study Lounge</div>
                    <div className={styles.spaceRating}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                      </svg>
                      4.5
                    </div>
                  </div>
                  <div className={styles.spaceDetails}>Dedicated student environment</div>
                  <div className={styles.spacePrice}>Group Rooms Available</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className={styles.viewAll}>
        <Link to="/search" className={`${styles.ctaButton} ${styles.primaryButton}`}>
          View All Spaces
        </Link>
      </div>
    </section>
  );
};

export default PopularSpacesSection;