import React from 'react';
import { useApp } from '../../context/AppContext';

export default function DynamicBrandLogo({ size = 36, showText = false, className = '' }) {
  const { branding } = useApp();

  const renderIcon = () => {
    if (branding.logoType === 'custom' && branding.customLogoUrl) {
      return (
        <img 
          src={branding.customLogoUrl} 
          alt={branding.companyName} 
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: '8px' }}
        />
      );
    }

    // Preset SVG logos
    if (branding.selectedPreset === 'sport') {
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="46" fill="#0f172a" />
          <path d="M25 65 L45 35 L65 35 L75 55 L55 55 L40 65 Z" fill="#f59e0b" />
          <circle cx="35" cy="65" r="12" fill="none" stroke="#38bdf8" strokeWidth="5" />
          <circle cx="75" cy="65" r="12" fill="none" stroke="#38bdf8" strokeWidth="5" />
        </svg>
      );
    }

    if (branding.selectedPreset === 'apex') {
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <rect x="8" y="8" width="84" height="84" rx="20" fill="#1e1b4b" />
          <path d="M24 72 L50 24 L76 72 L62 72 L50 48 L38 72 Z" fill="#6366f1" />
          <circle cx="50" cy="64" r="6" fill="#a855f7" />
        </svg>
      );
    }

    if (branding.selectedPreset === 'shield') {
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <path d="M50 10 L82 24 V52 C82 72 50 90 50 90 C50 90 18 72 18 52 V24 Z" fill="#047857" />
          <path d="M35 50 L45 60 L68 36" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Default 'modern' preset
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={branding.primaryColor || "#2563eb"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-3h3l2 4" />
        <path d="M9 17.5h5.5" />
      </svg>
    );
  };

  return (
    <div className={`dynamic-brand-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div 
        style={{ 
          width: size + 8, 
          height: size + 8, 
          borderRadius: '10px', 
          background: '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}
      >
        {renderIcon()}
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'inherit', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            {branding.companyName}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.75, fontWeight: 500 }}>
            {branding.tagline}
          </span>
        </div>
      )}
    </div>
  );
}

