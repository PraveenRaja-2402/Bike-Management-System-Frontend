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
  Users,
  Palette,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RequireSuperAdmin({ children, moduleName = "Super Admin Feature" }) {
  const { currentRole, currentUser, switchAccountWithPassword } = useApp();
  const navigate = useNavigate();

  const [elevationPassword, setElevationPassword] = useState('superadmin');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If already Super Admin, render children normally!
  if (currentRole === 'super_admin') {
    return children;
  }

  const handleElevate = (pwd = elevationPassword) => {
    setErrorMessage('');
    const res = switchAccountWithPassword('super_admin', pwd);
    if (res.success) {
      setSuccessMessage('Elevated to Super Admin session successfully!');
      setTimeout(() => setSuccessMessage(''), 1500);
    } else {
      setErrorMessage(res.error || 'Incorrect Super Admin password. (Hint: password is "superadmin" or "SuperAdmin@2026!")');
    }
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card" style={{ maxWidth: '580px', padding: '36px 32px' }}>
        <div className="access-icon-circle" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
          <Crown size={42} color="#d97706" />
        </div>

        <div className="access-role-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
          <Lock size={13} />
          <span>Root Authorization Required</span>
        </div>

        <h2 className="access-title" style={{ fontSize: '22px' }}>
          Super Admin Access Required
        </h2>
        
        <p className="access-desc" style={{ fontSize: '13.5px', marginBottom: '18px' }}>
          The module <strong>"{moduleName}"</strong> is restricted to system-level Super Administrators.
          You are currently signed in as <strong>{currentUser?.name || 'Operations Admin'}</strong>.
        </p>

        {/* Understandable Role Permissions Breakdown */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Why is this restricted? Role Governance Breakdown:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '11.5px' }}>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <div style={{ fontWeight: 800, color: '#b45309', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Crown size={13} /> Super Admin Only
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <Check size={12} color="#16a34a" /> Admin User Creation
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <Check size={12} color="#16a34a" /> Store Workshop Hubs
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} color="#16a34a" /> Logo & Dynamic Branding
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} /> Operations Admin
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <Check size={12} color="#16a34a" /> Customer User Creation
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <Check size={12} color="#16a34a" /> Job Cards & Workflows
              </div>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} color="#16a34a" /> Live GPS Fleet & Services
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="auth-error-banner" style={{ marginTop: '0', marginBottom: '16px' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '12px' }}>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #10b981', padding: '10px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1-Click Instant Elevation Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
              padding: '12px 18px', 
              fontSize: '13.5px', 
              fontWeight: 800,
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
            }}
            onClick={() => handleElevate('superadmin')}
          >
            <Crown size={16} /> ⚡ 1-Click Switch to Super Admin (Pass: superadmin)
          </button>
        </div>

        <div className="access-footer-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft size={15} /> Return to Operations Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
