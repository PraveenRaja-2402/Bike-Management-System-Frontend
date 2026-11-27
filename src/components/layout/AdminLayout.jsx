import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import WelcomePopup from '../common/WelcomePopup';
import { useApp } from '../../context/AppContext';

export default function AdminLayout() {
  const { currentUser, currentRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('bsp_sidebar_collapsed') === 'true';
  });
  const [showWelcome, setShowWelcome] = useState(() => {
    const pending = sessionStorage.getItem('bsp_welcome_pending') === '1';
    if (pending) {
      sessionStorage.removeItem('bsp_welcome_pending');
    }
    return pending;
  });
  const location = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem('bsp_welcome_pending') === '1') {
      sessionStorage.removeItem('bsp_welcome_pending');
      setShowWelcome(true);
    }
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('bsp_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Determine page meta from path
  const getPageMeta = () => {
    const path = location.pathname;
    
    // Bike Repair & Service System
    if (path.includes('bikes')) {
      return {
        title: 'Bike Registry',
        subtitle: 'Manage customer vehicle fleet, odometer readings, and registrations'
      };
    }
    if (path.includes('services')) {
      return {
        title: 'Service Tracking',
        subtitle: 'Track periodic maintenance items, costs, and next service benchmarks'
      };
    }
    if (path.includes('repairs')) {
      return {
        title: 'Repair History',
        subtitle: 'Comprehensive bike-wise repair logs, parts replacements, and labor costs'
      };
    }
    if (path.includes('sales')) {
      return {
        title: 'Sales & Revenue Analytics',
        subtitle: 'Daily, weekly, monthly, and yearly service, spare parts, and labour revenue insights'
      };
    }
    if (path.includes('ratings')) {
      return {
        title: 'Customer Ratings & Feedback',
        subtitle: 'Overall satisfaction score, 5-star distribution, and service-wise customer reviews'
      };
    }
    if (path.includes('service-prediction')) {
      return {
        title: 'Vehicle Service Prediction',
        subtitle: 'Estimated next service dates, remaining kilometres, and component maintenance alerts'
      };
    }
    if (path.includes('reports')) {
      return {
        title: 'Reports & Analytics',
        subtitle: 'Daily, monthly, lifetime bike histories, and downloadable CSV/JSON exports'
      };
    }

    // Super Admin restricted routes
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

    // Fleet Telemetry & Operations
    if (path.includes('pending-services')) {
      return {
        title: 'Service Pending Monitoring',
        subtitle: 'Monitor overdue and pending vehicle maintenance across all branches'
      };
    }
    if (path.includes('all-pages')) {
      return {
        title: 'All Pages Overview',
        subtitle: 'Quick access to all modules of Bike Service Pro Admin Panel'
      };
    }
    if (path.includes('dashboard')) {
      return {
        title: 'Dashboard',
        subtitle: 'Real-time overview of registered bikes, service due, and workshop activities'
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
        title: 'Service Alerts & Reminders',
        subtitle: 'Automatic KM and date-based reminders with 1-click WhatsApp & SMS dispatch'
      };
    }
    if (path.includes('job-cards')) {
      return {
        title: 'Job Completion & Service Reminders',
        subtitle: 'Track Service Booking → In Progress → Job Completed → Next Service Reminder'
      };
    }
    if (path.includes('users')) {
      return {
        title: 'Customers & User Directory',
        subtitle: 'Manage customer accounts, mobile portal access credentials, and workshop staff'
      };
    }
    if (path.includes('manage-brands')) {
      return {
        title: 'Manage Bike Brands',
        subtitle: 'Add, edit and manage supported bike brands and models'
      };
    }
    if (path.includes('settings')) {
      return {
        title: 'Settings & Storage',
        subtitle: 'Configurable service intervals, local browser storage, and pendrive backup'
      };
    }
    if (path.includes('profile')) {
      return {
        title: 'Profile',
        breadcrumb: 'Profile > My Profile'
      };
    }
    return {
      title: 'Bike Service Pro',
      subtitle: 'Commercial SaaS System Management'
    };
  };

  const meta = getPageMeta();

  return (
    <div className="admin-layout-root">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div className={`admin-main-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
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

      <WelcomePopup
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        user={currentUser}
        isSuperAdmin={currentRole === 'super_admin'}
      />
    </div>
  );
}

