import { Outlet } from '@tanstack/react-router';

// This component will serve as the root layout for all routes
export default function RootLayout() {
  return (
    <>
      {/* You could add global elements here that appear on all pages */}
      <Outlet />
      {/* You could add a global footer here if needed */}
    </>
  );
}
