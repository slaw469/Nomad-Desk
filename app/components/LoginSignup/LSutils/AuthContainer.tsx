import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm';

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleLoginSubmit = (data: any) => {
    // Add login logic here
    alert('Login successful! Redirecting to dashboard...');
    console.log('Login data:', data);
  };

  const handleSignupSubmit = (data: any) => {
    // Add signup logic here
    alert('Account created successfully! Please check your email to verify your account.');
    console.log('Signup data:', data);
    setActiveTab('login'); // Switch to login tab after successful signup
  };

  return (
    <div className="auth-container">
      <AuthImage />
      
      <div className="auth-form-container">
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </div>
          <div 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>
        
        <div className="form-container">
          {activeTab === 'login' ? (
            <LoginForm 
              onSubmit={handleLoginSubmit} 
              onSwitchToSignup={() => setActiveTab('signup')} 
            />
          ) : (
            <SignupForm 
              onSubmit={handleSignupSubmit} 
              onSwitchToLogin={() => setActiveTab('login')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;