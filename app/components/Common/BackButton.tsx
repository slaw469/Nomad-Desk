// app/components/Common/BackButton.tsx
import React from 'react';
import { useNavigate } from '@tanstack/react-router';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  fallbackPath = '/search', 
  className = '',
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to specified path if no history
      navigate({ to: fallbackPath });
    }
  };

  const defaultStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#4B5563',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    marginBottom: '20px'
  };

  const hoverStyles = {
    backgroundColor: '#F1F5F9',
    borderColor: '#4A6FDC',
    color: '#4A6FDC',
    transform: 'translateY(-1px)'
  };

  return (
    <button 
      onClick={handleBack}
      className={className}
      style={defaultStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, defaultStyles);
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M19 12H5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M12 19l-7-7 7-7" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {children || 'Back'}
    </button>
  );
};

export default BackButton;