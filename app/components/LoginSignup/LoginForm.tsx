import React, { useState } from 'react';
import Divider from './Divider';
import SocialButton from './SocialButton';
import styles from '../../styles/loginSignup.module.css';

interface LoginFormProps {
  onSubmit: (data: any) => void | Promise<void>;
  onSwitchToSignup: () => void;
  isLoading?: boolean;
  onSocialLogin?: (provider: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onSwitchToSignup,
  isLoading = false,
  onSocialLogin 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await onSubmit({ email, password, rememberMe });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.formError}>
          {error}
        </div>
      )}
      
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      
      <div className={styles.formCheckboxGroup}>
        <input
          type="checkbox"
          id="remember"
          className={styles.formCheckbox}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLoading}
        />
        <label htmlFor="remember">Remember me</label>
        <a href="#" className={`${styles.formLink} ${styles.forgotPassword}`}>
          Forgot Password?
        </a>
      </div>
      
      <button 
        type="submit" 
        className={`${styles.btn} ${styles.btnPrimary}`}
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      
      <Divider />
      
      <div className={styles.socialButtons}>
        <SocialButton 
          provider="google" 
          disabled={isLoading}
          onClick={() => onSocialLogin && onSocialLogin('google')}
        />
        <SocialButton 
          provider="facebook" 
          disabled={isLoading}
          onClick={() => onSocialLogin && onSocialLogin('facebook')}
        />
      </div>
      
      <div className={styles.accountText}>
        Don't have an account?{' '}
        <a 
          href="#" 
          className={styles.formLink}
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) {
              onSwitchToSignup();
            }
          }}
        >
          Sign up now
        </a>
      </div>
    </form>
  );
};

export default LoginForm;