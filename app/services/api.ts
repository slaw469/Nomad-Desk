// app/services/api.ts

// Base API URL - adjust this for development/production environments
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for authentication responses
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
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
  getCurrentUser: async (token: string): Promise<{ id: string; name: string; email: string }> => {
    return fetchApi('/auth/user', 'GET', undefined, token);
  }
};