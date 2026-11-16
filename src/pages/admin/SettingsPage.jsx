import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Building, 
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
        {/* Subnavigation Sidebar */}
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
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notification Settings</span>
          </button>
        </div>

        {/* Settings Content Card */}
        <div className="card settings-content-card">
          <div className="card-header">
            <div className="card-title">
              <Settings size={18} color="#2563eb" />
              <span>
                {activeTab === 'general' && 'General Settings'}
                {activeTab === 'notifications' && 'Notification Settings'}
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
