// app/contexts/AuthContext.tsx - FIXED: Better error handling for context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginData, SignupData } from '../services/api';

interface User {
  id?: string;
  email?: string;
  name?: string;
  provider?: string;
  avatar?: string;
  [key: string]: any; // Allow any additional properties
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

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook with proper error handling
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped with AuthProvider.');
  }
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Define backend URL - UPDATED TO MATCH YOUR RUNNING BACKEND
const BACKEND_URL = 'http://localhost:5003';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to navigate to a path
  const navigateTo = (path: string) => {
    try {
      window.location.href = path;
    } catch (err) {
      console.error('Navigation error:', err);
      // Fallback: try to use history API
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', path);
        window.location.reload();
      }
    }
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            // Verify token validity by getting current user
            const userData = await authService.getCurrentUser(token);
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              // Clear invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (err) {
            console.log('Token validation failed, clearing auth data');
            // If token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        // Always set loading to false, even if there are errors
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Login user
  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(data);
      
      // Store auth info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful login
      navigateTo('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during login');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      
      // Store auth info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful signup
      navigateTo('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during registration');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Social login - redirects to backend OAuth endpoint
  const socialLogin = async (provider: string) => {
    try {
      // Save the current path for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to backend OAuth route
      window.location.href = `${BACKEND_URL}/api/auth/${provider}`;
    } catch (err) {
      console.error(`${provider} login error:`, err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An error occurred during ${provider} login`);
      }
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('redirectAfterLogin');
      
      setUser(null);
      setIsAuthenticated(false);
      navigateTo('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    socialLogin,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};