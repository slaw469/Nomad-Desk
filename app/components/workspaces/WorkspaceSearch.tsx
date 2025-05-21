// app/components/workspaces/WorkspaceSearch.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './workspace.module.css';
import LocationSearch from '../common/LocationSearch';
import mapsService, { NearbySearchResult, Location } from '../../services/mapsService';

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
  const [nearbyWorkspaces, setNearbyWorkspaces] = useState<NearbySearchResult[]>([]);

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

    try {
      // Search for libraries, coffee shops, and coworking spaces
      const libraryResults = await mapsService.searchNearbyPlaces(
        location,
        searchRadius,
        'library'
      );

      const cafeResults = await mapsService.searchNearbyPlaces(
        location,
        searchRadius,
        'cafe',
        'study OR work'
      );

      const coworkingResults = await mapsService.searchNearbyPlaces(
        location,
        searchRadius,
        undefined,
        'coworking OR workspace'
      );

      // Combine and deduplicate results
      const combinedResults = [...libraryResults, ...cafeResults, ...coworkingResults];
      const uniqueResults = removeDuplicates(combinedResults, 'place_id');

      setNearbyWorkspaces(uniqueResults);
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

  // Utility function to remove duplicates from an array based on a property
  const removeDuplicates = <T extends Record<string, any>>(
    array: T[],
    property: keyof T
  ): T[] => {
    return Array.from(new Map(array.map(item => [item[property], item])).values());
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

  // Determine workspace type based on types array
  const getWorkspaceType = (types: string[]): string => {
    if (types.includes('library')) return 'Library';
    if (types.includes('cafe')) return 'Café';
    if (types.includes('restaurant')) return 'Restaurant';
    return 'Workspace';
  };

  // Format distance (in meters) to a friendly string
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${distance.toFixed(0)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
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

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingIndicator}>
          <p>Searching for workspaces...</p>
        </div>
      ) : (
        <div className={styles.searchResults}>
          {nearbyWorkspaces.length > 0 ? (
            <>
              <h3>Workspaces near {searchAddress}</h3>
              <div className={styles.workspaceGrid}>
                {nearbyWorkspaces.map((workspace) => (
                  <div key={workspace.place_id} className={styles.workspaceCard}>
                    <div className={styles.cardImage}>
                      <Link to={`/workspaces/map/${workspace.place_id}`}>
                        <img 
                          src={`/api/placeholder/400/250?text=${encodeURIComponent(workspace.name)}`} 
                          alt={workspace.name} 
                        />
                      </Link>
                      <div className={styles.cardFavorite}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <Link to={`/workspaces/map/${workspace.place_id}`} className={styles.cardTitle}>
                        {workspace.name}
                      </Link>
                      <p className={styles.cardLocation}>{workspace.vicinity}</p>
                      <div className={styles.cardAmenities}>
                        <span className={styles.cardAmenity}>{getWorkspaceType(workspace.types)}</span>
                        {workspace.types.includes('wifi') && (
                          <span className={styles.cardAmenity}>Wi-Fi</span>
                        )}
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardDistance}>
                          {searchLocation && workspace.geometry?.location && (
                            formatDistance(
                              calculateDistance(
                                searchLocation, 
                                {
                                  lat: workspace.geometry.location.lat,
                                  lng: workspace.geometry.location.lng
                                }
                              )
                            )
                          )}
                        </div>
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

// Utility function to calculate distance between two points using the Haversine formula
function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export default WorkspaceSearch;