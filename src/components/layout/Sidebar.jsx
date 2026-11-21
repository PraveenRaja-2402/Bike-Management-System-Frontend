import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  User,
  Home, 
  MapPin, 
  Bell, 
  ClipboardCheck, 
  Users, 
  Tag, 
  Settings, 
  X,
  Crown,
  ShieldCheck,
  Store,
  Palette,
  AlertCircle,
  LogOut,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../common/DynamicBrandLogo';
import Modal from '../common/Modal';

export default function Sidebar({ isOpen, onClose }) {
  const { currentRole, currentUser, branding, pendingServices, logout, switchAccountWithPassword } = useApp();
  const navigate = useNavigate();

  const isSuperAdmin = currentRole === 'super_admin';
  const criticalOverdueCount = pendingServices.filter(s => s.serviceDueDays < 0).length;

  // Password-authenticated Role Switch Modal
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState(isSuperAdmin ? 'admin' : 'super_admin');
  const [switchPassword, setSwitchPassword] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');

  const handleOpenSwitchModal = () => {
    const nextRole = isSuperAdmin ? 'admin' : 'super_admin';
    setTargetRole(nextRole);
    setSwitchPassword('');
    setSwitchError('');
    setIsSwitchModalOpen(true);
  };

  const handleSwitchSubmit = (e) => {
    e.preventDefault();
    setSwitchError('');
    const res = switchAccountWithPassword(targetRole, switchPassword);
    if (res.success) {
      setIsSwitchModalOpen(false);
      setSwitchPassword('');
      if (onClose) onClose();
      if (targetRole === 'super_admin') {
        navigate('/admin/admins');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setSwitchError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const coreNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Live Tracking', path: '/admin/live-tracking', icon: MapPin },
    { 
      name: 'Service Monitoring', 
      path: '/admin/pending-services', 
      icon: AlertCircle,
      badge: `${criticalOverdueCount} Overdue`,
      badgeColor: '#ef4444'
    },
    { name: 'Next Service', path: '/admin/next-service', icon: Bell },
    { name: 'Job Cards', path: '/admin/job-cards', icon: ClipboardCheck },
    { name: 'User Management', path: '/admin/users', icon: Users, subtext: 'Admin creation' },
    { name: 'Manage Brands', path: '/admin/manage-brands', icon: Tag },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'My Profile', path: '/admin/profile', icon: User }
  ];

  const superAdminNavItems = [
    { name: 'Admin Management', path: '/admin/admins', icon: Crown, badge: isSuperAdmin ? 'Super' : '🔒 Locked' },
    { name: 'Store Locations', path: '/admin/stores', icon: Store, badge: isSuperAdmin ? 'Hubs' : '🔒 Locked' },
    { name: 'Logo & Branding', path: '/admin/branding', icon: Palette, badge: isSuperAdmin ? 'Branding' : '🔒 Locked' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header with Dynamic Logo */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <DynamicBrandLogo size={32} />
            <div className="brand-title-wrap">
              <span className="brand-name">{branding.companyName}</span>
              <span className="brand-tagline">
                {isSuperAdmin ? '⚡ Super Admin Root' : '🛡️ Operations Admin'}
              </span>
            </div>
          </div>
          <button type="button" className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Authenticated User Identity Card */}
        <div className="sidebar-user-card-wrap">
          <div className={`sidebar-user-card ${isSuperAdmin ? 'super-active' : 'admin-active'}`}>
            <div className="user-card-top">
              <div className="user-avatar-badge">
                {currentUser?.avatar || (isSuperAdmin ? 'SA' : 'AD')}
              </div>
              <div className="user-card-info">
                <div className="user-card-name">{currentUser?.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman')}</div>
                <div className="user-card-role">
                  {isSuperAdmin ? '👑 Super Admin (Master)' : '🛡️ Operations Admin'}
                </div>
              </div>
            </div>

            <div className="user-card-branch">
              <span className="branch-label">Assigned Hub:</span>
              <span className="branch-val">{currentUser?.assignedBranch || (isSuperAdmin ? 'All Mega Hubs' : 'Salem Central Hub')}</span>
            </div>

            {/* Quick Switch Button (Protected with password) */}
            <div className="user-card-actions">
              <button
                type="button"
                className="btn-switch-account"
                onClick={handleOpenSwitchModal}
                title="Switch account role with password verification"
              >
                <KeyRound size={12} />
                <span>Switch to {isSuperAdmin ? 'Operations Admin' : 'Super Admin'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {/* Super Admin Modules */}
          <div className="nav-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>SUPER ADMIN CONTROLS</span>
            <span style={{ 
              fontSize: '9px', 
              background: isSuperAdmin ? '#f59e0b25' : '#ef444420', 
              color: isSuperAdmin ? '#f59e0b' : '#ef4444', 
              padding: '1px 6px', 
              borderRadius: '4px', 
              fontWeight: 800,
              letterSpacing: '0.4px'
            }}>
              {isSuperAdmin ? 'MASTER' : 'RESTRICTED'}
            </span>
          </div>
          
          {superAdminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''} ${!isSuperAdmin ? 'restricted-item' : ''}`}
                style={{ opacity: isSuperAdmin ? 1 : 0.8 }}
                title={!isSuperAdmin ? 'Super Admin Password Required' : undefined}
              >
                <Icon size={18} className="nav-item-icon" color={isSuperAdmin ? '#f59e0b' : '#94a3b8'} />
                <span className="nav-item-label">{item.name}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '9.5px',
                    marginLeft: 'auto',
                    background: isSuperAdmin ? '#fef3c7' : '#fee2e2',
                    color: isSuperAdmin ? '#b45309' : '#dc2626',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '16px' }}>CORE OPERATIONS</div>
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label">{item.name}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '9px',
                    marginLeft: 'auto',
                    background: item.badgeColor || '#2563eb',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span className="status-dot-pulse" />
            <span>Node: Salem-Central-01 • Active</span>
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Terminate session and return to secure login"
          >
            <LogOut size={16} />
            <span>Secure Log Out</span>
          </button>
        </div>
      </aside>

      {/* Account Switch Modal with Password Verification */}
      <Modal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        title="Secure Account Elevation & Switch"
        size="md"
      >
        <form onSubmit={handleSwitchSubmit} className="switch-role-form">
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {targetRole === 'super_admin' ? <Crown size={18} color="#d97706" /> : <ShieldCheck size={18} color="#2563eb" />}
              <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>
                Switching to: {targetRole === 'super_admin' ? 'Super Admin (Alexander Vance)' : 'Operations Admin (Vikram Raman)'}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', lineHeight: 1.5 }}>
              {targetRole === 'super_admin'
                ? 'Super Admin grants full administrative privileges over all hubs, store locations, admin user management, and global branding.'
                : 'Operations Admin handles everyday branch customer onboarding, job cards, service tracking, and fleet telemetry.'
              }
            </p>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '6px' }}>
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
    </>
  );
}
