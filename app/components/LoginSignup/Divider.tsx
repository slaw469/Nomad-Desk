import React from 'react';
import styles from '../../styles/loginSignup.module.css';

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <div className={styles.dividerLine} />
    <div className={styles.dividerText}>OR</div>
    <div className={styles.dividerLine} />
  </div>
);

export default Divider;
