// src/router.tsx
import { Router, Route, RootRoute } from '@tanstack/react-router';
import React from 'react';
import App from './App';
import LandingPage from '../app/components/LandingPageComponents/components/LandingPage';
import WorkspaceList from '../app/components/workspaces/WorkSpaceIndex';
import WorkspaceDetail from '../app/components/workspaces/$workspaceId/WSindex';
import FeaturesPage from '../app/components/Features/FeaturesPage';
import Dashboard from '../app/components/dashboard/Dashboard';
import Profile from '../app/components/dashboard/sidebar/Profile';
import Settings from '../app/components/dashboard/sidebar/Settings';
import Notifications from '../app/components/dashboard/sidebar/Notifications';
import Network from '../app/components/dashboard/sidebar/Network';
import WrappedLSPage from '../app/components/LoginSignup/WrappedLSPage';
import OAuthCallback from '../app/components/LoginSignup/OAuthCallback';
import NomadDeskAbout from '../app/components/About/NomadDeskAbout';
import ProtectedRoute from '../app/components/ProtectedRoute';
import '../app/styles/font-fix.css';

// Placeholder component for routes that don't have components yet
const PlaceholderPage = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Coming Soon</h1>
    <p>This page is under construction.</p>
  </div>
);

// Define the root route
const rootRoute = new RootRoute({
  component: App
});

// Define the index route (landing page)
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Define the dashboard route (protected)
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

// Define all the other protected routes
const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'profile',
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
});

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
});

const notificationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'notifications',
  component: () => (
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  ),
});

const networkRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'network',
  component: () => (
    <ProtectedRoute>
      <Network />
    </ProtectedRoute>
  ),
});

const workspacesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces',
  component: () => (
    <ProtectedRoute>
      <WorkspaceList />
    </ProtectedRoute>
  ),
});

const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces/$workspaceId',
  component: () => (
    <ProtectedRoute>
      <WorkspaceDetail />
    </ProtectedRoute>
  ),
});

// Define additional public routes
const howItWorksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'how-it-works',
  component: PlaceholderPage,
});

const featuresRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'features',
  component: FeaturesPage,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'about',
  component: NomadDeskAbout,
});

// Auth routes
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: WrappedLSPage,
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: WrappedLSPage,
});

// OAuth callback route
const oauthCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'oauth-callback',
  component: OAuthCallback,
});

const createGroupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'create-group',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
});

// Create the route tree using the routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  notificationsRoute,
  networkRoute,
  workspacesRoute,
  workspaceDetailRoute,
  howItWorksRoute,
  featuresRoute,
  aboutRoute,
  loginRoute,
  signupRoute,
  oauthCallbackRoute, // Added OAuth callback route
  createGroupRoute,
]);

// Create the router
export const router = new Router({ routeTree });

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}