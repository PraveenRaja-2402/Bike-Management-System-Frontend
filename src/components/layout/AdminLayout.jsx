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
    if (path.includes('admins')) {
      return {
        title: 'Admin Management',
        subtitle: 'Super Admin: Provision and configure administrator credentials'
      };
    }
    if (path.includes('stores')) {
      return {
        title: 'Store & Workshop Locations',
        subtitle: 'Super Admin: Configure workshop branches, service bays and geofences'
      };
    }
    if (path.includes('branding')) {
      return {
        title: 'Logo Change & Branding',
        subtitle: 'Super Admin: Customize corporate logo, brand colors and system identity'
      };
    }
    if (path.includes('pending-services')) {
      return {
        title: 'Service Pending Monitoring',
        subtitle: 'Monitor overdue and pending vehicle maintenance across all branches'
      };
    }
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
        title: 'User Management',
        subtitle: 'Admin: Create customer, technician, and advisor user accounts'
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
        subtitle: 'General preferences and notification settings'
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
