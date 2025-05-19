import React from 'react';
import styles from '../../styles/loginSignup.module.css';

const Divider: React.FC = () => {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine}></div>
      <div className={styles.dividerText}>OR</div>
      <div className={styles.dividerLine}></div>
    </div>
  );
};

export default Divider;