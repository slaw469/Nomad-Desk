// app/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface User {
  email?: string;
  name?: string;
  provider?: string;
  [key: string]: any; // Allow any additional properties
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: string) => Promise<void>;
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
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call with a delay
      // Replace this with your actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication info
      localStorage.setItem('isAuthenticated', 'true');
      const userData = { email: data.email, name: data.email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful login
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call with a delay
      // Replace this with your actual user registration logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store authentication info
      localStorage.setItem('isAuthenticated', 'true');
      const userData = { email: data.email, name: data.name };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful signup
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate API call with a delay
      // Replace this with your actual social authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication info
      localStorage.setItem('isAuthenticated', 'true');
      const userData = { provider, name: `${provider} User` };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Navigate to dashboard after successful social login
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate({ to: '/' });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    socialLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;