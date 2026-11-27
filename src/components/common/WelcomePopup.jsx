import React, { useEffect } from 'react';
import { Crown, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function WelcomePopup({ isOpen, onClose, user, isSuperAdmin }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = user?.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman');
  const branchName = user?.assignedBranch || (isSuperAdmin ? 'All Salem Branches' : 'Salem Central Mega Hub');

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 100000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '430px',
          padding: '32px 28px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          animation: 'modalPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* SweetAlert-style Animated Icon Ring */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSuperAdmin
              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
              : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: isSuperAdmin ? '4px solid #fffbeb' : '4px solid #f0f9ff',
            boxShadow: isSuperAdmin
              ? '0 0 0 2px #f59e0b, 0 10px 24px rgba(245, 158, 11, 0.25)'
              : '0 0 0 2px #356DF3, 0 10px 24px rgba(53, 109, 243, 0.25)',
            position: 'relative'
          }}
        >
          {isSuperAdmin ? (
            <Crown size={34} color="#d97706" />
          ) : (
            <ShieldCheck size={34} color="#356DF3" />
          )}
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={14} color="#ffffff" />
          </span>
        </div>

        {/* Role Pill */}
        <div style={{ marginBottom: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: isSuperAdmin ? '#fef3c7' : '#eff6ff',
              color: isSuperAdmin ? '#b45309' : '#2957CC',
              border: isSuperAdmin ? '1px solid #fde68a' : '1px solid #bfdbfe'
            }}
          >
            <Sparkles size={12} />
            <span>{isSuperAdmin ? 'Super Admin Workspace' : 'Operations Admin Workspace'}</span>
          </span>
        </div>

        {/* Welcome Title & Role-Appropriate Message */}
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '21px',
            fontWeight: 800,
            color: '#101828',
            letterSpacing: '-0.4px'
          }}
        >
          Welcome back, {displayName}!
        </h2>

        <p
          style={{
            margin: '0 0 20px 0',
            fontSize: '13.5px',
            color: '#667085',
            lineHeight: 1.55
          }}
        >
          {isSuperAdmin
            ? `You are signed in with full Super Admin privileges across ${branchName}. Manage hubs, branding, analytics, and team access.`
            : `You are signed in to ${branchName}. Manage customer onboarding, job completions, service predictions, and sales reports.`}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-primary"
          style={{
            width: '100%',
            height: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 700,
            borderRadius: '12px'
          }}
        >
          <span>Continue to Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
