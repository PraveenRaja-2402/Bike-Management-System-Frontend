import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Lock, 
  Crown, 
  ArrowLeft, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Building2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RequireSuperAdmin({ children, moduleName = "Super Admin Module" }) {
  const { currentRole, currentUser, switchAccountWithPassword } = useApp();
  const navigate = useNavigate();

  const [elevationPassword, setElevationPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If already Super Admin, render children normally!
  if (currentRole === 'super_admin') {
    return children;
  }

  const handleElevate = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = switchAccountWithPassword('super_admin', elevationPassword);
    if (res.success) {
      setSuccessMessage('Elevated to Super Admin session successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Incorrect Super Admin password. (Hint: SuperAdmin@2026!)');
    }
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-icon-circle">
          <ShieldAlert size={44} color="#dc2626" />
        </div>

        <div className="access-role-badge">
          <Lock size={13} />
          <span>Security Clearance Level: Master Required</span>
        </div>

        <h2 className="access-title">Access Restricted: Super Admin Only</h2>
        
        <p className="access-desc">
          The requested module (<strong>{moduleName}</strong>) requires root <strong>Super Admin</strong> credentials.
          You are currently logged in as:
        </p>

        <div className="access-user-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-avatar-tag">{currentUser?.avatar || 'A'}</div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{currentUser?.email} • {currentUser?.badge}</div>
            </div>
          </div>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
            {currentUser?.assignedBranch || 'Branch Admin'}
          </span>
        </div>

        {errorMessage && (
          <div className="auth-error-banner" style={{ marginTop: '14px', marginBottom: 0 }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '12px' }}>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #10b981', padding: '10px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Elevate with Super Admin Password */}
        <form onSubmit={handleElevate} className="elevation-form">
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
            Elevate to Super Admin (Enter Master Password):
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              className="form-input no-left-icon"
              placeholder="Enter SuperAdmin@2026!..."
              value={elevationPassword}
              onChange={(e) => setElevationPassword(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ background: '#2563eb', padding: '0 16px', whiteSpace: 'nowrap' }}
            >
              <KeyRound size={15} /> Unlock
            </button>
          </div>
          <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block', marginTop: '4px', textAlign: 'left' }}>
            Hint: Super Admin password is <strong>SuperAdmin@2026!</strong>
          </span>
        </form>

        <div className="access-footer-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

