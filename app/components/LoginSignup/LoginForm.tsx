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
    <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="login-email" className="block mb-2 font-medium text-gray-800">
          Email Address
        </label>
        <input
          type="email"
          id="login-email"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="mb-5">
        <label htmlFor="login-password" className="block mb-2 font-medium text-gray-800">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="flex items-center mb-5">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="remember">Remember me</label>
        <a href="#" className="ml-auto text-blue-600 text-sm hover:underline">
          Forgot Password?
        </a>
      </div>
      
      <button 
        type="submit" 
        className="bg-gradient-to-r from-blue-600 to-teal-400 text-white border-none rounded-lg py-3.5 px-5 font-semibold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg mt-2.5"
      >
        Sign In
      </button>
      
      <Divider />
      
      <div className="flex gap-4 md:flex-row flex-col">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
      
      <div className="text-center mt-5 text-sm">
        Don't have an account?{' '}
        <a 
          href="#" 
          className="text-blue-600 font-semibold hover:underline"
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