import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page meta from path
  const getPageMeta = () => {
    const path = location.pathname;
    if (path.includes('all-pages')) {
      return {
        title: 'All Pages Overview',
        subtitle: 'Quick access to all modules of Bike Service Admin Panel'
      };
    }
    if (path.includes('dashboard')) {
      return {
        title: 'Dashboard',
        subtitle: 'Overview of bikes, service due, and recent activity'
      };
    }
    if (path.includes('live-tracking')) {
      return {
        title: 'Live Bike Tracking',
        subtitle: 'Track all bikes in real-time on interactive map'
      };
    }
    if (path.includes('next-service')) {
      return {
        title: 'Next Service Notifications',
        subtitle: 'View bikes with upcoming service due dates'
      };
    }
    if (path.includes('job-cards')) {
      return {
        title: 'Job Cards',
        subtitle: 'Create and manage service job cards'
      };
    }
    if (path.includes('users')) {
      return {
        title: 'Users',
        subtitle: 'Add, edit and manage system users'
      };
    }
    if (path.includes('manage-brands')) {
      return {
        title: 'Manage Bike Brands',
        subtitle: 'Add, edit and manage bike brands'
      };
    }
    if (path.includes('settings')) {
      return {
        title: 'Settings',
        subtitle: 'System configuration and service settings'
      };
    }
    if (path.includes('profile')) {
      return {
        title: 'Profile',
        breadcrumb: 'Profile > My Profile'
      };
    }
    return {
      title: 'Bike Service Admin',
      subtitle: 'System Management'
    };
  };

  const meta = getPageMeta();

  return (
    <div className="admin-layout-root">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="admin-main-container">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={meta.title}
          subtitle={meta.subtitle}
          breadcrumb={meta.breadcrumb}
        />
        
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
