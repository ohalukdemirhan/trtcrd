import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './components/admin/AdminLayout';
import UsersManagement from './components/admin/UsersManagement';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layout Components
import Layout from './components/layout/Layout';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSubscriptions from './components/admin/AdminSubscriptions';
import AdminTranslations from './components/admin/AdminTranslations';
import AdminCompliance from './components/admin/AdminCompliance';

// Pages
import HomePage from './pages';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import ComplianceRulesPage from './pages/ComplianceRules';
import ProfessionalTranslation from './pages/ProfessionalTranslation';

// Import the modern components
import ModernDashboard from './pages/ModernDashboard';
import ModernTranslations from './pages/ModernTranslations';
import ModernSubscription from './pages/ModernSubscription';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <ModernDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/translations"
        element={
          <ProtectedRoute>
            <Layout>
              <ModernTranslations />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/compliance"
        element={
          <ProtectedRoute>
            <Layout>
              <ComplianceRulesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/usage"
        element={
          <ProtectedRoute>
            <Layout>
              <ModernSubscription />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/professional-translation"
        element={
          <ProtectedRoute>
            <Layout>
              <TranslationProvider>
                <ProfessionalTranslation />
              </TranslationProvider>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="translations" element={<AdminTranslations />} />
        <Route path="compliance" element={<AdminCompliance />} />
      </Route>

      {/* Default redirect */}
      <Route
        path="/"
        element={
          <Navigate to={user ? "/admin/dashboard" : "/login"} />
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
};

export default App;