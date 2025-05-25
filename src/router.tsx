// src/router.tsx - UPDATED: Add OAuth success route
import { Router, Route, RootRoute, ErrorComponent } from '@tanstack/react-router';
import React from 'react';
import App from './App';
import LandingPage from '../app/components/LandingPageComponents/components/LandingPage';
import WorkspaceList from '../app/components/workspaces/WorkSpaceIndex';
import WorkspaceDetail from '../app/components/workspaces/$workspaceId/WSindex';
import WorkspaceSearchPage from '../app/components/workspaces/WorkspaceSearchPage';
import MapWorkspaceDetail from '../app/components/workspaces/MapWorkspaceDetail';
import FeaturesPage from '../app/components/Features/FeaturesPage';
import Dashboard from '../app/components/dashboard/Dashboard';
import Profile from '../app/components/Profile/Profile';
import Favorites from '../app/components/Favorites/Favorites';
import Settings from '../app/components/dashboard/sidebar/Settings';
import Notifications from '../app/components/dashboard/sidebar/Notifications';
import Network from '../app/components/dashboard/sidebar/Network';
import WrappedLSPage from '../app/components/LoginSignup/WrappedLSPage';
import OAuthSuccess from '../app/components/LoginSignup/OAuthSuccess';
import NomadDeskAbout from '../app/components/About/NomadDeskAbout';
import ProtectedRoute from '../app/components/ProtectedRoute';
import '../app/styles/font-fix.css';

// Error boundary component for routes
const RouteErrorComponent = ({ error }: { error: Error }) => {
  console.error('Route error:', error);
  
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      color: 'red',
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>Something went wrong</h1>
      <p>We're sorry, but something unexpected happened.</p>
      <details style={{ marginTop: '20px', textAlign: 'left' }}>
        <summary>Error details</summary>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '600px',
          overflow: 'auto'
        }}>
          {error.message}
        </pre>
      </details>
      <button 
        onClick={() => window.location.reload()} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4A6FDC',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
};

// Placeholder component for routes that don't have components yet
const PlaceholderPage = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Coming Soon</h1>
    <p>This page is under construction.</p>
  </div>
);

// Define the root route with error boundary
const rootRoute = new RootRoute({
  component: App,
  errorComponent: RouteErrorComponent,
  notFoundComponent: () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: '#4A6FDC', textDecoration: 'underline' }}>
        Go back to home
      </a>
    </div>
  ),
});

// Define the index route (landing page)
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
  errorComponent: RouteErrorComponent,
});

// Define the dashboard route (protected)
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Define all the other protected routes
const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const favoritesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: () => (
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const notificationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const networkRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/network',
  component: () => (
    <ProtectedRoute>
      <Network />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Workspace routes
const workspacesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/workspaces',
  component: () => (
    <ProtectedRoute>
      <WorkspaceList />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/workspaces/$workspaceId',
  component: () => (
    <ProtectedRoute>
      <WorkspaceDetail />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const workspaceSearchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: () => (
    <ProtectedRoute>
      <WorkspaceSearchPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const mapWorkspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/workspaces/map/$placeId',
  component: () => (
    <ProtectedRoute>
      <MapWorkspaceDetail />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Define additional public routes
const howItWorksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: PlaceholderPage,
  errorComponent: RouteErrorComponent,
});

const featuresRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: FeaturesPage,
  errorComponent: RouteErrorComponent,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: NomadDeskAbout,
  errorComponent: RouteErrorComponent,
});

// Auth routes - These should NOT be wrapped in ProtectedRoute
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: WrappedLSPage,
  errorComponent: RouteErrorComponent,
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: WrappedLSPage,
  errorComponent: RouteErrorComponent,
});

// NEW: OAuth success route with search schema
const oauthSuccessRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/oauth-success',
  component: OAuthSuccess,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: search.token as string,
      user: search.user as string,
      error: search.error as string,
    }
  },
  errorComponent: RouteErrorComponent,
});

const createGroupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create-group',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Study sessions routes
const studySessionsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/study-sessions',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const createStudySessionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/study-sessions/create',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const studySessionDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/study-sessions/$sessionId',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Messages routes
const messagesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const messageDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/messages/$userId',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Create the route tree using the routes (ADDED oauthSuccessRoute)
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  profileRoute,
  favoritesRoute,
  settingsRoute,
  notificationsRoute,
  networkRoute,
  workspacesRoute,
  workspaceDetailRoute,
  workspaceSearchRoute,
  mapWorkspaceDetailRoute,
  howItWorksRoute,
  featuresRoute,
  aboutRoute,
  loginRoute,
  signupRoute,
  oauthSuccessRoute, // NEW ROUTE
  createGroupRoute,
  studySessionsRoute,
  createStudySessionRoute,
  studySessionDetailRoute,
  messagesRoute,
  messageDetailRoute,
]);

// Create the router with error handling
export const router = new Router({ 
  routeTree,
  defaultErrorComponent: RouteErrorComponent,
  context: undefined,
});

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}