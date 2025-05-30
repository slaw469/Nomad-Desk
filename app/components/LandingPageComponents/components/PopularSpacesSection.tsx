// app/components/LandingPageComponents/components/PopularSpacesSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";
import workspaceService, { Workspace } from '../../../services/workspaceService';
import Loading from '../../Common/Loading';

// Global cities data for rotation
const GLOBAL_CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 }
];

const PopularSpacesSection: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isUsingRealLocation, setIsUsingRealLocation] = useState(false);
  const [currentCity, setCurrentCity] = useState<typeof GLOBAL_CITIES[0] | null>(null);

  // Get random global city
  const getRandomCity = useCallback(() => {
    const city = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
    setCurrentCity(city);
    return { lat: city.lat, lng: city.lng };
  }, []);

  // Get user's location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsUsingRealLocation(true);
        },
        () => {
          // On error, use a random global city
          setUserLocation(getRandomCity());
          setIsUsingRealLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // If geolocation not supported, use a random global city
      setUserLocation(getRandomCity());
      setIsUsingRealLocation(false);
    }
  }, [getRandomCity]);

  // Load popular workspaces
  const loadPopularWorkspaces = useCallback(async (location: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      setError(null);

      const results = await workspaceService.searchWorkspaces({
        location,
        radius: 5000, // 5km radius
        minRating: 4.0 // Only highly rated places
      });

      // Sort by rating and limit to 4 workspaces
      const sortedWorkspaces = results
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

      setWorkspaces(sortedWorkspaces);
    } catch (err) {
      console.error('Error loading popular workspaces:', err);
      setError('Unable to load popular workspaces at this time');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load workspaces when user location is available
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (userLocation) {
      loadPopularWorkspaces(userLocation);
    }
  }, [userLocation, loadPopularWorkspaces]);

  // Get photo URL
  const getPhotoUrl = (workspace: Workspace): string => {
    if (workspace.photos && workspace.photos.length > 0) {
      // Use absolute URL to backend
      return `http://localhost:5003/api/public-maps/photo?reference=${encodeURIComponent(workspace.photos[0])}&maxwidth=400`;
    }
    // Use absolute URL for placeholder
    return `http://localhost:5003/api/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`;
  };

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces</h2>
        <p className={styles.sectionSubtitle}>
          {loading 
            ? "Finding the best workspaces near you..." 
            : error 
              ? "⚠️ Backend service is not available" 
              : isUsingRealLocation
                ? "Curated workspaces in your area"
                : "Share your location to discover nearby spaces"
          }
        </p>
        
        {!loading && !error && (
          <p className={styles.locationInfo}>
            {isUsingRealLocation ? (
              <span className={styles.locationTag}>
                📍 Showing workspaces near your current location
              </span>
            ) : currentCity && (
              <div className={styles.globalLocationInfo}>
                <span className={styles.locationTag}>
                  🌍 Exploring spaces in {currentCity.name}, {currentCity.country}
                </span>
                <div className={styles.locationActions}>
                  <button 
                    onClick={() => {
                      setUserLocation(getRandomCity());
                      setIsUsingRealLocation(false);
                    }}
                    className={styles.refreshButton}
                  >
                    Discover another city →
                  </button>
                  <button 
                    onClick={getUserLocation}
                    className={styles.shareLocationButton}
                  >
                    📍 Share Location
                  </button>
                </div>
              </div>
            )}
          </p>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <p>Showing recommended spaces while we fix this issue</p>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading message="Finding popular workspaces..." />
        </div>
      ) : (
        <div className={styles.spaceCards}>
          {workspaces.map((workspace) => (
            <div key={workspace.id} className={styles.spaceCard}>
              <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.id }}>
                <img 
                  src={getPhotoUrl(workspace)}
                  alt={workspace.name} 
                  className={styles.spaceImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Use absolute URL for error fallback
                    target.src = `http://localhost:5003/api/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`;
                  }}
                  loading="lazy" // Add lazy loading for better performance
                />
              </Link>
              {workspace.rating && workspace.rating >= 4.5 && (
                <div className={styles.popularTag}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
                  </svg>
                  {workspace.rating >= 4.7 ? 'Top Rated' : 'Popular'}
                </div>
              )}
              <div className={styles.spaceInfo}>
                <div className={styles.spaceTitle}>
                  <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.id }} className={styles.spaceName}>
                    {workspace.name}
                  </Link>
                  <div className={styles.spaceRating}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="#4A6FDC"/>
                    </svg>
                    {workspace.rating?.toFixed(1)}
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
          Explore All Workspaces
        </Link>
      </div>
    </section>
  );
};

export default PopularSpacesSection;