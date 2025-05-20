// app/components/LoginSignup/LSutils/AuthContainer.tsx
import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm';
import styles from '../../../styles/loginSignup.module.css';

interface AuthContainerProps {
  initialTab?: 'login' | 'signup';
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
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