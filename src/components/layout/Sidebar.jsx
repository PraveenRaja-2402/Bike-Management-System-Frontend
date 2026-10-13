import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  User,
  Home, 
  MapPin, 
  Bell, 
  ClipboardCheck, 
  Users, 
  Tag, 
  Settings, 
  Smartphone,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Live Tracking', path: '/admin/live-tracking', icon: MapPin },
    { name: 'Next Service', path: '/admin/next-service', icon: Bell },
    { name: 'Job Cards', path: '/admin/job-cards', icon: ClipboardCheck },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Manage Brands', path: '/admin/manage-brands', icon: Tag },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <div className="brand-icon-circle">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-3h3l2 4" />
                <path d="M9 17.5h5.5" />
              </svg>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-name">Bike Service</span>
              <span className="brand-tagline">Admin Panel</span>
            </div>
          </div>
          <button type="button" className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MENU</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} className="nav-item-icon" />
                <span className="nav-item-label">{item.name}</span>
              </NavLink>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '24px' }}>CUSTOMER INTERFACE</div>
          <NavLink
            to="/customer"
            onClick={onClose}
            className={({ isActive }) => `sidebar-nav-item customer-link ${isActive ? 'active' : ''}`}
          >
            <Smartphone size={19} className="nav-item-icon" />
            <span className="nav-item-label">Customer Mobile App</span>
            <span className="customer-badge-live">Live</span>
          </NavLink>
        </nav>

        {/* Footer info */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span className="status-dot-pulse" />
            <span>Service Node Online</span>
          </div>
          <div className="system-version">v1.2.0 • 2026 Edition</div>
        </div>
      </aside>
    </>
  );
}
