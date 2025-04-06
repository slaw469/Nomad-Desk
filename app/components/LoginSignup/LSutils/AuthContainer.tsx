import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from '../LoginForm';
import SignupForm from './SignupForm'; // Adjusted the path to match the correct location

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleLoginSubmit = (data: any) => {
    // Add login logic here
    alert('Login successful! Redirecting to dashboard...');
    console.log('Login data:', data);
  };

  const handleSignupSubmit = (data: any) => {
    // Add signup logic here
    alert('Account created successfully! Please check your email to verify your account.');
    console.log('Signup data:', data);
    setActiveTab('login'); // Switch to login tab after successful signup
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-[900px] flex overflow-hidden min-h-[600px] md:flex-row flex-col">
      <AuthImage />
      
      <div className="flex-1 p-10 flex flex-col">
        <div className="flex mb-8">
          <div 
            className={`flex-1 py-3 text-center font-semibold cursor-pointer border-b-2 transition-all duration-300 ${
              activeTab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-600 hover:opacity-70'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </div>
          <div 
            className={`flex-1 py-3 text-center font-semibold cursor-pointer border-b-2 transition-all duration-300 ${
              activeTab === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-600 hover:opacity-70'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>
        
        <div className="form-container flex-1 flex flex-col">
          {activeTab === 'login' ? (
            <LoginForm 
              onSubmit={handleLoginSubmit} 
              onSwitchToSignup={() => setActiveTab('signup')} 
            />
          ) : (
            <SignupForm 
              onSubmit={handleSignupSubmit} 
              onSwitchToLogin={() => setActiveTab('login')} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;