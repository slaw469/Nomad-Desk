// src/App.tsx - FIXED: Remove AuthProvider from here
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import './App.css';

const App: React.FC = () => (
  <div className="app-container">
    <Outlet />
  </div>
);

export default App;
