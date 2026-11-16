import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Smartphone, 
  Layout, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../../components/common/DynamicBrandLogo';

export default function BrandingPage() {
  const { currentRole, switchRole, branding, updateBranding } = useApp();

  const [formState, setFormState] = useState({
    companyName: branding.companyName,
    tagline: branding.tagline,
    logoType: branding.logoType,
    selectedPreset: branding.selectedPreset,
    customLogoUrl: branding.customLogoUrl,
    primaryColor: branding.primaryColor,
    accentColor: branding.accentColor,
    supportPhone: branding.supportPhone,
    supportEmail: branding.supportEmail
  });

  const [successToast, setSuccessToast] = useState('');

  const colorPresets = [
    { name: 'Royal Blue', color: '#2563eb', accent: '#3b82f6' },
    { name: 'Speed Red', color: '#dc2626', accent: '#ef4444' },
    { name: 'Racing Green', color: '#059669', accent: '#10b981' },
    { name: 'Midnight Violet', color: '#7c3aed', accent: '#8b5cf6' },
    { name: 'Amber Gold', color: '#d97706', accent: '#f59e0b' },
    { name: 'Dark Stealth', color: '#0f172a', accent: '#334155' }
  ];

  const logoPresets = [
    {
      id: 'modern',
      title: 'Modern Fleet Cycle',
      desc: 'Clean geometric bicycle vector',
      render: () => (
        <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke={formState.primaryColor} strokeWidth="2.2">
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-3h3l2 4" />
          <path d="M9 17.5h5.5" />
        </svg>
      )
    },
    {
      id: 'sport',
      title: 'Sport Superbike',
      desc: 'High velocity motorbike badge',
      render: () => (
        <svg viewBox="0 0 100 100" width={32} height={32}>
          <circle cx="50" cy="50" r="46" fill="#0f172a" />
          <path d="M25 65 L45 35 L65 35 L75 55 L55 55 L40 65 Z" fill="#f59e0b" />
          <circle cx="35" cy="65" r="12" fill="none" stroke="#38bdf8" strokeWidth="5" />
          <circle cx="75" cy="65" r="12" fill="none" stroke="#38bdf8" strokeWidth="5" />
        </svg>
      )
    },
    {
      id: 'apex',
      title: 'Apex Speed Emblem',
      desc: 'Futuristic angular monogram',
      render: () => (
        <svg viewBox="0 0 100 100" width={32} height={32}>
          <rect x="8" y="8" width="84" height="84" rx="20" fill="#1e1b4b" />
          <path d="M24 72 L50 24 L76 72 L62 72 L50 48 L38 72 Z" fill="#6366f1" />
          <circle cx="50" cy="64" r="6" fill="#a855f7" />
        </svg>
      )
    },
    {
      id: 'shield',
      title: 'Shield Care Guarantee',
      desc: 'Protective service warranty shield',
      render: () => (
        <svg viewBox="0 0 100 100" width={32} height={32}>
          <path d="M50 10 L82 24 V52 C82 72 50 90 50 90 C50 90 18 72 18 52 V24 Z" fill="#047857" />
          <path d="M35 50 L45 60 L68 36" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload an optimized image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormState({
          ...formState,
          logoType: 'custom',
          customLogoUrl: uploadEvent.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateBranding(formState);
    setSuccessToast('System logo & branding updated successfully across all panels!');
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleReset = () => {
    const def = {
      companyName: "Bike Service Pro",
      tagline: "Smart IoT Fleet & Bike Care Center",
      logoType: "preset",
      selectedPreset: "modern",
      customLogoUrl: "",
      primaryColor: "#2563eb",
      accentColor: "#3b82f6",
      supportPhone: "1800-425-BIKE",
      supportEmail: "support@bikeservicepro.com"
    };
    setFormState(def);
    updateBranding(def);
    setSuccessToast('Branding reset to default system theme.');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="branding-page">
      {currentRole !== 'super_admin' && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          color: '#92400e',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <div>
              <strong>Super Admin Privilege:</strong> Logo change and corporate identity settings require Super Admin access.
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => switchRole('super_admin')}
          >
            Switch to Super Admin
          </button>
        </div>
      )}

      {successToast && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Form: Customizer */}
        <form onSubmit={handleSave} className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Logo & Brand Identity</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Super Admin control for system-wide branding</p>
              </div>
            </div>

            <button type="button" className="btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={13} /> Reset Default
            </button>
          </div>

          {/* Company Name & Tagline */}
          <div className="form-group">
            <label className="form-label">Service Center / Company Name *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              required
              value={formState.companyName}
              onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
              placeholder="e.g. Apex Bike Care Salem"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Tagline *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              required
              value={formState.tagline}
              onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
              placeholder="e.g. Smart IoT Fleet & Service Center"
            />
          </div>

          {/* Logo Selection: Upload or Preset */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>Choose Logo Method</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                className={`btn-secondary ${formState.logoType === 'preset' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderColor: formState.logoType === 'preset' ? '#2563eb' : '#cbd5e1',
                  background: formState.logoType === 'preset' ? '#eff6ff' : '#ffffff',
                  color: formState.logoType === 'preset' ? '#2563eb' : '#475569',
                  fontWeight: 600
                }}
                onClick={() => setFormState({ ...formState, logoType: 'preset' })}
              >
                Select Built-in Preset
              </button>

              <button
                type="button"
                className={`btn-secondary ${formState.logoType === 'custom' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderColor: formState.logoType === 'custom' ? '#2563eb' : '#cbd5e1',
                  background: formState.logoType === 'custom' ? '#eff6ff' : '#ffffff',
                  color: formState.logoType === 'custom' ? '#2563eb' : '#475569',
                  fontWeight: 600
                }}
                onClick={() => setFormState({ ...formState, logoType: 'custom' })}
              >
                Upload Custom Logo
              </button>
            </div>

            {formState.logoType === 'preset' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {logoPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setFormState({ ...formState, selectedPreset: preset.id })}
                    style={{
                      border: formState.selectedPreset === preset.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: formState.selectedPreset === preset.id ? '#f0f7ff' : '#ffffff',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '10px',
                      background: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {preset.render()}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{preset.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{preset.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: '#f8fafc'
              }}>
                {formState.customLogoUrl ? (
                  <div style={{ marginBottom: '14px' }}>
                    <img
                      src={formState.customLogoUrl}
                      alt="Uploaded Logo Preview"
                      style={{ height: '70px', maxWidth: '200px', objectFit: 'contain', margin: '0 auto', display: 'block', borderRadius: '8px' }}
                    />
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '8px' }}>
                      ✓ Custom logo loaded ready to apply
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b', marginBottom: '12px' }}>
                    <Upload size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>Click to browse or drag & drop PNG, JPG, or SVG</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Recommended square or 1:1 aspect ratio, max 2MB</div>
                  </div>
                )}

                <label className="btn-primary" style={{ display: 'inline-flex', cursor: 'pointer', padding: '8px 16px' }}>
                  <Upload size={14} /> Choose Image File
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Primary Color Palette */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label">Brand Color Theme</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {colorPresets.map((cp) => (
                <button
                  key={cp.color}
                  type="button"
                  onClick={() => setFormState({ ...formState, primaryColor: cp.color, accentColor: cp.accent })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: formState.primaryColor === cp.color ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: cp.color }} />
                  <span>{cp.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 24px' }}
              disabled={currentRole !== 'super_admin'}
            >
              <CheckCircle2 size={16} /> Apply System Logo & Branding
            </button>
          </div>
        </form>

        {/* Right Card: Real-time Multi-Device Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={16} color="#2563eb" />
              <span>Admin Sidebar Preview</span>
            </h4>

            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  overflow: 'hidden'
                }}>
                  {formState.logoType === 'custom' && formState.customLogoUrl ? (
                    <img src={formState.customLogoUrl} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  ) : (
                    logoPresets.find(p => p.id === formState.selectedPreset)?.render()
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{formState.companyName}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{formState.tagline}</div>
                </div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Admin
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={16} color="#2563eb" />
              <span>Customer Mobile Header Preview</span>
            </h4>

            <div style={{
              background: '#1d4ed8',
              borderRadius: '16px',
              padding: '18px',
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(29, 78, 216, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {formState.logoType === 'custom' && formState.customLogoUrl ? (
                      <img src={formState.customLogoUrl} alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    ) : (
                      logoPresets.find(p => p.id === formState.selectedPreset)?.render()
                    )}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '15px' }}>{formState.companyName}</span>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '12px' }}>
                  Customer
                </span>
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Hi Bharath, Your bike is safely connected!</div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#2563eb" />
              <span>Job Card / Invoice Header Preview</span>
            </h4>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{formState.companyName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>GSTIN: 33AAAAA0000A1Z5 • Salem Center</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>TAX INVOICE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

