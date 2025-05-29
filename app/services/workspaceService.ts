// app/services/workspaceService.ts - ENHANCED VERSION FOR POPULAR SPACES
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
  userRatingsTotal?: number;
  openingHours?: string[];
  priceLevel?: number;
  businessStatus?: string;
}

// Interface for workspace search parameters
export interface WorkspaceSearchParams {
  location: Location;
  radius: number;
  type?: string;
  keyword?: string;
  minRating?: number;
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

// Helper function to determine amenities
const determineAmenities = (types: string[], details?: PlaceDetailsResult): string[] => {
  const amenities: string[] = [];

  // Basic amenities based on type
  if (types.includes('library')) {
    amenities.push('Quiet Zone', 'Free Wi-Fi');
  }
  if (types.includes('cafe') || types.includes('restaurant')) {
    amenities.push('Food & Drinks', 'Wi-Fi Available');
  }
  if (types.includes('book_store')) {
    amenities.push('Reading Area', 'Wi-Fi Available');
  }
  if (types.includes('university')) {
    amenities.push('Study Rooms', 'Wi-Fi Available');
  }

  // Additional amenities from place details
  if (details) {
    if (details.wheelchair_accessible_entrance) {
      amenities.push('Wheelchair Accessible');
    }
    if (details.has_wifi) {
      amenities.push('Wi-Fi');
    }
  }

  return Array.from(new Set(amenities)); // Remove duplicates
};

// Helper function to determine price level
const determinePrice = (types: string[], priceLevel?: number): string => {
  if (types.includes('library')) return 'Free';
  if (types.includes('university')) return 'Contact for Pricing';
  
  switch(priceLevel) {
    case 0: return 'Free';
    case 1: return 'Budget-Friendly';
    case 2: return 'Moderate';
    case 3: return 'Premium';
    case 4: return 'Luxury';
    default: return 'Purchase Recommended';
  }
};

// Enhanced workspace service
export const workspaceService = {
  // Enhanced search for workspaces
  searchWorkspaces: async (params: WorkspaceSearchParams): Promise<Workspace[]> => {
    try {
      console.log("Searching for workspaces with enhanced params:", params);
      let results: NearbySearchResult[] = [];
      
      if (!params.type || params.type === 'all') {
        // Search for all workspace types in parallel with enhanced queries
        const searchPromises = [
          // Libraries - always high priority for studying
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'library'
          ).catch(err => {
            console.error('Error fetching libraries:', err);
            return [];
          }),
          
          // Cafes with study-friendly keywords
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'cafe',
            'wifi study laptop'
          ).catch(err => {
            console.error('Error fetching cafes:', err);
            return [];
          }),
          
          // Coworking spaces and business centers
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'establishment',
            'coworking workspace business center'
          ).catch(err => {
            console.error('Error fetching coworking spaces:', err);
            return [];
          }),
          
          // Bookstores (often have study areas)
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'book_store'
          ).catch(err => {
            console.error('Error fetching bookstores:', err);
            return [];
          })
        ];
        
        const [libraryResults, cafeResults, coworkingResults, bookstoreResults] = await Promise.all(searchPromises);
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
      
      console.log(`Found ${uniqueResults.length} unique potential workspaces`);
      
      // Filter results for work-friendly places
      const workFriendlyResults = uniqueResults.filter(result => {
        // Check if it's a good workspace
        if (!isGoodForWork(result.types, result.rating)) {
          return false;
        }

        // Apply minimum rating filter if specified
        if (params.minRating && result.rating && result.rating < params.minRating) {
          return false;
        }

        // Filter out places that are likely not suitable
        const name = result.name.toLowerCase();
        const excludeKeywords = ['hospital', 'clinic', 'pharmacy', 'gas station', 'parking', 'atm'];
        if (excludeKeywords.some(keyword => name.includes(keyword))) {
          return false;
        }

        return true;
      });

      console.log(`Filtered to ${workFriendlyResults.length} work-friendly spaces`);
      
      // Transform to workspace format with enhanced data
      return workFriendlyResults.map(result => ({
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
        price: determinePrice(result.types, result.price_level),
        rating: result.rating,
        userRatingsTotal: result.user_ratings_total,
        businessStatus: result.business_status || 'OPERATIONAL'
      }));
    } catch (error) {
      console.error('Error searching for workspaces:', error);
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