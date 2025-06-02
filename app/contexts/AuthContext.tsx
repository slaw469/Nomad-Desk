// app/contexts/AuthContext.tsx - Complete Rewrite with Better Debugging
import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { authService, LoginData, SignupData } from '../services/api';

interface User {
  id?: string;
  email?: string;
  name?: string;
  provider?: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Get backend URL from environment with proper fallbacks
const getBackendUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  console.log('🔍 Raw VITE_API_BASE_URL:', apiBaseUrl);
  
  // If we have an API base URL, remove /api to get the backend URL
  if (apiBaseUrl) {
    const backendUrl = apiBaseUrl.replace('/api', '');
    console.log('🔍 Computed backend URL:', backendUrl);
    return backendUrl;
  }
  
  // Fallback for local development
  const fallbackUrl = 'http://localhost:5003';
  console.log('🔍 Using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

const BACKEND_URL = getBackendUrl();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe navigation helper
  const navigateTo = (path: string): void => {
    try {
      console.log('🧭 Navigating to:', path);
      window.location.href = path;
    } catch (err) {
      console.error('❌ Navigation error:', err);
      // Fallback navigation method
      window.location.assign(path);
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        console.log('🚀 Initializing authentication...');
        
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          console.log('📭 No stored authentication data found');
          setIsLoading(false);
          return;
        }

        console.log('🔍 Found stored auth data, validating token...');

        try {
          const currentUser = await authService.getCurrentUser(token);
          
          if (currentUser) {
            console.log('✅ Token valid, user authenticated:', currentUser.name || currentUser.email);
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            console.log('❌ Token invalid, clearing stored data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (validationError) {
          console.log('❌ Token validation failed:', validationError);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        console.log('🏁 Auth initialization complete');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Clear error state
  const clearError = (): void => {
    setError(null);
  };

  // Store authentication data
  const storeAuthData = (token: string, userData: User): void => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('❌ Failed to store auth data:', err);
      throw new Error('Failed to store authentication data');
    }
  };

  // Handle login
  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login for:', data.email);
      
      const response = await authService.login(data);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      storeAuthData(response.token, response.user);
      
      console.log('✅ Login successful for:', response.user.name || response.user.email);
      
      // Navigate to dashboard or saved redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      navigateTo(redirectPath);
      
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const signup = async (data: SignupData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Attempting signup for:', data.email);
      
      const response = await authService.register(data);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      storeAuthData(response.token, response.user);
      
      console.log('✅ Signup successful for:', response.user.name || response.user.email);
      
      // Navigate to dashboard or saved redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      navigateTo(redirectPath);
      
    } catch (err) {
      console.error('❌ Signup failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const socialLogin = async (provider: string): Promise<void> => {
    try {
      console.log(`🔗 Initiating ${provider.toUpperCase()} OAuth...`);
      
      // Debug environment and URL construction
      console.log('🔍 Environment debug:');
      console.log('  - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('  - BACKEND_URL:', BACKEND_URL);
      console.log('  - Current location:', window.location.href);
      console.log('  - Is HTTPS:', window.location.protocol === 'https:');

      // Save current path for post-login redirect
      const currentPath = window.location.pathname;
      const redirectPath = (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') 
        ? currentPath 
        : '/dashboard';
      
      localStorage.setItem('redirectAfterLogin', redirectPath);
      console.log('💾 Saved redirect path:', redirectPath);

      // Construct OAuth URL
      const oauthUrl = `${BACKEND_URL}/api/auth/${provider}`;
      
      console.log('🚀 Final OAuth URL:', oauthUrl);
      console.log('🔍 URL Protocol:', new URL(oauthUrl).protocol);
      console.log('🔍 URL Host:', new URL(oauthUrl).host);
      console.log('🔍 URL Path:', new URL(oauthUrl).pathname);

      // Redirect to OAuth provider
      window.location.href = oauthUrl;
      
    } catch (err) {
      console.error(`❌ ${provider} OAuth error:`, err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to initiate ${provider} login`;
      setError(errorMessage);
      throw err;
    }
  };

  // Handle logout
  const logout = (): void => {
    try {
      console.log('👋 Logging out user...');
      
      // Clear all auth-related data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('redirectAfterLogin');

      // Update state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      console.log('✅ Logout successful');
      navigateTo('/');
      
    } catch (err) {
      console.error('❌ Logout error:', err);
      // Even if there's an error, clear the state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    socialLogin,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};