// app/services/favoritesService.ts
import { Location } from './mapsService';

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Favorite interfaces
export interface Favorite {
  id: string;
  user: string;
  workspace: {
    id: string;
    name: string;
    address: string;
    type: string;
    photo?: string;
    coordinates: Location;
    rating?: number;
    price: string;
  };
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
}

export interface FavoriteRequest {
  workspaceId: string;
  workspaceName: string;
  workspaceAddress: string;
  workspaceType: string;
  workspacePhoto?: string;
  coordinates: Location;
  rating?: number;
  price: string;
}

export interface FavoriteStats {
  total: number;
  byType: Record<string, number>;
}

// Generic fetch function for API calls
const fetchApi = async <T>(
  endpoint: string,
  method = 'GET',
  data?: any,
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['x-auth-token'] = token;
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
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.status} ${response.statusText}`;
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('API fetch error:', error.message);
      throw error;
    }
    console.error('Unexpected API error:', error);
    throw new Error('An unexpected error occurred');
  }
};

// Favorites Service methods
export const favoritesService = {
  // Get all favorites
  getFavorites: async (): Promise<Favorite[]> => fetchApi<Favorite[]>('/favorites'),

  // Add workspace to favorites
  addFavorite: async (favoriteData: FavoriteRequest): Promise<Favorite> => fetchApi<Favorite>('/favorites', 'POST', favoriteData),

  // Remove workspace from favorites
  removeFavorite: async (workspaceId: string): Promise<{ message: string }> => fetchApi<{ message: string }>(`/favorites/${workspaceId}`, 'DELETE'),

  // Check if workspace is favorited
  isFavorited: async (workspaceId: string): Promise<boolean> => {
    const response = await fetchApi<{ isFavorited: boolean }>(`/favorites/check/${workspaceId}`);
    return response.isFavorited;
  },

  // Get favorites statistics
  getFavoriteStats: async (): Promise<FavoriteStats> => fetchApi<FavoriteStats>('/favorites/stats'),

  // Toggle favorite status (add if not favorited, remove if favorited)
  toggleFavorite: async (
    workspaceId: string,
    workspaceData?: Omit<FavoriteRequest, 'workspaceId'>,
  ): Promise<{ isFavorited: boolean; message: string }> => {
    try {
      const isFavorited = await favoritesService.isFavorited(workspaceId);

      if (isFavorited) {
        await favoritesService.removeFavorite(workspaceId);
        return { isFavorited: false, message: 'Removed from favorites' };
      }
      if (!workspaceData) {
        throw new Error('Workspace data required to add favorite');
      }
      await favoritesService.addFavorite({ workspaceId, ...workspaceData });
      return { isFavorited: true, message: 'Added to favorites' };
    } catch (error) {
      console.error('Toggle favorite error:', error);
      throw error;
    }
  },
};

export default favoritesService;
