import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Lazy load components
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Translations = React.lazy(() => import('../pages/Translations'));
const ComplianceRules = React.lazy(() => import('../pages/ComplianceRules'));
const UsageBilling = React.lazy(() => import('../pages/UsageBilling'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));

// Loading component
const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
    </div>
);

// Protected Route wrapper
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    
    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }
    
    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/translations" element={<ProtectedRoute><Translations /></ProtectedRoute>} />
                <Route path="/compliance" element={<ProtectedRoute><ComplianceRules /></ProtectedRoute>} />
                <Route path="/usage" element={<ProtectedRoute><UsageBilling /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </React.Suspense>
    );
};

export default AppRoutes; 