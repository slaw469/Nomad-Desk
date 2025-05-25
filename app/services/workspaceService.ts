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
  userRatingsTotal?: number; // NEW: Number of reviews
  openingHours?: string[];
  priceLevel?: number; // NEW: Google's price level (0-4)
  businessStatus?: string; // NEW: OPERATIONAL, CLOSED_TEMPORARILY, etc.
}

// Interface for workspace search params
export interface WorkspaceSearchParams {
  location: Location;
  radius: number;
  type?: string;
  keyword?: string;
  minRating?: number; // NEW: Minimum rating filter
  openNow?: boolean; // NEW: Only show places open now
}

// Helper function to determine workspace type based on Google Places types
const determineWorkspaceType = (types: string[]): string => {
  if (types.includes('library')) return 'Library';
  if (types.includes('cafe')) return 'Café';
  if (types.includes('restaurant')) return 'Restaurant';
  if (types.includes('book_store')) return 'Bookstore';
  if (types.includes('university')) return 'University';
  if (types.includes('school')) return 'School';
  return 'Co-working Space';
};

// Enhanced helper function to determine amenities
const determineAmenities = (types: string[], placeDetails?: PlaceDetailsResult): string[] => {
  const amenities: string[] = [];

  // Base amenities based on type
  if (types.includes('library')) {
    amenities.push('Wi-Fi', 'Quiet Zone', 'Study Rooms', 'Power Outlets');
  }
  if (types.includes('cafe') || types.includes('restaurant')) {
    amenities.push('Wi-Fi', 'Refreshments', 'Food', 'Casual Atmosphere');
  }
  if (types.includes('book_store')) {
    amenities.push('Wi-Fi', 'Reading Area', 'Quiet Environment');
  }
  if (types.includes('university') || types.includes('school')) {
    amenities.push('Wi-Fi', 'Study Areas', 'Computer Access', 'Group Rooms');
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

  // Ensure we always have basic amenities
  if (amenities.length === 0) {
    amenities.push('Wi-Fi', 'Seating');
  }

  return [...new Set(amenities)]; // Remove duplicates
};

// Enhanced pricing logic
const determinePrice = (types: string[], priceLevel?: number): string => {
  // Use Google's price level if available
  if (priceLevel !== undefined) {
    switch (priceLevel) {
      case 0: return 'Free';
      case 1: return 'Inexpensive';
      case 2: return 'Moderate';
      case 3: return 'Expensive';
      case 4: return 'Very Expensive';
    }
  }

  // Fallback to type-based pricing
  if (types.includes('library') || types.includes('university')) {
    return 'Free';
  }
  
  if (types.includes('cafe') || types.includes('restaurant') || types.includes('book_store')) {
    return 'Purchase Recommended';
  }
  
  return 'Contact for Pricing';
};

// NEW: Helper to check if a place is good for studying/working
const isGoodForWork = (types: string[], rating?: number): boolean => {
  // Libraries and educational institutions are always good
  if (types.includes('library') || types.includes('university') || types.includes('school')) {
    return true;
  }

  // Bookstores are usually good
  if (types.includes('book_store')) {
    return true;
  }

  // Cafes need good ratings to be considered
  if (types.includes('cafe')) {
    return !rating || rating >= 4.0;
  }

  // Restaurants need excellent ratings
  if (types.includes('restaurant')) {
    return !rating || rating >= 4.2;
  }

  // Coworking spaces (establishments with coworking keyword)
  if (types.includes('establishment')) {
    return true; // These were searched with coworking keyword
  }

  return false;
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
          }),

          // Universities and colleges
          mapsService.searchNearbyPlaces(
            params.location,
            params.radius,
            'university'
          ).catch(err => {
            console.error('Error fetching universities:', err);
            return [];
          })
        ];
        
        const [libraryResults, cafeResults, coworkingResults, bookstoreResults, universityResults] = await Promise.all(searchPromises);
        results = [...libraryResults, ...cafeResults, ...coworkingResults, ...bookstoreResults, ...universityResults];
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
      const workspaces = workFriendlyResults.map(result => ({
        id: result.place_id,
        name: result.name,
        type: determineWorkspaceType(result.types),
        address: result.vicinity,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        amenities: determineAmenities(result.types),
        price: determinePrice(result.types, result.rating ? Math.floor(result.rating) : undefined),
        rating: result.rating,
        userRatingsTotal: undefined, // Would need place details for this
        photos: result.photos?.map(photo => photo.photo_reference) || [],
        businessStatus: 'OPERATIONAL' // Default assumption
      }));

      return workspaces;
    } catch (error) {
      console.error('Error searching for workspaces:', error);
      throw error;
    }
  },
  
  // Enhanced workspace details with more information  
  getWorkspaceById: async (placeId: string): Promise<Workspace> => {
    try {
      const placeDetails = await mapsService.getPlaceDetails(
        placeId,
        'name,formatted_address,geometry,photos,rating,types,website,formatted_phone_number,opening_hours,reviews,wheelchair_accessible_entrance,price_level,user_ratings_total,business_status'
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
        price: determinePrice(placeDetails.types, placeDetails.price_level),
        rating: placeDetails.rating,
        userRatingsTotal: placeDetails.user_ratings_total,
        openingHours: placeDetails.opening_hours?.weekday_text,
        photos: placeDetails.photos ? 
          placeDetails.photos.map(photo => photo.photo_reference) : 
          undefined,
        businessStatus: placeDetails.business_status || 'OPERATIONAL'
      };
    } catch (error) {
      console.error('Error fetching workspace details:', error);
      throw error;
    }
  },
  
  // NEW: Get popular workspaces with enhanced filtering
  getPopularWorkspaces: async (
    location: Location, 
    radius: number = 5000,
    limit: number = 4
  ): Promise<Workspace[]> => {
    try {
      const workspaces = await workspaceService.searchWorkspaces({
        location,
        radius,
        minRating: 4.0
      });

      // Sort by rating and user ratings total, then limit
      return workspaces
        .filter(w => w.rating && w.rating >= 4.0)
        .sort((a, b) => {
          // Primary sort by rating
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          
          // Secondary sort by number of ratings (more reviews = more popular)
          return (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0);
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting popular workspaces:', error);
      return [];
    }
  },
  
  // Get similar workspaces (existing function, enhanced)
  getSimilarWorkspaces: async (workspace: Workspace, limit: number = 4): Promise<Workspace[]> => {
    try {
      const results = await mapsService.searchNearbyPlaces(
        workspace.coordinates,
        3000, // 3km radius
        undefined,
        workspace.type
      );
      
      const filteredResults = results
        .filter(result => result.place_id !== workspace.id)
        .filter(result => isGoodForWork(result.types, result.rating))
        .slice(0, limit);
      
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
  
  // Calculate distance between a location and a workspace (existing function)
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
  
  // Format distance (existing function)
  formatDistance: (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
  },

  // NEW: Get workspaces by city name (for random city feature)
  getWorkspacesByCity: async (cityName: string, limit: number = 4): Promise<Workspace[]> => {
    try {
      // First geocode the city name to get coordinates
      const geocodeResults = await mapsService.geocodeAddress(cityName);
      if (!geocodeResults || geocodeResults.length === 0) {
        throw new Error(`Could not find coordinates for ${cityName}`);
      }

      const cityLocation = geocodeResults[0].geometry.location;
      
      // Search for popular workspaces in that city
      return await workspaceService.getPopularWorkspaces(
        { lat: cityLocation.lat, lng: cityLocation.lng },
        15000, // Larger radius for cities
        limit
      );
    } catch (error) {
      console.error(`Error getting workspaces for ${cityName}:`, error);
      return [];
    }
  },

  // NEW: Check if a workspace is currently open
  isCurrentlyOpen: (openingHours?: string[]): boolean => {
    if (!openingHours || openingHours.length === 0) {
      return true; // Assume open if no hours provided
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format

    // This is a simplified check - in reality, you'd need to parse the opening hours format
    // Google's opening hours format can be complex
    return true; // Placeholder - implement proper parsing if needed
  },

  // NEW: Get workspace recommendations based on user preferences
  getRecommendedWorkspaces: async (
    location: Location,
    preferences: {
      type?: string;
      atmosphere?: 'quiet' | 'lively' | 'any';
      amenities?: string[];
      maxDistance?: number;
    }
  ): Promise<Workspace[]> => {
    try {
      const searchParams: WorkspaceSearchParams = {
        location,
        radius: preferences.maxDistance || 5000,
        minRating: 3.5
      };

      // Add type filter if specified
      if (preferences.type && preferences.type !== 'any') {
        searchParams.type = preferences.type;
      }

      const workspaces = await workspaceService.searchWorkspaces(searchParams);

      // Filter based on preferences
      let filteredWorkspaces = workspaces;

      if (preferences.atmosphere === 'quiet') {
        filteredWorkspaces = filteredWorkspaces.filter(w => 
          w.type === 'Library' || w.amenities.includes('Quiet Zone')
        );
      } else if (preferences.atmosphere === 'lively') {
        filteredWorkspaces = filteredWorkspaces.filter(w => 
          w.type === 'Café' || w.amenities.includes('Casual Atmosphere')
        );
      }

      if (preferences.amenities && preferences.amenities.length > 0) {
        filteredWorkspaces = filteredWorkspaces.filter(w =>
          preferences.amenities!.some(amenity => w.amenities.includes(amenity))
        );
      }

      return filteredWorkspaces.slice(0, 8);
    } catch (error) {
      console.error('Error getting recommended workspaces:', error);
      return [];
    }
  }
};

export default workspaceService;