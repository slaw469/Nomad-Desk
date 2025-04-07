import React from 'react';

const AuthImage: React.FC = () => {
  return (
    <div className="auth-image">
      <div className="auth-image-pattern"></div>
      <div className="auth-image-content">
        <h2 className="auth-image-title">Find Your Perfect Workspace</h2>
        <p className="auth-image-text">
          Join thousands of students and remote workers discovering productive spaces tailored to their needs.
        </p>
      </div>
    </div>
  );
};

export default AuthImage;