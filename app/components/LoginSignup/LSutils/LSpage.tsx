import React from 'react';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import '../../../styles/login-signup.css';
const LSpage: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <LSHeader />
      <div className="flex-1 flex items-center justify-center p-5 md:p-10">
        <AuthContainer />
      </div>
    </div>
  );
};

export default LSpage;
// This component serves as a layout for the login/signup page.