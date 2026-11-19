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
  AlertTriangle,
  Crown,
  ShieldCheck,
  Building2,
  Palette,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function Header({ onToggleSidebar, title, subtitle, breadcrumb }) {
  const { currentRole, currentUser, branding, logout, switchAccountWithPassword } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState(currentRole === 'super_admin' ? 'admin' : 'super_admin');
  const [switchPassword, setSwitchPassword] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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
      title: "Critical Service Overdue",
      desc: "TN 30 AB 1234 (Yamaha FZ-S) is overdue by 4 days. Automatic reminder queued.",
      time: "5 mins ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Store Location Geo Alert",
      desc: "Salem Central Hub reached 92% bay occupancy capacity.",
      time: "30 mins ago",
      type: "info"
    },
    {
      id: 3,
      title: "New Customer Registered",
      desc: "Admin Vikram created customer account for Bharath (TN 30 AB 1234).",
      time: "1 hour ago",
      type: "success"
    }
  ];

  const isSuperAdmin = currentRole === 'super_admin';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="header-page-title" style={{ margin: 0 }}>{title}</h1>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 700,
              background: isSuperAdmin ? '#fef3c7' : '#eff6ff',
              color: isSuperAdmin ? '#b45309' : '#1d4ed8',
              border: isSuperAdmin ? '1px solid #fde68a' : '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isSuperAdmin ? <Crown size={12} /> : <ShieldCheck size={12} />}
              <span>{isSuperAdmin ? 'Super Admin Mode' : 'Admin Mode'}</span>
            </span>
          </div>
          {subtitle && <p className="header-page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Quick Role Toggle Pill (Password Authenticated) */}
        <button
          type="button"
          onClick={() => {
            const next = isSuperAdmin ? 'admin' : 'super_admin';
            setTargetRole(next);
            setSwitchPassword('');
            setSwitchError('');
            setIsSwitchModalOpen(true);
          }}
          className="header-customer-switch-btn"
          style={{
            background: isSuperAdmin ? '#1e293b' : '#2563eb',
            borderColor: isSuperAdmin ? '#334155' : '#1d4ed8'
          }}
          title="Click to securely switch between Super Admin and Admin (Password Required)"
        >
          {isSuperAdmin ? <Crown size={15} color="#f59e0b" /> : <ShieldCheck size={15} color="#ffffff" />}
          <span>Switch to {isSuperAdmin ? 'Admin' : 'Super Admin'}</span>
        </button>

        {/* Switcher to Customer Mobile App */}
        <Link 
          to="/customer" 
          className="header-customer-switch-btn"
          title="Open interactive customer mobile view"
        >
          <Smartphone size={16} />
          <span>Mobile View</span>
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
                <span className="dropdown-title">System Alerts</span>
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
                <Link to="/admin/pending-services" onClick={() => setShowNotifications(false)}>
                  View Service Monitoring &rarr;
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
            <div className="user-avatar-circle" style={{
              background: isSuperAdmin ? 'linear-gradient(135deg, #1e293b, #0f172a)' : '#2563eb',
              color: isSuperAdmin ? '#f59e0b' : '#ffffff'
            }}>
              {currentUser.avatar}
            </div>
            <span className="user-name">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown size={15} className="dropdown-arrow-icon" />
          </button>

          {showProfileMenu && (
            <div className="header-dropdown profile-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar-circle large" style={{
                  background: isSuperAdmin ? 'linear-gradient(135deg, #1e293b, #0f172a)' : '#2563eb',
                  color: isSuperAdmin ? '#f59e0b' : '#ffffff'
                }}>
                  {currentUser.avatar}
                </div>
                <div>
                  <div className="user-info-name">{currentUser.name}</div>
                  <div className="user-info-role" style={{ color: isSuperAdmin ? '#d97706' : '#2563eb', fontWeight: 600 }}>
                    {currentUser.badge}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{currentUser.email}</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              
              <button 
                type="button" 
                className="dropdown-item" 
                onClick={() => { switchRole(isSuperAdmin ? 'admin' : 'super_admin'); setShowProfileMenu(false); }}
              >
                {isSuperAdmin ? <ShieldCheck size={16} /> : <Crown size={16} />}
                <span>Switch to {isSuperAdmin ? 'Admin Role' : 'Super Admin Role'}</span>
              </button>

              {isSuperAdmin && (
                <>
                  <button 
                    type="button" 
                    className="dropdown-item" 
                    onClick={() => { setShowProfileMenu(false); navigate('/admin/branding'); }}
                  >
                    <Palette size={16} />
                    <span>Logo & Branding</span>
                  </button>
                  <button 
                    type="button" 
                    className="dropdown-item" 
                    onClick={() => { setShowProfileMenu(false); navigate('/admin/stores'); }}
                  >
                    <Building2 size={16} />
                    <span>Store Locations</span>
                  </button>
                </>
              )}

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
                <span>System Settings</span>
              </button>

              <div className="dropdown-divider" />
              <button 
                type="button" 
                className="dropdown-item text-danger" 
                onClick={() => { 
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Secure Account Switch with Password Verification */}
      <Modal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        title={`Authenticate: Switch to ${targetRole === 'super_admin' ? 'Super Admin' : 'Operations Admin'}`}
        maxWidth="460px"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          setSwitchError('');
          const res = switchAccountWithPassword(targetRole, switchPassword);
          if (res.success) {
            setIsSwitchModalOpen(false);
            setSwitchPassword('');
            if (targetRole === 'super_admin') {
              navigate('/admin/admins');
            } else {
              navigate('/admin/dashboard');
            }
          } else {
            setSwitchError(res.error || 'Authentication failed. Super Admin and Admin have different passwords.');
          }
        }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {targetRole === 'super_admin' ? <Crown size={18} color="#d97706" /> : <ShieldCheck size={18} color="#2563eb" />}
              <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>
                {targetRole === 'super_admin' ? 'Alexander Vance (Super Admin)' : 'Vikram Raman (Operations Admin)'}
              </strong>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Target Email: <strong>{targetRole === 'super_admin' ? 'superadmin@bikeservice.com' : 'admin@bikeservice.com'}</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
              🔒 Security Policy: Distinct passwords are required for Super Admin and Admin.
            </div>
          </div>

          {switchError && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{switchError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Enter Password for {targetRole === 'super_admin' ? 'Super Admin' : 'Admin'} *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showSwitchPassword ? 'text' : 'password'}
                className="form-input no-left-icon"
                placeholder={targetRole === 'super_admin' ? 'Enter SuperAdmin@2026!' : 'Enter Admin@Ops2026!'}
                value={switchPassword}
                onChange={(e) => setSwitchPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showSwitchPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick test autofill for user convenience */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#1e40af' }}>
              Demo Hint: <strong>{targetRole === 'super_admin' ? 'SuperAdmin@2026!' : 'Admin@Ops2026!'}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSwitchPassword(targetRole === 'super_admin' ? 'SuperAdmin@2026!' : 'Admin@Ops2026!')}
              style={{ fontSize: '11px', fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Autofill
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsSwitchModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <KeyRound size={15} /> Authenticate & Switch
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
