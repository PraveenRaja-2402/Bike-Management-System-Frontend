import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Bell, 
  ClipboardCheck, 
  Users, 
  Tag, 
  Settings, 
  User,
  ArrowRight,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import BrandLogo from '../../components/common/BrandLogo';
import { mockBikes, mockJobCards, mockUsers, mockBikeBrands } from '../../data/mockData';

export default function AllPagesOverview() {
  const navigate = useNavigate();

  return (
    <div className="all-pages-overview">
      <div className="overview-grid">
        
        {/* 1. Dashboard */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">1</span>
              <div className="overview-icon-box" style={{ background: '#2563eb' }}>
                <Home size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Dashboard</span>
                <span className="overview-desc">Overview of bikes, service due, and recent activity</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/dashboard')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              {/* Mini metric counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                <div style={{ background: '#eff6ff', borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Total Bikes</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb' }}>52</div>
                </div>
                <div style={{ background: '#ecfdf5', borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Online Now</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>38</div>
                </div>
                <div style={{ background: '#fffbeb', borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Service Due</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b' }}>12</div>
                </div>
                <div style={{ background: '#fef2f2', borderRadius: '4px', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Offline</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ef4444' }}>14</div>
                </div>
              </div>
              {/* Mini split preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', flex: 1 }}>
                <div style={{ background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>Salem Live Map</div>
                  <div style={{ position: 'absolute', width: 14, height: 14, background: '#d92228', borderRadius: '50%', border: '2px solid #fff' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px' }}>
                  <div style={{ background: '#f8fafc', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>TN 30 AB 1234</span> Moving
                  </div>
                  <div style={{ background: '#f8fafc', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>TN 28 CD 5678</span> Completed
                  </div>
                  <div style={{ background: '#f8fafc', padding: '3px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>TN 38 KL 2345</span> Offline
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Live Bike Tracking */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">2</span>
              <div className="overview-icon-box" style={{ background: '#10b981' }}>
                <MapPin size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Live Bike Tracking</span>
                <span className="overview-desc">Track all bikes in real-time on map</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/live-tracking')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>Search Reg No...</div>
                <div style={{ display: 'flex', gap: '2px', fontSize: '9px' }}>
                  <span style={{ background: '#2563eb', color: '#fff', padding: '2px 4px', borderRadius: '3px' }}>Map</span>
                  <span style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '3px' }}>Satellite</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                    <span><strong>TN 30 AB 1234</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>45 km/h</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                    <span><strong>TN 28 CD 5678</strong></span>
                    <span style={{ color: '#3b82f6', fontWeight: 600 }}>Parked</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                    <span><strong>TN 45 EF 9012</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>32 km/h</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
                    <span><strong>TN 30 GH 3456</strong></span>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Stopped</span>
                  </div>
                </div>
                <div style={{ background: '#e0f2fe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '10px', color: '#0369a1', fontWeight: 600 }}>Live Telemetry</span>
                  <div style={{ position: 'absolute', top: '30%', left: '40%', width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  <div style={{ position: 'absolute', bottom: '30%', right: '35%', width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Next Service Notifications */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">3</span>
              <div className="overview-icon-box" style={{ background: '#f59e0b' }}>
                <Bell size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Next Service Notifications</span>
                <span className="overview-desc">View bikes with upcoming service due dates</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/next-service')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '9px' }}>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>All Brands ⌄</span>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>Due in 30 Days ⌄</span>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>Search...</span>
              </div>
              <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Reg No</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Brand</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Days</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBikes.slice(0, 3).map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3px', fontWeight: 600 }}>{b.regNo}</td>
                      <td style={{ padding: '3px', color: '#64748b' }}>{b.brand}</td>
                      <td style={{ padding: '3px', fontWeight: 600 }}>{b.daysLeft}</td>
                      <td style={{ padding: '3px' }}>
                        <span style={{ 
                          fontSize: '8px', 
                          padding: '1px 4px', 
                          borderRadius: '4px',
                          background: b.daysLeft <= 10 ? '#fef3c7' : '#ecfdf5',
                          color: b.daysLeft <= 10 ? '#b45309' : '#15803d'
                        }}>
                          {b.serviceStatus}
                        </span>
                      </td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>
                        <span style={{ background: '#2563eb', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '3px' }}>Notify</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Job Cards */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">4</span>
              <div className="overview-icon-box" style={{ background: '#8b5cf6' }}>
                <ClipboardCheck size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Job Cards</span>
                <span className="overview-desc">Create and manage service job cards</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/job-cards')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'flex', gap: '3px', marginBottom: '6px', fontSize: '9px' }}>
                <span style={{ background: '#2563eb', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>All (8)</span>
                <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>Open (3)</span>
                <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>In Service (3)</span>
                <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>Ready (1)</span>
              </div>
              <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Job No</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Reg No</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockJobCards.slice(0, 3).map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3px', fontWeight: 600, color: '#2563eb' }}>{j.jobNo}</td>
                      <td style={{ padding: '3px' }}>{j.regNo}</td>
                      <td style={{ padding: '3px' }}>{j.customer}</td>
                      <td style={{ padding: '3px' }}>
                        <span style={{ 
                          fontSize: '8px', 
                          padding: '1px 4px', 
                          borderRadius: '4px',
                          background: j.status === 'Completed' ? '#ecfdf5' : j.status === 'In Service' ? '#fef3c7' : '#eff6ff',
                          color: j.status === 'Completed' ? '#15803d' : j.status === 'In Service' ? '#b45309' : '#2563eb'
                        }}>
                          {j.status}
                        </span>
                      </td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>
                        <span style={{ background: '#2563eb', color: '#fff', fontSize: '8px', padding: '2px 6px', borderRadius: '3px' }}>View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Users */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">5</span>
              <div className="overview-icon-box" style={{ background: '#ef4444' }}>
                <Users size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Users</span>
                <span className="overview-desc">Add, edit and manage system users</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/users')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '9px' }}>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>All Roles ⌄</span>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>All Status ⌄</span>
                <span style={{ border: '1px solid #cbd5e1', padding: '2px 4px', borderRadius: '3px' }}>Search...</span>
              </div>
              <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.slice(0, 3).map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '3px', color: '#64748b' }}>{u.phone}</td>
                      <td style={{ padding: '3px' }}>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 4px', borderRadius: '3px', fontSize: '8px' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '3px' }}>
                        <span style={{ background: '#ecfdf5', color: '#15803d', padding: '1px 4px', borderRadius: '3px', fontSize: '8px' }}>{u.status}</span>
                      </td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>
                        <span style={{ color: '#2563eb', fontSize: '8px', marginRight: 4 }}>View</span>
                        <span style={{ color: '#2563eb', fontSize: '8px' }}>Edit</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 6. Manage Bike Brands */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">6</span>
              <div className="overview-icon-box" style={{ background: '#0284c7' }}>
                <Tag size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Manage Bike Brands</span>
                <span className="overview-desc">Add, edit and manage bike brands</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/manage-brands')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Brand Name</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Logo</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Models</th>
                    <th style={{ textAlign: 'left', padding: '3px' }}>Default Interval</th>
                    <th style={{ textAlign: 'center', padding: '3px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBikeBrands.slice(0, 3).map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3px', fontWeight: 600 }}>{b.name}</td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>
                        <BrandLogo brand={b.name} size={16} />
                      </td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>{b.totalModels}</td>
                      <td style={{ padding: '3px', color: '#64748b' }}>{b.defaultInterval}</td>
                      <td style={{ padding: '3px', textAlign: 'center' }}>
                        <span style={{ color: '#2563eb', fontSize: '8px' }}>Edit</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 7. Settings */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">7</span>
              <div className="overview-icon-box" style={{ background: '#475569' }}>
                <Settings size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Settings</span>
                <span className="overview-desc">System configuration and service settings</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/settings')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px', fontSize: '8.5px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderRight: '1px solid #f1f5f9', paddingRight: '4px' }}>
                  <span style={{ fontWeight: 'bold', color: '#2563eb' }}>General</span>
                  <span style={{ color: '#64748b' }}>Service</span>
                  <span style={{ color: '#64748b' }}>Notification</span>
                  <span style={{ color: '#64748b' }}>User Roles</span>
                  <span style={{ color: '#64748b' }}>Security</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Company Name</div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 4px', borderRadius: '3px', fontWeight: 600 }}>Bike Service Center</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Address</div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 4px', borderRadius: '3px' }}>Anna Nagar, Salem</div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '4px' }}>
                    <span style={{ background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>Save Changes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Profile */}
        <div className="overview-card">
          <div className="overview-card-header">
            <div className="overview-card-title-group">
              <span className="overview-number-badge">8</span>
              <div className="overview-icon-box" style={{ background: '#2563eb' }}>
                <User size={18} />
              </div>
              <div className="overview-text-wrap">
                <span className="overview-title">Profile</span>
                <span className="overview-desc">View and edit your profile details</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => navigate('/admin/profile')}
            >
              Open &rarr;
            </button>
          </div>
          <div className="overview-preview-area">
            <div className="mini-preview-frame">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Admin User <span style={{ color: '#10b981', fontSize: '9px' }}>● Active</span></div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Administrator</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '8.5px' }}>
                <div>
                  <div style={{ color: '#64748b' }}>Full Name</div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 4px', borderRadius: '3px' }}>Admin User</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Email</div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 4px', borderRadius: '3px' }}>admin@bikeservice.com</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <span style={{ background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontWeight: 600, fontSize: '9px' }}>Update Profile</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
