// app/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { authService, LoginData, SignupData } from '../services/api';

interface User {
  id?: string;
  email?: string;
  name?: string;
  provider?: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token validity by getting current user
          const userData = await authService.getCurrentUser(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          // If token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
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
      navigate({ to: '/dashboard' });
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
      navigate({ to: '/dashboard' });
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

  // Social login placeholder - replace with actual social auth logic
  const socialLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Placeholder for social login - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { provider, name: `${provider} User`, id: Date.now().toString() };
      
      // For demo purposes, store mock auth info
      localStorage.setItem('token', 'mock-social-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful social login
      navigate({ to: '/dashboard' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An error occurred during ${provider} login`);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectAfterLogin');
    
    setUser(null);
    setIsAuthenticated(false);
    navigate({ to: '/' });
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