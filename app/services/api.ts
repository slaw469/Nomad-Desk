// app/services/api.ts - UPDATED WITH CORRECT BACKEND PORT

// Base API URL - UPDATED to match your backend port
const API_BASE_URL = 'http://localhost:5003/api';

// Interface for authentication responses
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Interface for signup data
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

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
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    console.log(`Fetching ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // If status is 401 Unauthorized and this is a getCurrentUser request,
    // return null instead of throwing an error
    if (response.status === 401 && endpoint === '/auth/user') {
      console.log('User not authenticated, returning null');
      return null as T;
    }
    
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
    if (error instanceof Error) {
      console.error('API fetch error:', error.message);
      throw error;
    }
    console.error('Unexpected API error:', error);
    throw new Error('An unexpected error occurred');
  }
};

// Auth Service methods
export const authService = {
  // Login user
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/login', 'POST', loginData);
  },

  // Register user
  register: async (signupData: SignupData): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/register', 'POST', signupData);
  },

  // Get current user
  getCurrentUser: async (token: string): Promise<{ id: string; name: string; email: string; avatar?: string } | null> => {
    return fetchApi('/auth/user', 'GET', undefined, token);
  }
};

// Export default for convenience
export default {
  auth: authService
};