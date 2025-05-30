// app/components/LoginSignup/OAuthSuccess.tsx - FIXED WITH AUTH CONTEXT REFRESH
import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../Common/Loading';

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { clearError } = useAuth(); // Get clearError from auth context
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    console.log('\n🔵 === OAUTH SUCCESS COMPONENT MOUNTED ===');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔍 Search params:', window.location.search);

    const processOAuthResponse = () => {
      try {
        console.log('\n🔍 === PROCESSING OAUTH RESPONSE ===');

        // Use URLSearchParams to get query parameters directly
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userStr = urlParams.get('user');
        const errorMsg = urlParams.get('error');

        console.log('🔑 Token found:', !!token);
        console.log('🔑 Token length:', token ? token.length : 0);
        console.log('👤 User data found:', !!userStr);
        console.log('👤 User data length:', userStr ? userStr.length : 0);
        console.log('❌ Error found:', errorMsg);

        if (errorMsg) {
          console.log('❌ Error in URL params:', errorMsg);
          setError(decodeURIComponent(errorMsg));
          console.log('🔄 Redirecting to login in 3 seconds...');
          setTimeout(() => {
            navigate({ to: '/login' });
          }, 3000);
          return;
        }

        if (token && userStr) {
          console.log('\n📦 === PROCESSING USER DATA ===');
          try {
            console.log('🔓 Decoding user data...');
            const decodedUserStr = decodeURIComponent(userStr);
            console.log('📝 Decoded user string:', decodedUserStr);

            const user = JSON.parse(decodedUserStr);
            console.log('✅ User data parsed successfully:', user);

            console.log('\n💾 === STORING AUTH DATA ===');
            // Store auth info in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('✅ Token stored in localStorage');
            console.log('✅ User data stored in localStorage');

            // Verify storage
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            console.log('🔍 Verification - Token stored:', !!storedToken);
            console.log('🔍 Verification - User stored:', !!storedUser);

            // Clear any existing auth errors
            clearError();

            // Get redirect path or default to dashboard
            const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
            localStorage.removeItem('redirectAfterLogin');

            console.log('\n🎯 === PREPARING REDIRECT ===');
            console.log('📍 Redirect path:', redirectPath);
            console.log('⏰ Redirect delay: 500ms');

            // SHORTER delay and force a page reload to refresh auth context
            setTimeout(() => {
              console.log('🚀 Executing redirect to:', redirectPath);

              // Force a full page navigation to ensure AuthContext refreshes
              window.location.href = redirectPath;
            }, 500);
          } catch (parseError) {
            console.error('❌ Error parsing user data:');

            // Type narrowing for parseError
            if (parseError instanceof Error) {
              console.error('Parse error message:', parseError.message);
              console.error('Parse error stack:', parseError.stack);
            } else {
              console.error('Unknown parse error:', parseError);
            }

            console.error('📝 Raw user string:', userStr);
            setError('Failed to process authentication response');
          }
        } else {
          console.error('\n❌ === MISSING AUTH DATA ===');
          console.error('🔑 Token present:', !!token);
          console.error('👤 User data present:', !!userStr);
          console.error('📍 Current URL:', window.location.href);
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            console.log('🔄 Redirecting to login due to missing data...');
            navigate({ to: '/login' });
          }, 3000);
        }
      } catch (err) {
        console.error('\n❌ === OAUTH PROCESSING ERROR ===');
        console.error('Error:', err);

        // Type narrowing for the error
        if (err instanceof Error) {
          console.error('Stack:', err.stack);
          console.error('Message:', err.message);
        } else {
          console.error('Unknown error type:', typeof err);
        }

        setError('An unexpected error occurred during authentication');
        setTimeout(() => {
          navigate({ to: '/login' });
        }, 3000);
      } finally {
        console.log('\n🏁 === PROCESSING COMPLETE ===');
        setIsProcessing(false);
      }
    };

    processOAuthResponse();
  }, [navigate, clearError]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8fafc',
      }}
      >
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          maxWidth: '400px',
        }}
        >
          <h2 style={{ color: '#EF4444', marginBottom: '10px' }}>❌ Authentication Error</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #4A6FDC 0%, #2DD4BF 100%)',
      }}
      >
        <div style={{
          backgroundColor: 'white',
          color: '#333',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          maxWidth: '400px',
        }}
        >
          <div style={{
            color: '#10B981', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px',
          }}
          >
            ✅ Authentication Successful!
          </div>
          <div style={{ fontSize: '18px', margin: '20px 0' }}>
            Processing your login...
          </div>
          <Loading message="" />
          <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>
            You'll be redirected to your dashboard shortly.
          </p>
        </div>
      </div>
    );
  }

  return <Loading message="Completing authentication..." fullScreen />;
};

export default OAuthSuccess;
