import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  UploadCloud, 
  Lock, 
  Eye, 
  EyeOff, 
  Info, 
  MoreVertical, 
  FileText, 
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { initialAdminProfile, mockActivityLogs } from '../../data/mockData';

export default function ProfilePage() {
  // Profile Form State
  const [profile, setProfile] = useState(initialAdminProfile);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Activity Log State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockActivityLogs.length / itemsPerPage);
  const currentLogs = mockActivityLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (!profile.fullName.trim() || !profile.email.trim() || !profile.phone.trim()) {
      setProfileErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    // Mock save
    setProfileSuccessMsg('Profile updated successfully! (Mock state updated)');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
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
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation password do not match.');
      return;
    }

    // Mock save
    setPasswordSuccessMsg('Password updated successfully! (Mock state updated)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  return (
    <div className="profile-page-container">
      {/* 2x2 Grid exactly matching Design 3 */}
      <div className="profile-grid">
        
        {/* Card 1: Profile Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <User size={18} color="#2563eb" />
              <span>Profile Overview</span>
            </div>
            <button type="button" className="btn-secondary btn-sm" style={{ padding: '4px 6px', border: 'none' }}>
              <MoreVertical size={16} color="#64748b" />
            </button>
          </div>

          <div className="card-body">
            <div className="profile-overview-card" style={{ padding: '10px 0' }}>
              <div className="profile-avatar-upload-wrap">
                <div className="profile-big-avatar">
                  {profile.avatar}
                  <label htmlFor="avatar-file-input" className="avatar-cam-badge" title="Upload new photo">
                    <Camera size={14} />
                    <input id="avatar-file-input" type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                </div>
                <button type="button" className="btn-outline-blue" style={{ fontSize: '11px', marginTop: 4 }}>
                  Change Photo
                </button>
                <span className="avatar-upload-hint">JPG, PNG (Max 2MB)</span>
              </div>

              <div className="profile-info-block">
                <div className="profile-name-row">
                  <span className="profile-display-name">{profile.fullName}</span>
                  <StatusBadge status="Active" />
                </div>
                <span className="profile-role-sub">{profile.role}</span>

                <div className="profile-detail-list">
                  <div className="profile-detail-item">
                    <Phone size={15} color="#64748b" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="profile-detail-item">
                    <Mail size={15} color="#64748b" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="profile-detail-item">
                    <Shield size={15} color="#64748b" />
                    <span>{profile.role}</span>
                  </div>
                  <div className="profile-detail-item">
                    <Calendar size={15} color="#64748b" />
                    <span>Joined on {profile.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Edit Profile */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Edit3 size={18} color="#2563eb" />
              <span>Edit Profile</span>
            </div>
          </div>

          <div className="card-body">
            {profileSuccessMsg && (
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> {profileSuccessMsg}
              </div>
            )}
            {profileErrorMsg && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {profileErrorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon-left" />
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Admin User"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon-left" />
                    <input 
                      type="email" 
                      className="form-input" 
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="admin@bikeservice.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon-left" />
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Picture</label>
                  <div className="upload-dropzone" onClick={() => alert('Mock photo selector: you can select JPG or PNG')}>
                    <div className="upload-icon-circle">
                      <UploadCloud size={18} />
                    </div>
                    <span className="upload-text">Click to upload</span>
                    <span className="upload-sub">JPG, PNG (Max 2MB)</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select 
                  className="form-input no-left-icon"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Service Manager">Service Manager</option>
                  <option value="Technician">Technician</option>
                </select>
              </div>

              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 3: Change Password */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Lock size={18} color="#2563eb" />
              <span>Change Password</span>
            </div>
          </div>

          <div className="card-body">
            {passwordSuccessMsg && (
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> {passwordSuccessMsg}
              </div>
            )}
            {passwordErrorMsg && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {passwordErrorMsg}
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
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                  />
                  <button 
                    type="button" 
                    className="input-icon-right"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Blue Info Notice */}
              <div className="password-rules-box">
                <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Password must be at least 8 characters and include letters, numbers and special characters.</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 4: Activity Log */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} color="#2563eb" />
              <span>Activity Log</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select className="filter-select" style={{ padding: '4px 8px', fontSize: '12px' }}>
                <option>01 Sep 2026 - 30 Sep 2026</option>
                <option>01 Aug 2026 - 31 Aug 2026</option>
              </select>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Date & Time</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: '#64748b' }}>{log.id}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{log.dateTime}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 600, 
                        color: log.action.includes('Login') ? '#10b981' : log.action.includes('Logout') ? '#64748b' : '#2563eb' 
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>{log.description}</td>
                    <td style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '12px' }}>{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="table-pagination-footer">
              <span>Showing {currentLogs.length} of {mockActivityLogs.length} entries</span>
              <div className="pagination-controls">
                <button 
                  type="button" 
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button 
                  type="button" 
                  className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                {totalPages > 1 && (
                  <button 
                    type="button" 
                    className={`page-btn ${currentPage === 2 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                )}
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

      </div>
    </div>
  );
}
