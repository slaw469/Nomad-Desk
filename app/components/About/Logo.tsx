import React from 'react';
import './aboutstyles/Logo.css';

interface LogoProps {
  dark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ dark = false }) => (
  <svg className="logo" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 15H35V35H15V15Z" fill={dark ? '#1C2536' : 'white'} />
    <path d="M15 15L25 25L35 15L25 5L15 15Z" fill="#4A6FDC" />
    <path d="M15 35L25 25L15 15V35Z" fill="#2DD4BF" />
    <path d="M35 35L25 25L35 15V35Z" fill={dark ? '#1C2536' : 'white'} />
  </svg>
);

export default Logo;
