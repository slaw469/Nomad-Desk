import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm';
import styles from '../../../styles/loginSignup.module.css';

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
    <div className={styles.container}>
      <AuthImage />
      
      <div className={styles.formContainer}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>
        
        <div>
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