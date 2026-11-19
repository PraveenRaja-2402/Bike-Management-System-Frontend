import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Wifi, 
  AlertCircle, 
  WifiOff, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Send, 
  ExternalLink,
  Crown,
  ShieldCheck,
  Store,
  Palette,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import MetricCard from '../../components/common/MetricCard';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { mockStats, mockBikes, mockRecentActivities } from '../../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentRole, currentUser, branding, pendingServices, storesList } = useApp();
  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);

  const isSuperAdmin = currentRole === 'super_admin';
  const criticalOverdueServices = pendingServices.filter(s => s.serviceDueDays < 0);

  return (
    <div className="dashboard-page">
      {/* Top Telemetry Gateway Status Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #070c18 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(7, 12, 24, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: isSuperAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSuperAdmin ? '0 0 16px rgba(245, 158, 11, 0.5)' : '0 0 16px rgba(37, 99, 235, 0.5)'
          }}>
            {isSuperAdmin ? <Crown size={22} color="#ffffff" /> : <Zap size={22} color="#ffffff" />}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>
                {isSuperAdmin 
                  ? '⚡ Super Admin Master Overview' 
                  : `🛡️ Operations Admin Dashboard • ${currentUser?.name || 'Vikram Raman'}`
                }
              </span>
              <span style={{ 
                fontSize: '10px', 
                background: isSuperAdmin ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.2)', 
                color: isSuperAdmin ? '#fbbf24' : '#34d399', 
                padding: '2px 8px', 
                borderRadius: '9999px', 
                fontWeight: 800 
              }}>
                {isSuperAdmin ? 'ROOT CLEARANCE' : 'BRANCH OPS ACTIVE'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              {isSuperAdmin 
                ? `Master Monitoring: 52 IoT vehicles across all ${storesList.length} Salem workshop branches` 
                : `Assigned Branch: ${currentUser?.assignedBranch || 'Salem Central Mega Hub'} • Fleet Telemetry & Service Desk`
              }
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSuperAdmin && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary btn-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
                onClick={() => navigate('/admin/branding')}
              >
                <Palette size={13} color="#f59e0b" /> Change Logo
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
                onClick={() => navigate('/admin/stores')}
              >
                <Store size={13} color="#38bdf8" /> Store Locations
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => navigate('/customer')}
          >
            Open Customer Mobile App &rarr;
          </button>
        </div>
      </div>

      {/* Critical Service Pending Alert Banner */}
      {criticalOverdueServices.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #fff1f2 0%, #fee2e2 100%)',
          border: '1px solid #fca5a5',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <div>
              <strong style={{ color: '#991b1b', fontSize: '13.5px' }}>
                Service Pending Action Required:
              </strong>
              <span style={{ color: '#b91c1c', fontSize: '13px', marginLeft: '6px' }}>
                {criticalOverdueServices.length} bikes are critically overdue for periodic maintenance.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-danger btn-sm"
            onClick={() => navigate('/admin/pending-services')}
          >
            View Service Monitoring &rarr;
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="metrics-row">
        <MetricCard
          title="Total Connected Bikes"
          value={mockStats.totalBikes}
          icon={Bike}
          color="blue"
          trend="+12% MoM"
          trendType="up"
          subtitle="All active IoT units"
          onClick={() => navigate('/admin/live-tracking')}
        />
        <MetricCard
          title="Online & Moving Now"
          value={mockStats.onlineNow}
          icon={Wifi}
          color="green"
          trend="73% Active"
          trendType="up"
          subtitle="Live telemetry streaming"
          onClick={() => navigate('/admin/live-tracking')}
        />
        <MetricCard
          title="Service Pending / Due"
          value={pendingServices.length}
          icon={AlertCircle}
          color="amber"
          trend={`${criticalOverdueServices.length} Overdue`}
          trendType="warning"
          subtitle="Requires branch booking"
          onClick={() => navigate('/admin/pending-services')}
        />
        <MetricCard
          title="Offline Vehicles"
          value={mockStats.offlineBikes}
          icon={WifiOff}
          color="red"
          trend="Idle Safe"
          trendType="neutral"
          subtitle="Parked or standby mode"
          onClick={() => navigate('/admin/live-tracking')}
        />
      </div>

      {/* Main Grid: Live Location Map + Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left: Bike Live Location Map */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={18} color="#2563eb" />
              <span>Real-Time Fleet Radar Map</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/live-tracking')}
            >
              Full Screen Map <ExternalLink size={12} style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div className="card-body" style={{ padding: '16px' }}>
            {/* Active Telemetry Chip */}
            {selectedBike && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    🏍️
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '14.5px', color: '#0f172a' }}>{selectedBike.regNo}</span>
                    <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '12px' }}>{selectedBike.model}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12.5px', color: '#475569' }}>
                    Speed: <strong style={{ color: '#0f172a' }}>{selectedBike.speed}</strong>
                  </span>
                  <StatusBadge status={selectedBike.status} />
                </div>
              </div>
            )}

            {/* Interactive Leaflet Map */}
            <LeafletMap 
              bikes={mockBikes} 
              selectedBike={selectedBike}
              onSelectBike={setSelectedBike}
              height="370px"
            />
          </div>
        </div>

        {/* Right: Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="#2563eb" />
              <span>Live Fleet Signals</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Salem Region Telemetry</span>
          </div>

          <div className="card-body" style={{ padding: '0' }}>
            <div className="activity-list-container" style={{ display: 'flex', flexDirection: 'column' }}>
              {mockRecentActivities.map((act) => {
                const isMoving = act.type === 'moving';
                const isCompleted = act.type === 'completed';
                const isOffline = act.type === 'offline';

                return (
                  <div 
                    key={act.id} 
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '10px',
                      background: isMoving ? '#ecfdf5' : isCompleted ? '#eff6ff' : isOffline ? '#fef2f2' : '#f8fafc',
                      color: isMoving ? '#10b981' : isCompleted ? '#2563eb' : isOffline ? '#ef4444' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isMoving ? <MapPin size={16} /> : isCompleted ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                        {act.time}
                      </div>
                    </div>

                    <StatusBadge status={act.status} />
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '16px 18px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                Operational Shortcuts
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="btn-primary btn-sm"
                  onClick={() => navigate('/admin/job-cards')}
                >
                  <Plus size={14} /> New Job Card
                </button>
                <button 
                  type="button" 
                  className="btn-secondary btn-sm"
                  onClick={() => navigate('/admin/pending-services')}
                >
                  <AlertCircle size={14} color="#d97706" /> Service Monitor
                </button>
                <button 
                  type="button" 
                  className="btn-secondary btn-sm"
                  onClick={() => navigate('/admin/users')}
                >
                  + Add User
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Row: Upcoming Services & Open Job Cards Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Next Service Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertCircle size={18} color="#d97706" />
              <span>Service Pending Monitoring Preview</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/pending-services')}
            >
              Full Monitor <ArrowRight size={13} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Customer</th>
                  <th>Due Status</th>
                  <th>Est Cost</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingServices.slice(0, 4).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{b.regNo}</td>
                    <td style={{ color: '#475569' }}>{b.customer}</td>
                    <td style={{ fontWeight: 700, color: b.serviceDueDays < 0 ? '#dc2626' : '#d97706' }}>
                      {b.serviceDueDays < 0 ? `${Math.abs(b.serviceDueDays)}d Overdue` : `${b.serviceDueDays}d Left`}
                    </td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{b.estimatedCost}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline-blue btn-sm"
                        onClick={() => navigate('/admin/pending-services')}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Job Cards */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Bike size={18} color="#2563eb" />
              <span>Active Workshop Job Cards</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/job-cards')}
            >
              View All <ArrowRight size={13} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Job No</th>
                  <th>Customer</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {mockBikes.slice(0, 4).map((b, idx) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>JC-00{idx + 1}</td>
                    <td>{b.customer}</td>
                    <td style={{ color: '#64748b' }}>General Service</td>
                    <td><StatusBadge status={idx % 2 === 0 ? 'In Service' : 'Open'} /></td>
                    <td style={{ fontWeight: 700 }}>₹1,250</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
