import React, { useState } from 'react';
import { AuthFormProps } from './LSutils/types';
import Divider from './Divider';
import SocialButton from './SocialButton';
import styles from '../../styles/loginSignup.module.css';

interface LoginFormProps extends AuthFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, rememberMe });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="login-email" className={styles.formLabel}>
          Email Address
        </label>
        <input
          type="email"
          id="login-email"
          className={styles.formInput}
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="login-password" className={styles.formLabel}>
          Password
        </label>
        <input
          type="password"
          id="login-password"
          className={styles.formInput}
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className={styles.formCheckboxGroup}>
        <input
          type="checkbox"
          id="remember"
          className={styles.formCheckbox}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember">Remember me</label>
        <a href="#" className={`${styles.formLink} ${styles.forgotPassword}`}>
          Forgot Password?
        </a>
      </div>
      
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Sign In
      </button>
      
      <Divider />
      
      <div className={styles.socialButtons}>
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className={styles.accountText}>
        Don't have an account?{' '}
        <a 
          href="#" 
          className={styles.formLink}
          onClick={(e) => {
            e.preventDefault();
            onSwitchToSignup();
          }}
        >
          Sign up now
        </a>
      </div>
    </form>
  );
};

export default LoginForm;