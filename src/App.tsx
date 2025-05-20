// src/App.tsx - Add AuthProvider here instead
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AuthProvider } from '../app/contexts/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Outlet />
      </div>
    </AuthProvider>
  );
};

export default App;