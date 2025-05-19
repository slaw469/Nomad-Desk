// app/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Save the current path to redirect back after login
      const currentPath = routerState.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // Redirect to login
      navigate({ to: '/login' });
    }
  }, [navigate, routerState.location.pathname]);

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // You can render a loading state here if you want
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;