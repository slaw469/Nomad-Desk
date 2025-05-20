// app/components/LoginSignup/OAuthCallback.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Loading from '../Common/Loading';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processOAuthResponse = () => {
      // Get URL parameters
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userStr = params.get('user');
      const errorMsg = params.get('error');
      
      if (errorMsg) {
        setError(decodeURIComponent(errorMsg));
        setTimeout(() => {
          navigate({ to: '/login' });
        }, 3000);
        return;
      }
      
      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          
          // Store auth info in local storage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Redirect to dashboard or saved redirect path
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
          localStorage.removeItem('redirectAfterLogin');
          navigate({ to: redirectPath });
        } catch (error) {
          console.error('Error processing OAuth response:', error);
          setError('Failed to process authentication response');
        }
      } else {
        // If no token or user, redirect to login
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate({ to: '/login' });
        }, 3000);
      }
    };
    
    processOAuthResponse();
  }, [navigate]);
  
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }
  
  return <Loading message="Processing authentication..." fullScreen={true} />;
};

export default OAuthCallback;