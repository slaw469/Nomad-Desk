// app/components/LandingPageComponents/components/PopularSpacesSection.tsx - FIXED VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";

// Global cities with coordinates for rotation
const GLOBAL_CITIES = [
  { name: 'New York City', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, country: 'USA' },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
];

// Sample workspaces as fallback
const SAMPLE_WORKSPACES = [
  {
    id: 'sample-library-001',
    name: 'Central Public Library',
    type: 'Library',
    address: 'Downtown Area',
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
    address: 'Arts District',
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
    address: 'Business District',
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
    address: 'Literary Quarter',
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

interface Workspace {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  photos: string[];
  price: string;
  rating: number;
  distance?: string;
}

const PopularSpacesSection: React.FC = () => {
  const [popularWorkspaces, setPopularWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<typeof GLOBAL_CITIES[0] | null>(null);
  
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    locationName: '',
    isUserLocation: false,
    error: null
  });

  // Get real photo URL from Google Places via backend proxy
  const getPhotoUrl = useCallback((photoReference: string | undefined, workspaceName: string, index: number) => {
    // If we have a photo reference, use the backend proxy to get the real image
    if (photoReference) {
      return `http://localhost:5003/api/public-maps/photo?reference=${encodeURIComponent(photoReference)}&maxwidth=400`;
    }
    
    // Fallback to placeholder if no photo available
    const colors = ['#4A6FDC', '#2DD4BF', '#F59E0B', '#EF4444'];
    const color = colors[index % colors.length];
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="400" height="320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="1" />
            <stop offset="100%" stop-color="${color}88" stop-opacity="1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad${index})"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${workspaceName}
        </text>
      </svg>
    `)}`;
  }, []);

  // Get user's current location with permission check
  const getCurrentLocation = useCallback((): Promise<LocationState> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const randomCity = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
        setCurrentCity(randomCity);
        resolve({
          coordinates: { lat: randomCity.lat, lng: randomCity.lng },
          locationName: `${randomCity.name}, ${randomCity.country}`,
          isUserLocation: false,
          error: 'Geolocation not supported'
        });
        return;
      }

      setLocationPermissionAsked(true);

      const timeout = setTimeout(() => {
        const randomCity = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
        setCurrentCity(randomCity);
        resolve({
          coordinates: { lat: randomCity.lat, lng: randomCity.lng },
          locationName: `${randomCity.name}, ${randomCity.country}`,
          isUserLocation: false,
          error: 'Location timeout'
        });
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          resolve({
            coordinates,
            locationName: 'Your Area',
            isUserLocation: true,
            error: null
          });
        },
        (error) => {
          clearTimeout(timeout);
          const randomCity = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
          setCurrentCity(randomCity);
          resolve({
            coordinates: { lat: randomCity.lat, lng: randomCity.lng },
            locationName: `${randomCity.name}, ${randomCity.country}`,
            isUserLocation: false,
            error: error.message
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000
        }
      );
    });
  }, []);

  // Test backend API connectivity
  const testBackendConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5003/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }
      
      return true;
      
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Backend test failed');
      return false;
    }
  }, []);

  // Get API key from backend
  const getApiKey = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5003/api/public-maps/api-key', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`API key request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.apiKey) {
        throw new Error('No API key returned');
      }
      
      console.log('✅ API key obtained from backend');
      return data.apiKey;
      
    } catch (error) {
      console.error('❌ Failed to get API key:', error);
      throw error;
    }
  }, []);

  // Search for real workspaces using backend proxy
  const searchRealWorkspaces = useCallback(async (coordinates: { lat: number; lng: number }): Promise<Workspace[]> => {
    try {
      console.log('🔍 Searching for real workspaces via backend...');
      
      const searchTypes = [
        { type: 'library', name: 'libraries' },
        { type: 'cafe', name: 'cafes' },
        { type: 'establishment', name: 'coworking spaces', keyword: 'coworking workspace' }
      ];
      
      const allResults: any[] = [];
      
      // Use backend proxy instead of direct Google API calls
      for (const searchType of searchTypes) {
        try {
          // Use the backend proxy endpoint
          let searchUrl = `http://localhost:5003/api/public-maps/places/nearby?location=${coordinates.lat},${coordinates.lng}&radius=5000&type=${searchType.type}`;
          
          if (searchType.keyword) {
            searchUrl += `&keyword=${encodeURIComponent(searchType.keyword)}`;
          }
          
          const response = await fetch(searchUrl, {
            signal: AbortSignal.timeout(8000)
          });
          
          if (!response.ok) {
            console.warn(`❌ ${searchType.name} search failed:`, response.status);
            continue;
          }
          
          const data = await response.json();
          
          if (data.status === 'OK' && data.results) {
            allResults.push(...data.results.slice(0, 2)); // Take 2 from each type
            console.log(`✅ Found ${data.results.length} ${searchType.name}`);
          }
          
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.warn(`Error searching ${searchType.name}:`, error);
        }
      }
      
      if (allResults.length === 0) {
        console.warn('No real workspaces found via backend');
        return [];
      }
      
      // Convert to workspace format
      const workspaces: Workspace[] = allResults.slice(0, 4).map((result: any) => ({
        id: result.place_id,
        name: result.name,
        type: result.types?.includes('library') ? 'Library' : 
              result.types?.includes('cafe') ? 'Café' : 
              result.types?.includes('establishment') ? 'Co-working Space' : 'Workspace',
        address: result.vicinity || result.formatted_address || 'Address not available',
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: ['Wi-Fi', 'Seating'],
        price: result.types?.includes('library') ? 'Free' : 'Contact for Info',
        rating: result.rating || 4.0,
        photos: result.photos?.map((photo: any) => photo.photo_reference) || [],
        distance: 'Nearby'
      }));
      
      console.log(`✅ Successfully converted ${workspaces.length} real workspaces`);
      return workspaces;
      
    } catch (error) {
      console.error('❌ Real workspace search failed:', error);
      return [];
    }
  }, []);

  // Load popular workspaces
  const loadPopularWorkspaces = useCallback(async (locationData: LocationState) => {
    if (!locationData.coordinates) return;

    setLoading(true);

    try {
      // Test backend connectivity first
      const backendWorking = await testBackendConnectivity();
      
      if (!backendWorking) {
        setUseFallbackData(true);
        setPopularWorkspaces(SAMPLE_WORKSPACES);
        setLoading(false);
        return;
      }

      // Try to get real workspaces via backend
      const realWorkspaces = await searchRealWorkspaces(locationData.coordinates);
      
      if (realWorkspaces.length === 0) {
        setUseFallbackData(true);
        setPopularWorkspaces(SAMPLE_WORKSPACES);
      } else {
        setUseFallbackData(false);
        setPopularWorkspaces(realWorkspaces);
      }

    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to load workspaces');
      setUseFallbackData(true);
      setPopularWorkspaces(SAMPLE_WORKSPACES);
    } finally {
      setLoading(false);
    }
  }, [testBackendConnectivity, searchRealWorkspaces]);

  // Initialize on mount
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
  }, [getCurrentLocation, loadPopularWorkspaces]);

  return (
    <section className={styles.popularSpaces}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Spaces</h2>
        <p className={styles.sectionSubtitle}>
          {loading 
            ? "Discovering amazing workspaces..." 
            : location.isUserLocation 
              ? `Curated workspaces in your area`
              : `Discover popular workspaces from ${currentCity?.name || 'around the world'}`
          }
        </p>
        
        {/* User-friendly hints */}
        {!location.isUserLocation && (
          <div style={{ 
            fontSize: '0.9rem',
            color: '#6B7280',
            marginTop: '10px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '5px 0' }}>
              📍 <strong>Enable location</strong> to see workspaces near you
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.8rem', opacity: '0.8' }}>
              Refresh to explore workspaces from another major city around the world
            </p>
          </div>
        )}
        
        {location.isUserLocation && (
          <div style={{ 
            fontSize: '0.85rem',
            color: '#10B981',
            marginTop: '8px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            ✨ Showing workspaces near your location
          </div>
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
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>Finding the perfect workspaces for you...</p>
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
                  src={getPhotoUrl(workspace.photos[0], workspace.name, index)}
                  alt={workspace.name} 
                  className={styles.spaceImage}
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    // If the real photo fails to load, fallback to placeholder
                    const target = e.target as HTMLImageElement;
                    const colors = ['#4A6FDC', '#2DD4BF', '#F59E0B', '#EF4444'];
                    const color = colors[index % colors.length];
                    target.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="400" height="320" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="${color}"/>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
                          ${workspace.name}
                        </text>
                      </svg>
                    `)}`;
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
          {location.isUserLocation ? 'Explore More Spaces' : 'Find Spaces Near You'}
        </Link>
      </div>
    </section>
  );
};

export default PopularSpacesSection;