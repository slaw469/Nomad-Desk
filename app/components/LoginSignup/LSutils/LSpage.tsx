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
      
          </div>
        ) : (
          <div className={styles.pageInfo}>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default LSPage;