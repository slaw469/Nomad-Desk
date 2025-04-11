import React from 'react';
import styles from '../../../styles/loginSignup.module.css';

const AuthImage: React.FC = () => {
  return (
    <div className={styles.image}>
      <div className={styles.imagePattern}></div>
      <div className={styles.imageContent}>
        <h2 className={styles.imageTitle}>Find Your Perfect Workspace</h2>
        <p className={styles.imageText}>
          Join thousands of students and remote workers discovering productive spaces tailored to their needs.
        </p>
      </div>
    </div>
  );
};

export default AuthImage;