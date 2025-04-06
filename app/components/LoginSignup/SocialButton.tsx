// SocialButton.tsx
import React from 'react';

interface SocialButtonProps {
  provider: 'google' | 'facebook';
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onClick }) => {
  return (
    <button 
      type="button" 
      className="flex-1 flex items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5"
      onClick={onClick}
    >
      {provider === 'google' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.66 15.63 16.89 16.795 15.72 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.72 17.575C14.74 18.235 13.48 18.625 12 18.625C9.13 18.625 6.72 16.73 5.81 14.155H2.13V16.995C3.94 20.555 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.81 14.155C5.59 13.495 5.47 12.795 5.47 12.075C5.47 11.355 5.6 10.655 5.81 9.995V7.155H2.13C1.41 8.675 1 10.335 1 12.075C1 13.815 1.41 15.475 2.13 16.995L5.81 14.155Z" fill="#FBBC05"/>
          <path d="M12 5.525C13.62 5.525 15.06 6.09 16.21 7.17L19.36 4.02C17.46 2.26 14.97 1.155 12 1.155C7.7 1.155 3.94 3.6 2.13 7.155L5.81 9.995C6.72 7.42 9.13 5.525 12 5.525Z" fill="#EA4335"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z" fill="#1877F2"/>
        </svg>
      )}
      {provider === 'google' ? 'Google' : 'Facebook'}
    </button>
  );
};

export default SocialButton;