// app/components/common/GoogleMap.tsx
import React, { useEffect, useRef, useState } from 'react';

// Define interfaces for the component props
interface GoogleMapProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markerTitle?: string;
  address?: string;
  height?: string;
  width?: string;
  className?: string;
  onLoad?: (map: google.maps.Map) => void;
}

// Define a marker info window content interface
interface MarkerInfoContent {
  title: string;
  address?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  center,
  zoom = 15,
  markerTitle = '',
  address = '',
  height = '400px',
  width = '100%',
  className = '',
  onLoad
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  // Function to create the Google Maps script
  const loadGoogleMapsScript = () => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      initializeMap();
      return;
    }

    console.log('Loading Google Maps script with key:', apiKey.substring(0, 10) + '...');

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Handle script load event
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      setIsScriptLoaded(true);
      initializeMap();
    };
    
    // Handle script error
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API:', e);
      setLoading(false);
      setError('Failed to load Google Maps API. Please check your API key.');
    };
    
    // Add script to document
    document.head.appendChild(script);
  };

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.warn('Cannot initialize map: missing dependencies');
      setLoading(false);
      setError('Failed to initialize map - missing dependencies');
      return;
    }
    
    try {
      console.log('Initializing map with center:', center);
      
      // Create a new map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      });
      
      // Add a marker if title is provided
      if (markerTitle) {
        const marker = new window.google.maps.Marker({
          position: center,
          map: mapInstance,
          title: markerTitle,
          animation: window.google.maps.Animation.DROP
        });
        
        // Create info window if we have an address
        if (address) {
          const infoContent: MarkerInfoContent = {
            title: markerTitle,
            address
          };
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: createInfoWindowContent(infoContent)
          });
          
          // Open the info window when marker is clicked
          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
          
          // Open info window by default
          infoWindow.open(mapInstance, marker);
        }
      }
      
      // Set the map instance and loading state
      setMap(mapInstance);
      setLoading(false);
      
      // Call onLoad callback if provided
      if (onLoad) {
        onLoad(mapInstance);
      }
      
      console.log('Map initialized successfully');
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize Google Maps');
      setLoading(false);
    }
  };

  // Create HTML content for info window
  const createInfoWindowContent = (content: MarkerInfoContent): string => {
    return `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 10px; font-size: 16px; color: #2A3347;">${content.title}</h3>
        ${content.address ? `<p style="margin: 0; font-size: 14px; color: #4B5563;">${content.address}</p>` : ''}
      </div>
    `;
  };

  // Load the map on component mount
  useEffect(() => {
    loadGoogleMapsScript();
    
    // Cleanup function
    return () => {
      // Nothing to clean up currently
    };
  }, []);

  // Update map center if it changes and map exists
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [center, map]);

  return (
    <div style={{ position: 'relative', height, width }} className={className}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8FAFC'
        }}>
          <p>Loading map...</p>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          color: '#EF4444',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p>{error}</p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default GoogleMap;