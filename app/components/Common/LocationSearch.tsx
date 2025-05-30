// app/components/common/LocationSearch.tsx
import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '../../utils/mapsLoader';

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
  defaultValue = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  // Initialize Autocomplete
  const initializeAutocomplete = async () => {
    if (!inputRef.current) {
      console.warn('Unable to initialize autocomplete: missing input ref');
      setError('Failed to initialize location search');
      setLoading(false);
      return;
    }

    try {
      // Ensure Google Maps is loaded with Places library
      await loadGoogleMapsApi(apiKey, ['places']);

      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
        fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
      });

      // Store reference to autocomplete
      autocompleteRef.current = autocomplete;

      // Add place_changed event listener
      autocomplete.addListener('place_changed', handlePlaceChanged);
      console.log('Autocomplete initialized successfully');
      setLoading(false);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setError('Failed to initialize location search');
      setLoading(false);
    }
  };

  // Handle place changed event
  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) {
      console.warn('Autocomplete reference is null');
      return;
    }

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      console.error('No geometry found for this place:', place);
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

  // Initialize on component mount
  useEffect(() => {
    initializeAutocomplete();

    // Cleanup function
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiKey]);

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
          border: '1px solid #E5E7EB',
        }}
        disabled={loading || !!error}
      />

      {error && (
        <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '5px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
