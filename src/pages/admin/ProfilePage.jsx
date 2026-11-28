import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Calendar, 
  UploadCloud, 
  Lock, 
  Eye, 
  EyeOff, 
  Info, 
  FileText, 
  Edit3,
  CheckCircle,
  AlertCircle,
  Crown,
  ShieldCheck,
  KeyRound,
  Copy,
  MapPin,
  Building2,
  Sparkles,
  Clock,
  Laptop,
  Smartphone,
  Check,
  CheckCircle2,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { mockActivityLogs } from '../../data/mockData';

const AVATAR_COLOR_PRESETS = [
  { name: 'Electric Blue', bg: 'linear-gradient(135deg, #356DF3, #1e40af)' },
  { name: 'Royal Indigo', bg: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  { name: 'Emerald Green', bg: 'linear-gradient(135deg, #10b981, #047857)' },
  { name: 'Amber Gold', bg: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  { name: 'Crimson Rose', bg: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  { name: 'Obsidian Night', bg: 'linear-gradient(135deg, #334155, #0f172a)' }
];

export default function ProfilePage() {
  const { 
    currentUser, 
    currentRole, 
    updateCurrentUserProfile, 
    switchAccountWithPassword,
    storesList 
  } = useApp();

  const isSuperAdmin = currentRole === 'super_admin';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security' | 'access' | 'logs'

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [assignedBranch, setAssignedBranch] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarBg, setAvatarBg] = useState(AVATAR_COLOR_PRESETS[0].bg);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Synchronize state with current authenticated user
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || (isSuperAdmin ? 'Alexander Vance' : 'Vikram Raman'));
      setEmail(currentUser.email || (isSuperAdmin ? 'alexander@bikeservicepro.com' : 'vikram@bikeservicepro.com'));
      setPhone(currentUser.phone || '9876543210');
      setRole(isSuperAdmin ? 'Super Administrator' : 'Operations Administrator');
      setAssignedBranch(currentUser.assignedBranch || (isSuperAdmin ? 'All Salem Branches' : 'Salem Central Mega Hub'));
      setBio(currentUser.bio || (isSuperAdmin 
        ? 'Overseeing enterprise operations, global store configurations, branding, and system administrative policies across all Salem locations.'
        : 'Managing Salem Central Mega Hub daily vehicle intakes, customer relations, technician dispatch, and telemetry diagnostics.'));
      setAvatar(currentUser.avatar || (isSuperAdmin ? 'AV' : 'VR'));
      setAvatarBg(isSuperAdmin ? AVATAR_COLOR_PRESETS[3].bg : AVATAR_COLOR_PRESETS[0].bg);
      if (currentUser.photo) {
        setCustomPhotoUrl(currentUser.photo);
      }
    }
  }, [currentUser, isSuperAdmin]);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // 2FA Toggle State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Switch Role Modal State
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState(isSuperAdmin ? 'admin' : 'super_admin');
  const [switchPassword, setSwitchPassword] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Activity Log State
  const [logSearch, setLogSearch] = useState('');
  const [logFilterCategory, setLogFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter(log => {
      const matchSearch = (log.action + ' ' + log.description + ' ' + log.ipAddress).toLowerCase().includes(logSearch.toLowerCase());
      if (logFilterCategory === 'All') return matchSearch;
      if (logFilterCategory === 'Auth') return matchSearch && (log.action.includes('Login') || log.action.includes('Logout') || log.action.includes('Password'));
      if (logFilterCategory === 'Bikes') return matchSearch && (log.action.includes('Bike') || log.description.includes('Bike') || log.description.includes('KM'));
      if (logFilterCategory === 'Services') return matchSearch && (log.action.includes('Service') || log.action.includes('Job') || log.description.includes('Maintenance'));
      return matchSearch;
    });
  }, [logSearch, logFilterCategory]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Password criteria check
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
  const strengthScore = [hasMinLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  // Handle Profile Photo Upload with format and 2 MB limit validation
  const handlePhotoUpload = (e) => {
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Format validation: strictly PNG or JPG/JPEG
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setProfileErrorMsg('Invalid file format. Please upload a PNG or JPG photo.');
      if (e.target) e.target.value = '';
      return;
    }

    // Size validation: max 2 MB (2 * 1024 * 1024 bytes)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setProfileErrorMsg(`File size (${sizeMb} MB) exceeds the 2 MB limit. Please select an image under 2 MB.`);
      if (e.target) e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setCustomPhotoUrl(String(dataUrl));
        setProfileSuccessMsg('Photo uploaded successfully! Click "Save Changes" to save to your profile.');
        showToast('Photo uploaded successfully (PNG/JPG < 2 MB)');
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setCustomPhotoUrl('');
    setProfileSuccessMsg('Custom photo removed. Restored signature monogram initials.');
    showToast('Photo removed');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setProfileErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    // Save to AppContext & persistent storage
    updateCurrentUserProfile({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      assignedBranch,
      avatar,
      photo: customPhotoUrl
    });

    setProfileSuccessMsg('Profile changes saved successfully! Your identity has been updated across the portal.');
    showToast('Profile updated and synchronized successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 4500);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (!hasNumber || !hasLetter) {
      setPasswordErrorMsg('New password must contain both letters and numbers.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation password do not match.');
      return;
    }

    // Update password in user profile
    updateCurrentUserProfile({ password: newPassword });

    setPasswordSuccessMsg('Your administrative password has been updated securely.');
    showToast('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 4500);
  };

  const handleOpenSwitchModal = () => {
    setTargetRole(isSuperAdmin ? 'admin' : 'super_admin');
    setSwitchPassword('');
    setSwitchError('');
    setIsSwitchModalOpen(true);
  };

  const handleSwitchSubmit = (e) => {
    e.preventDefault();
    setSwitchError('');
    const res = switchAccountWithPassword(targetRole, switchPassword);
    if (res.success) {
      setIsSwitchModalOpen(false);
      setSwitchPassword('');
      showToast(`Switched account role to ${targetRole === 'super_admin' ? 'Super Admin' : 'Operations Admin'}`);
    } else {
      setSwitchError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleCopyAdminUID = () => {
    const uid = `BSP-${isSuperAdmin ? 'ROOT' : 'OPS'}-${currentUser?.email?.split('@')[0].toUpperCase() || 'ADM882'}`;
    navigator.clipboard?.writeText(uid);
    showToast(`Copied Admin UID: ${uid}`);
  };

  return (
    <div className="profile-page-wrapper">
      {/* Floating Success Feedback Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#101828',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '13.5px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 99999,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CheckCircle2 size={18} color="#12B76A" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO IDENTITY BANNER CARD (Executive Presentation)
          ========================================================================= */}
      <div className="profile-hero-banner">
        <div className="profile-hero-left">
          <div className="profile-avatar-super-wrap">
            <div 
              className="profile-avatar-circle" 
              style={{ 
                background: customPhotoUrl ? '#0f172a' : avatarBg,
                overflow: 'hidden'
              }}
              title="Profile Avatar"
            >
              {customPhotoUrl ? (
                <img 
                  src={customPhotoUrl} 
                  alt={fullName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                avatar || (isSuperAdmin ? 'AV' : 'VR')
              )}
            </div>
            <div className="profile-status-beacon" title="Active Authenticated Session" />
          </div>

          <div className="profile-hero-info">
            <div className="profile-hero-name-row">
              <h1 className="profile-hero-name">{fullName}</h1>
              <span 
                className="profile-hero-role-badge" 
                style={{
                  background: isSuperAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(53, 109, 243, 0.2)',
                  color: isSuperAdmin ? '#fbbf24' : '#93c5fd',
                  border: isSuperAdmin ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(53, 109, 243, 0.4)'
                }}
              >
                {isSuperAdmin ? <Crown size={13} color="#f59e0b" /> : <ShieldCheck size={13} color="#38bdf8" />}
                <span>{isSuperAdmin ? 'Super Admin' : 'Operations Admin'}</span>
              </span>
              <span style={{ 
                fontSize: '11px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#34d399', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px', 
                borderRadius: '9999px', 
                fontWeight: 700 
              }}>
                ● ONLINE
              </span>
            </div>

            <div className="profile-hero-meta-row">
              <span className="profile-hero-meta-pill">
                <Mail size={14} color="#38bdf8" />
                <span>{email}</span>
              </span>
              <span className="profile-hero-meta-pill">
                <Phone size={14} color="#38bdf8" />
                <span>{phone}</span>
              </span>
              <span className="profile-hero-meta-pill">
                <MapPin size={14} color="#f59e0b" />
                <span>{assignedBranch}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Executive Stats & Fast Elevation Controls */}
        <div className="profile-hero-stats">
          <div className="profile-stat-box">
            <span className="profile-stat-label">Active Role</span>
            <span className="profile-stat-val" style={{ color: isSuperAdmin ? '#fbbf24' : '#38bdf8' }}>
              {isSuperAdmin ? 'Super Admin' : 'Operations Admin'}
            </span>
          </div>

          <div className="profile-stat-box">
            <span className="profile-stat-label">Security Shield</span>
            <span className="profile-stat-val" style={{ color: '#34d399' }}>
              {twoFactorEnabled ? '2FA Active' : 'Standard'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={handleOpenSwitchModal}
              title={`Switch account role between Super Admin and Operations Admin`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '12.5px'
              }}
            >
              <KeyRound size={14} />
              <span>Switch Account Role</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleCopyAdminUID}
              title="Copy Unique Administrator ID"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                fontSize: '12px'
              }}
            >
              <Copy size={13} />
              <span>Copy Admin UID</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PROFILE ENTERPRISE NAVIGATION TABS (Sticky with proper offset)
          ========================================================================= */}
      <div className="profile-tabs-header">
        <button
          type="button"
          className={`profile-tab-pill ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <User size={16} />
          <span>Personal Identity & Details</span>
        </button>

        <button
          type="button"
          className={`profile-tab-pill ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={16} />
          <span>Security & Authentication</span>
        </button>

        <button
          type="button"
          className={`profile-tab-pill ${activeTab === 'access' ? 'active' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          <KeyRound size={16} />
          <span>Clearance & Access Matrix</span>
        </button>

        <button
          type="button"
          className={`profile-tab-pill ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <FileText size={16} />
          <span>Audit Trail & Activity Logs ({filteredLogs.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PERSONAL IDENTITY & DETAILS
          ========================================================================= */}
      {activeTab === 'details' && (
        <div className="profile-content-two-col">
          {/* Left Column: Editable Identity Form */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="card-title">
                <Edit3 size={18} color="#356DF3" />
                <span>Account Identity & Contact Details</span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Updated in real-time</span>
            </div>

            <div className="card-body" style={{ padding: '24px' }}>
              {profileSuccessMsg && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#10b981" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
              {profileErrorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} color="#ef4444" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Full Legal Name <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <User size={16} className="input-icon-left" />
                      <input 
                        type="text" 
                        className="form-input" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alexander Vance"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Work Email Address <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon-left" />
                      <input 
                        type="email" 
                        className="form-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@bikeservicepro.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Direct Mobile Number <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Phone size={16} className="input-icon-left" />
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Workshop Location</label>
                    <div className="input-with-icon">
                      <Building2 size={16} className="input-icon-left" />
                      <select
                        className="form-input"
                        value={assignedBranch}
                        onChange={(e) => setAssignedBranch(e.target.value)}
                      >
                        <option value="All Salem Branches">All Salem Branches (Global Clearance)</option>
                        {storesList.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.location})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">System Role Title</label>
                  <div className="input-with-icon">
                    <Shield size={16} className="input-icon-left" />
                    <input 
                      type="text" 
                      className="form-input" 
                      value={role}
                      readOnly
                      style={{ background: '#f8fafc', color: '#475569', cursor: 'not-allowed' }}
                      title="Role permissions are managed via Super Admin Clearance"
                    />
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px', lineHeight: 1.4, display: 'block' }}>
                    Role assignments and administrative privileges are configured by the System Super Admin. Use the account switch button above to toggle between Super Admin and Operations Admin.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio & Operational Responsibilities</label>
                  <textarea
                    rows={3}
                    className="form-input no-left-icon"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your role responsibilities and workshop oversight..."
                    style={{ 
                      minHeight: '90px', 
                      height: '90px', 
                      padding: '10px 14px', 
                      resize: 'vertical',
                      lineHeight: 1.5,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                  <button type="submit" className="btn-save-profile">
                    <Check size={16} color="#ffffff" strokeWidth={2.5} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Avatar Customizer & Session Snapshot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card: Avatar Customization */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Sparkles size={18} color="#f59e0b" />
                  <span>Avatar & Visual Signature</span>
                </div>
              </div>

              <div className="card-body" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div 
                    style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: '16px', 
                      background: customPhotoUrl ? '#0f172a' : avatarBg, 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}
                  >
                    {customPhotoUrl ? (
                      <img src={customPhotoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      avatar || (fullName ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AV')
                    )}
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>Display Signature</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Customizable 2-character monogram</span>
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        maxLength={3}
                        className="form-input no-left-icon"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                        placeholder="e.g. AV"
                        style={{ width: '80px', height: '36px', textAlign: 'center', fontWeight: 800 }}
                      />
                      {customPhotoUrl && (
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={handleRemovePhoto}
                          title="Remove custom photo and restore initials"
                          style={{ fontSize: '11px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}
                        >
                          <Trash2 size={12} />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <label className="form-label" style={{ marginBottom: '10px' }}>Select Avatar Colour Swatch:</label>
                <div className="color-swatches-grid" style={{ marginBottom: '20px' }}>
                  {AVATAR_COLOR_PRESETS.map((preset) => {
                    const isSelected = avatarBg === preset.bg && !customPhotoUrl;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        className={`color-swatch-circle ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setAvatarBg(preset.bg);
                          showToast(`Applied ${preset.name} theme`);
                        }}
                        style={{ background: preset.bg }}
                        title={`${preset.name} (${isSelected ? 'Selected' : 'Click to select'})`}
                        aria-label={`Select ${preset.name}`}
                      >
                        {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>

                {/* Restricted PNG/JPG photo upload */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/png, image/jpeg, image/jpg" 
                  style={{ display: 'none' }} 
                  onChange={handlePhotoUpload} 
                />

                <div 
                  className="upload-dropzone" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ borderRadius: '12px', padding: '16px' }}
                >
                  <div className="upload-icon-circle">
                    <UploadCloud size={18} />
                  </div>
                  <span className="upload-text">
                    {customPhotoUrl ? 'Replace Profile Photo' : 'Upload Profile Photo'}
                  </span>
                  <span className="upload-sub">PNG or JPG only (Max 2 MB)</span>
                </div>
              </div>
            </div>

            {/* Card: Account Session Snapshot with Improved Hierarchy */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Account Session Snapshot</span>
                </div>
              </div>

              <div className="card-body" style={{ padding: '20px 24px' }}>
                <div className="snapshot-list">
                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <ShieldCheck size={15} color="#10b981" />
                      <span>Account Status:</span>
                    </div>
                    <div className="snapshot-value">
                      <StatusBadge status="Active" />
                    </div>
                  </div>

                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <Shield size={15} color="#356DF3" />
                      <span>Security Clearance:</span>
                    </div>
                    <div className="snapshot-value">
                      <span style={{ 
                        color: isSuperAdmin ? '#b45309' : '#0284c7', 
                        fontWeight: 700,
                        fontSize: '12.5px'
                      }}>
                        {isSuperAdmin ? 'Master Root Clearance' : 'Branch Operations'}
                      </span>
                    </div>
                  </div>

                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <Calendar size={15} color="#64748b" />
                      <span>Account Created:</span>
                    </div>
                    <div className="snapshot-value">
                      12 Sep 2026
                    </div>
                  </div>

                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <Clock size={15} color="#64748b" />
                      <span>Last Sign-in:</span>
                    </div>
                    <div className="snapshot-value">
                      Today, 20:45 IST
                    </div>
                  </div>

                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <MapPin size={15} color="#64748b" />
                      <span>Session Network IP:</span>
                    </div>
                    <div className="snapshot-value">
                      <code style={{ 
                        background: '#eff6ff', 
                        color: '#2563eb', 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        fontWeight: 700,
                        fontSize: '12px'
                      }}>
                        192.168.1.104
                      </code>
                    </div>
                  </div>

                  <div className="snapshot-item">
                    <div className="snapshot-label-wrap">
                      <Laptop size={15} color="#64748b" />
                      <span>Active Client Device:</span>
                    </div>
                    <div className="snapshot-value">
                      Windows 11 (Chrome Desktop)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SECURITY & AUTHENTICATION
          ========================================================================= */}
      {activeTab === 'security' && (
        <div className="profile-content-two-col">
          {/* Left Column: Password Change Form */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Lock size={18} color="#356DF3" />
                <span>Change Administrator Password</span>
              </div>
            </div>

            <div className="card-body" style={{ padding: '24px' }}>
              {passwordSuccessMsg && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#10b981" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}
              {passwordErrorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} color="#ef4444" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label className="form-label">
                    Current Password <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon-left" />
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      className="form-input" 
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-icon-right"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    New Password <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon-left" />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      className="form-input" 
                      placeholder="Enter strong new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-icon-right"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>Password Strength:</span>
                        <strong style={{ 
                          color: strengthScore <= 1 ? '#ef4444' : strengthScore === 2 ? '#f59e0b' : strengthScore === 3 ? '#3b82f6' : '#10b981' 
                        }}>
                          {strengthScore <= 1 ? 'Weak' : strengthScore === 2 ? 'Fair' : strengthScore === 3 ? 'Good' : 'Very Strong'}
                        </strong>
                      </div>
                      <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${(strengthScore / 4) * 100}%`,
                            background: strengthScore <= 1 ? '#ef4444' : strengthScore === 2 ? '#f59e0b' : strengthScore === 3 ? '#3b82f6' : '#10b981',
                            transition: 'width 0.25s ease'
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Confirm New Password <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon-left" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      className="form-input" 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-icon-right"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword && (
                    <span style={{ 
                      fontSize: '11px', 
                      marginTop: '4px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      color: confirmPassword === newPassword ? '#10b981' : '#ef4444' 
                    }}>
                      {confirmPassword === newPassword ? <Check size={12} /> : <AlertTriangle size={12} />}
                      {confirmPassword === newPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  )}
                </div>

                {/* Password Criteria Checklist */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', margin: '16px 0' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    Security Policy Criteria:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasMinLength ? '#10b981' : '#94a3b8' }}>
                      <Check size={14} color={hasMinLength ? '#10b981' : '#cbd5e1'} />
                      <span>8+ characters</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLetter ? '#10b981' : '#94a3b8' }}>
                      <Check size={14} color={hasLetter ? '#10b981' : '#cbd5e1'} />
                      <span>Letters (A-Z, a-z)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? '#10b981' : '#94a3b8' }}>
                      <Check size={14} color={hasNumber ? '#10b981' : '#cbd5e1'} />
                      <span>Numbers (0-9)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecial ? '#10b981' : '#94a3b8' }}>
                      <Check size={14} color={hasSpecial ? '#10b981' : '#cbd5e1'} />
                      <span>Special symbol (!@#$)</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn-save-profile">
                    <Check size={16} color="#ffffff" strokeWidth={2.5} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Multi-Factor & Session Elevation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 2-Step Verification Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Two-Step Verification (2FA)</span>
                </div>
              </div>

              <div className="card-body" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                      Hardware / App Authenticator
                    </strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
                      Require an authentication code whenever you sign in or perform sensitive vehicle ledger exports.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(twoFactorEnabled ? '2FA disabled (Standard auth)' : '2FA activated successfully!');
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: twoFactorEnabled ? '#ecfdf5' : '#f8fafc',
                      color: twoFactorEnabled ? '#059669' : '#64748b',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div style={{ marginTop: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px', fontSize: '12.5px', color: '#1e40af' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                    <Info size={15} />
                    <span>Policy Recommendation</span>
                  </div>
                  <span>Super Admin root accounts must keep 2FA enabled to access Store Hubs and Global Branding settings.</span>
                </div>
              </div>
            </div>

            {/* Active Sessions Device Card */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Laptop size={18} color="#356DF3" />
                  <span>Active Browser Sessions</span>
                </div>
              </div>

              <div className="card-body" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Laptop size={18} color="#356DF3" />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Windows 11 • Chrome 134</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Salem Central • 192.168.1.104</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
                    Current Device
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={18} color="#64748b" />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>Android Tablet • Workshop Bay 2</strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Logged in 3 days ago</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-secondary btn-sm" 
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => showToast('Terminated tablet session successfully')}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CLEARANCE & ACCESS MATRIX
          ========================================================================= */}
      {activeTab === 'access' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-title">
              <KeyRound size={18} color="#356DF3" />
              <span>Role Permissions & Architectural Access Matrix</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              background: isSuperAdmin ? '#fef3c7' : '#ecfdf5',
              color: isSuperAdmin ? '#b45309' : '#047857'
            }}>
              Current Role: {isSuperAdmin ? 'Super Admin' : 'Operations Admin'}
            </span>
          </div>

          <div className="card-body" style={{ padding: '24px' }}>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
              The matrix below illustrates the module-level entitlements active for your authenticated role. Super Admin holds master authority over store locations, administrative user accounts, and branding, while Operations Admin holds full day-to-day workshop capabilities.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Module 1 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Global Branding & Logo</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isSuperAdmin ? '#059669' : '#dc2626' }}>
                    {isSuperAdmin ? '● Full Access' : '🔒 Restricted'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Customize company name, dark/light SVG logos, primary theme color, and customer portal appearance.
                </p>
              </div>

              {/* Module 2 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Store & Hub Management</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isSuperAdmin ? '#059669' : '#dc2626' }}>
                    {isSuperAdmin ? '● Full Access' : '🔒 Restricted'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Create, configure, and assign Salem branch service locations and operational workshop bays.
                </p>
              </div>

              {/* Module 3 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Administrator Provisioning</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isSuperAdmin ? '#059669' : '#dc2626' }}>
                    {isSuperAdmin ? '● Full Access' : '🔒 Restricted'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Invite, authorize, suspend, or configure administrative and staff personnel credentials.
                </p>
              </div>

              {/* Module 4 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Bike Registry & Ownership</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669' }}>
                    ● Granted (Both Roles)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Register vehicles, link to customer profiles, update odometer KM, and view vehicle profiles.
                </p>
              </div>

              {/* Module 5 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Service Tracking & Job Cards</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669' }}>
                    ● Granted (Both Roles)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Log periodic service maintenance, allocate technicians, and generate customer invoice statements.
                </p>
              </div>

              {/* Module 6 */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Sales Analytics & Predictions</strong>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669' }}>
                    ● Granted (Both Roles)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Monitor service & spare parts revenue, customer ratings, and predictive vehicle maintenance schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: AUDIT TRAIL & ACTIVITY LOGS
          ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div className="card-title">
              <FileText size={18} color="#356DF3" />
              <span>System Audit Logs & Security History</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                type="text"
                className="search-input"
                placeholder="Search audit trail..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                style={{ height: '36px', fontSize: '12.5px', width: '200px' }}
              />

              <select 
                className="filter-select"
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                style={{ height: '36px', fontSize: '12.5px' }}
              >
                <option value="All">All Categories</option>
                <option value="Auth">Authentication & Passwords</option>
                <option value="Bikes">Bikes & Telemetry</option>
                <option value="Services">Services & Repairs</option>
              </select>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}># ID</th>
                    <th style={{ minWidth: 160 }}>Timestamp</th>
                    <th style={{ minWidth: 140 }}>Action Category</th>
                    <th style={{ minWidth: 260 }}>Audit Description</th>
                    <th style={{ minWidth: 130 }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        No audit records match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    currentLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ color: '#94a3b8', fontWeight: 600 }}>#{log.id}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '12.5px', color: '#334155' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} color="#94a3b8" />
                            <span>{log.dateTime}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            fontWeight: 700, 
                            fontSize: '11.5px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: log.action.includes('Login') ? '#ecfdf5' : log.action.includes('Logout') ? '#f1f5f9' : '#eff6ff',
                            color: log.action.includes('Login') ? '#059669' : log.action.includes('Logout') ? '#64748b' : '#356DF3' 
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ color: '#1e293b', fontSize: '13px' }}>{log.description}</td>
                        <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '12px' }}>
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="table-pagination-footer" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span>Showing {currentLogs.length} of {filteredLogs.length} total entries</span>
              <div className="pagination-controls">
                <button 
                  type="button" 
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button 
                    key={idx + 1}
                    type="button" 
                    className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button 
                  type="button" 
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE ELEVATION & SWITCH MODAL
          ========================================================================= */}
      {isSwitchModalOpen && (
        <Modal
          isOpen={isSwitchModalOpen}
          onClose={() => setIsSwitchModalOpen(false)}
          title="Switch Administrative Role"
          size="md"
        >
          <form onSubmit={handleSwitchSubmit}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {targetRole === 'super_admin' ? <Crown size={20} color="#d97706" /> : <ShieldCheck size={20} color="#356DF3" />}
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                  Target Role: {targetRole === 'super_admin' ? 'Super Admin (Alexander Vance)' : 'Operations Admin (Vikram Raman)'}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
                {targetRole === 'super_admin'
                  ? 'Super Admin grants full administrative privileges over all hubs, store locations, admin user management, and global branding.'
                  : 'Operations Admin handles everyday branch customer onboarding, job cards, service tracking, and fleet telemetry.'
                }
              </p>
            </div>

            {switchError && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '12px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{switchError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Enter Password for {targetRole === 'super_admin' ? 'Super Admin' : 'Operations Admin'} *
              </label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon-left" />
                <input
                  type={showSwitchPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder={targetRole === 'super_admin' ? 'Enter SuperAdmin@2026!' : 'Enter Admin@Ops2026!'}
                  value={switchPassword}
                  onChange={(e) => setSwitchPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                >
                  {showSwitchPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Quick hint: You can use <code>{targetRole === 'super_admin' ? 'superadmin' : 'admin'}</code>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn-cancel" onClick={() => setIsSwitchModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-save-profile">
                <span>Verify & Switch Role</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
