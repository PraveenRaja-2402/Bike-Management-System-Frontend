import React from 'react';

export default function BrandLogo({ brand, size = 32, className = '' }) {
  const norm = (brand || '').toLowerCase().replace(/[\s-_]/g, '');

  if (norm.includes('yamaha')) {
    return (
      <div 
        className={`brand-logo-container yamaha ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="48" fill="#d92228" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeWidth="4" />
          {/* Tuning forks icon */}
          <path d="M50 20 L50 80 M50 50 L25 35 M50 50 L75 35 M50 50 L25 65 M50 50 L75 65" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="8" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (norm.includes('honda')) {
    return (
      <div 
        className={`brand-logo-container honda ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <path d="M15 65 Q 45 35, 85 25 Q 70 45, 55 55 Q 85 45, 88 55 Q 65 65, 45 70 Q 25 72, 15 65 Z" fill="#cc0000" />
          <path d="M22 75 L78 75 L72 82 L28 82 Z" fill="#cc0000" />
        </svg>
      </div>
    );
  }

  if (norm.includes('tvs')) {
    return (
      <div 
        className={`brand-logo-container tvs ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 100 60" width={size * 1.4} height={size}>
          <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="#003399" fontWeight="900" fontSize="34" letterSpacing="1">TVS</text>
          <path d="M10 12 Q 30 6, 45 10 L 40 18 Q 25 14, 15 18 Z" fill="#d92228" />
        </svg>
      </div>
    );
  }

  if (norm.includes('bajaj')) {
    return (
      <div 
        className={`brand-logo-container bajaj ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <rect x="15" y="25" width="70" height="50" rx="10" fill="#004687" />
          <path d="M35 35 L48 50 L35 65 L44 65 L57 50 L44 35 Z M52 35 L65 50 L52 65 L61 65 L74 50 L61 35 Z" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (norm.includes('hero')) {
    return (
      <div 
        className={`brand-logo-container hero ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 100 60" width={size * 1.5} height={size}>
          <path d="M15 15 L28 35 L15 50 L25 50 L38 35 L25 15 Z" fill="#d92228" />
          <text x="65" y="38" textAnchor="middle" fill="#1e293b" fontWeight="800" fontSize="28">Hero</text>
        </svg>
      </div>
    );
  }

  if (norm.includes('royalenfield') || norm.includes('royal')) {
    return (
      <div 
        className={`brand-logo-container royalenfield ${className}`} 
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 110 60" width={size * 1.6} height={size}>
          <rect x="2" y="10" width="106" height="40" rx="4" fill="#8b0000" />
          <text x="55" y="26" textAnchor="middle" fill="#f59e0b" fontWeight="900" fontSize="13" letterSpacing="1">ROYAL</text>
          <text x="55" y="42" textAnchor="middle" fill="#ffffff" fontWeight="800" fontSize="12" letterSpacing="0.5">ENFIELD</text>
        </svg>
      </div>
    );
  }

  // Fallback generic bike badge
  return (
    <div 
      className={`brand-logo-container generic ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        backgroundColor: '#e2e8f0', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        color: '#475569'
      }}
    >
      {(brand || 'B').slice(0, 2).toUpperCase()}
    </div>
  );
}
