import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Crown, 
  UserCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  KeyRound,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../../components/common/DynamicBrandLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, branding, authUsers } = useApp();

  // Active portal tab: 'super_admin' or 'admin'
  const [selectedRole, setSelectedRole] = useState('super_admin');
  const [email, setEmail] = useState('superadmin@bikeservice.com');
  const [password, setPassword] = useState('SuperAdmin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Where to redirect after login (default to /admin/dashboard)
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handlePortalSwitch = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'super_admin') {
      setEmail('superadmin@bikeservice.com');
      setPassword('SuperAdmin@2026!');
    } else {
      setEmail('admin@bikeservice.com');
      setPassword('Admin@Ops2026!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setIsSubmitting(false);

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  const handleQuickAutofill = (type) => {
    setErrorMessage('');
    if (type === 'super_admin') {
      setSelectedRole('super_admin');
      setEmail('superadmin@bikeservice.com');
      setPassword('SuperAdmin@2026!');
    } else if (type === 'admin') {
      setSelectedRole('admin');
      setEmail('admin@bikeservice.com');
      setPassword('Admin@Ops2026!');
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Background Mesh */}
      <div className="auth-bg-ambient" />

      <div className="auth-container">
        
        {/* Main Card */}
        <div className="auth-card">
          
          {/* Header & Dynamic Branding */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <DynamicBrandLogo size={42} />
            </div>
            <h1 className="auth-company-name">{branding.companyName}</h1>
            <p className="auth-tagline">{branding.tagline}</p>
            <div className="auth-security-pill">
              <ShieldCheck size={14} color="#10b981" />
              <span>Multi-Tier Role-Based Security • RBAC Active</span>
            </div>
          </div>

          {/* Portal Selector Tabs: Super Admin vs Operations Admin */}
          <div className="auth-portal-selector">
            <button
              type="button"
              className={`auth-portal-tab ${selectedRole === 'super_admin' ? 'active super-admin' : ''}`}
              onClick={() => handlePortalSwitch('super_admin')}
            >
              <Crown size={16} />
              <div>
                <div className="tab-main-title">Super Admin</div>
                <div className="tab-sub-title">Root & Master Hubs</div>
              </div>
            </button>

            <button
              type="button"
              className={`auth-portal-tab ${selectedRole === 'admin' ? 'active ops-admin' : ''}`}
              onClick={() => handlePortalSwitch('admin')}
            >
              <UserCheck size={16} />
              <div>
                <div className="tab-main-title">Operations Admin</div>
                <div className="tab-sub-title">Branch Workshop Ops</div>
              </div>
            </button>
          </div>

          {/* Error Message Toast / Alert */}
          {errorMessage && (
            <div className="auth-error-banner">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '13px' }}>Authentication Denied</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-group">
              <label className="auth-label">
                <span>{selectedRole === 'super_admin' ? 'Super Admin Identifier / Email' : 'Operations Admin Email'}</span>
                <span className="auth-required-mark">*</span>
              </label>
              <div className="auth-input-wrap">
                <Mail size={17} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder={selectedRole === 'super_admin' ? 'superadmin@bikeservice.com' : 'admin@bikeservice.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label" style={{ margin: 0 }}>
                  <span>{selectedRole === 'super_admin' ? 'Super Admin Password' : 'Admin Password'}</span>
                  <span className="auth-required-mark">*</span>
                </label>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {selectedRole === 'super_admin' ? 'Unique Master Password' : 'Branch Ops Password'}
                </span>
              </div>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter secure account password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-extra-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Persist encrypted session</span>
              </label>
              <span className="auth-session-info">256-bit Token</span>
            </div>

            <button
              type="submit"
              className={`auth-submit-btn ${selectedRole === 'super_admin' ? 'btn-super' : 'btn-ops'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Validating Security Clearance...</span>
              ) : (
                <>
                  <KeyRound size={17} />
                  <span>Authenticate as {selectedRole === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Autofill Pills for Testing */}
          <div className="auth-quick-autofill-section">
            <span className="autofill-title">
              <Sparkles size={13} color="#f59e0b" />
              <span>1-Click Test Credentials (Different Passwords Enforced):</span>
            </span>

            <div className="autofill-grid">
              <button
                type="button"
                className={`autofill-card ${selectedRole === 'super_admin' ? 'selected' : ''}`}
                onClick={() => handleQuickAutofill('super_admin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <Crown size={13} color="#d97706" />
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>Super Admin</strong>
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>superadmin@bikeservice.com</div>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 800, marginTop: '2px' }}>
                  Pass: SuperAdmin@2026!
                </div>
              </button>

              <button
                type="button"
                className={`autofill-card ${selectedRole === 'admin' ? 'selected' : ''}`}
                onClick={() => handleQuickAutofill('admin')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <UserCheck size={13} color="#2563eb" />
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>Operations Admin</strong>
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>admin@bikeservice.com</div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800, marginTop: '2px' }}>
                  Pass: Admin@Ops2026!
                </div>
              </button>
            </div>
          </div>

          {/* Customer Portal Shortcut */}
          <div className="auth-customer-link-row">
            <button
              type="button"
              className="auth-customer-btn"
              onClick={() => navigate('/customer')}
            >
              <Smartphone size={16} />
              <span>Looking for Customer GPS Telemetry & Points? Open Mobile App</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

