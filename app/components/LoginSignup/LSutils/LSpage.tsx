// app/components/LoginSignup/LSutils/LSpage.tsx
import React, { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import styles from '../../../styles/loginSignup.module.css';
import { useAuth } from '../../../contexts/AuthContext';

const LSPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Get current path and set initial tab accordingly
  const currentPath = router.state.location.pathname;
  const initialTab = currentPath === '/signup' ? 'signup' : 'login';

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
        <AuthContainer initialTab={initialTab} />
      </div>
    </div>
  );
};

export default LSPage;
