// app/components/workspaces/WorkspaceSearchPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './workspace.module.css';
import WorkspaceSearch from './WorkspaceSearch';
import GoogleMap from '../Common/GoogleMap';
import mapsService, { Location } from '../../services/mapsService';
import workspaceService, { Workspace } from '../../services/workspaceService';
import Loading from '../Common/Loading';

const WorkspaceSearchPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const [popularWorkspaces, setPopularWorkspaces] = useState<Workspace[]>([]);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Fetch API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await mapsService.getApiKey();
        setApiKey(key);
      } catch (err) {
        console.error('Failed to get API key:', err);
        setError('Failed to load Maps API key');
      }
    };

    fetchApiKey();
  }, []);

  // Get user's current location on component mount
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
            // Automatically load popular workspaces in user's area
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
            enableHighAccuracy: true,
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

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    const locationToUse = selectedLocation || userLocation;
    if (locationToUse) {
      loadPopularWorkspaces(locationToUse, filter);
    }
  };

  // Load popular workspaces based on location and filter
  const loadPopularWorkspaces = async (location: Location, filterType: string = 'all') => {
    setLoadingPopular(true);
    try {
      // Search for workspaces based on filter
      const searchParams = {
        location,
        radius: 5000, // 5km radius for popular workspaces
        type: filterType === 'all' ? undefined : 
              filterType === 'coworking' ? 'establishment' : filterType
      };

      const results = await workspaceService.searchWorkspaces(searchParams);
      
      // Sort by rating and limit to top workspaces
      const sortedResults = results
        .filter(workspace => workspace.rating && workspace.rating >= 4.0) // Only highly rated
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6); // Limit to 6 popular workspaces

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
      // Keep empty array on error
      setPopularWorkspaces([]);
    } finally {
      setLoadingPopular(false);
    }
  };

  // Handle location selection
  const handleLocationSelected = (location: Location, address: string) => {
    setSelectedLocation(location);
    setLocationAddress(address);
    setMapVisible(true);
    
    // Update popular workspaces based on new location
    loadPopularWorkspaces(location, activeFilter);
  };

  // Toggle map visibility
  const toggleMap = () => {
    setMapVisible(!mapVisible);
  };

  // Get photo URL
  const getPhotoUrl = (photoReference: string) => {
    return mapsService.getPhotoUrl(photoReference);
  };

  return (
    <div className={styles.workspaceSearchPageContainer}>
      {/* Navigation Header */}
      <div className={styles.searchNavigation}>
        <Link to="/dashboard" className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </Link>
        
        <div className={styles.searchBreadcrumb}>
          <Link to="/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>Search Workspaces</span>
        </div>
      </div>

      {/* Streamlined Header */}
      <div className={styles.searchPageHeader}>
        <h1>Find Your Perfect Workspace</h1>
        <p>Discover libraries, cafés, and co-working spaces in your area</p>
      </div>

      {/* Main Search Section */}
      <div className={styles.mainSearchSection}>
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
                  apiKey={apiKey}
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

      {/* Functional Filter Buttons */}
      <div className={styles.categoryFilters}>
        <div className={styles.categoryHeader}>
          <h2>Browse by Category</h2>
          <p>Filter workspaces by type to find exactly what you need</p>
        </div>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span className={styles.filterIcon}>🏢</span>
            All Types
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'library' ? styles.active : ''}`}
            onClick={() => handleFilterChange('library')}
          >
            <span className={styles.filterIcon}>📚</span>
            Libraries
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'cafe' ? styles.active : ''}`}
            onClick={() => handleFilterChange('cafe')}
          >
            <span className={styles.filterIcon}>☕</span>
            Cafés
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'coworking' ? styles.active : ''}`}
            onClick={() => handleFilterChange('coworking')}
          >
            <span className={styles.filterIcon}>💼</span>
            Co-working
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === 'book_store' ? styles.active : ''}`}
            onClick={() => handleFilterChange('book_store')}
          >
            <span className={styles.filterIcon}>📖</span>
            Bookstores
          </button>
        </div>
      </div>

      {/* Popular Workspaces Section */}
      <div className={styles.popularWorkspaces}>
        <div className={styles.sectionHeader}>
          <h2>
            {activeFilter === 'all' 
              ? 'Popular Workspaces in Your Area' 
              : `Popular ${activeFilter === 'cafe' ? 'Cafés' : 
                         activeFilter === 'library' ? 'Libraries' : 
                         activeFilter === 'coworking' ? 'Co-working Spaces' : 
                         activeFilter === 'book_store' ? 'Bookstores' : 'Workspaces'} in Your Area`
            }
          </h2>
          {!loadingPopular && popularWorkspaces.length > 0 && (
            <p className={styles.sectionSubtitle}>
              Showing {popularWorkspaces.length} highly-rated spaces near you
            </p>
          )}
        </div>
        
        {loadingPopular ? (
          <div className={styles.loadingIndicator}>
            <Loading message="Finding popular workspaces..." />
          </div>
        ) : popularWorkspaces.length > 0 ? (
          <div className={styles.workspaceGrid}>
            {popularWorkspaces.map((workspace) => (
              <div key={workspace.id} className={styles.workspaceCard}>
                <div className={styles.cardImage}>
                  <Link to={`/workspaces/map/${workspace.id}`}>
                    <img 
                      src={workspace.photos && workspace.photos.length > 0 
                        ? getPhotoUrl(workspace.photos[0])
                        : `/api/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`} 
                      alt={workspace.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/api/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`;
                      }}
                    />
                  </Link>
                  <div className={styles.cardFavorite}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <Link to={`/workspaces/map/${workspace.id}`} className={styles.cardTitle}>
                    {workspace.name}
                  </Link>
                  <p className={styles.cardLocation}>
                    {workspace.distance} • {workspace.address.split(',')[0]}
                  </p>
                  <div className={styles.cardAmenities}>
                    <span className={styles.cardAmenity}>{workspace.type}</span>
                    {workspace.amenities.slice(0, 1).map((amenity, index) => (
                      <span key={index} className={styles.cardAmenity}>{amenity}</span>
                    ))}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>{workspace.price}</div>
                    <div className={styles.cardRating}>
                      {workspace.rating ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {workspace.rating.toFixed(1)}
                        </>
                      ) : (
                        'No rating'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No popular workspaces found in your area. Try searching in a different location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSearchPage;