// app/components/LoginSignup/LSutils/SignupForm.tsx
import React, { useState, useEffect } from 'react';
import Divider from '../Divider';
import SocialButton from '../SocialButton';
import styles from '../../../styles/loginSignup.module.css';
import { useAuth } from '../../../contexts/AuthContext';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const {
    signup, socialLogin, isLoading, error, clearError,
  } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formError, setFormError] = useState('');

  // Update error from auth context
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');

    // Basic validation
    if (!passwordsMatch) {
      setFormError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setFormError('You must agree to the terms of service');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup({ name, email, password });
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
        <label htmlFor="signup-name" className={styles.formLabel}>
          Full Name
        </label>
        <input
          type="text"
          id="signup-name"
          className={styles.formInput}
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-email" className={styles.formLabel}>
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          className={styles.formInput}
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-password" className={styles.formLabel}>
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          className={styles.formInput}
          placeholder="At least 6 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-confirm-password" className={styles.formLabel}>
          Confirm Password
        </label>
        <input
          type="password"
          id="signup-confirm-password"
          className={`${styles.formInput} ${!passwordsMatch ? styles.formInputError : ''}`}
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        {!passwordsMatch && (
          <span className={styles.formError}>Passwords do not match</span>
        )}
      </div>

      <div className={styles.formCheckboxGroup}>
        <input
          type="checkbox"
          id="terms"
          className={styles.formCheckbox}
          required
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          disabled={isLoading}
        />
        <label htmlFor="terms">
          I agree to the
          {' '}
          <a href="#" className={styles.formLink}>Terms of Service</a>
          {' '}
          and
          {' '}
          <a href="#" className={styles.formLink}>Privacy Policy</a>
        </label>
      </div>

      <button
        type="submit"
        className={`${styles.btn} ${styles.btnPrimary}`}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
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
        Already have an account?
        {' '}
        <a
          href="#"
          className={styles.formLink}
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) {
              clearError();
              onSwitchToLogin();
            }
          }}
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default SignupForm;
