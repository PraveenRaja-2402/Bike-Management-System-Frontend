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
  ExternalLink
} from 'lucide-react';
import MetricCard from '../../components/common/MetricCard';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { mockStats, mockBikes, mockRecentActivities } from '../../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);

  return (
    <div className="dashboard-page">
      {/* 4 Metric Cards matching Design 2 */}
      <div className="metrics-row">
        <MetricCard
          title="Total Bikes"
          value={mockStats.totalBikes}
          icon={Bike}
          color="blue"
          onClick={() => navigate('/admin/live-tracking')}
        />
        <MetricCard
          title="Online Now"
          value={mockStats.onlineNow}
          icon={Wifi}
          color="green"
          subtitle="73% Active"
          onClick={() => navigate('/admin/live-tracking')}
        />
        <MetricCard
          title="Service Due Soon"
          value={mockStats.serviceDueSoon}
          icon={AlertCircle}
          color="amber"
          subtitle="Next 30 days"
          onClick={() => navigate('/admin/next-service')}
        />
        <MetricCard
          title="Offline Bikes"
          value={mockStats.offlineBikes}
          icon={WifiOff}
          color="red"
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
              <span>Bike Live Location</span>
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
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    🏍️
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{selectedBike.regNo}</span>
                    <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '12px' }}>{selectedBike.model}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Speed: <strong>{selectedBike.speed}</strong></span>
                  <StatusBadge status={selectedBike.status} />
                </div>
              </div>
            )}

            {/* Interactive Leaflet Map */}
            <LeafletMap 
              bikes={mockBikes} 
              selectedBike={selectedBike}
              onSelectBike={setSelectedBike}
              height="360px"
            />
          </div>
        </div>

        {/* Right: Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="#2563eb" />
              <span>Recent Activities</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Today & Yesterday</span>
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
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
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
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
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
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
                Quick Shortcuts
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
                  onClick={() => navigate('/admin/next-service')}
                >
                  <Send size={14} /> Send Service Alert
                </button>
                <button 
                  type="button" 
                  className="btn-secondary btn-sm"
                  onClick={() => navigate('/customer')}
                >
                  Customer Mobile App
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
              <span>Upcoming Service Due (Next 15 Days)</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/next-service')}
            >
              View All <ArrowRight size={13} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Model</th>
                  <th>Due Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBikes.slice(0, 4).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.regNo}</td>
                    <td style={{ color: '#64748b' }}>{b.model}</td>
                    <td>{b.nextService}</td>
                    <td style={{ fontWeight: 600, color: b.daysLeft <= 10 ? '#ef4444' : '#1e293b' }}>
                      {b.daysLeft} days
                    </td>
                    <td><StatusBadge status={b.serviceStatus} /></td>
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
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>JC-00{idx + 1}</td>
                    <td>{b.customer}</td>
                    <td style={{ color: '#64748b' }}>General Service</td>
                    <td><StatusBadge status={idx % 2 === 0 ? 'In Service' : 'Open'} /></td>
                    <td style={{ fontWeight: 600 }}>₹1,250</td>
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
