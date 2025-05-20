// app/components/LoginSignup/LSutils/LSpage.tsx
import React, { useEffect } from 'react';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import styles from '../../../styles/loginSignup.module.css';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '../../../contexts/AuthContext';

const LSPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isSignupPage = router.state.location.pathname === '/signup';

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      router.navigate({ to: redirectPath });
    }
  }, [isAuthenticated, router]);

  return (
    <div className={styles.page}>
      <LSHeader />
      <div className={styles.content}>
        <AuthContainer />
      </div>
    </div>
  );
};

export default LSPage;