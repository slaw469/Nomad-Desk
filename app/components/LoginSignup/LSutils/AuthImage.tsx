import React from 'react';

const AuthImage: React.FC = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 to-teal-400 p-10 flex flex-col justify-center items-center text-white relative md:min-h-[600px] min-h-[200px]">
      <h2 className="text-2xl mb-4 text-center relative z-10">Find Your Perfect Workspace</h2>
      <p className="text-base text-center max-w-xs mb-8 leading-relaxed relative z-10">
        Join our community of students, freelancers, and professionals finding great places to study and work.
      </p>
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-20" 
        style={{ 
          backgroundImage: `url("/api/placeholder/400/600")`
        }} 
      />
    </div>
  );
};

export default AuthImage;