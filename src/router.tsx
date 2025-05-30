// src/router.tsx - UPDATED: Add all footer link routes and group booking routes
import { Router, Route, RootRoute } from '@tanstack/react-router';

import App from './App';
import LandingPage from '../app/components/LandingPageComponents/components/LandingPage';
import WorkspaceList from '../app/components/workspaces/WorkSpaceIndex';
import WorkspaceDetail from '../app/components/workspaces/$workspaceId/WSindex';
import WorkspaceSearchPage from '../app/components/workspaces/WorkspaceSearchPage';
import MapWorkspaceDetail from '../app/components/workspaces/MapWorkspaceDetail';
import FeaturesPage from '../app/components/Features/FeaturesPage';
import Dashboard from '../app/components/Dashboard/Dashboard';
import Profile from '../app/components/Profile/Profile';
import Favorites from '../app/components/Favorites/Favorites';
import Settings from '../app/components/Dashboard/SideBar/Settings';
import Notifications from '../app/components/Dashboard/SideBar/Notifications';
import Network from '../app/components/Dashboard/SideBar/Network';
import WrappedLSPage from '../app/components/LoginSignup/WrappedLSPage';
import OAuthSuccess from '../app/components/LoginSignup/OAuthSuccess';
import NomadDeskAbout from '../app/components/About/NomadDeskAbout';
import ProtectedRoute from '../app/components/ProtectedRoute';

// Import new components
import ComingSoon from '../app/components/Common/ComingSoon';
import ContactUs from '../app/components/Support/ContactUs';
import HelpCenter from '../app/components/Support/HelpCenter';
import PrivacyPolicy from '../app/components/Legal/PrivacyPolicy';
import TermsOfService from '../app/components/Legal/TermsOfService';
import TrustSafety from '../app/components/Legal/TrustSafety';

// Import group booking components (create these if they don't exist)
// import GroupBookingManage from '../app/components/Bookings/GroupBookingManage';
// import GroupBookingsList from '../app/components/Bookings/GroupBookingsList';

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

// Group bookings routes - NEW ADDITIONS
const groupBookingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/group-bookings',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Group Bookings" description="Manage your group bookings and reservations" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const groupBookingManageRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/group-bookings/$groupId/manage',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Manage Group Booking" description="Edit and manage your group booking details" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const groupBookingDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/group-bookings/$groupId',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Group Booking Details" description="View your group booking details and participants" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Public routes
const howItWorksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: () => <ComingSoon title="How It Works" description="Learn how Nomad Desk helps you find the perfect workspace" />,
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

// OAuth success route
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

// Company routes - Using ComingSoon component
const careersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/careers',
  component: ComingSoon,
  errorComponent: RouteErrorComponent,
});

const blogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: ComingSoon,
  errorComponent: RouteErrorComponent,
});

const pressRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/press',
  component: ComingSoon,
  errorComponent: RouteErrorComponent,
});

const partnersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/partners',
  component: ComingSoon,
  errorComponent: RouteErrorComponent,
});

// Support routes - Using actual components
const contactRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUs,
  errorComponent: RouteErrorComponent,
});

const helpCenterRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/help-center',
  component: HelpCenter,
  errorComponent: RouteErrorComponent,
});

// Legal routes - Using actual components
const privacyPolicyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
  errorComponent: RouteErrorComponent,
});

const termsOfServiceRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/terms-of-service',
  component: TermsOfService,
  errorComponent: RouteErrorComponent,
});

const trustSafetyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/trust-safety',
  component: TrustSafety,
  errorComponent: RouteErrorComponent,
});

// Create group route
const createGroupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create-group',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Create Study Group" description="Organize study sessions with friends and classmates" />
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
      <ComingSoon title="Study Sessions" description="Join or create collaborative study sessions" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const createStudySessionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/study-sessions/create',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Create Study Session" description="Start a new study session and invite others" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const studySessionDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/study-sessions/$sessionId',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Study Session Details" description="View and manage your study session" />
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
      <ComingSoon title="Messages" description="Connect and chat with other workspace users" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

const messageDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/messages/$userId',
  component: () => (
    <ProtectedRoute>
      <ComingSoon title="Chat" description="Send messages to other users" />
    </ProtectedRoute>
  ),
  errorComponent: RouteErrorComponent,
});

// Create the route tree using all routes
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
  // Group booking routes - NEW ADDITIONS
  groupBookingsRoute,
  groupBookingManageRoute,
  groupBookingDetailRoute,
  // Existing routes continue
  howItWorksRoute,
  featuresRoute,
  aboutRoute,
  loginRoute,
  signupRoute,
  oauthSuccessRoute,
  createGroupRoute,
  studySessionsRoute,
  createStudySessionRoute,
  studySessionDetailRoute,
  messagesRoute,
  messageDetailRoute,
  // Company routes
  careersRoute,
  blogRoute,
  pressRoute,
  partnersRoute,
  // Support routes
  contactRoute,
  helpCenterRoute,
  // Legal routes
  privacyPolicyRoute,
  termsOfServiceRoute,
  trustSafetyRoute,
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