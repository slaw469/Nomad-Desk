// app/components/LoginSignup/WrappedLSPage.tsx - FIXED: Remove duplicate AuthProvider
import React from 'react';
import LSpage from './LSutils/LSpage';

/**
 * This component now just renders LSpage directly since AuthProvider 
 * is already provided at the top level in main.tsx
 */
const WrappedLSPage: React.FC = () => {
  return <LSpage />;
};

export default WrappedLSPage;