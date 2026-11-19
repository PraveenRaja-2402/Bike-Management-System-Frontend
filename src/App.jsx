import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RequireSuperAdmin from './components/auth/RequireSuperAdmin';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import LiveTrackingPage from './pages/admin/LiveTrackingPage';
import NextServicePage from './pages/admin/NextServicePage';
import PendingServicePage from './pages/admin/PendingServicePage';
import JobCardsPage from './pages/admin/JobCardsPage';
import UsersPage from './pages/admin/UsersPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import StoreLocationsPage from './pages/admin/StoreLocationsPage';
import BrandingPage from './pages/admin/BrandingPage';
import ManageBrandsPage from './pages/admin/ManageBrandsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProfilePage from './pages/admin/ProfilePage';
import CustomerApp from './pages/customer/CustomerApp';

function AppRoutes() {
  const { currentUser } = useApp();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <Routes>
      {/* 1. Public Authentication Route: Hitting /login ALWAYS renders the Login Page! */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Customer Mobile Interface (Public / Rider Access) */}
      <Route path="/customer" element={<CustomerApp />} />

      {/* 3. Protected Admin Routes (Require Active Authenticated Session) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route 
            index 
            element={
              <Navigate 
                to={isSuperAdmin ? "/admin/admins" : "/admin/dashboard"} 
                replace 
              />
            } 
          />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="live-tracking" element={<LiveTrackingPage />} />
          <Route path="next-service" element={<NextServicePage />} />
          <Route path="pending-services" element={<PendingServicePage />} />
          <Route path="job-cards" element={<JobCardsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="manage-brands" element={<ManageBrandsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Super Admin Restricted Routes (Require Master Root Credentials) */}
          <Route 
            path="admins" 
            element={
              <RequireSuperAdmin moduleName="Admin Account Management">
                <AdminManagementPage />
              </RequireSuperAdmin>
            } 
          />
          <Route 
            path="stores" 
            element={
              <RequireSuperAdmin moduleName="Store Hubs & Workshop Locations">
                <StoreLocationsPage />
              </RequireSuperAdmin>
            } 
          />
          <Route 
            path="branding" 
            element={
              <RequireSuperAdmin moduleName="Logo & Dynamic Corporate Branding">
                <BrandingPage />
              </RequireSuperAdmin>
            } 
          />
        </Route>
      </Route>

      {/* 4. Root & Fallback Redirects: Hitting the URL / ALWAYS opens the Login Page first! */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
