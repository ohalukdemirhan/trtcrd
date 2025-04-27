import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme.ts';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

// Layouts
import DashboardLayout from './components/dashboard/DashboardLayout';
import Navbar from './components/layout/Navbar';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useAuth } from './contexts/AuthContext';
import Compliance from './pages/Compliance';
import TranslationsUpload from './pages/TranslationsUpload';
import Subscriptions from './pages/Subscriptions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompliance from './pages/admin/Compliance';
import AdminTranslations from './pages/admin/Translations';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Toast from './components/Toast';

const App = () => {
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '' });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ open: true, message, severity });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <AppHeader />
                <Navbar />
                <Landing />
                <AppFooter />
              </>
            }
          />
          <Route path="/login" element={<><AppHeader /><Login /><AppFooter /></>} />
          <Route path="/register" element={<><AppHeader /><Register /><AppFooter /></>} />
          <Route path="/privacy-policy" element={<><AppHeader /><PrivacyPolicy /><AppFooter /></>} />
          <Route path="/terms" element={<><AppHeader /><Terms /><AppFooter /></>} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<><Sidebar /><DashboardLayout><Dashboard /></DashboardLayout></>} />
            <Route path="/compliance" element={<><AppHeader /><Sidebar /><Compliance /><AppFooter /></>} />
            <Route path="/translations/upload" element={<><AppHeader /><Sidebar /><TranslationsUpload /><AppFooter /></>} />
            <Route path="/subscriptions" element={<><AppHeader /><Sidebar /><Subscriptions /><AppFooter /></>} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<><AppHeader /><Sidebar /><AdminDashboard /><AppFooter /></>} />
            <Route path="/admin/users" element={<><AppHeader /><Sidebar /><AdminUsers /><AppFooter /></>} />
            <Route path="/admin/compliance" element={<><AppHeader /><Sidebar /><AdminCompliance /><AppFooter /></>} />
            <Route path="/admin/translations" element={<><AppHeader /><Sidebar /><AdminTranslations /><AppFooter /></>} />
          </Route>

          {/* Public Information Pages */}
          <Route
            path="/about"
            element={
              <>
                <AppHeader />
                <Navbar />
                {/* Add About component here */}
                <div>About Page</div>
                <AppFooter />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <AppHeader />
                <Navbar />
                {/* Add Services component here */}
                <div>Services Page</div>
                <AppFooter />
              </>
            }
          />
          <Route
            path="/pricing"
            element={
              <>
                <AppHeader />
                <Navbar />
                {/* Add Pricing component here */}
                <div>Pricing Page</div>
                <AppFooter />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <AppHeader />
                <Navbar />
                {/* Add Contact component here */}
                <div>Contact Page</div>
                <AppFooter />
              </>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;