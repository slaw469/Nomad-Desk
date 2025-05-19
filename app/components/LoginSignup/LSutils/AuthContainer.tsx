import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm';
import styles from '../../../styles/loginSignup.module.css';

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      // Replace this with your actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Login data:', data);
      
      // Store authentication info in localStorage or sessionStorage
      // This is a simplified example - use a more secure approach in production
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ 
        email: data.email,
        name: data.email.split('@')[0] // Just as an example
      }));
      
      // Navigate to dashboard after successful login
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      // Replace this with your actual user registration logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup data:', data);
      
      // Store authentication info in localStorage or sessionStorage
      // This is a simplified example - use a more secure approach in production
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ 
        email: data.email, 
        name: data.name 
      }));
      
      // Option 1: Auto-login and redirect to dashboard
      navigate({ to: '/dashboard' });
      
      // Option 2: Just switch to login tab after successful signup
      // setActiveTab('login');
      // alert('Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      console.error('Signup error:', error);
      // Handle signup error (show message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call with a delay
      // Replace this with your actual social authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Login with ${provider}`);
      
      // Store authentication info in localStorage or sessionStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ 
        provider,
        name: `${provider} User` // Just as an example
      }));
      
      // Navigate to dashboard after successful social login
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      // Handle login error (show message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AuthImage />
      
      <div className={styles.formContainer}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
            onClick={() => !isLoading && setActiveTab('login')}
            style={isLoading ? { cursor: 'not-allowed' } : {}}
          >
            Login
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => !isLoading && setActiveTab('signup')}
            style={isLoading ? { cursor: 'not-allowed' } : {}}
          >
            Sign Up
          </div>
        </div>
        
        <div>
          {activeTab === 'login' ? (
            <LoginForm 
              onSubmit={handleLoginSubmit} 
              onSwitchToSignup={() => setActiveTab('signup')}
              isLoading={isLoading}
              onSocialLogin={handleSocialLogin}
            />
          ) : (
            <SignupForm 
              onSubmit={handleSignupSubmit}
              onSwitchToLogin={() => setActiveTab('login')}
              isLoading={isLoading}
              onSocialLogin={handleSocialLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;