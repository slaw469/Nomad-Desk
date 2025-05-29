import React, { useEffect } from 'react';

const GoogleMap: React.FC = () => {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  const loadGoogleMapsScript = () => {
    // Check if script is already loaded
    if (window.google?.maps) {
      console.log('Google Maps already loaded');
      initializeMap();
      return;
    }

    // Remove any existing Google Maps scripts
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => script.remove());

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      initializeMap();
    };
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (apiKey) {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  const initializeMap = () => {
    // Implementation of initializeMap function
  };

  return (
    <div id="map" style={{ width: '100%', height: '300px' }}></div>
  );
};

export default GoogleMap; 