import React from 'react';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import styles from '../../../styles/loginSignup.module.css';

const LSPage: React.FC = () => {
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