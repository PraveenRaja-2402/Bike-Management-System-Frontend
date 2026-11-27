import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Building, 
  CheckCircle,
  Save,
  Clock,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  FileJson,
  Shield,
  Smartphone,
  Gauge
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initialCompanySettings } from '../../data/mockData';

export default function SettingsPage() {
  const { 
    serviceIntervals, 
    updateServiceIntervals, 
    exportDatabaseBackup, 
    restoreDatabaseFromBackup, 
    resetDatabaseToDefaults,
    bikesList,
    serviceRecords,
    repairRecords,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState('intervals'); // 'intervals' | 'offline_storage' | 'general' | 'notifications'
  const [settings, setSettings] = useState(initialCompanySettings);
  const [intervals, setIntervals] = useState(serviceIntervals);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [restoreError, setRestoreError] = useState('');

  // Handle Intervals Save
  const handleSaveIntervals = (e) => {
    e.preventDefault();
    updateServiceIntervals({
      engineOilKm: parseInt(intervals.engineOilKm, 10) || 3000,
      airFilterKm: parseInt(intervals.airFilterKm, 10) || 6000,
      chainMaintenanceKm: parseInt(intervals.chainMaintenanceKm, 10) || 500,
      brakeInspectionKm: parseInt(intervals.brakeInspectionKm, 10) || 3000,
      batteryCheckMonths: parseInt(intervals.batteryCheckMonths, 10) || 6,
      generalServiceKm: parseInt(intervals.generalServiceKm, 10) || 3000,
      insuranceNoticeDays: parseInt(intervals.insuranceNoticeDays, 10) || 30
    });
    setSavedSuccess('✅ Service alert intervals updated and saved to local storage!');
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  // Handle General Settings Save
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSavedSuccess('✅ General workshop settings updated successfully!');
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  // Handle Restore from File
  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = restoreDatabaseFromBackup(json);
        if (res.success) {
          setIntervals(json.serviceIntervals || serviceIntervals);
          setSavedSuccess('✅ Offline database backup restored successfully from file!');
          setTimeout(() => setSavedSuccess(''), 5000);
        } else {
          setRestoreError(res.error || 'Failed to restore backup');
        }
      } catch (err) {
        setRestoreError('Invalid JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Handle Reset to Defaults
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all bikes, services, and repairs to the default system records? Your current entries will be replaced.')) {
      resetDatabaseToDefaults();
      setIntervals({
        engineOilKm: 3000,
        airFilterKm: 6000,
        chainMaintenanceKm: 500,
        brakeInspectionKm: 3000,
        batteryCheckMonths: 6,
        generalServiceKm: 3000,
        insuranceNoticeDays: 30
      });
      setSavedSuccess('✅ Database reset to factory default demonstration data!');
      setTimeout(() => setSavedSuccess(''), 4000);
    }
  };

  return (
    <div className="settings-page" style={{ paddingBottom: '36px' }}>
      {/* Top SaaS Header Banner */}
      <div className="dash-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #EFF4FE, #DBEAFE)',
            color: '#356DF3',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Settings size={22} />
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#101828', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>System Settings & Local Storage</span>
              <span style={{
                fontSize: '11px',
                background: '#ECFDF3',
                color: '#12B76A',
                border: '1px solid #A6F4C5',
                padding: '2px 9px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                OFFLINE SYNCED
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#667085', marginTop: '3px' }}>
              Configure service interval benchmarks, manage JSON database backups, workshop info, and alert channels
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <CheckCircle size={18} />
          <span>{savedSuccess}</span>
        </div>
      )}

      {restoreError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <AlertTriangle size={18} />
          <span>{restoreError}</span>
        </div>
      )}

      <div className="settings-layout">
        {/* Subnavigation Sidebar */}
        <div className="settings-subnav">
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'intervals' ? 'active' : ''}`}
            onClick={() => setActiveTab('intervals')}
          >
            <Gauge size={16} />
            <span>Service Intervals</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'offline_storage' ? 'active' : ''}`}
            onClick={() => setActiveTab('offline_storage')}
          >
            <HardDrive size={16} />
            <span>Offline Storage & Backup</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Building size={16} />
            <span>Workshop Details</span>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Settings Content Card */}
        <div className="card settings-content-card">
          <div className="card-header">
            <div className="card-title">
              <Settings size={18} color="#356DF3" />
              <span>
                {activeTab === 'intervals' && 'Configurable Maintenance & Service Intervals'}
                {activeTab === 'offline_storage' && 'Browser Local Storage & Offline Backup / Restore'}
                {activeTab === 'general' && 'Workshop & Organization Settings'}
                {activeTab === 'notifications' && 'Notification & Alert Channel Settings'}
              </span>
            </div>
          </div>

          <div className="card-body">
            {/* ============================================================= */}
            {/* 1. SERVICE INTERVALS TAB */}
            {/* ============================================================= */}
            {activeTab === 'intervals' && (
              <form onSubmit={handleSaveIntervals}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: '1.5'
                }}>
                  <strong>ℹ️ Default Service Benchmark Rules:</strong> Configure the odometer distance (km) and calendar timelines used to automatically calculate when customer bikes become due or overdue for maintenance.
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Engine Oil Service Interval (KM) *</label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      className="form-input no-left-icon"
                      value={intervals.engineOilKm}
                      onChange={(e) => setIntervals({ ...intervals, engineOilKm: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 3,000 km</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Air Filter Cleaning/Replacement (KM) *</label>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      className="form-input no-left-icon"
                      value={intervals.airFilterKm}
                      onChange={(e) => setIntervals({ ...intervals, airFilterKm: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 6,000 km</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chain Cleaning & Lubrication (KM) *</label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      className="form-input no-left-icon"
                      value={intervals.chainMaintenanceKm}
                      onChange={(e) => setIntervals({ ...intervals, chainMaintenanceKm: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 500 km</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brake Inspection & Brake Oil Check (KM) *</label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      className="form-input no-left-icon"
                      value={intervals.brakeInspectionKm}
                      onChange={(e) => setIntervals({ ...intervals, brakeInspectionKm: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 3,000 km</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Battery Health Inspection (Months) *</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="form-input no-left-icon"
                      value={intervals.batteryCheckMonths}
                      onChange={(e) => setIntervals({ ...intervals, batteryCheckMonths: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 6 months</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">General Periodic Servicing Interval (KM) *</label>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      className="form-input no-left-icon"
                      value={intervals.generalServiceKm}
                      onChange={(e) => setIntervals({ ...intervals, generalServiceKm: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Default recommended: Every 3,000 km</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Insurance Expiry Alert Threshold (Days) *</label>
                    <input
                      type="number"
                      min="5"
                      step="1"
                      className="form-input no-left-icon"
                      value={intervals.insuranceNoticeDays}
                      onChange={(e) => setIntervals({ ...intervals, insuranceNoticeDays: e.target.value })}
                      required
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Alert triggered 30 days before insurance expiry</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                    <Save size={15} /> Save Interval Settings
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================= */}
            {/* 2. OFFLINE STORAGE & BACKUP / RESTORE TAB */}
            {/* ============================================================= */}
            {activeTab === 'offline_storage' && (
              <div>
                {/* Local Storage Status Box */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HardDrive size={22} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#15803d' }}>
                      Offline Local Storage Active & Fully Synchronized
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '2px' }}>
                      All data is saved locally on your computer inside browser storage (`localStorage`). Saved records remain completely intact after restarting or closing your browser.
                    </div>
                  </div>
                </div>

                {/* Storage Inventory Statistics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Registered Bikes</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{bikesList.length}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Service Records</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>{serviceRecords.length}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Repair Records</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#ea580c' }}>{repairRecords.length}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Storage Keys</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a' }}>4 Local Collections</div>
                  </div>
                </div>

                {/* Backup & Restoration Section */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    💾 PC & Pendrive Database Backup
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    Download a standalone JSON backup of your entire customer database, service logs, repair items, and settings. You can store this file on your hard drive, a USB pendrive, or transfer it to another computer.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={exportDatabaseBackup}
                    style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={16} /> Download Database Backup (.JSON)
                  </button>
                </div>

                {/* Restore Section */}
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    📥 Restore Database from Pendrive or PC
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    Select a previously downloaded `.json` backup file to restore all customer bikes, service records, and repair histories instantly.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label 
                      className="btn-secondary"
                      style={{ cursor: 'pointer', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Upload size={16} /> Choose Backup File (.JSON)
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileRestore}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Reset to Defaults Section */}
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: '12px',
                  padding: '16px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#b91c1c' }}>
                        Reset to Factory Default Sample Data
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#dc2626', marginTop: '2px' }}>
                        Restores initial demo dataset with 6 registered bikes, sample services, and repairs.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetData}
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RefreshCw size={14} /> Reset Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* 3. GENERAL SETTINGS TAB */}
            {/* ============================================================= */}
            {activeTab === 'general' && (
              <form onSubmit={handleSaveGeneral}>
                <div className="form-group">
                  <label className="form-label">Workshop / Company Name *</label>
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
                    <label className="form-label">Help Desk Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input no-left-icon"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Email Address *</label>
                    <input
                      type="email"
                      className="form-input no-left-icon"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                    <Save size={15} /> Save Workshop Info
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================= */}
            {/* 4. NOTIFICATIONS TAB */}
            {/* ============================================================= */}
            {activeTab === 'notifications' && (
              <div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.autoSmsAlerts}
                      onChange={(e) => setSettings({ ...settings, autoSmsAlerts: e.target.checked })}
                    />
                    <span style={{ fontWeight: 600, fontSize: '13.5px' }}>Automatic WhatsApp & SMS Reminders for Upcoming Maintenance</span>
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '22px' }}>
                    Generates 1-click customer dispatches 7 days before service due date or within 500 km remaining.
                  </span>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.autoEmailAlerts}
                      onChange={(e) => setSettings({ ...settings, autoEmailAlerts: e.target.checked })}
                    />
                    <span style={{ fontWeight: 600, fontSize: '13.5px' }}>Insurance Expiry Alert Notifications</span>
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '22px' }}>
                    Highlights vehicles with policies expiring within 30 days.
                  </span>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    style={{ padding: '10px 24px' }}
                    onClick={() => {
                      setSavedSuccess('✅ Notification preferences updated!');
                      setTimeout(() => setSavedSuccess(''), 4000);
                    }}
                  >
                    <Save size={15} /> Save Notification Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

