// LSHeader.tsx
import React from 'react';
import Logo from './Logo';

const LSHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-5 md:px-20 bg-white shadow-sm">
      <Logo />
    </header>
  );
};
export default LSHeader;