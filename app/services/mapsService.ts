// app/services/mapsService.ts

// Base API URL - adjust this for development/production environments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Interface for geocoding response
export interface GeocodingResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

// Interface for place autocomplete response
export interface PlaceAutocompleteResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
}

// Interface for place details response
export interface PlaceDetailsResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
  rating?: number;
  types: string[];
  website?: string;
  formatted_phone_number?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now?: boolean;
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  wheelchair_accessible_entrance?: boolean;
  has_wifi?: boolean;
  vicinity: string;
}

// Interface for nearby search response
export interface NearbySearchResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  place_id: string;
  vicinity: string;
  rating?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

// Interface for directions response
export interface DirectionsResult {
  routes: Array<{
    legs: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      start_address: string;
      end_address: string;
      steps: Array<{
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
        instructions: string;
      }>;
    }>;
  }>;
}

// Interface for Location for easier use
export interface Location {
  lat: number;
  lng: number;
}

// Flag to determine whether to use public endpoints (for development)
const usePublicEndpoints = import.meta.env.VITE_USE_PUBLIC_ENDPOINTS === 'true';

// Helper function to get the appropriate API route
const getApiRoute = (path: string) => {
  return usePublicEndpoints ? `/public-maps${path}` : `/maps${path}`;
};

// Helper to handle API errors
const handleApiError = (error: any): never => {
  console.error('API error:', error);
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected API error occurred');
};

// Generic fetch function for API calls
const fetchApi = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  token?: string
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['x-auth-token'] = token;
  } else {
    // Try to get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken && !usePublicEndpoints) {
      headers['x-auth-token'] = storedToken;
    }
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    console.log(`Fetching ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Try to parse response as JSON
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      // If response is not JSON, use an empty object
      responseData = {};
    }
    
    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.status} ${response.statusText}`;
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    return handleApiError(error);
  }
};

// Maps Service methods
export const mapsService = {
  // Get Google Maps API key
  getApiKey: async (): Promise<string> => {
    try {
      const response = await fetchApi<{ apiKey: string }>(getApiRoute('/api-key'));
      return response.apiKey;
    } catch (error) {
      console.error('Failed to get API key:', error);
      throw error;
    }
  },

  // Geocode an address to get coordinates
  geocodeAddress: async (address: string): Promise<GeocodingResult[]> => {
    try {
      const response = await fetchApi<{ results: GeocodingResult[] }>(getApiRoute(`/geocode?address=${encodeURIComponent(address)}`));
      return response.results;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  },

  // Get place autocomplete suggestions
  getPlaceAutocomplete: async (
    input: string, 
    types?: string, 
    components?: string
  ): Promise<PlaceAutocompleteResult[]> => {
    try {
      let url = getApiRoute(`/places/autocomplete?input=${encodeURIComponent(input)}`);
      
      if (types) {
        url += `&types=${encodeURIComponent(types)}`;
      }
      
      if (components) {
        url += `&components=${encodeURIComponent(components)}`;
      }
      
      const response = await fetchApi<{ predictions: PlaceAutocompleteResult[] }>(url);
      return response.predictions;
    } catch (error) {
      console.error('Place autocomplete error:', error);
      throw error;
    }
  },

  // Get place details
  getPlaceDetails: async (
    placeId: string, 
    fields?: string
  ): Promise<PlaceDetailsResult> => {
    try {
      let url = getApiRoute(`/places/details?place_id=${encodeURIComponent(placeId)}`);
      
      if (fields) {
        url += `&fields=${encodeURIComponent(fields)}`;
      }
      
      const response = await fetchApi<{ result: PlaceDetailsResult }>(url);
      return response.result;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  },

  // Search for places nearby
  searchNearbyPlaces: async (
    location: Location | string, 
    radius: number, 
    type?: string, 
    keyword?: string
  ): Promise<NearbySearchResult[]> => {
    try {
      const locationStr = typeof location === 'string' 
        ? location 
        : `${location.lat},${location.lng}`;
      
      let url = getApiRoute(`/places/nearby?location=${encodeURIComponent(locationStr)}&radius=${radius}`);
      
      if (type) {
        url += `&type=${encodeURIComponent(type)}`;
      }
      
      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }
      
      const response = await fetchApi<{ results: NearbySearchResult[] }>(url);
      return response.results || [];
    } catch (error) {
      console.error('Nearby search error:', error);
      throw error;
    }
  },

  // Get directions between two locations
  getDirections: async (
    origin: string | Location, 
    destination: string | Location, 
    options?: {
      mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
      waypoints?: string;
      alternatives?: boolean;
      avoid?: string;
      units?: 'metric' | 'imperial';
    }
  ): Promise<DirectionsResult> => {
    try {
      const originStr = typeof origin === 'string' 
        ? origin 
        : `${origin.lat},${origin.lng}`;
      
      const destinationStr = typeof destination === 'string' 
        ? destination 
        : `${destination.lat},${destination.lng}`;
      
      let url = getApiRoute(`/directions?origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destinationStr)}`);
      
      if (options) {
        if (options.mode) {
          url += `&mode=${encodeURIComponent(options.mode)}`;
        }
        
        if (options.waypoints) {
          url += `&waypoints=${encodeURIComponent(options.waypoints)}`;
        }
        
        if (options.alternatives) {
          url += `&alternatives=${options.alternatives}`;
        }
        
        if (options.avoid) {
          url += `&avoid=${encodeURIComponent(options.avoid)}`;
        }
        
        if (options.units) {
          url += `&units=${encodeURIComponent(options.units)}`;
        }
      }
      
      const response = await fetchApi<DirectionsResult>(url);
      return response;
    } catch (error) {
      console.error('Directions error:', error);
      throw error;
    }
  },

  // Generate static map URL
  getStaticMapUrl: (
    center: string | Location, 
    zoom: number, 
    size: string, 
    markers?: string, 
    path?: string, 
    format?: string
  ): string => {
    try {
      const centerStr = typeof center === 'string' 
        ? center 
        : `${center.lat},${center.lng}`;
      
      let url = getApiRoute(`/static?center=${encodeURIComponent(centerStr)}&zoom=${zoom}&size=${encodeURIComponent(size)}`);
      
      if (markers) {
        url += `&markers=${encodeURIComponent(markers)}`;
      }
      
      if (path) {
        url += `&path=${encodeURIComponent(path)}`;
      }
      
      if (format) {
        url += `&format=${encodeURIComponent(format)}`;
      }
      
      // Return the full URL to the static map
      return `${API_BASE_URL}${url}`;
    } catch (error) {
      console.error('Static map URL error:', error);
      throw error;
    }
  },

  // Get a photo URL for a photo reference
  getPhotoUrl: (photoReference: string, maxWidth: number = 400, maxHeight?: number): string => {
    if (!photoReference) {
      return `${API_BASE_URL}/placeholder/400/300?text=No+Image`;
    }
    
    // Make sure to handle different API_BASE_URL formats
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    
    // Use public-maps endpoint for better compatibility
    let url = `/public-maps/photo?reference=${encodeURIComponent(photoReference)}&maxwidth=${maxWidth}`;
    
    if (maxHeight) {
      url += `&maxheight=${maxHeight}`;
    }
    
    return `${baseUrl}${url}`;
  },
  
  // Test if API is available
  testConnection: async (): Promise<boolean> => {
    try {
      await mapsService.getApiKey();
      return true;
    } catch (error) {
      console.error('Maps API connection test failed:', error);
      return false;
    }
  }
};

// Export default for convenience
export default mapsService;