import React, { useState, useMemo } from 'react';
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
  Zap,
  Wrench,
  Download,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import MetricCard from '../../components/common/MetricCard';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { mockStats, mockBikes } from '../../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { 
    currentRole, 
    currentUser, 
    branding, 
    storesList,
    bikesList,
    serviceRecords,
    repairRecords,
    serviceIntervals,
    exportDatabaseBackup
  } = useApp();

  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);

  const isSuperAdmin = currentRole === 'super_admin';

  // Calculate live counts from real state
  const { overdueCount, upcomingCount, totalRegisteredBikes, totalServicesCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let over = 0;
    let upc = 0;

    bikesList.forEach(b => {
      const curKm = parseInt(b.currentKm, 10) || 0;
      const nextKm = parseInt(b.nextServiceKm, 10) || (curKm + 3000);
      const kmRemaining = nextKm - curKm;

      let daysRemaining = 999;
      if (b.nextServiceDate) {
        const nextDate = new Date(b.nextServiceDate);
        nextDate.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      }

      if (kmRemaining <= 0 || daysRemaining < 0) {
        over += 1;
      } else if (kmRemaining <= 500 || daysRemaining <= 15) {
        upc += 1;
      }
    });

    return {
      overdueCount: over,
      upcomingCount: upc,
      totalRegisteredBikes: bikesList.length,
      totalServicesCount: serviceRecords.length
    };
  }, [bikesList, serviceRecords]);

  // Recent service & repair activities combined
  const recentServiceActivities = useMemo(() => {
    const srv = serviceRecords.map(s => ({
      id: s.id,
      date: s.serviceDate,
      regNo: s.regNo,
      owner: s.ownerName,
      type: 'Service',
      detail: s.serviceType || 'Periodic Maintenance',
      cost: s.serviceCost,
      technician: s.technician || 'Mani'
    }));

    const rep = repairRecords.map(r => ({
      id: r.id,
      date: r.repairDate,
      regNo: r.regNo,
      owner: r.ownerName,
      type: 'Repair',
      detail: r.repairDetails || 'Mechanical Repair',
      cost: r.totalCost,
      technician: r.technician || 'Mani'
    }));

    return [...srv, ...rep]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [serviceRecords, repairRecords]);

  return (
    <div className="dashboard-page" style={{ paddingBottom: '32px' }}>
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
                ? `Master Monitoring: ${totalRegisteredBikes} Registered Bikes • ${storesList.length} Salem workshop branches` 
                : `Assigned Branch: ${currentUser?.assignedBranch || 'Salem Central Mega Hub'} • Bike Repair & Service Alert System`
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

      {/* Critical Overdue Alert Banner if overdue bikes exist */}
      {overdueCount > 0 && (
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
                Service Alerts Action Required:
              </strong>
              <span style={{ color: '#b91c1c', fontSize: '13px', marginLeft: '6px' }}>
                {overdueCount} bikes are currently overdue for periodic service. Send WhatsApp/SMS reminders immediately.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn-danger btn-sm"
            onClick={() => navigate('/admin/next-service')}
          >
            Dispatch Reminders &rarr;
          </button>
        </div>
      )}

      {/* 5 Core Required Metrics Row */}
      <div className="metrics-row" style={{ marginBottom: '20px' }}>
        <MetricCard
          title="Total Registered Bikes"
          value={totalRegisteredBikes}
          icon={Bike}
          color="blue"
          trend="In Database"
          trendType="neutral"
          subtitle="All customer bike profiles"
          onClick={() => navigate('/admin/bikes')}
        />
        <MetricCard
          title="Total Services Completed"
          value={totalServicesCount}
          icon={CheckCircle2}
          color="green"
          trend="Lifetime Logged"
          trendType="up"
          subtitle="All maintenance records"
          onClick={() => navigate('/admin/services')}
        />
        <MetricCard
          title="Upcoming Services"
          value={upcomingCount}
          icon={Clock}
          color="amber"
          trend="≤ 500 km / 15d"
          trendType="warning"
          subtitle="Due for maintenance soon"
          onClick={() => navigate('/admin/next-service')}
        />
        <MetricCard
          title="Overdue Services"
          value={overdueCount}
          icon={AlertCircle}
          color="red"
          trend={overdueCount > 0 ? "Action Required" : "Zero Overdue"}
          trendType={overdueCount > 0 ? "warning" : "up"}
          subtitle="KM or date exceeded"
          onClick={() => navigate('/admin/next-service')}
        />
      </div>

      {/* Fast Operational Action Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
            System Quick Actions:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-primary btn-sm"
            onClick={() => navigate('/admin/bikes')}
          >
            <Plus size={14} /> Register Bike
          </button>
          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/services')}
          >
            <Wrench size={14} color="#0284c7" /> Log Service
          </button>
          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/repairs')}
          >
            <Wrench size={14} color="#ea580c" /> Log Repair
          </button>
          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/next-service')}
          >
            <Clock size={14} color="#d97706" /> Reminders
          </button>
          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/reports')}
          >
            <FileText size={14} color="#059669" /> Reports
          </button>
          <button 
            type="button" 
            className="btn-secondary btn-sm"
            onClick={exportDatabaseBackup}
            title="Download JSON backup to PC or USB pendrive"
          >
            <Download size={14} color="#7c3aed" /> Backup (JSON)
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Service Activities + Fleet Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left: Recent Service Activities (Required Dashboard Feature #5) */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">
              <Clock size={18} color="#2563eb" />
              <span>Recent Service & Repair Activities</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/services')}
            >
              View All Services &rarr;
            </button>
          </div>

          <div className="card-body" style={{ padding: '0' }}>
            {recentServiceActivities.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                No recent service activities logged yet.
              </div>
            ) : (
              <div className="activity-list-container" style={{ display: 'flex', flexDirection: 'column' }}>
                {recentServiceActivities.map((act) => {
                  const isService = act.type === 'Service';
                  return (
                    <div 
                      key={act.id} 
                      style={{
                        padding: '12px 18px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '8px',
                          background: isService ? '#e0f2fe' : '#ffedd5',
                          color: isService ? '#0369a1' : '#c2410c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '11px',
                          flexShrink: 0
                        }}>
                          {isService ? 'SRV' : 'REP'}
                        </div>

                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                            {act.regNo} <span style={{ fontWeight: 500, color: '#64748b' }}>• {act.owner}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: '1px' }}>
                            {act.detail} • Tech: {act.technician}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#059669', fontSize: '13.5px' }}>
                          ₹{act.cost?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {act.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Stored locally in browser • Auto-synced
              </span>
              <button
                type="button"
                className="btn-link"
                style={{ fontSize: '12.5px', fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => navigate('/admin/reports')}
              >
                View Full Reports &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Fleet Radar Map */}
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
              Full Screen <ExternalLink size={12} style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div className="card-body" style={{ padding: '14px' }}>
            <LeafletMap 
              bikes={mockBikes} 
              selectedBike={selectedBike}
              onSelectBike={setSelectedBike}
              height="330px"
            />
          </div>
        </div>

      </div>

      {/* Secondary Row: Upcoming Services & Registered Bikes Quick Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Next Service Due Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertCircle size={18} color="#d97706" />
              <span>Upcoming & Overdue Service Reminders</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/next-service')}
            >
              All Reminders <ArrowRight size={13} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Customer</th>
                  <th>Current KM</th>
                  <th>Target KM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bikesList.slice(0, 5).map((b) => {
                  const cur = parseInt(b.currentKm, 10) || 0;
                  const next = parseInt(b.nextServiceKm, 10) || (cur + 3000);
                  const isOver = cur >= next;
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{b.regNo}</td>
                      <td style={{ color: '#475569' }}>{b.ownerName}</td>
                      <td>{cur.toLocaleString()} km</td>
                      <td>{next.toLocaleString()} km</td>
                      <td>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: isOver ? '#fee2e2' : '#fef3c7',
                          color: isOver ? '#b91c1c' : '#b45309'
                        }}>
                          {isOver ? 'OVERDUE' : 'DUE SOON'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Customer Bikes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Bike size={18} color="#2563eb" />
              <span>Registered Customer Bikes</span>
            </div>
            <button 
              type="button" 
              className="btn-outline-blue"
              onClick={() => navigate('/admin/bikes')}
            >
              Manage Bikes <ArrowRight size={13} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Model</th>
                  <th>Owner</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bikesList.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{b.regNo}</td>
                    <td>{b.brand} {b.model}</td>
                    <td>{b.ownerName}</td>
                    <td>{b.ownerPhone}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline-blue btn-sm"
                        onClick={() => navigate('/admin/bikes')}
                      >
                        Profile
                      </button>
                    </td>
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
