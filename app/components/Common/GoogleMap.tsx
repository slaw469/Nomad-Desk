// app/components/common/GoogleMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '../../utils/mapsLoader';

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

  // Initialize the map
  const initializeMap = async () => {
    if (!mapRef.current) {
      console.warn('Cannot initialize map: missing map container ref');
      setLoading(false);
      setError('Failed to initialize map - missing container');
      return;
    }
    
    try {
      // Ensure Google Maps is loaded
      await loadGoogleMapsApi(apiKey, ['places']);
      
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

  // Initialize map on component mount
  useEffect(() => {
    initializeMap();
    
    // Cleanup function
    return () => {
      if (map) {
        // Clean up any map listeners if needed
      }
    };
  }, [apiKey]); // Re-initialize if API key changes

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