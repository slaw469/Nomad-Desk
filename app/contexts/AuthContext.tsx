// app/contexts/AuthContext.tsx - UPDATED BACKEND URL
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

// Create a default value for the context
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => { throw new Error('Auth provider not initialized'); },
  signup: async () => { throw new Error('Auth provider not initialized'); },
  logout: () => {},
  socialLogin: async () => { throw new Error('Auth provider not initialized'); },
  clearError: () => {}
};

// Create context with default value
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
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
    window.location.href = path;
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
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
      
      // Always set loading to false, even if token verification fails
      setIsLoading(false);
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

  const value = {
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

export default AuthContext;