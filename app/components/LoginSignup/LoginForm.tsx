// LoginForm.tsx
import React, { useState } from 'react';
import { AuthFormProps } from '../../components/LoginSignup/LSutils/types';
import Divider from '../../components/LoginSignup/Divider';
import SocialButton from '../../components/LoginSignup/SocialButton';

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
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="login-email"
          className="form-input"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          className="form-input"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="form-checkbox-group">
        <input
          type="checkbox"
          id="remember"
          className="form-checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="remember">Remember me</label>
        <a href="#" className="form-link forgot-password">
          Forgot Password?
        </a>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
      
      <Divider />
      
      <div className="social-buttons">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className="account-text">
        Don't have an account?{' '}
        <a 
          href="#" 
          className="form-link"
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