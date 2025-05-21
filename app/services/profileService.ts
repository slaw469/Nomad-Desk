// app/services/profileService.ts

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// User profile interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  location?: string;
  timezone?: string;
  interests?: string[];
  education?: Education[];
  skills?: string[];
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  current: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface UserPreferences {
  privateProfile: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyPreferences?: StudyPreferences;
}

export interface StudyPreferences {
  preferredEnvironments: string[];
  noiseLevel: 'silent' | 'quiet' | 'moderate' | 'lively';
  preferredTimes: string[];
  groupSize: 'solo' | 'small' | 'medium' | 'large';
}

// Generic fetch function for API calls
const fetchApi = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
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

// Profile Service methods
export const profileService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    return fetchApi<UserProfile>('/profile');
  },
  
  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return fetchApi<UserProfile>('/profile', 'PUT', profileData);
  },
  
  // Upload profile avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const headers: HeadersInit = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['x-auth-token'] = token;
    }
    
    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }
    
    return response.json();
  },
  
  // Get user profile by ID
  getProfileById: async (userId: string): Promise<UserProfile> => {
    return fetchApi<UserProfile>(`/profile/${userId}`);
  },
  
  // Search for users
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    return fetchApi<UserProfile[]>(`/profile/search?q=${encodeURIComponent(query)}`);
  },
  
  // Get suggested connections
  getSuggestedConnections: async (): Promise<UserProfile[]> => {
    return fetchApi<UserProfile[]>('/profile/suggested-connections');
  },
  
  // Update study preferences
  updateStudyPreferences: async (preferences: StudyPreferences): Promise<UserProfile> => {
    return fetchApi<UserProfile>('/profile/study-preferences', 'PUT', preferences);
  },
  
  // Update user preferences
  updatePreferences: async (preferences: UserPreferences): Promise<UserProfile> => {
    return fetchApi<UserProfile>('/profile/preferences', 'PUT', preferences);
  }
};

export default profileService;