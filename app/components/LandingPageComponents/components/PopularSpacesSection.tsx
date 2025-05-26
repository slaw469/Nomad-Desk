// components/PopularSpacesSection.tsx - WORKING VERSION WITH REAL API
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import styles from "../../../styles/landing.module.css";

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

// Sample workspaces as fallback
const SAMPLE_WORKSPACES = [
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
  const [apiKey, setApiKey] = useState<string>('');
  
  const [location, setLocation] = useState<LocationState>({
    coordinates: null,
    locationName: '',
    isUserLocation: false,
    error: null
  });

  // SAFE image creation function - NEVER calls backend
  const createSafeImage = useCallback((workspaceName: string, index: number) => {
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
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${workspaceName}
        </text>
      </svg>
    `)}`;
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback((): Promise<LocationState> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const randomCity = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
        resolve({
          coordinates: { lat: randomCity.lat, lng: randomCity.lng },
          locationName: randomCity.name,
          isUserLocation: false,
          error: 'Geolocation not supported'
        });
        return;
      }

      setLocationPermissionAsked(true);

      const timeout = setTimeout(() => {
        const randomCity = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
        resolve({
          coordinates: { lat: randomCity.lat, lng: randomCity.lng },
          locationName: randomCity.name,
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
          const randomCity = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
          resolve({
            coordinates: { lat: randomCity.lat, lng: randomCity.lng },
            locationName: randomCity.name,
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

  // Test API connectivity
  const testApiConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔧 Testing API connectivity...');
      
      const response = await fetch('http://localhost:5003/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }
      
      console.log('✅ Backend is healthy');
      return true;
      
    } catch (error) {
      console.error('❌ API connectivity test failed:', error);
      setApiError(error instanceof Error ? error.message : 'API test failed');
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
      
      console.log('✅ API key obtained');
      return data.apiKey;
      
    } catch (error) {
      console.error('❌ Failed to get API key:', error);
      throw error;
    }
  }, []);

  // Search for real workspaces using Google Places API
  const searchRealWorkspaces = useCallback(async (coordinates: { lat: number; lng: number }, apiKey: string): Promise<Workspace[]> => {
    try {
      console.log('🔍 Searching for real workspaces...');
      
      const searchTypes = [
        { type: 'library', name: 'libraries' },
        { type: 'cafe', name: 'cafes' },
        { type: 'book_store', name: 'bookstores' }
      ];
      
      const allResults: any[] = [];
      
      for (const searchType of searchTypes) {
        try {
          const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=10000&type=${searchType.type}&key=${apiKey}`;
          
          const response = await fetch(searchUrl);
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
        console.warn('No real workspaces found');
        return [];
      }
      
      // Convert to workspace format
      const workspaces: Workspace[] = allResults.slice(0, 4).map((result: any) => ({
        id: result.place_id,
        name: result.name,
        type: result.types?.includes('library') ? 'Library' : 
              result.types?.includes('cafe') ? 'Café' : 
              result.types?.includes('book_store') ? 'Bookstore' : 'Workspace',
        address: result.vicinity || result.formatted_address || 'Address not available',
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: ['Wi-Fi', 'Seating'],
        photos: result.photos?.map((photo: any) => photo.photo_reference) || [],
        price: result.types?.includes('library') ? 'Free' : 'Contact for Info',
        rating: result.rating || 4.0,
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
    console.log('🔍 Loading workspaces for:', locationData.locationName);

    try {
      // Test API connectivity
      const apiWorking = await testApiConnectivity();
      
      if (!apiWorking) {
        console.warn('⚠️ API not working, using fallback data');
        setUseFallbackData(true);
        setPopularWorkspaces(SAMPLE_WORKSPACES);
        setLoading(false);
        return;
      }

      // Get API key
      const key = await getApiKey();
      setApiKey(key);
      
      // Search for real workspaces
      const realWorkspaces = await searchRealWorkspaces(locationData.coordinates, key);
      
      if (realWorkspaces.length === 0) {
        console.warn('⚠️ No real workspaces found, using fallback data');
        setUseFallbackData(true);
        setPopularWorkspaces(SAMPLE_WORKSPACES);
      } else {
        console.log(`✅ Successfully loaded ${realWorkspaces.length} real workspaces`);
        setUseFallbackData(false);
        setPopularWorkspaces(realWorkspaces);
      }

    } catch (error) {
      console.error('❌ Error loading workspaces:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to load workspaces');
      setUseFallbackData(true);
      setPopularWorkspaces(SAMPLE_WORKSPACES);
    } finally {
      setLoading(false);
    }
  }, [testApiConnectivity, getApiKey, searchRealWorkspaces]);

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

  // Debug info
  const debugInfo = useMemo(() => {
    if (!import.meta.env.DEV) return null;
    
    return {
      apiError,
      useFallbackData,
      locationName: location.locationName,
      isUserLocation: location.isUserLocation,
      workspaceCount: popularWorkspaces.length,
      coordinates: location.coordinates,
      hasApiKey: !!apiKey
    };
  }, [apiError, useFallbackData, location.locationName, location.isUserLocation, location.coordinates, popularWorkspaces.length, apiKey]);

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
                ? `Real workspaces near you in ${location.locationName}`
                : `Real workspaces from ${location.locationName}`
          }
        </p>
        
        {/* Debug info */}
        {import.meta.env.DEV && debugInfo && (
          <details style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
            <summary>Debug Info (Dev Only)</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '0.7rem' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}

        {/* Status message */}
        <div style={{ 
          background: useFallbackData ? '#fff3cd' : '#d1ecf1', 
          padding: '10px', 
          borderRadius: '4px', 
          fontSize: '0.85rem',
          color: useFallbackData ? '#856404' : '#0c5460',
          marginTop: '10px'
        }}>
          {useFallbackData ? (
            <>🔧 {apiError ? `API Error: ${apiError}` : 'Using sample data - enable location for real workspaces'}</>
          ) : (
            <>✅ Showing real workspaces from Google Places API!</>
          )}
        </div>
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
                  src={createSafeImage(workspace.name, index)}
                  alt={workspace.name} 
                  className={styles.spaceImage}
                  style={{ objectFit: 'cover' }}
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