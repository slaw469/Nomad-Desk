// app/components/LoginSignup/WrappedLSPage.tsx
import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import LSpage from './LSutils/LSpage';

/**
 * This component wraps the LSpage with its own AuthProvider
 * to ensure auth context is available for login/signup functionality
 */
const WrappedLSPage: React.FC = () => {
  return (
    <AuthProvider>
      <LSpage />
    </AuthProvider>
  );
};

export default WrappedLSPage;