// app/components/LoginSignup/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import Divider from './Divider';
import SocialButton from './SocialButton';
import styles from '../../styles/loginSignup.module.css';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const {
    login, socialLogin, isLoading, error, clearError,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  // Clear form error when auth context error changes
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');

    // Basic validation
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      await login({ email, password, rememberMe });
    } catch (err) {
      // Error is handled by the auth context and displayed via the error state
    }
  };

  const handleSocialLoginClick = (provider: string) => {
    clearError();
    setFormError('');
    socialLogin(provider);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {formError && (
        <div className={styles.formError}>
          {formError}
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

      {/* Only include Google button */}
      <div className={styles.socialButtons}>
        <SocialButton
          provider="google"
          disabled={isLoading}
          onClick={() => handleSocialLoginClick('google')}
        />
      </div>

      <div className={styles.accountText}>
        Don't have an account?
        {' '}
        <a
          href="#"
          className={styles.formLink}
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) {
              clearError();
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
