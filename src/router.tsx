
// src/router.tsx
import { Router, Route, RootRoute } from '@tanstack/react-router'
import LandingPage from '../app/components/LandingPageComponents/components/LandingPage'
import WorkspaceList from '../app/components/workspaces/WorkSpaceIndex'
import WorkspaceDetail from '../app/components/workspaces/$workspaceId/WSindex'
import FeaturesPage from '../app/components/Features/FeaturesPage'
import Dashboard from '../app/components/dashboard/Dashboard'
import Profile from '../app/components/dashboard/sidebar/Profile'
import Settings from '../app/components/dashboard/sidebar/Settings'
import Notifications from '../app/components/dashboard/sidebar/Notifications'
import Network from '../app/components/dashboard/sidebar/Network'
import App from './App'
import LSpage from '../app/components/LoginSignup/LSutils/LSpage'
import NomadDeskAbout from '../app/components/About/NomadDeskAbout'
import ProtectedRoute from '../app/components/dashboard/ProtectedRoute'
import { AuthProvider } from '../app/components/dashboard/AuthContext'
import React from 'react'
import '../app/styles/font-fix.css';

// Placeholder component for routes that don't have components yet
const PlaceholderPage = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Coming Soon</h1>
    <p>This page is under construction.</p>
  </div>
)

// Define the root route
const rootRoute = new RootRoute({
  component: () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
})

// Define the index route (landing page)
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

// Define the dashboard route (protected)
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
})

// Define the profile route (protected)
const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'profile',
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
})

// Define the settings route (protected)
const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
})

// Define the notifications route (protected)
const notificationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'notifications',
  component: () => (
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  ),
})

// Define the network route (protected)
const networkRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'network',
  component: () => (
    <ProtectedRoute>
      <Network />
    </ProtectedRoute>
  ),
})

// Define the workspaces list route (protected)
const workspacesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces',
  component: () => (
    <ProtectedRoute>
      <WorkspaceList />
    </ProtectedRoute>
  ),
})

// Define the workspace detail route with dynamic parameter (protected)
const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces/$workspaceId',
  component: () => (
    <ProtectedRoute>
      <WorkspaceDetail />
    </ProtectedRoute>
  ),
})

// Define additional routes
const howItWorksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'how-it-works',
  component: PlaceholderPage,
})

const featuresRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'features',
  component: FeaturesPage,
})

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'about',
  component: NomadDeskAbout,
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LSpage,
})

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: LSpage,
})

const createGroupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'create-group',
  component: () => (
    <ProtectedRoute>
      <PlaceholderPage />
    </ProtectedRoute>
  ),
})

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
  createGroupRoute,
])

// Create the router
export const router = new Router({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}