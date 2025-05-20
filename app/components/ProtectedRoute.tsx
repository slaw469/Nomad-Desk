// app/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated after loading
    if (!isLoading && !isAuthenticated) {
      // Save the current path to redirect back after login
      const currentPath = routerState.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // Redirect to login
      navigate({ to: '/login' });
    }
  }, [navigate, routerState.location.pathname, isAuthenticated, isLoading]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading message="Checking authentication..." fullScreen={true} />;
  }
  
  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return <Loading message="Redirecting to login..." fullScreen={true} />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;