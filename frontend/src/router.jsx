/**
 * Router Configuration
 * Application routing with protected routes
 */

import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { LoadingPage } from './components/common/Loading/Loading';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route wrapper (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Import pages
import Sales from './pages/Sales/Sales';
import NewSale from './pages/Sales/NewSale';
import SaleDetail from './pages/Sales/SaleDetail';
import Inventory from './pages/Inventory/Inventory';
import Rentals from './pages/Rentals/Rentals';
import Reports from './pages/Reports/Reports';
import Employees from './pages/Employees/Employees';
import Coupons from './pages/Coupons/Coupons';

// Placeholder components for routes (to be implemented)
const ProfilePage = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Page</h2>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);
const SettingsPage = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings Page</h2>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);
const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="text-primary-600 hover:text-primary-700 underline"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'sales',
        element: <Sales />,
      },
      {
        path: 'sales/new',
        element: <NewSale />,
      },
      {
        path: 'sales/:id',
        element: <SaleDetail />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
      {
        path: 'rentals',
        element: <Rentals />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'employees',
        element: <Employees />,
      },
      {
        path: 'coupons',
        element: <Coupons />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
