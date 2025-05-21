// app/components/workspaces/WorkspaceSearch.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './workspace.module.css';
import LocationSearch from '../Common/LocationSearch';
import mapsService, { Location } from '../../services/mapsService';
import workspaceService, { Workspace, WorkspaceSearchParams } from '../../services/workspaceService';
import Loading from '../Common/Loading';

interface WorkspaceSearchProps {
  onLocationSelected?: (location: Location, address: string) => void;
}

const WorkspaceSearch: React.FC<WorkspaceSearchProps> = ({ onLocationSelected }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(1000); // Default 1km
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Fetch API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await mapsService.getApiKey();
        setApiKey(key);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load Maps API key');
        }
      }
    };

    fetchApiKey();
  }, []);

  // Handle place selection from LocationSearch
  const handlePlaceSelected = async (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) {
      setError('Invalid location selected');
      return;
    }

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setSearchLocation(location);
    setSearchAddress(place.formatted_address || '');

    // Call the callback if provided
    if (onLocationSelected) {
      onLocationSelected(location, place.formatted_address || '');
    }

    // Search for nearby workspaces
    searchNearbyWorkspaces(location);
  };

  // Search for nearby workspaces
  const searchNearbyWorkspaces = async (location: Location) => {
    setLoading(true);
    setError(null);
    setWorkspaces([]);

    try {
      // Create search parameters
      const searchParams: WorkspaceSearchParams = {
        location,
        radius: searchRadius,
        type: activeFilter === 'all' ? undefined : activeFilter
      };

      // Search for workspaces
      const results = await workspaceService.searchWorkspaces(searchParams);

      // Calculate and add distance to each workspace
      const workspacesWithDistance = results.map(workspace => {
        const distance = workspaceService.calculateDistance(location, workspace.coordinates);
        return {
          ...workspace,
          distance: workspaceService.formatDistance(distance)
        };
      });

      setWorkspaces(workspacesWithDistance);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to search for nearby workspaces');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle radius change
  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const radius = parseInt(e.target.value, 10);
    setSearchRadius(radius);

    // If we already have a location, search again with the new radius
    if (searchLocation) {
      searchNearbyWorkspaces(searchLocation);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);

    // If we already have a location, search again with the new filter
    if (searchLocation) {
      searchNearbyWorkspaces(searchLocation);
    }
  };

  // Method to get photo URL
  const getPhotoUrl = (photoReference: string) => {
    return mapsService.getPhotoUrl(photoReference);
  };

  return (
    <div className={styles.workspaceSearchContainer}>
      <div className={styles.searchHeader}>
        <h2>Find Workspaces Near You</h2>
        <p>Search for libraries, cafés, and coworking spaces in your area</p>
      </div>

      <div className={styles.searchControls}>
        <div className={styles.locationSearch}>
          {apiKey ? (
            <LocationSearch
              apiKey={apiKey}
              placeholder="Enter a location"
              onPlaceSelected={handlePlaceSelected}
              className={styles.locationSearchInput}
            />
          ) : (
            <div className={styles.loadingSearch}>Loading search...</div>
          )}
        </div>

        <div className={styles.radiusSelector}>
          <label htmlFor="radius">Search radius:</label>
          <select
            id="radius"
            value={searchRadius}
            onChange={handleRadiusChange}
            className={styles.radiusSelect}
          >
            <option value="500">500 m</option>
            <option value="1000">1 km</option>
            <option value="2000">2 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
          </select>
        </div>
      </div>

      <div className={styles.filterButtons}>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Types
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'library' ? styles.active : ''}`}
          onClick={() => handleFilterChange('library')}
        >
          Libraries
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'cafe' ? styles.active : ''}`}
          onClick={() => handleFilterChange('cafe')}
        >
          Cafés
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilter === 'establishment' ? styles.active : ''}`}
          onClick={() => handleFilterChange('establishment')}
        >
          Co-working
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'book_store' ? styles.active : ''}`}
          onClick={() => handleFilterChange('book_store')}
        >
          Bookstores
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingIndicator}>
          <Loading message="Searching for workspaces..." />
        </div>
      ) : (
        <div className={styles.searchResults}>
          {workspaces.length > 0 ? (
            <>
              <h3>Workspaces near {searchAddress}</h3>
              <div className={styles.workspaceGrid}>
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className={styles.workspaceCard}>
                    <div className={styles.cardImage}>
                      <Link to={`/workspaces/map/${workspace.id}`}>
                        <img 
                          src={workspace.photos && workspace.photos.length > 0 
                            ? getPhotoUrl(workspace.photos[0])
                            : `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`} 
                          alt={workspace.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`;
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
            </>
          ) : (
            searchLocation && (
              <div className={styles.noResults}>
                <p>No workspaces found near this location. Try increasing the search radius or searching in a different area.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSearch;