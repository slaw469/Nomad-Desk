// Logo.tsx
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <svg className="w-10 h-10 mr-2" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 15H35V35H15V15Z" fill="white" />
        <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC" />
        <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF" />
        <path d="M35 35L25 25L35 15V35Z" fill="white" />
      </svg>
      <span className="text-2xl font-bold text-gray-800 tracking-wider">NOMAD DESK</span>
    </div>
  );
};

export default Logo;