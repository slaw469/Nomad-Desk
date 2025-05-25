// components/PopularSpacesSection.tsx - FIXED VERSION (NO INFINITE LOOPS)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";
import workspaceService, { Workspace } from '../../../services/workspaceService';
import mapsService from '../../../services/mapsService';

// Major cities with coordinates for fallback locations
const MAJOR_CITIES = [
  { name: 'New York City', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589 },
  { name: 'Austin', lat: 30.2672, lng: -97.7431 },
  { name: 'Denver', lat: 39.7392, lng: -104.9903 }
];

// Hardcoded sample data as ultimate fallback
const SAMPLE_WORKSPACES: Workspace[] = [
  {
    id: 'sample-library-001',
    name: 'Central Public Library',
    type: 'Library',
    address: '123 Main Street, Downtown',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    amenities: ['Wi-Fi', 'Quiet Zone', 'Study Rooms'],
    photos: [],
    price: 'Free',
    rating: 4.6,
    distance: '0.8 km'
  },
  {
    id: 'sample-cafe-001',
    name: 'The Study Café',
    type: 'Café',
    address: '456 Coffee Lane, Arts District',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    amenities: ['Wi-Fi', 'Refreshments', 'Power Outlets'],
    photos: [],
    price: 'Purchase Recommended',
    rating: 4.4,
    distance: '1.2 km'
  },
  {
    id: 'sample-coworking-001',
    name: 'Innovation Hub',
    type: 'Co-working Space',
    address: '789 Tech Boulevard, Business District',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    amenities: ['High-Speed Wi-Fi', 'Meeting Rooms', '24/7 Access'],
    photos: [],
    price: 'Contact for Pricing',
    rating: 4.8,
    distance: '2.1 km'
  },
  {
    id: 'sample-bookstore-001',
    name: 'Barnes & Books Study Corner',
    type: 'Bookstore',
    address: '321 Reading Way, Literary Quarter',
    coordinates: { lat: 40.7282, lng: -74.0776 },
    amenities: ['Wi-Fi', 'Reading Area', 'Quiet Environment'],
    photos: [],
    price: 'Purchase Recommended',
    rating: 4.3,
    distance: '1.5 km'
  }
];

interface LocationState {
  coordinates: { lat: number; lng: number } | null;
  locationName: string;
  isUserLocation: boolean;
  error: string | null;
}

