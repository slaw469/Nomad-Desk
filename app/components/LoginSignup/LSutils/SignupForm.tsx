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
    <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="signup-name" className="block mb-2 font-medium text-gray-800">
          Full Name
        </label>
        <input
          type="text"
          id="signup-name"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="signup-email" className="block mb-2 font-medium text-gray-800">
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="signup-password" className="block mb-2 font-medium text-gray-800">
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
          placeholder="At least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="signup-confirm-password" className="block mb-2 font-medium text-gray-800">
          Confirm Password
        </label>
        <input
          type="password"
          id="signup-confirm-password"
          className={`w-full p-3 border rounded-lg text-sm transition-all duration-300 focus:outline-none focus:shadow-outline-blue ${
            passwordsMatch ? 'border-gray-200 focus:border-blue-500' : 'border-red-500 focus:border-red-500'
          }`}
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!passwordsMatch && (
          <span className="text-red-500 text-xs mt-1">Passwords do not match</span>
        )}
      </div>
      
      <div className="flex items-center mb-5">
        <input
          type="checkbox"
          id="terms"
          required
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="terms">
          I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
        </label>
      </div>
      
      <button 
        type="submit" 
        className="bg-gradient-to-r from-blue-600 to-teal-400 text-white border-none rounded-lg py-3.5 px-5 font-semibold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg mt-2.5"
      >
        Create Account
      </button>
      
      <Divider />
      
      <div className="flex gap-4 md:flex-row flex-col">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className="text-center mt-5 text-sm">
        Already have an account?{' '}
        <a 
          href="#" 
          className="text-blue-600 font-semibold hover:underline"
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