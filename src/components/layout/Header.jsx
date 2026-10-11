import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  Smartphone, 
  User, 
  Settings, 
  LogOut,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { initialAdminProfile } from '../../data/mockData';

export default function Header({ onToggleSidebar, title, subtitle, breadcrumb }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Upcoming Service Due",
      desc: "TN 30 AB 1234 (Yamaha FZ-S) is due for service in 5 days.",
      time: "10 mins ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Job Card Completed",
      desc: "Job card #JC-003 for TVS Apache marked completed by Mani.",
      time: "1 hour ago",
      type: "success"
    },
    {
      id: 3,
      title: "Bike Movement Alert",
      desc: "TN 11 U 7890 moving at 56 km/h on Omalur Main Road.",
      time: "2 hours ago",
      type: "info"
    }
  ];

  return (
    <header className="admin-header">
      <div className="header-left">
        <button 
          type="button" 
          className="mobile-menu-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-titles">
          {breadcrumb ? (
            <div className="header-breadcrumb">{breadcrumb}</div>
          ) : null}
          <h1 className="header-page-title">{title}</h1>
          {subtitle && <p className="header-page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Switcher to Customer Mobile App */}
        <Link 
          to="/customer" 
          className="header-customer-switch-btn"
          title="Open interactive mobile preview"
        >
          <Smartphone size={16} />
          <span>Customer App Preview</span>
        </Link>

        {/* Notifications */}
        <div className="header-popover-wrap" ref={notifRef}>
          <button 
            type="button" 
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notif-badge">3</span>
          </button>

          {showNotifications && (
            <div className="header-dropdown notif-dropdown">
              <div className="dropdown-head">
                <span className="dropdown-title">Notifications</span>
                <span className="dropdown-tag">3 New</span>
              </div>
              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className="notif-item">
                    <div className={`notif-icon-dot ${n.type}`}>
                      {n.type === 'warning' ? <Clock size={14} /> : n.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    </div>
                    <div className="notif-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-desc">{n.desc}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <Link to="/admin/next-service" onClick={() => setShowNotifications(false)}>
                  View all alerts &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="header-popover-wrap" ref={profileRef}>
          <button 
            type="button" 
            className="header-user-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="user-avatar-circle">
              {initialAdminProfile.avatar}
            </div>
            <span className="user-name">Admin</span>
            <ChevronDown size={15} className="dropdown-arrow-icon" />
          </button>

          {showProfileMenu && (
            <div className="header-dropdown profile-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar-circle large">A</div>
                <div>
                  <div className="user-info-name">{initialAdminProfile.fullName}</div>
                  <div className="user-info-role">{initialAdminProfile.email}</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button 
                type="button" 
                className="dropdown-item" 
                onClick={() => { setShowProfileMenu(false); navigate('/admin/profile'); }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button 
                type="button" 
                className="dropdown-item" 
                onClick={() => { setShowProfileMenu(false); navigate('/admin/settings'); }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button 
                type="button" 
                className="dropdown-item" 
                onClick={() => { setShowProfileMenu(false); navigate('/customer'); }}
              >
                <Smartphone size={16} />
                <span>Customer Mobile App</span>
              </button>
              <div className="dropdown-divider" />
              <button 
                type="button" 
                className="dropdown-item text-danger" 
                onClick={() => { 
                  setShowProfileMenu(false);
                  alert('Logged out (Mock state: session cleared)');
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
