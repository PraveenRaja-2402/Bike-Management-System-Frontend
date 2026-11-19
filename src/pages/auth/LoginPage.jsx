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
  Key,
  Info,
  Check,
  X
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

  // 1-Click Instant Login (Super Easy & Understandable)
  const handleInstantLogin = (role) => {
    setErrorMessage('');
    setIsSubmitting(true);
    const email = role === 'super_admin' ? 'superadmin@bikeservice.com' : 'admin@bikeservice.com';
    const pwd = role === 'super_admin' ? 'superadmin' : 'admin';

    setTimeout(() => {
      const res = login(email, pwd, true);
      setIsSubmitting(false);

      if (res.success) {
        if (res.user.role === 'super_admin') {
          navigate('/admin/admins', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    }, 250);
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
    }, 350);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Background Mesh */}
      <div className="auth-bg-ambient" />

      <div className="auth-container" style={{ maxWidth: '540px' }}>
        
        {/* Main Card */}
        <div className="auth-card" style={{ padding: '30px 28px' }}>
          
          {/* Header & Dynamic Branding */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <DynamicBrandLogo size={42} />
            </div>
            <h1 className="auth-company-name">{branding.companyName}</h1>
            <p className="auth-tagline">{branding.tagline}</p>
            <div className="auth-security-pill">
              <ShieldCheck size={14} color="#10b981" />
              <span>Role-Based Authentication • Super Admin & Operations Admin</span>
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
                <span>Sign In (Instant Access)</span>
              </button>
              <button
                type="button"
                className={`auth-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => handleModeChange('signup')}
              >
                <UserPlus size={15} />
                <span>Create New Account</span>
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
              {/* Easy Visual Account Cards (1-Click Login or Select) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#f59e0b" />
                  <span>Choose Account to Sign In (1-Click Login):</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  
                  {/* Super Admin Card */}
                  <div 
                    style={{
                      border: signInRole === 'super_admin' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                      background: signInRole === 'super_admin' ? '#fffbeb' : '#ffffff',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: signInRole === 'super_admin' ? '0 4px 14px rgba(245, 158, 11, 0.15)' : 'none'
                    }}
                    onClick={() => {
                      handleSignInPortalSwitch('super_admin');
                      setSignInPassword('superadmin');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Crown size={11} /> SUPER ADMIN
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>ROOT</span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                      Alexander Vance
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                      Admins, Store Hubs & Global Branding
                    </div>

                    <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      Pass: <code>superadmin</code>
                    </div>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantLogin('super_admin');
                      }}
                    >
                      <KeyRound size={12} /> 1-Click Login &rarr;
                    </button>
                  </div>

                  {/* Operations Admin Card */}
                  <div 
                    style={{
                      border: signInRole === 'admin' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: signInRole === 'admin' ? '#eff6ff' : '#ffffff',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: signInRole === 'admin' ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                    onClick={() => {
                      handleSignInPortalSwitch('admin');
                      setSignInPassword('admin');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={11} /> OPS ADMIN
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>BRANCH</span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                      Vikram Raman
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                      User Creation, Job Cards, Fleet & Services
                    </div>

                    <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, marginTop: '6px', background: 'rgba(37, 99, 235, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      Pass: <code>admin</code>
                    </div>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantLogin('admin');
                      }}
                    >
                      <KeyRound size={12} /> 1-Click Login &rarr;
                    </button>
                  </div>

                </div>
              </div>

              {/* Or Manual Sign In Form */}
              <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0' }}>
                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1' }} />
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#ffffff', padding: '0 10px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                  OR ENTER CREDENTIALS MANUALLY
                </span>
              </div>

              <form onSubmit={handleSignInSubmit} className="auth-form">
                <div className="auth-field-group">
                  <label className="auth-label">
                    <span>{signInRole === 'super_admin' ? 'Super Admin Account Email' : 'Operations Admin Account Email'}</span>
                    <span className="auth-required-mark">*</span>
                  </label>
                  <div className="auth-input-wrap">
                    <Mail size={17} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="auth-label" style={{ margin: 0 }}>
                      <span>Password</span>
                      <span className="auth-required-mark">*</span>
                    </label>
                    <span style={{ fontSize: '11px', color: signInRole === 'super_admin' ? '#b45309' : '#1d4ed8', fontWeight: 700 }}>
                      {signInRole === 'super_admin' ? 'Enter "superadmin" or "SuperAdmin@2026!"' : 'Enter "admin" or "Admin@Ops2026!"'}
                    </span>
                  </div>
                  <div className="auth-input-wrap">
                    <Lock size={17} className="auth-input-icon" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder={signInRole === 'super_admin' ? 'Type "superadmin"...' : 'Type "admin"...'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
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
                    <span>Persist session</span>
                  </label>
                  <span className="auth-session-info">256-bit Secure</span>
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
                          ? 'Enter Super Admin Console (Admins & Stores)' 
                          : 'Enter Operations Dashboard (User Creation & Fleet)'
                        }
                      </span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Role Matrix & Authorization Guide (Clear & Understandable) */}
              <div style={{ marginTop: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={14} color="#2563eb" />
                  <span>Role Permissions & Destination Guide:</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>👑 Super Admin Lands On:</strong>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>Super Admin Console</div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>• Admin Management</div>
                    <div style={{ color: '#64748b' }}>• Store Workshop Hubs</div>
                    <div style={{ color: '#64748b' }}>• Logo & Branding Colors</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '4px' }}>🛡️ Admin Lands On:</strong>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>Operations Dashboard</div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>• Customer User Creation</div>
                    <div style={{ color: '#64748b' }}>• Service Monitoring</div>
                    <div style={{ color: '#64748b' }}>• Job Cards & Fleet GPS</div>
                  </div>
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
                      placeholder="Min 4 chars (e.g. admin)"
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
            </form>
          )}

          {/* Customer Portal Shortcut */}
          <div className="auth-customer-link-row" style={{ marginTop: '16px' }}>
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
