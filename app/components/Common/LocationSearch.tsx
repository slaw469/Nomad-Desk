// app/components/common/LocationSearch.tsx
import React, { useEffect, useRef, useState } from 'react';

// Define interfaces for the component props
interface LocationSearchProps {
  apiKey: string;
  placeholder?: string;
  className?: string;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  defaultValue?: string;
}

// Interface for the returned location data
export interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
  name: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  apiKey,
  placeholder = 'Search for a location',
  className = '',
  onPlaceSelected,
  defaultValue = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  // Function to load the Google Maps Places API script
  const loadGoogleMapsScript = () => {
    // Check if the script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsScriptLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Handle script load event
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    // Handle script error
    script.onerror = () => {
      setScriptError('Failed to load Google Maps API');
    };
    
    // Add script to document
    document.head.appendChild(script);
  };

  // Initialize Autocomplete
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) return;
    
    try {
      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
        fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id']
      });
      
      // Store reference to autocomplete
      autocompleteRef.current = autocomplete;
      
      // Add place_changed event listener
      autocomplete.addListener('place_changed', handlePlaceChanged);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setScriptError('Failed to initialize location search');
    }
  };

  // Handle place changed event
  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      console.error('No geometry found for this place');
      return;
    }
    
    // Call the onPlaceSelected callback if provided
    if (onPlaceSelected) {
      onPlaceSelected(place);
    }
    
    // Update the input value
    if (place.formatted_address) {
      setInputValue(place.formatted_address);
    }
  };

  // Load the script on component mount
  useEffect(() => {
    loadGoogleMapsScript();
    
    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        // Remove event listeners if necessary
        // google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  // Initialize autocomplete when script is loaded
  useEffect(() => {
    if (isScriptLoaded) {
      initializeAutocomplete();
    }
  }, [isScriptLoaded]);

  // Handle input value change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB'
        }}
        disabled={!isScriptLoaded || !!scriptError}
      />
      
      {scriptError && (
        <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '5px' }}>
          {scriptError}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;