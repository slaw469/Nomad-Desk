// Divider.tsx
import React from 'react';

const Divider: React.FC = () => {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-200"></div>
      <div className="px-4 text-sm text-gray-400">OR</div>
      <div className="flex-1 h-px bg-gray-200"></div>
    </div>
  );
};

export default Divider;