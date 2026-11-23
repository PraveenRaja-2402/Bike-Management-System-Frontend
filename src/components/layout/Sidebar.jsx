import React, { useState, useMemo } from 'react';
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
  Sparkles,
  ShieldAlert,
  Bike,
  Wrench,
  FileText,
  HardDrive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../common/DynamicBrandLogo';
import Modal from '../common/Modal';

export default function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) {
  const { 
    currentRole, 
    currentUser, 
    branding, 
    pendingServices, 
    logout, 
    switchAccountWithPassword,
    bikesList,
    customerFines 
  } = useApp();
  const navigate = useNavigate();

  const isSuperAdmin = currentRole === 'super_admin';
  const criticalOverdueCount = pendingServices.filter(s => s.serviceDueDays < 0).length;

  // Calculate overdue count for badge
  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bikesList.filter(b => {
      const curKm = parseInt(b.currentKm, 10) || 0;
      const nextKm = parseInt(b.nextServiceKm, 10) || (curKm + 3000);
      let dateOver = false;
      if (b.nextServiceDate) {
        const d = new Date(b.nextServiceDate);
        d.setHours(0, 0, 0, 0);
        dateOver = d < today;
      }
      return curKm >= nextKm || dateOver;
    }).length;
  }, [bikesList]);

  // Calculate unpaid police fines count
  const unpaidFinesCount = useMemo(() => {
    return (customerFines || []).filter(f => f.status === 'Unpaid').length;
  }, [customerFines]);

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

  // Bike Repair & Service Alert System Core Navigation
  const bikeSystemNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Bike Registry', path: '/admin/bikes', icon: Bike, badge: `${bikesList.length}`, badgeColor: '#0284c7' },
    { name: 'Service Tracking', path: '/admin/services', icon: Wrench },
    { name: 'Repair History', path: '/admin/repairs', icon: Wrench },
    { 
      name: 'Alerts & Reminders', 
      path: '/admin/next-service', 
      icon: Bell, 
      badge: overdueCount > 0 ? `${overdueCount} Due` : null, 
      badgeColor: '#ef4444' 
    },
    { 
      name: 'Police Fines', 
      path: '/admin/fines', 
      icon: ShieldAlert, 
      badge: unpaidFinesCount > 0 ? `${unpaidFinesCount} Due` : null, 
      badgeColor: '#ef4444' 
    },
    { name: 'Reports & Export', path: '/admin/reports', icon: FileText }
  ];

  // Fleet Telemetry & IoT Operations
  const telemetryNavItems = [
    { name: 'Live Tracking', path: '/admin/live-tracking', icon: MapPin },
    { 
      name: 'Service Monitoring', 
      path: '/admin/pending-services', 
      icon: AlertCircle,
      badge: criticalOverdueCount > 0 ? `${criticalOverdueCount} Due` : null,
      badgeColor: '#f59e0b'
    },
    { name: 'Job Cards', path: '/admin/job-cards', icon: ClipboardCheck },
    { name: 'Customers & Users', path: '/admin/users', icon: Users },
    { name: 'Manage Brands', path: '/admin/manage-brands', icon: Tag }
  ];

  // System & Account
  const systemNavItems = [
    { name: 'Settings & Storage', path: '/admin/settings', icon: Settings },
    { name: 'My Profile', path: '/admin/profile', icon: User }
  ];

  // Super Admin Only Master Modules (No redundant text badges in super admin mode)
  const superAdminNavItems = [
    { name: 'Admin Management', path: '/admin/admins', icon: Crown, badge: !isSuperAdmin ? '🔒' : null },
    { name: 'Store Locations', path: '/admin/stores', icon: Store, badge: !isSuperAdmin ? '🔒' : null },
    { name: 'Logo & Branding', path: '/admin/branding', icon: Palette, badge: !isSuperAdmin ? '🔒' : null }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Header with Dynamic Logo */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">
            <DynamicBrandLogo size={32} />
            {!isCollapsed && (
              <div className="brand-title-wrap">
                <span className="brand-name">{branding.companyName}</span>
                <span className="brand-tagline">
                  {isSuperAdmin ? '⚡ Super Admin Root' : '🛡️ Operations Admin'}
                </span>
              </div>
            )}
          </div>
          <div className="sidebar-header-actions">
            {onToggleCollapse && (
              <button
                type="button"
                className="sidebar-collapse-btn desktop-only"
                onClick={onToggleCollapse}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
            <button type="button" className="sidebar-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Authenticated User Identity Card (Clean & Compact) */}
        {!isCollapsed ? (
          <div className="sidebar-user-card-wrap">
            <div className={`sidebar-user-card-compact ${isSuperAdmin ? 'super-active' : 'admin-active'}`}>
              <div className="user-avatar-badge">
                {currentUser?.avatar || (isSuperAdmin ? 'SA' : 'AD')}
              </div>
              <div className="user-card-info">
                <div className="user-card-name" title={currentUser?.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman')}>
                  {currentUser?.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman')}
                </div>
                <div className="user-card-role-sub">
                  {isSuperAdmin ? 'Super Admin' : 'Operations Admin'} • {currentUser?.assignedBranch || (isSuperAdmin ? 'All Hubs' : 'Salem Hub')}
                </div>
              </div>
              <button
                type="button"
                className="btn-switch-compact"
                onClick={handleOpenSwitchModal}
                title={`Switch to ${isSuperAdmin ? 'Operations Admin' : 'Super Admin'}`}
                aria-label="Switch Role"
              >
                <KeyRound size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="sidebar-user-card-collapsed" title={`${currentUser?.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman')} (${isSuperAdmin ? 'Super Admin' : 'Operations Admin'})`}>
            <div className="user-avatar-badge small" onClick={handleOpenSwitchModal} style={{ cursor: 'pointer' }}>
              {currentUser?.avatar || (isSuperAdmin ? 'SA' : 'AD')}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {/* Super Admin Modules */}
          <div className="nav-section-title">
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
                title={!isSuperAdmin ? `${item.name} (Super Admin Password Required)` : item.name}
              >
                <Icon size={18} className="nav-item-icon" color={isSuperAdmin ? '#f59e0b' : '#94a3b8'} />
                <span className="nav-item-label">{item.name}</span>
                {item.badge && (
                  <span className="nav-item-badge" style={{
                    background: isSuperAdmin ? '#fef3c7' : '#fee2e2',
                    color: isSuperAdmin ? '#b45309' : '#dc2626'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Section: Bike Repair & Service System */}
          <div className="nav-section-title" style={{ marginTop: '10px' }}>
            <span>BIKE REPAIR & SERVICE</span>
          </div>
          {bikeSystemNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.name}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label">{item.name}</span>
                {item.badge && (
                  <span className="nav-item-badge" style={{
                    background: item.badgeColor || '#356DF3',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Section: Telemetry & Operations */}
          <div className="nav-section-title" style={{ marginTop: '10px' }}>
            <span>FLEET TELEMETRY & OPS</span>
          </div>
          {telemetryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.name}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label">{item.name}</span>
                {item.badge && (
                  <span className="nav-item-badge" style={{
                    background: item.badgeColor || '#356DF3',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Section: Settings & Account */}
          <div className="nav-section-title" style={{ marginTop: '10px' }}>
            <span>SYSTEM & STORAGE</span>
          </div>
          {systemNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.name}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span className="status-dot-pulse" />
            <span>Offline LocalStorage • Synced</span>
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
              {targetRole === 'super_admin' ? <Crown size={18} color="#d97706" /> : <ShieldCheck size={18} color="#356DF3" />}
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
              style={{ fontSize: '11px', fontWeight: 800, background: '#356DF3', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
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

