import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  const getStyleClass = () => {
    const s = String(status).toLowerCase();
    
    // Status types
    if (s.includes('active') || s.includes('normal') || s.includes('completed') || s.includes('ready')) {
      return 'badge-success';
    }
    if (s.includes('due soon') || s.includes('in service') || s.includes('open') || s.includes('pending')) {
      return 'badge-warning';
    }
    if (s.includes('offline') || s.includes('inactive') || s.includes('stopped') || s.includes('cancelled')) {
      return 'badge-danger';
    }
    if (s.includes('moving')) {
      return 'badge-info';
    }
    if (s.includes('parked')) {
      return 'badge-neutral';
    }

    // Roles
    if (s.includes('customer')) return 'badge-role-customer';
    if (s.includes('technician')) return 'badge-role-technician';
    if (s.includes('service manager')) return 'badge-role-manager';
    if (s.includes('administrator') || s.includes('admin')) return 'badge-role-admin';

    return 'badge-default';
  };

  const styleClass = getStyleClass();

  return (
    <span className={`status-badge ${styleClass} ${className}`}>
      {status === 'Active' && <span className="status-dot">●</span>}
      {status}
    </span>
  );
}
