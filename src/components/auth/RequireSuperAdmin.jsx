import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Lock, 
  Crown,
  Sparkles,
  ArrowLeft, 
  Building2, 
  Users,
  Palette,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RequireSuperAdmin({ children, moduleName = "Super Admin Feature" }) {
  const { currentRole, currentUser } = useApp();
  const navigate = useNavigate();

  // If already Super Admin, render children normally!
  if (currentRole === 'super_admin') {
    return children;
  }

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
              <div style={{ fontWeight: 800, color: '#2957CC', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

