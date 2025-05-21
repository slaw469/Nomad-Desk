// app/services/workspaceService.ts
import mapsService, { Location, NearbySearchResult, PlaceDetailsResult } from './mapsService';

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
  openingHours?: string[];
}

// Interface for workspace search params
export interface WorkspaceSearchParams {
  location: Location;
  radius: number;
  type?: string;
  keyword?: string;
}

// Helper function to determine workspace type based on Google Places types
const determineWorkspaceType = (types: string[]): string => {
  if (types.includes('library')) return 'Library';
  if (types.includes('cafe')) return 'Café';
  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('book_store')) return 'Bookstore';
  if (types.includes('university')) return 'University';
  return 'Co-working Space';
};

// Helper function to determine amenities based on workspace type and available data
const determineAmenities = (types: string[], placeDetails?: PlaceDetailsResult): string[] => {
  const amenities: string[] = ['Wi-Fi'];

  // Add amenities based on type
  if (types.includes('library')) {
    amenities.push('Quiet Zone', 'Study Rooms');
  }
  if (types.includes('cafe') || types.includes('restaurant')) {
    amenities.push('Refreshments', 'Food');
  }
  if (types.includes('book_store')) {
    amenities.push('Reading Area');
  }

  // Add amenities based on place details
  if (placeDetails) {
    if (placeDetails.wheelchair_accessible_entrance) {
      amenities.push('Wheelchair Accessible');
    }
    if (placeDetails.has_wifi === true) {
      amenities.push('Free Wi-Fi');
    }
  }

  return [...new Set(amenities)]; // Remove duplicates
};

// Helper function to determine price based on workspace type
const determinePrice = (types: string[]): string => {
  if (types.includes('library')) return 'Free';
  if (types.includes('book_store')) return 'Purchase Required';
  if (types.includes('cafe') || types.includes('restaurant')) return '$5/hr min';
  return '$15/hr';
};

// Workspace Service methods
export const workspaceService = {
  // Search for workspaces near a location
  searchWorkspaces: async (params: WorkspaceSearchParams): Promise<Workspace[]> => {
    try {
      console.log("Searching for workspaces with params:", params);
      // Determine search parameters based on workspace type
      let results: NearbySearchResult[] = [];
      
      if (!params.type || params.type === 'all') {
        // Search for all workspace types in parallel
        const [libraryResults, cafeResults, coworkingResults, bookstoreResults] = await Promise.all([
          // Libraries
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'library'
          ).catch(err => {
            console.error('Error fetching libraries:', err);
            return [];
          }),
          
          // Cafes
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'cafe',
            'study OR work'
          ).catch(err => {
            console.error('Error fetching cafes:', err);
            return [];
          }),
          
          // Co-working spaces (generic establishments with coworking keyword)
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'establishment',
            'coworking OR workspace'
          ).catch(err => {
            console.error('Error fetching coworking spaces:', err);
            return [];
          }),
          
          // Bookstores
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'book_store'
          ).catch(err => {
            console.error('Error fetching bookstores:', err);
            return [];
          })
        ]);
        
        // Combine all results
        results = [...libraryResults, ...cafeResults, ...coworkingResults, ...bookstoreResults];
      } else {
        // Search for specific workspace type
        results = await mapsService.searchNearbyPlaces(
          params.location,
          params.radius,
          params.type,
          params.keyword
        );
      }
      
      // Remove duplicates by place_id
      const uniqueResults = Array.from(
        new Map(results.map(item => [item.place_id, item])).values()
      );
      
      console.log(`Found ${uniqueResults.length} unique workspaces`);
      
      // Transform to workspace format
      return uniqueResults.map(result => ({
        id: result.place_id,
        name: result.name,
        type: determineWorkspaceType(result.types),
        address: result.vicinity,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: determineAmenities(result.types),
        price: determinePrice(result.types),
        rating: result.rating,
        photos: result.photos?.map(photo => photo.photo_reference) || []
      }));
    } catch (error) {
      console.error('Error searching for workspaces:', error);
      throw error;
    }
  },
  
  // Get workspace details by place ID
  getWorkspaceById: async (placeId: string): Promise<Workspace> => {
    try {
      const placeDetails = await mapsService.getPlaceDetails(
        placeId,
        'name,formatted_address,geometry,photos,rating,types,website,formatted_phone_number,opening_hours,reviews,wheelchair_accessible_entrance'
      );
      
      return {
        id: placeId,
        name: placeDetails.name,
        type: determineWorkspaceType(placeDetails.types),
        address: placeDetails.formatted_address,
        coordinates: {
          lat: placeDetails.geometry.location.lat,
          lng: placeDetails.geometry.location.lng
        },
        amenities: determineAmenities(placeDetails.types, placeDetails),
        price: determinePrice(placeDetails.types),
        rating: placeDetails.rating,
        openingHours: placeDetails.opening_hours?.weekday_text,
        photos: placeDetails.photos ? 
          placeDetails.photos.map(photo => photo.photo_reference) : 
          undefined
      };
    } catch (error) {
      console.error('Error fetching workspace details:', error);
      throw error;
    }
  },
  
  // Get similar workspaces near a specific workspace
  getSimilarWorkspaces: async (workspace: Workspace, limit: number = 4): Promise<Workspace[]> => {
    try {
      // First, find all nearby places of the same type
      const results = await mapsService.searchNearbyPlaces(
        workspace.coordinates,
        2000, // 2km radius
        undefined,
        workspace.type
      );
      
      // Filter out the original workspace and limit results
      const filteredResults = results
        .filter(result => result.place_id !== workspace.id)
        .slice(0, limit);
      
      // Transform to workspace format
      return filteredResults.map(result => ({
        id: result.place_id,
        name: result.name,
        type: determineWorkspaceType(result.types),
        address: result.vicinity,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: determineAmenities(result.types),
        price: determinePrice(result.types),
        rating: result.rating,
        photos: result.photos?.map(photo => photo.photo_reference) || []
      }));
    } catch (error) {
      console.error('Error fetching similar workspaces:', error);
      throw error;
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
  }
};

export default workspaceService;