// app/services/workspaceService.ts - ENHANCED VERSION FOR POPULAR SPACES
import mapsService, { Location, NearbySearchResult } from './mapsService';

// Interface for workspace data
export interface Workspace {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: Location;
  distance?: string;
  amenities: string[];
  photos?: string[];
  price?: string;
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: string[];
  priceLevel?: number;
  businessStatus?: string;
  types: string[]; // Add types field
}

// Interface for workspace search parameters
export interface WorkspaceSearchParams {
  location: Location;
  radius: number;
  type?: string;
  keyword?: string;
  minRating?: number;
  excludeId?: string;
  limit?: number;
}

// Helper function to determine if a place is suitable for work
const isGoodForWork = (types: string[], rating?: number): boolean => {
  // Minimum rating threshold
  if (rating && rating < 3.5) return false;

  // Good types for workspaces
  const goodTypes = [
    'library',
    'book_store',
    'cafe',
    'restaurant',
    'university',
    'school',
    'establishment'
  ];

  // Bad types that indicate not suitable for work
  const badTypes = [
    'bar',
    'night_club',
    'liquor_store',
    'gas_station',
    'car_repair',
    'car_dealer',
    'cemetery',
    'funeral_home',
    'gym',
    'hospital'
  ];

  return (
    goodTypes.some(type => types.includes(type)) &&
    !badTypes.some(type => types.includes(type))
  );
};

// Helper function to determine workspace type
const determineWorkspaceType = (types: string[]): string => {
  if (types.includes('library')) return 'Library';
  if (types.includes('book_store')) return 'Bookstore';
  if (types.includes('cafe')) return 'Café';
  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('university')) return 'University';
  return 'Co-working Space';
};

// Helper function to determine workspace price
const getWorkspacePrice = (types: string[]): string => {
  if (types.includes('library') || types.includes('university')) {
    return 'Free';
  }
  if (types.includes('cafe') || types.includes('restaurant') || types.includes('book_store')) {
    return 'Purchase Recommended';
  }
  if (types.includes('establishment')) {
    return 'Contact for Pricing';
  }
  return 'Free';
};

// Helper function to determine amenities based on types
const determineAmenities = (types: string[]): string[] => {
  const amenities = ['Wi-Fi'];
  
  if (types.includes('library')) {
    amenities.push('Study Rooms', 'Quiet Zone');
  }
  if (types.includes('cafe') || types.includes('restaurant')) {
    amenities.push('Coffee', 'Food');
  }
  if (types.includes('book_store')) {
    amenities.push('Reading Area');
  }
  
  return amenities;
};

// Enhanced workspace service
export const workspaceService = {
  // Enhanced search for workspaces
  searchWorkspaces: async (params: WorkspaceSearchParams): Promise<Workspace[]> => {
    try {
      const { location, radius = 5000, type, keyword, minRating, excludeId, limit } = params;
      
      // Search for workspaces
      const results = await mapsService.searchNearbyPlaces(
        location,
        radius,
        type || 'establishment',
        keyword
      );

      // Apply filters
      let filteredResults = results.filter((place: NearbySearchResult) => {
        // Filter by minimum rating if specified
        if (minRating && place.rating && place.rating < minRating) {
          return false;
        }
        // Filter out excluded workspace if specified
        if (excludeId && place.place_id === excludeId) {
          return false;
        }
        return true;
      });

      // Limit results if specified
      if (limit && limit > 0) {
        filteredResults = filteredResults.slice(0, limit);
      }

      // Map to workspace format
      return filteredResults.map((result: NearbySearchResult) => ({
        id: result.place_id,
        name: result.name,
        type: determineWorkspaceType(result.types),
        address: result.vicinity,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: determineAmenities(result.types),
        photos: result.photos?.map(photo => photo.photo_reference) || [],
        rating: result.rating || 0,
        types: result.types || []
      }));
    } catch (error) {
      console.error('Error searching workspaces:', error);
      return [];
    }
  },

  // Calculate distance between a location and a workspace
  calculateDistance: (origin: Location, destination: Location): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (origin.lat * Math.PI) / 180;
    const φ2 = (destination.lat * Math.PI) / 180;
    const Δφ = ((destination.lat - origin.lat) * Math.PI) / 180;
    const Δλ = ((destination.lng - origin.lng) * Math.PI) / 180;
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
  },
  
  // Format distance
  formatDistance: (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
  },

  /**
   * Get similar workspaces based on type and location
   */
  getSimilarWorkspaces: async (workspaceId: string, type: string, location: { lat: number; lng: number }) => {
    try {
      // Search for workspaces of the same type within 5km radius
      const results = await workspaceService.searchWorkspaces({
        location,
        radius: 5000,
        type,
        excludeId: workspaceId,
        limit: 4 // Limit to 4 similar places
      });
      
      return results;
    } catch (error) {
      console.error('Error fetching similar workspaces:', error);
      return [];
    }
  },

  // Export helper functions
  determineWorkspaceType,
  getWorkspacePrice,
  determineAmenities,
  isGoodForWork
};

export default workspaceService;