// src/App.tsx
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default App;