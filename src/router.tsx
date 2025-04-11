// src/router.tsx

import { Router, Route, RootRoute } from '@tanstack/react-router'
import LandingPage from '../app/components/LandingPageComponents/components/LandingPage'
import WorkspaceList from '../app/components/workspaces/WorkSpaceIndex'
import WorkspaceDetail from '../app/components/workspaces/$workspaceId/WSindex'
import FeaturesPage from '../app/components/Features/FeaturesPage'
import App from './App'
import LSpage from '../app/components/LoginSignup/LSutils/LSpage'
import NomadDeskAbout from '../app/components/About/NomadDeskAbout'
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
  component: App,
})

// Define the index route (landing page)
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

// Define the workspaces list route
const workspacesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces',
  component: WorkspaceList,
})

// Define the workspace detail route with dynamic parameter
const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'workspaces/$workspaceId',
  component: WorkspaceDetail,
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
  component: FeaturesPage, // Now using the actual FeaturesPage component
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
  component: PlaceholderPage,
})

// Create the route tree using the routes
const routeTree = rootRoute.addChildren([
  indexRoute,
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