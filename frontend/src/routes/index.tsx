import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout Components
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/admin/AdminLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import HomePage from '../pages';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import ComplianceRulesPage from '../pages/ComplianceRules';
import ProfessionalTranslation from '../pages/ProfessionalTranslation';
import ModernDashboard from '../pages/ModernDashboard';
import ModernTranslations from '../pages/ModernTranslations';
import ModernSubscription from '../pages/ModernSubscription';

// Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import UsersManagement from '../components/admin/UsersManagement';
import AdminSubscriptions from '../components/admin/AdminSubscriptions';
import AdminTranslations from '../components/admin/AdminTranslations';
import AdminCompliance from '../components/admin/AdminCompliance';

// Protected Route Component
import ProtectedRoute from './ProtectedRoute';

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
              <ProfessionalTranslation />
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
              <Navigate to="/admin/dashboard" replace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="translations" element={<AdminTranslations />} />
                <Route path="compliance" element={<AdminCompliance />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          <Navigate to={user ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes; 