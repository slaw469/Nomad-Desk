// SignupForm.tsx
import React, { useState, useEffect } from 'react';
import { AuthFormProps } from './types';
import Divider from '../Divider';
import SocialButton from '../SocialButton';
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
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="signup-name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="signup-name"
          className="form-input"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          className="form-input"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          className="form-input"
          placeholder="At least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-confirm-password" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          id="signup-confirm-password"
          className={`form-input ${!passwordsMatch ? 'error' : ''}`}
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!passwordsMatch && (
          <span className="form-error">Passwords do not match</span>
        )}
      </div>
      
      <div className="form-checkbox-group">
        <input
          type="checkbox"
          id="terms"
          className="form-checkbox"
          required
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <label htmlFor="terms">
          I agree to the <a href="#" className="form-link">Terms of Service</a> and <a href="#" className="form-link">Privacy Policy</a>
        </label>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Create Account
      </button>
      
      <Divider />
      
      <div className="social-buttons">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className="account-text">
        Already have an account?{' '}
        <a 
          href="#" 
          className="form-link"
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