import React from 'react';
import { Outlet, Link } from '@tanstack/react-router';

// This component will handle any fallback routes or route structuring
export default function IndexRoute() {
  return (
    <div>
      <Outlet />
      
      {/* This could be a 404 page if needed */}
      <div style={{ display: 'none' }}>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">Go back to home</Link>
      </div>
    </div>
  );
}