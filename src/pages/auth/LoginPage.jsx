import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Crown, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  Sparkles, 
  Phone, 
  User, 
  Building2, 
  Key, 
  Check, 
  Zap, 
  MessageSquare, 
  HardDrive, 
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../../components/common/DynamicBrandLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, branding, storesList, authUsers } = useApp();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In state
  const [signInRole, setSignInRole] = useState('admin');
  const [signInEmail, setSignInEmail] = useState('admin@bikeservice.com');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [signUpRole, setSignUpRole] = useState('admin');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpBranch, setSignUpBranch] = useState(storesList[0]?.name || 'Salem Central Mega Hub');
  const [signUpMasterKey, setSignUpMasterKey] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Status banners
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch between Sign In and Sign Up
  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Sign In role switch
  const handleSignInRoleSwitch = (role) => {
    setSignInRole(role);
    setErrorMessage('');
    setSignInPassword('');
    if (role === 'super_admin') {
      setSignInEmail('superadmin@bikeservice.com');
    } else {
      setSignInEmail('admin@bikeservice.com');
    }
  };

  // Discreet Quick-Fill for Local Dev Testing
  const handleDevQuickFill = (role) => {
    setSignInRole(role);
    setErrorMessage('');
    if (role === 'super_admin') {
      setSignInEmail('superadmin@bikeservice.com');
      setSignInPassword('superadmin');
    } else {
      setSignInEmail('admin@bikeservice.com');
      setSignInPassword('admin');
    }
  };

  // Sign In submit
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(signInEmail, signInPassword, rememberMe);
      setIsSubmitting(false);

      if (res.success) {
        if (res.user.role === 'super_admin') {
          navigate('/admin/admins', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    }, 280);
  };

  // Sign Up submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password entries.');
      return;
    }

    if (signUpPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = signup({
        name: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        role: signUpRole,
        password: signUpPassword,
        assignedBranch: signUpRole === 'super_admin' ? 'All Branches' : signUpBranch,
        masterKey: signUpMasterKey
      });

      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(`Account created successfully! Welcome, ${res.user.name}.`);
        setTimeout(() => {
          if (res.user.role === 'super_admin') {
            navigate('/admin/admins', { replace: true });
          } else {
            navigate('/admin/dashboard', { replace: true });
          }
        }, 500);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check form details.');
      }
    }, 320);
  };

  return (
    <div className="saas-auth-wrapper">
      {/* =====================================================================
          1. LEFT HERO SHOWCASE PANEL (Clean Brand Identity & Balanced Overview)
          ===================================================================== */}
      <div className="saas-auth-showcase">
        <div className="saas-showcase-grid" />

        <div className="saas-showcase-content">
          {/* Top Brand Identity */}
          <div className="saas-showcase-header">
            <div className="saas-brand-identity">
              <div className="saas-brand-logo-wrap">
                <DynamicBrandLogo size={28} />
              </div>
              <div>
                <div className="saas-brand-title">{branding.companyName || 'Bike Service Pro'}</div>
                <div className="saas-brand-subtitle">Commercial SaaS Platform</div>
              </div>
            </div>

            <div className="saas-enterprise-badge">
              <Shield size={11} /> ENTERPRISE SAAS
            </div>
          </div>

          {/* Balanced Product Introduction */}
          <div className="saas-showcase-body">
            <div className="saas-hero-pill">
              <Sparkles size={11} /> Workshop & Fleet Intelligence
            </div>

            <h2 className="saas-hero-title">
              Streamlined Workshop & Fleet Operations
            </h2>

            <p className="saas-hero-desc">
              Automate maintenance schedules, track mechanical repairs, generate job cards, and manage customer communications in one unified platform.
            </p>

            {/* Compact Feature Cards */}
            <div className="saas-feature-list">
              <div className="saas-feature-card">
                <div className="saas-feature-icon-box">
                  <Zap size={15} />
                </div>
                <div className="saas-feature-text">
                  <h4>Automated Service Reminders</h4>
                  <p>Predictive distance & date algorithms prevent missed maintenance.</p>
                </div>
              </div>

              <div className="saas-feature-card">
                <div className="saas-feature-icon-box">
                  <MessageSquare size={15} />
                </div>
                <div className="saas-feature-text">
                  <h4>Direct Customer Dispatch</h4>
                  <p>1-click WhatsApp & SMS service receipts and reminders.</p>
                </div>
              </div>

              <div className="saas-feature-card">
                <div className="saas-feature-icon-box">
                  <HardDrive size={15} />
                </div>
                <div className="saas-feature-text">
                  <h4>Offline-First Local Storage</h4>
                  <p>100% browser data persistence with instant pendrive/PC backups.</p>
                </div>
              </div>
            </div>

            {/* Honest Functional Capability Badges (No Unsupported Claims) */}
            <div className="saas-capability-strip">
              <span className="saas-capability-item">
                <strong style={{ color: '#38bdf8' }}>📁</strong> Local PC Storage
              </span>
              <span className="saas-capability-bullet">•</span>
              <span className="saas-capability-item">
                <strong style={{ color: '#34d399' }}>🛡️</strong> Role-Based Access
              </span>
              <span className="saas-capability-bullet">•</span>
              <span className="saas-capability-item">
                <strong style={{ color: '#fbbf24' }}>⚡</strong> Instant WhatsApp Dispatch
              </span>
            </div>
          </div>

          {/* Showcase Footer */}
          <div className="saas-showcase-footer">
            <div className="saas-security-guarantee">
              <ShieldCheck size={13} /> Session Security • Offline Data Engine
            </div>
            <span>v3.4.0 SaaS Edition</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. RIGHT AUTHENTICATION FORM PANEL (Refined Spacing & Alignment)
          ===================================================================== */}
      <div className="saas-auth-form-panel">
        <div className="saas-auth-form-inner">
          
          {/* Mobile Top Brand Bar */}
          <div className="saas-mobile-brand-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#0b132b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DynamicBrandLogo size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>{branding.companyName || 'Bike Service Pro'}</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Enterprise SaaS Portal</div>
              </div>
            </div>
            <span style={{ fontSize: '10px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
              SaaS v3.4
            </span>
          </div>

          {/* Form Header */}
          <div className="saas-form-header">
            <h1 className="saas-form-title">
              {authMode === 'signin' ? 'Sign In to Workspace' : 'Create Enterprise Account'}
            </h1>
            <p className="saas-form-subtitle">
              {authMode === 'signin' 
                ? 'Select your administrative clearance and enter credentials.'
                : 'Provision a new administrative account for your workshop team.'
              }
            </p>
          </div>

          {/* Mode Switcher Segment Control */}
          <div className="saas-mode-toggle">
            <button
              type="button"
              className={`saas-mode-btn ${authMode === 'signin' ? 'active' : ''}`}
              onClick={() => handleModeChange('signin')}
            >
              <Lock size={13} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`saas-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => handleModeChange('signup')}
            >
              <UserPlus size={13} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="saas-alert-banner error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '12.5px' }}>Authentication Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="saas-alert-banner success">
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '12.5px' }}>Account Provisioned</strong>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW A: SIGN IN FORM
              ================================================================= */}
          {authMode === 'signin' && (
            <>
              {/* Compact Role Selection Cards */}
              <div className="saas-role-selector-wrap">
                <div className="saas-role-selector-label">
                  <span>Administrative Clearance:</span>
                </div>

                <div className="saas-role-grid">
                  {/* Operations Admin Card */}
                  <div
                    className={`saas-role-card ${signInRole === 'admin' ? 'active ops-admin' : ''}`}
                    onClick={() => handleSignInRoleSwitch('admin')}
                  >
                    <div className="saas-role-card-top">
                      <div className="saas-role-icon-pill ops">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="saas-role-check-indicator">
                        {signInRole === 'admin' && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="saas-role-name">Operations Admin</div>
                    <div className="saas-role-scope">Customer Onboarding & Workshop Jobs</div>
                    <span className="saas-role-clearance ops">Branch Ops Active</span>
                  </div>

                  {/* Super Admin Card */}
                  <div
                    className={`saas-role-card ${signInRole === 'super_admin' ? 'active super-admin' : ''}`}
                    onClick={() => handleSignInRoleSwitch('super_admin')}
                  >
                    <div className="saas-role-card-top">
                      <div className="saas-role-icon-pill super">
                        <Crown size={16} />
                      </div>
                      <div className="saas-role-check-indicator">
                        {signInRole === 'super_admin' && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="saas-role-name">Super Admin</div>
                    <div className="saas-role-scope">Multi-Branch Hubs & Master Root</div>
                    <span className="saas-role-clearance super">Root Clearance</span>
                  </div>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="saas-form">
                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Account Email Address</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Mail size={15} className="saas-input-icon" />
                    <input
                      type="email"
                      className="saas-input"
                      placeholder="admin@bikeservice.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Password</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Lock size={15} className="saas-input-icon" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      className="saas-input"
                      placeholder="Enter administrative password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="saas-eye-btn"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      aria-label={showSignInPassword ? "Hide password" : "Show password"}
                    >
                      {showSignInPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="saas-form-row">
                  <label className="saas-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Persist session on this workstation</span>
                  </label>

                  <span className="saas-help-link" onClick={() => alert("For security assistance or password recovery, please contact your Super Administrator.")}>
                    Need help?
                  </span>
                </div>

                <button
                  type="submit"
                  className={`saas-submit-btn ${signInRole === 'super_admin' ? 'btn-super' : 'btn-ops'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Authenticating Workspace...</span>
                  ) : (
                    <>
                      <span>
                        {signInRole === 'super_admin' 
                          ? 'Enter Super Admin Console' 
                          : 'Enter Operations Dashboard'
                        }
                      </span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Development Mode Only: Hidden in Production */}
              {import.meta.env.DEV && (
                <details className="saas-dev-drawer">
                  <summary className="saas-dev-summary">
                    <Sparkles size={12} color="#2563eb" />
                    <span>Development Testing Credentials</span>
                  </summary>
                  <div className="saas-dev-content">
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginBottom: '6px' }}>
                      Available only in local development mode for verification:
                    </div>

                    <div className="saas-dev-row">
                      <div>
                        <strong>Ops Admin:</strong> <code>admin@bikeservice.com</code>
                      </div>
                      <button
                        type="button"
                        className="saas-dev-fill-btn"
                        onClick={() => handleDevQuickFill('admin')}
                      >
                        Autofill
                      </button>
                    </div>

                    <div className="saas-dev-row" style={{ marginTop: '3px' }}>
                      <div>
                        <strong>Super Admin:</strong> <code>superadmin@bikeservice.com</code>
                      </div>
                      <button
                        type="button"
                        className="saas-dev-fill-btn"
                        onClick={() => handleDevQuickFill('super_admin')}
                      >
                        Autofill
                      </button>
                    </div>
                  </div>
                </details>
              )}
            </>
          )}

          {/* =================================================================
              VIEW B: SIGN UP FORM (Redesigned with Identical Design Language)
              ================================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="saas-form">
              {/* Role Selection Matching Sign In Exactly */}
              <div className="saas-role-selector-wrap">
                <div className="saas-role-selector-label">
                  <span>Account Type to Provision:</span>
                </div>

                <div className="saas-role-grid">
                  <div
                    className={`saas-role-card ${signUpRole === 'admin' ? 'active ops-admin' : ''}`}
                    onClick={() => setSignUpRole('admin')}
                  >
                    <div className="saas-role-card-top">
                      <div className="saas-role-icon-pill ops">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="saas-role-check-indicator">
                        {signUpRole === 'admin' && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="saas-role-name">Operations Admin</div>
                    <div className="saas-role-scope">Branch workshop & customer management</div>
                    <span className="saas-role-clearance ops">Branch Ops Access</span>
                  </div>

                  <div
                    className={`saas-role-card ${signUpRole === 'super_admin' ? 'active super-admin' : ''}`}
                    onClick={() => setSignUpRole('super_admin')}
                  >
                    <div className="saas-role-card-top">
                      <div className="saas-role-icon-pill super">
                        <Crown size={16} />
                      </div>
                      <div className="saas-role-check-indicator">
                        {signUpRole === 'super_admin' && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="saas-role-name">Super Admin</div>
                    <div className="saas-role-scope">Executive root management</div>
                    <span className="saas-role-clearance super">Master Root Clearance</span>
                  </div>
                </div>
              </div>

              {/* Master Key input if Super Admin is selected */}
              {signUpRole === 'super_admin' && (
                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Super Admin Master Key Authorization</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Key size={15} className="saas-input-icon" />
                    <input
                      type="password"
                      className="saas-input"
                      placeholder="Enter corporate master security key"
                      value={signUpMasterKey}
                      onChange={(e) => setSignUpMasterKey(e.target.value)}
                      required
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Hint: Default corporate master key is <code>MASTER-2026-SALEM</code>
                  </span>
                </div>
              )}

              {/* Full Name & Work Email */}
              <div className="saas-field-grid-2">
                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Full Name</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <User size={15} className="saas-input-icon" />
                    <input
                      type="text"
                      className="saas-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Work Email</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Mail size={15} className="saas-input-icon" />
                    <input
                      type="email"
                      className="saas-input"
                      placeholder="ramesh@bikeservice.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Assigned Branch Hub */}
              <div className="saas-field-grid-2">
                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Mobile Number</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Phone size={15} className="saas-input-icon" />
                    <input
                      type="tel"
                      className="saas-input"
                      placeholder="9876543210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Assigned Workshop Hub</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Building2 size={15} className="saas-input-icon" />
                    <select
                      className="saas-input"
                      value={signUpBranch}
                      onChange={(e) => setSignUpBranch(e.target.value)}
                      disabled={signUpRole === 'super_admin'}
                      style={{ cursor: signUpRole === 'super_admin' ? 'not-allowed' : 'pointer' }}
                    >
                      {signUpRole === 'super_admin' ? (
                        <option value="All Branches">All Mega Hubs (Global Master)</option>
                      ) : (
                        storesList.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="saas-field-grid-2">
                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Password</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Lock size={15} className="saas-input-icon" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      className="saas-input"
                      placeholder="Min. 4 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="saas-field-group">
                  <label className="saas-label">
                    <span>Confirm Password</span>
                    <span className="saas-required-mark">*</span>
                  </label>
                  <div className="saas-input-wrap">
                    <Lock size={15} className="saas-input-icon" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      className="saas-input"
                      placeholder="Re-enter password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="saas-eye-btn"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    >
                      {showSignUpPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`saas-submit-btn ${signUpRole === 'super_admin' ? 'btn-super' : 'btn-ops'}`}
                disabled={isSubmitting}
                style={{ marginTop: '8px' }}
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>Create Enterprise Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Customer Mobile App Shortcut Link */}
          <div className="saas-customer-portal-shortcut">
            <button
              type="button"
              className="saas-customer-btn"
              onClick={() => navigate('/customer')}
            >
              <span>Looking for Rider Mobile App?</span>
              <strong style={{ color: '#2563eb' }}>Launch Customer Portal &rarr;</strong>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
