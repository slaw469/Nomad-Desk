import React from 'react';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import styles from '../../../styles/loginSignup.module.css';
import { useRouter } from '@tanstack/react-router';

const LSPage: React.FC = () => {
  const router = useRouter();
  const isSignupPage = router.state.location.pathname === '/signup';

  return (
    <div className={styles.page}>
      <LSHeader />
      <div className={styles.content}>
        <AuthContainer />
        {isSignupPage ? (
          <div className={styles.pageInfo}>
            <p>Join NomadDesk today to find the perfect workspace for your needs.</p>
          </div>
        ) : (
          <div className={styles.pageInfo}>
            <p>Welcome back to NomadDesk. Log in to access your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LSPage;