import React from 'react';
import { Link } from '@tanstack/react-router';
import styles from '../../styles/loginSignup.module.css';

const LSHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <svg className={styles.logoIcon} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15H35V35H15V15Z" fill="white"/>
            <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC"/>
            <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF"/>
            <path d="M35 35L25 25L35 15V35Z" fill="white"/>
          </svg>
          <span className={styles.logoText}>NOMAD DESK</span>
        </Link>
      </div>
    </header>
  );
};

export default LSHeader;