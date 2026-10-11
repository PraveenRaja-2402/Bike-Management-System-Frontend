import React, { useState } from 'react';
import { 
  Settings, 
  Wrench, 
  Bell, 
  Users, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  Save
} from 'lucide-react';
import { initialCompanySettings } from '../../data/mockData';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(initialCompanySettings);
  const [savedSuccess, setSavedSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess('Settings saved successfully! (Mock state updated)');
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  return (
    <div className="settings-page">
      {savedSuccess && (
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
          <CheckCircle size={18} />
          <span>{savedSuccess}</span>
        </div>
      )}

      <div className="settings-layout">
        {/* Subnavigation Sidebar matching Design 2 */}
        <div className="settings-subnav">
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Building size={16} />
            <span>General Settings</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            <Wrench size={16} />
            <span>Service Settings</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notification Settings</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <Users size={16} />
            <span>User Roles</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <ShieldCheck size={16} />
            <span>Backup & Security</span>
          </button>
        </div>

        {/* Settings Content Card */}
        <div className="card settings-content-card">
          <div className="card-header">
            <div className="card-title">
              <Settings size={18} color="#2563eb" />
              <span>
                {activeTab === 'general' && 'General Settings'}
                {activeTab === 'service' && 'Service Configuration'}
                {activeTab === 'notifications' && 'Notification Channels'}
                {activeTab === 'roles' && 'Role Permissions'}
                {activeTab === 'backup' && 'System Security & Backups'}
              </span>
            </div>
          </div>

          <div className="card-body">
            <form onSubmit={handleSave}>
              {activeTab === 'general' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className="form-input no-left-icon"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Workshop Address *</label>
                    <textarea
                      className="form-input no-left-icon"
                      rows={2}
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input no-left-icon"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input no-left-icon"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'service' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Upcoming Service Notice Window (Days)</label>
                      <input
                        type="number"
                        className="form-input no-left-icon"
                        value={settings.serviceDueNoticeDays}
                        onChange={(e) => setSettings({ ...settings, serviceDueNoticeDays: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Currency Symbol</label>
                      <input
                        type="text"
                        className="form-input no-left-icon"
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Standard Periodic Service Interval (km)</label>
                    <input
                      type="text"
                      className="form-input no-left-icon"
                      defaultValue="5,000 km"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Diagnostic Multi-point Inspection</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', marginTop: 4 }}>
                      <label><input type="checkbox" defaultChecked /> Engine oil and filter check</label>
                      <label><input type="checkbox" defaultChecked /> Front and rear disc brakes / lining pad inspection</label>
                      <label><input type="checkbox" defaultChecked /> Drive chain slack and lubrication</label>
                      <label><input type="checkbox" defaultChecked /> Battery voltage and terminal cleaning</label>
                      <label><input type="checkbox" defaultChecked /> Tire pressure and tread wear</label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settings.autoSmsAlerts}
                        onChange={(e) => setSettings({ ...settings, autoSmsAlerts: e.target.checked })}
                      />
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>Automatic SMS Reminders for upcoming service</span>
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '22px' }}>
                      Sends SMS 7 days before service due date.
                    </span>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settings.autoEmailAlerts}
                        onChange={(e) => setSettings({ ...settings, autoEmailAlerts: e.target.checked })}
                      />
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>Email Invoices & Service Completion Reports</span>
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '22px' }}>
                      Dispatches detailed job card PDF upon status marked as Ready/Completed.
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'roles' && (
                <div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                    Default role permission assignments across the bike service network:
                  </p>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Live Tracking</th>
                        <th>Create Job Cards</th>
                        <th>Billing</th>
                        <th>Manage Brands</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Administrator</strong></td>
                        <td>Full Access</td>
                        <td>Full Access</td>
                        <td>Full Access</td>
                        <td>Full Access</td>
                      </tr>
                      <tr>
                        <td><strong>Service Manager</strong></td>
                        <td>Full Access</td>
                        <td>Full Access</td>
                        <td>Full Access</td>
                        <td>Read Only</td>
                      </tr>
                      <tr>
                        <td><strong>Technician</strong></td>
                        <td>View Assigned</td>
                        <td>Update Status</td>
                        <td>None</td>
                        <td>None</td>
                      </tr>
                      <tr>
                        <td><strong>Customer</strong></td>
                        <td>Own Bike Only</td>
                        <td>Request Service</td>
                        <td>View Invoices</td>
                        <td>None</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'backup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>Automated Cloud Database Backup</div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>Last backup generated: Today at 03:00 AM (Size: 14.8 MB)</div>
                    <button 
                      type="button" 
                      className="btn-secondary btn-sm" 
                      style={{ marginTop: '10px' }}
                      onClick={() => alert('Backup snapshot created successfully! (Mock operation)')}
                    >
                      Download Backup Archive
                    </button>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>Session Security Timeout</div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>Inactivity logout timer set to 30 minutes.</div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
