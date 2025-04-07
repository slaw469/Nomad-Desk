import React from 'react';
import LSHeader from '../LSHeader';
import AuthContainer from './AuthContainer';
import '../../../styles/login-signup.css';
const LSpage: React.FC = () => {
  return (
    <div className="ls-page">
      <LSHeader />
      <div className="ls-content">
        <AuthContainer />
      </div>
    </div>
  );
};

export default LSpage;
// This component serves as a layout for the login/signup page.