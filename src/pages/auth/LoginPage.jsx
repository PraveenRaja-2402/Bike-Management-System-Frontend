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
  Smartphone,
  User,
  Phone,
  Building2,
  UserPlus,
  Key
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
  const [signInRole, setSignInRole] = useState('super_admin');
  const [signInEmail, setSignInEmail] = useState('superadmin@bikeservice.com');
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

  // Common status
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch between Sign In and Sign Up
  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Sign In portal tab switch
  const handleSignInPortalSwitch = (role) => {
    setSignInRole(role);
    setErrorMessage('');
    setSignInPassword('');
    if (role === 'super_admin') {
      setSignInEmail('superadmin@bikeservice.com');
    } else {
      setSignInEmail('admin@bikeservice.com');
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
        // Super Admin lands on Super Admin Console (/admin/admins)
        // Operations Admin lands on Operations Dashboard (/admin/dashboard)
        if (res.user.role === 'super_admin') {
          navigate('/admin/admins', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 300);
  };

  // Sign Up submit
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
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
        }, 600);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check form details.');
      }
    }, 400);
  };

  // Quick 1-click test fill for evaluation
  const handleQuickAutofill = (type) => {
    setErrorMessage('');
    setAuthMode('signin');
    if (type === 'super_admin') {
      setSignInRole('super_admin');
      setSignInEmail('superadmin@bikeservice.com');
      setSignInPassword('SuperAdmin@2026!');
    } else if (type === 'admin') {
      setSignInRole('admin');
      setSignInEmail('admin@bikeservice.com');
      setSignInPassword('Admin@Ops2026!');
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

          {/* Primary Mode Toggle: Sign In vs Sign Up */}
          <div className="auth-mode-toggle-wrap">
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`auth-mode-btn ${authMode === 'signin' ? 'active' : ''}`}
                onClick={() => handleModeChange('signin')}
              >
                <Lock size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`auth-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => handleModeChange('signup')}
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </div>
          </div>

          {/* Error Message Toast / Alert */}
          {errorMessage && (
            <div className="auth-error-banner">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '13px' }}>Authentication Alert</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Message Toast */}
          {successMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* =================================================================
              VIEW 1: SIGN IN FORM
              ================================================================= */}
          {authMode === 'signin' && (
            <>
              {/* Portal Selector Tabs: Super Admin vs Operations Admin */}
              <div className="auth-portal-selector">
                <button
                  type="button"
                  className={`auth-portal-tab ${signInRole === 'super_admin' ? 'active super-admin' : ''}`}
                  onClick={() => handleSignInPortalSwitch('super_admin')}
                >
                  <Crown size={16} />
                  <div>
                    <div className="tab-main-title">Super Admin</div>
                    <div className="tab-sub-title">Root & Master Hubs</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`auth-portal-tab ${signInRole === 'admin' ? 'active ops-admin' : ''}`}
                  onClick={() => handleSignInPortalSwitch('admin')}
                >
                  <UserCheck size={16} />
                  <div>
                    <div className="tab-main-title">Operations Admin</div>
                    <div className="tab-sub-title">Branch Workshop Ops</div>
                  </div>
                </button>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="auth-form">
                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>{signInRole === 'super_admin' ? 'Super Admin Identifier / Email' : 'Operations Admin Email'}</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Mail size={17} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={signInRole === 'super_admin' ? 'superadmin@bikeservice.com' : 'admin@bikeservice.com'}
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="auth-label" style={{ margin: 0 }}>
                      <span>{signInRole === 'super_admin' ? 'Super Admin Password' : 'Admin Password'}</span>
                      <span className="auth-required-mark">*</span>
                    </label>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {signInRole === 'super_admin' ? 'Pass: SuperAdmin@2026!' : 'Pass: Admin@Ops2026!'}
                    </span>
                  </div>
                  <div className="auth-input-wrap">
                    <Lock size={17} className="auth-input-icon" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder={signInRole === 'super_admin' ? 'Enter SuperAdmin@2026!...' : 'Enter Admin@Ops2026!...'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      aria-label={showSignInPassword ? "Hide password" : "Show password"}
                    >
                      {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  className={`auth-submit-btn ${signInRole === 'super_admin' ? 'btn-super' : 'btn-ops'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Validating Security Clearance...</span>
                  ) : (
                    <>
                      <KeyRound size={17} />
                      <span>
                        {signInRole === 'super_admin' 
                          ? 'Sign In to Super Admin Console' 
                          : 'Sign In to Admin Operations Dashboard'
                        }
                      </span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Switch Prompt */}
              <div className="auth-switch-prompt-row">
                <span>New administrator on the team?</span>
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => handleModeChange('signup')}
                >
                  Create New Account (Sign Up) &rarr;
                </button>
              </div>

              {/* Quick Credential Autofill Pills for Testing */}
              <div className="auth-quick-autofill-section">
                <span className="autofill-title">
                  <Sparkles size={13} color="#f59e0b" />
                  <span>1-Click Test Credentials (Different Passwords Enforced):</span>
                </span>

                <div className="autofill-grid">
                  <button
                    type="button"
                    className={`autofill-card ${signInRole === 'super_admin' ? 'selected' : ''}`}
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
                    <div style={{ fontSize: '10px', color: '#059669', marginTop: '3px', fontWeight: 600 }}>
                      ➔ Lands on Super Admin Console
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`autofill-card ${signInRole === 'admin' ? 'selected' : ''}`}
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
                    <div style={{ fontSize: '10px', color: '#059669', marginTop: '3px', fontWeight: 600 }}>
                      ➔ Lands on Operations Dashboard
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              VIEW 2: SIGN UP FORM
              ================================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="auth-form">
              {/* Account Role Selector for Sign Up */}
              <div className="auth-field-group">
                <label className="auth-label">
                  <span>Select Account Role Clearance</span>
                  <span className="auth-required-mark">*</span>
                </label>
                <div className="auth-portal-selector" style={{ marginBottom: '6px' }}>
                  <button
                    type="button"
                    className={`auth-portal-tab ${signUpRole === 'admin' ? 'active ops-admin' : ''}`}
                    onClick={() => {
                      setSignUpRole('admin');
                      setErrorMessage('');
                    }}
                  >
                    <UserCheck size={16} />
                    <div>
                      <div className="tab-main-title">Operations Admin</div>
                      <div className="tab-sub-title">Workshop Branch Admin</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`auth-portal-tab ${signUpRole === 'super_admin' ? 'active super-admin' : ''}`}
                    onClick={() => {
                      setSignUpRole('super_admin');
                      setErrorMessage('');
                    }}
                  >
                    <Crown size={16} />
                    <div>
                      <div className="tab-main-title">Super Admin</div>
                      <div className="tab-sub-title">Root Clearances (Key Req.)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="auth-field-group">
                <label className="auth-label">
                  <span>Full Legal Name</span>
                  <span className="auth-required-mark">*</span>
                </label>
                <div className="auth-input-wrap">
                  <User size={17} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Ramesh Kumar"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Work Email & Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>Work Email</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="name@bikeservice.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>Phone Number</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Phone size={16} className="auth-input-icon" />
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="9876543210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Branch (if Operations Admin) or Master Key (if Super Admin) */}
              {signUpRole === 'admin' ? (
                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>Assigned Workshop Store Hub</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Building2 size={17} className="auth-input-icon" />
                    <select
                      className="auth-input"
                      style={{ paddingLeft: '42px', appearance: 'auto' }}
                      value={signUpBranch}
                      onChange={(e) => setSignUpBranch(e.target.value)}
                      required
                    >
                      {storesList.map(st => (
                        <option key={st.id} value={st.name}>{st.name} ({st.city})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="auth-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="auth-label" style={{ margin: 0 }}>
                      <span>Super Admin Security Key</span>
                      <span className="auth-required-mark">*</span>
                    </label>
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                      Demo Key: SUPER-ROOT-2026
                    </span>
                  </div>
                  <div className="auth-input-wrap">
                    <Key size={17} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter SUPER-ROOT-2026..."
                      value={signUpMasterKey}
                      onChange={(e) => setSignUpMasterKey(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>Create Password</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Min 6 chars"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>Confirm Password</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="Re-enter password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Show password toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '11.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {showSignUpPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showSignUpPassword ? 'Hide passwords' : 'Show passwords'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`auth-submit-btn ${signUpRole === 'super_admin' ? 'btn-super' : 'btn-ops'}`}
                disabled={isSubmitting}
                style={{ marginTop: '8px' }}
              >
                {isSubmitting ? (
                  <span>Registering Administrator...</span>
                ) : (
                  <>
                    <UserPlus size={17} />
                    <span>
                      {signUpRole === 'super_admin' 
                        ? 'Sign Up as Super Admin & Launch Console' 
                        : 'Sign Up as Operations Admin & Launch Dashboard'
                      }
                    </span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Switch back to Sign In */}
              <div className="auth-switch-prompt-row">
                <span>Already have an administrator account?</span>
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => handleModeChange('signin')}
                >
                  Sign In instead &rarr;
                </button>
              </div>
            </form>
          )}

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
