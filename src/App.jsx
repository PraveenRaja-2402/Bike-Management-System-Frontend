import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AllPagesOverview from './pages/admin/AllPagesOverview';
import DashboardPage from './pages/admin/DashboardPage';
import LiveTrackingPage from './pages/admin/LiveTrackingPage';
import NextServicePage from './pages/admin/NextServicePage';
import JobCardsPage from './pages/admin/JobCardsPage';
import UsersPage from './pages/admin/UsersPage';
import ManageBrandsPage from './pages/admin/ManageBrandsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProfilePage from './pages/admin/ProfilePage';
import CustomerApp from './pages/customer/CustomerApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/all-pages" replace />} />
          <Route path="all-pages" element={<AllPagesOverview />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="live-tracking" element={<LiveTrackingPage />} />
          <Route path="next-service" element={<NextServicePage />} />
          <Route path="job-cards" element={<JobCardsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="manage-brands" element={<ManageBrandsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Customer Mobile Interface */}
        <Route path="/customer" element={<CustomerApp />} />

        {/* Default route redirect to All Pages Overview */}
        <Route path="/" element={<Navigate to="/admin/all-pages" replace />} />
        <Route path="*" element={<Navigate to="/admin/all-pages" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
