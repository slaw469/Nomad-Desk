// app/services/mapsService.ts

// Base API URL - adjust this for development/production environments
const API_BASE_URL = 'http://localhost:5001/api';

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

// Fetch API with authentication
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
    if (storedToken) {
      headers['x-auth-token'] = storedToken;
    }
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the default error message
      }
      
      throw new Error(errorMessage);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('API fetch error:', error.message);
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Maps Service methods
export const mapsService = {
  // Get Google Maps API key
  getApiKey: async (): Promise<string> => {
    const response = await fetchApi<{ apiKey: string }>('/maps/api-key');
    return response.apiKey;
  },

  // Geocode an address to get coordinates
  geocodeAddress: async (address: string): Promise<GeocodingResult[]> => {
    const response = await fetchApi<{ results: GeocodingResult[] }>(`/maps/geocode?address=${encodeURIComponent(address)}`);
    return response.results;
  },

  // Get place autocomplete suggestions
  getPlaceAutocomplete: async (
    input: string, 
    types?: string, 
    components?: string
  ): Promise<PlaceAutocompleteResult[]> => {
    let url = `/maps/places/autocomplete?input=${encodeURIComponent(input)}`;
    
    if (types) {
      url += `&types=${encodeURIComponent(types)}`;
    }
    
    if (components) {
      url += `&components=${encodeURIComponent(components)}`;
    }
    
    const response = await fetchApi<{ predictions: PlaceAutocompleteResult[] }>(url);
    return response.predictions;
  },

  // Get place details
  getPlaceDetails: async (
    placeId: string, 
    fields?: string
  ): Promise<PlaceDetailsResult> => {
    let url = `/maps/places/details?place_id=${encodeURIComponent(placeId)}`;
    
    if (fields) {
      url += `&fields=${encodeURIComponent(fields)}`;
    }
    
    const response = await fetchApi<{ result: PlaceDetailsResult }>(url);
    return response.result;
  },

  // Search for places nearby
  searchNearbyPlaces: async (
    location: Location | string, 
    radius: number, 
    type?: string, 
    keyword?: string
  ): Promise<NearbySearchResult[]> => {
    const locationStr = typeof location === 'string' 
      ? location 
      : `${location.lat},${location.lng}`;
    
    let url = `/maps/places/nearby?location=${encodeURIComponent(locationStr)}&radius=${radius}`;
    
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    
    const response = await fetchApi<{ results: NearbySearchResult[] }>(url);
    return response.results;
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
    const originStr = typeof origin === 'string' 
      ? origin 
      : `${origin.lat},${origin.lng}`;
    
    const destinationStr = typeof destination === 'string' 
      ? destination 
      : `${destination.lat},${destination.lng}`;
    
    let url = `/maps/directions?origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(destinationStr)}`;
    
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
  },

  // Generate static map URL
  getStaticMapUrl: async (
    center: string | Location, 
    zoom: number, 
    size: string, 
    markers?: string, 
    path?: string, 
    format?: string
  ): Promise<string> => {
    const centerStr = typeof center === 'string' 
      ? center 
      : `${center.lat},${center.lng}`;
    
    let url = `/maps/static?center=${encodeURIComponent(centerStr)}&zoom=${zoom}&size=${encodeURIComponent(size)}`;
    
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
  }
};

// Export default for convenience
export default mapsService;