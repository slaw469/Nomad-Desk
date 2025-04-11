import React, { useState, useEffect } from 'react';
import { AuthFormProps } from '../LSutils/types';
import Divider from '../Divider';
import SocialButton from '../SocialButton';
import styles from '../../../styles/loginSignup.module.css';

interface SignupFormProps extends AuthFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    // Validate passwords when either password field changes
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      return;
    }
    
    onSubmit({ name, email, password, agreeToTerms });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
          placeholder="At least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        />
        <label htmlFor="terms">
          I agree to the <a href="#" className={styles.formLink}>Terms of Service</a> and <a href="#" className={styles.formLink}>Privacy Policy</a>
        </label>
      </div>
      
      <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
        Create Account
      </button>
      
      <Divider />
      
      <div className={styles.socialButtons}>
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className={styles.accountText}>
        Already have an account?{' '}
        <a 
          href="#" 
          className={styles.formLink}
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
          }}
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default SignupForm;