const PopularSpacesSection: React.FC = () => {
  const [popularWorkspaces, setPopularWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    locationName: '',
    isUserLocation: false,
    error: null
  });

  // Memoized photo URL function to prevent re-renders
  const getPhotoUrl = useCallback((photoReference: string) => {
    if (!photoReference) {
      return `http://localhost:5003/api/placeholder/400/320?text=Workspace`;
    }
    return `http://localhost:5003/api/public-maps/photo?reference=${encodeURIComponent(photoReference)}&maxwidth=400`;
  }, []);

  // Memoized random city function
  const getRandomCity = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MAJOR_CITIES.length);
    return MAJOR_CITIES[randomIndex];
  }, []);

  // Test API connectivity - USE PUBLIC ENDPOINTS FOR LANDING PAGE
  const testApiConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔧 Testing Google Maps API (public endpoints)...');
      
      // Use the public maps endpoint that doesn't require authentication
      const response = await fetch('http://localhost:5003/api/public-maps/api-key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        setApiError(`API key request failed: ${response.status}`);
        return false;
      }
      
      const data = await response.json();
      console.log('API Key available:', !!data.apiKey);
      
      if (!data.apiKey) {
        setApiError('No API key returned from public endpoint');
        return false;
      }

      // Test with a simple geocoding request using fetch directly
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=New+York+City&key=${data.apiKey}`;
      const testResponse = await fetch(testUrl);
      const testResult = await testResponse.json();
      
      const success = testResult.status === 'OK' && testResult.results && testResult.results.length > 0;
      console.log('API test result:', success ? 'Success' : 'Failed');
      
      if (!success) {
        setApiError(`Geocoding test failed: ${testResult.status || 'Unknown error'}`);
      }
      
      return success;
    } catch (error) {
      console.error('API test error:', error);
      setApiError(error instanceof Error ? error.message : 'API test failed');
      return false;
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback((): Promise<LocationState> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const randomCity = getRandomCity();
        resolve({
          coordinates: { lat: randomCity.lat, lng: randomCity.lng },
          locationName: randomCity.name,
          isUserLocation: false,
          error: 'Geolocation not supported'
        });
        return;
      }

      setLocationPermissionAsked(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          console.log('📍 User location obtained:', coordinates);

          let locationName = 'Your Area';
          try {
            const geocodeResults = await mapsService.geocodeAddress(`${coordinates.lat},${coordinates.lng}`);
            if (geocodeResults && geocodeResults.length > 0) {
              const addressComponents = geocodeResults[0].formatted_address.split(',');
              locationName = addressComponents.length > 1 ? addressComponents[1].trim() : 'Your Area';
            }
          } catch (error) {
            console.warn('Could not get location name:', error);
          }

          resolve({
            coordinates,
            locationName,
            isUserLocation: true,
            error: null
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          const randomCity = getRandomCity();
          resolve({
            coordinates: { lat: randomCity.lat, lng: randomCity.lng },
            locationName: randomCity.name,
            isUserLocation: false,
            error: error.message
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, [getRandomCity]);

  // Load popular workspaces - simplified to prevent loops
  const loadPopularWorkspaces = useCallback(async (locationData: LocationState) => {
    if (!locationData.coordinates) return;

    setLoading(true);
    console.log('🔍 Loading workspaces for:', locationData.locationName);

    try {
      // Test API first
      const apiWorking = await testApiConnectivity();
      
      if (!apiWorking) {
        console.warn('⚠️ API not working, using fallback data');
        setUseFallbackData(true);
        setPopularWorkspaces(SAMPLE_WORKSPACES);
        setLoading(false);
        return;
      }

      // Try to search for real workspaces using direct Google Maps API (with CORS handling)
      console.log('🔍 Searching for real workspaces using direct Google Maps API...');
      
      try {
        // Get API key from public endpoint
        const keyResponse = await fetch('http://localhost:5003/api/public-maps/api-key');
        
        if (!keyResponse.ok) {
          throw new Error(`API key request failed: ${keyResponse.status}`);
        }
        
        const keyData = await keyResponse.json();
        console.log('Got API key:', !!keyData.apiKey);
        
        if (!keyData.apiKey) {
          throw new Error('No API key available');
        }
        
        // Try multiple search strategies
        const searchStrategies = [
          // Strategy 1: Libraries
          {
            type: 'library',
            radius: 15000,
            keyword: null,
            name: 'libraries'
          },
          // Strategy 2: Cafes
          {
            type: 'cafe', 
            radius: 10000,
            keyword: null,
            name: 'cafes'
          },
          // Strategy 3: General establishments with keywords
          {
            type: 'establishment',
            radius: 12000, 
            keyword: 'coffee',
            name: 'coffee shops'
          }
        ];
        
        let allResults: any[] = [];
        
        for (const strategy of searchStrategies) {
          try {
            console.log(`Trying search strategy: ${strategy.name}`);
            
            let searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationData.coordinates.lat},${locationData.coordinates.lng}&radius=${strategy.radius}&type=${strategy.type}&key=${keyData.apiKey}`;
            
            if (strategy.keyword) {
              searchUrl += `&keyword=${encodeURIComponent(strategy.keyword)}`;
            }
            
            console.log('Search URL:', searchUrl.replace(keyData.apiKey, 'API_KEY_HIDDEN'));
            
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            
            console.log(`${strategy.name} search - Status:`, searchData.status, 'Results:', searchData.results?.length || 0);
            
            if (searchData.status === 'OK' && searchData.results && searchData.results.length > 0) {
              allResults.push(...searchData.results.slice(0, 3)); // Take top 3 from each strategy
              console.log(`Added ${Math.min(3, searchData.results.length)} results from ${strategy.name}`);
            } else if (searchData.error_message) {
              console.warn(`${strategy.name} search error:`, searchData.error_message);
            }
            
            // Small delay between requests to be respectful to the API
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (strategyError) {
            console.warn(`Error with ${strategy.name} search:`, strategyError);
          }
        }
        
        console.log('Total results collected:', allResults.length);
        
        if (allResults.length === 0) {
          console.warn('⚠️ No results from any search strategy, using fallback data');
          setUseFallbackData(true);
          setPopularWorkspaces(SAMPLE_WORKSPACES);
          setLoading(false);
          return;
        }
        
        // Remove duplicates by place_id
        const uniqueResults = Array.from(
          new Map(allResults.map(item => [item.place_id, item])).values()
        );
        
        console.log('Unique results after deduplication:', uniqueResults.length);
      
      } catch (searchError) {
        console.error('Search process failed:', searchError);
        throw searchError;
      }

      // Convert to workspace format
      const workspaces = uniqueResults
        .slice(0, 4)
        .map((result: any) => ({
          id: result.place_id,
          name: result.name,
          type: result.types?.includes('library') ? 'Library' : 
                result.types?.includes('cafe') ? 'Café' : 
                result.types?.includes('restaurant') ? 'Restaurant' :
                'Workspace',
          address: result.vicinity || result.formatted_address || 'Address not available',
          coordinates: {
            lat: result.geometry?.location?.lat || 0,
            lng: result.geometry?.location?.lng || 0
          },
          amenities: ['Wi-Fi', 'Seating'],
          photos: result.photos?.map((photo: any) => photo.photo_reference) || [],
          price: result.types?.includes('library') ? 'Free' : 'Contact for Info',
          rating: result.rating || 4.0,
          distance: result.geometry?.location ? workspaceService.formatDistance(
            workspaceService.calculateDistance(locationData.coordinates!, {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng
            })
          ) : 'Unknown distance'
        }));

      console.log(`✅ Found ${workspaces.length} workspaces`);
      setUseFallbackData(false);
      setPopularWorkspaces(workspaces);

    } catch (error) {
      console.error('❌ Error loading workspaces:', error);
      setUseFallbackData(true);
      setPopularWorkspaces(SAMPLE_WORKSPACES);
    } finally {
      setLoading(false);
    }
  }, [testApiConnectivity]);

  // Initialize on mount - only once
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const locationData = await getCurrentLocation();
        if (mounted) {
          setLocation(locationData);
          await loadPopularWorkspaces(locationData);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setUseFallbackData(true);
          setPopularWorkspaces(SAMPLE_WORKSPACES);
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

  // Memoize the debug info display
  const debugInfo = useMemo(() => {
    if (!import.meta.env.DEV) return null;
    
    return {
      apiError,
      useFallbackData,
      locationName: location.locationName,
      isUserLocation: location.isUserLocation,
      workspaceCount: popularWorkspaces.length
    };
  }, [apiError, useFallbackData, location.locationName, location.isUserLocation, popularWorkspaces.length]);

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces</h2>
        <p className={styles.sectionSubtitle}>
          {loading 
            ? "Discovering workspaces for you..." 
            : useFallbackData
              ? "Curated workspaces perfect for studying and working"
              : location.isUserLocation 
                ? `Workspaces near you in ${location.locationName}`
                : `Workspaces from ${location.locationName}`
          }
        </p>
        
        {/* Debug information - only in dev */}
        {import.meta.env.DEV && debugInfo && (
          <details style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
            <summary>Debug Info (Dev Only)</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '0.7rem' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}

        {useFallbackData && (
          <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '8px', fontStyle: 'italic' }}>
            {locationPermissionAsked 
              ? "📍 Showing sample workspaces - enable location or check your internet connection for local results"
              : "🌍 Showing curated workspaces from major cities"
            }
          </p>
        )}
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
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>Loading amazing workspaces...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div className={styles.spaceCards}>
          {popularWorkspaces.map((workspace, index) => (
            <div key={workspace.id} className={styles.spaceCard}>
              <Link to={useFallbackData ? '/search' : `/workspaces/map/${workspace.id}`}>
                <img 
                  src={workspace.photos && workspace.photos.length > 0 
                    ? getPhotoUrl(workspace.photos[0])
                    : `http://localhost:5003/api/placeholder/400/320?text=${encodeURIComponent(workspace.name)}`} 
                  alt={workspace.name} 
                  className={styles.spaceImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `http://localhost:5003/api/placeholder/400/320?text=${encodeURIComponent(workspace.name)}`;
                  }}
                />
              </Link>
              {(index === 0 || (workspace.rating && workspace.rating >= 4.5)) && (
                <div className={styles.popularTag}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z" fill="white"/>
                  </svg>
                  {workspace.rating && workspace.rating >= 4.7 ? 'Top Rated' : 'Popular'}
                </div>
              )}
              <div className={styles.spaceInfo}>
                <div className={styles.spaceTitle}>
                  <Link 
                    to={useFallbackData ? '/search' : `/workspaces/map/${workspace.id}`} 
                    className={styles.spaceName}
                  >
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
          ))}
        </div>
      )}
      
      <div className={styles.viewAll}>
        <Link to="/search" className={`${styles.ctaButton} ${styles.primaryButton}`}>
          {useFallbackData ? 'Find Real Workspaces' : 'View All Spaces'}
        </Link>
      </div>
    </section>
  );
};

export default PopularSpacesSection;