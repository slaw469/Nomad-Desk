// app/components/LoginSignup/AuthContainer.tsx
import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm';
import styles from '../../../styles/loginSignup.module.css';

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  return (
    <div className={styles.container}>
      {/* The AuthImage component will be on the left in row layout */}
      <AuthImage />
      
      {/* The form container will be on the right in row layout */}
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
              onSwitchToSignup={() => setActiveTab('signup')}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;