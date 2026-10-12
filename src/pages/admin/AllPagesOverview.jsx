import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Layers,
  Grid,
  Send,
  Radio,
  Gauge,
  BatteryCharging,
  Fuel,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import { mockBikes, mockUsers, mockBikeBrands } from '../../data/mockData';
import '../../styles/all-pages-slider.css';

export default function AllPagesOverview() {
  const navigate = useNavigate();

  // Active slide index (0 to 7)
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // View modes: 'showcase' (hero 3D slide), 'filmstrip' (horizontal strip), 'grid' (overview matrix)
  const [viewMode, setViewMode] = useState('showcase');

  // Autoplay
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayTimerRef = useRef(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // In-slide interactive states
  const [activeTrackingBikeIndex, setActiveTrackingBikeIndex] = useState(0);
  const [trackingMapMode, setTrackingMapMode] = useState('streets');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);

  // Interactive settings switches inside Slide 7
  const [settingsToggles, setSettingsToggles] = useState({
    autoSms: true,
    speedAlerts: true,
    autoJobCard: false,
    whatsappInvoice: true
  });

  // Touch / mouse swipe handling
  const touchStartX = useRef(null);
  const isDragging = useRef(false);
  const stageRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Slide modules definitions
  const modules = [
    {
      id: 'dashboard',
      index: 1,
      title: 'Dashboard',
      category: 'Operations',
      path: '/admin/dashboard',
      icon: Home,
      color: '#2563eb',
      lightColor: '#eff6ff',
      glowColor: 'rgba(37, 99, 235, 0.4)',
      tag: 'Realtime Command',
      desc: 'High-level telemetry of active bikes, service alerts, and workshop workload.'
    },
    {
      id: 'live-tracking',
      index: 2,
      title: 'Live Bike Tracking',
      category: 'Operations',
      path: '/admin/live-tracking',
      icon: MapPin,
      color: '#10b981',
      lightColor: '#ecfdf5',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      tag: 'GPS Telemetry Radar',
      desc: 'Track live movements, speed, geofencing, and historical breadcrumb paths.'
    },
    {
      id: 'next-service',
      index: 3,
      title: 'Next Service Notifications',
      category: 'Service & Fleet',
      path: '/admin/next-service',
      icon: Bell,
      color: '#f59e0b',
      lightColor: '#fffbeb',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      tag: 'Predictive Maintenance',
      desc: 'Automatic 30-day interval alerts and one-click WhatsApp/SMS notification triggers.'
    },
    {
      id: 'job-cards',
      index: 4,
      title: 'Job Cards',
      category: 'Operations',
      path: '/admin/job-cards',
      icon: ClipboardCheck,
      color: '#8b5cf6',
      lightColor: '#f5f3ff',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      tag: 'Workshop Kanban',
      desc: 'Create digital inspection job cards, track mechanic bays, and monitor ready deliveries.'
    },
    {
      id: 'users',
      index: 5,
      title: 'Users & Technicians',
      category: 'Management',
      path: '/admin/users',
      icon: Users,
      color: '#f43f5e',
      lightColor: '#fff1f2',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      tag: 'Staff & Customers',
      desc: 'Manage service advisors, certified technicians, customer profiles, and permissions.'
    },
    {
      id: 'manage-brands',
      index: 6,
      title: 'Manage Bike Brands',
      category: 'Service & Fleet',
      path: '/admin/manage-brands',
      icon: Tag,
      color: '#0284c7',
      lightColor: '#f0f9ff',
      glowColor: 'rgba(2, 132, 199, 0.4)',
      tag: 'OEM Fleet Catalog',
      desc: 'Configure brand logos, models catalog, and standard preventive service schedules.'
    },
    {
      id: 'settings',
      index: 7,
      title: 'System Settings',
      category: 'Management',
      path: '/admin/settings',
      icon: Settings,
      color: '#475569',
      lightColor: '#f8fafc',
      glowColor: 'rgba(71, 85, 105, 0.4)',
      tag: 'Service Node Engine',
      desc: 'Company information, alert policies, automated messaging templates, and currency.'
    },
    {
      id: 'profile',
      index: 8,
      title: 'Admin Profile',
      category: 'Management',
      path: '/admin/profile',
      icon: User,
      color: '#6366f1',
      lightColor: '#eef2ff',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      tag: 'Superadmin Pass',
      desc: 'Account credentials, session security, two-factor authorization, and activity log.'
    }
  ];

  // Filter modules based on category
  const filteredModules = selectedCategory === 'All' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  // Active module
  const currentModule = modules[currentSlide] || modules[0];

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % modules.length);
  }, [modules.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + modules.length) % modules.length);
  }, [modules.length]);

  const handleGoTo = (index) => {
    setCurrentSlide(index);
    if (stageRef.current) {
      stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'Enter') {
        navigate(currentModule.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentModule.path, navigate]);

  // Autoplay effect
  useEffect(() => {
    if (isPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    } else {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    }

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPlaying, handleNext]);

  // Touch / mouse swipe events
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchStartX.current - endX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }

    touchStartX.current = null;
    isDragging.current = false;
  };

  // Switch toggle in Slide 7
  const toggleSetting = (key, name) => {
    setSettingsToggles(prev => {
      const nextVal = !prev[key];
      showToast(`${name} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [key]: nextVal };
    });
  };

  // Quick Action Handler for Service Slide
  const handleSendReminder = (bikeReg, customer) => {
    showToast(`✓ Instant WhatsApp & SMS Reminder sent to ${customer} (${bikeReg})!`);
  };

  // -------------------------------------------------------------------------
  // Render In-Slide Interactive Previews
  // -------------------------------------------------------------------------

  const renderDashboardPreview = () => (
    <div className="dash-slider-grid">
      <div>
        <div className="dash-stats-row">
          <div className="dash-stat-box">
            <span className="dash-stat-label">Total Fleet Bikes</span>
            <div className="dash-stat-val-group">
              <span className="dash-stat-number" style={{ color: '#2563eb' }}>52</span>
              <span className="dash-stat-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>↑ +12% MoM</span>
            </div>
          </div>
          <div className="dash-stat-box">
            <span className="dash-stat-label">Active Online</span>
            <div className="dash-stat-val-group">
              <span className="dash-stat-number" style={{ color: '#10b981' }}>38</span>
              <span className="dash-stat-badge" style={{ background: '#d1fae5', color: '#065f46' }}>● Live GPS</span>
            </div>
          </div>
          <div className="dash-stat-box">
            <span className="dash-stat-label">Service Due (30d)</span>
            <div className="dash-stat-val-group">
              <span className="dash-stat-number" style={{ color: '#f59e0b' }}>12</span>
              <span className="dash-stat-badge" style={{ background: '#fef3c7', color: '#92400e' }}>4 Urgent</span>
            </div>
          </div>
          <div className="dash-stat-box">
            <span className="dash-stat-label">Offline / Standby</span>
            <div className="dash-stat-val-group">
              <span className="dash-stat-number" style={{ color: '#ef4444' }}>14</span>
              <span className="dash-stat-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Check Battery</span>
            </div>
          </div>
        </div>

        {/* Live Radar Preview */}
        <div className="dash-mini-radar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Radio size={14} color="#2563eb" /> Salem Central Service Radar
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>● Live Telemetry Active</span>
          </div>
          <div className="dash-radar-map-surface">
            <div className="dash-radar-sweep" />
            <div className="dash-gps-beacon" style={{ top: '35%', left: '42%' }} title="TN 30 AB 1234 - Anna Park" />
            <div className="dash-gps-beacon" style={{ top: '65%', left: '60%', background: '#10b981', animationDelay: '0.4s' }} title="TN 28 CD 5678 - Fairlands" />
            <div className="dash-gps-beacon" style={{ top: '48%', left: '72%', background: '#3b82f6', animationDelay: '0.8s' }} title="TN 45 EF 9012 - Junction" />
            <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              Salem Geofence Hub • 38 Online
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Feed */}
      <div className="dash-recent-feed">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>Recent Activity Feed</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Updated seconds ago</span>
        </div>
        <div className="dash-feed-item">
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>TN 30 AB 1234 <span style={{ color: '#10b981', fontWeight: 600 }}>• 45 km/h</span></div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Near Anna Park, Salem • Yamaha FZ-S</div>
          </div>
          <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Moving</span>
        </div>
        <div className="dash-feed-item">
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>JC-003 Completed</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Customer: Mani • Quality Check Passed</div>
          </div>
          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Ready</span>
        </div>
        <div className="dash-feed-item">
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>Service Alert Sent</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>TN 28 CD 5678 • Due in 11 days</div>
          </div>
          <span style={{ background: '#fffbeb', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Notified</span>
        </div>
      </div>
    </div>
  );

  const renderLiveTrackingPreview = () => {
    const selectedBike = mockBikes[activeTrackingBikeIndex] || mockBikes[0];

    return (
      <div className="tracker-slider-deck">
        <div className="tracker-telemetry-console">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>Select Active Bike Telemetry</span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>● GPS 4G LTE Signal: Strong</span>
          </div>
          <div className="tracker-bike-selector-pills">
            {mockBikes.slice(0, 4).map((bike, idx) => (
              <button
                key={bike.id}
                type="button"
                className={`tracker-bike-pill ${activeTrackingBikeIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  setActiveTrackingBikeIndex(idx);
                  showToast(`Live telemetry switched to ${bike.regNo} (${bike.model})`);
                }}
              >
                {bike.regNo}
              </button>
            ))}
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{selectedBike.regNo}</span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '9999px', 
                fontSize: '11px', 
                fontWeight: 700,
                background: selectedBike.status === 'Moving' ? '#ecfdf5' : '#eff6ff',
                color: selectedBike.status === 'Moving' ? '#047857' : '#1d4ed8'
              }}>
                {selectedBike.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <strong>{selectedBike.model}</strong> • Owner: {selectedBike.customer} ({selectedBike.phone})
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
              📍 {selectedBike.lastLocation}
            </div>
          </div>

          <div className="tracker-gauges-cluster">
            <div className="tracker-gauge-card">
              <div className="tracker-gauge-label">
                <Gauge size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} /> Speed
              </div>
              <div className="tracker-gauge-value" style={{ color: '#10b981' }}>{selectedBike.speed || '0 km/h'}</div>
            </div>
            <div className="tracker-gauge-card">
              <div className="tracker-gauge-label">
                <BatteryCharging size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} /> Battery
              </div>
              <div className="tracker-gauge-value" style={{ color: '#0284c7' }}>{selectedBike.battery || '94%'}</div>
            </div>
            <div className="tracker-gauge-card">
              <div className="tracker-gauge-label">
                <Fuel size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} /> Fuel Level
              </div>
              <div className="tracker-gauge-value" style={{ color: '#f59e0b' }}>{selectedBike.fuel || '72%'}</div>
            </div>
          </div>
        </div>

        <div className="tracker-map-view-box">
          <div className="tracker-map-controls-row">
            <div className="tracker-map-hud-badge">
              LIVE SATELLITE HUD • SALEM, TN
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                type="button" 
                onClick={() => setTrackingMapMode('streets')}
                style={{
                  background: trackingMapMode === 'streets' ? '#10b981' : 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Streets
              </button>
              <button 
                type="button" 
                onClick={() => setTrackingMapMode('satellite')}
                style={{
                  background: trackingMapMode === 'satellite' ? '#10b981' : 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Satellite
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: '#10b981', 
              margin: '0 auto 12px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 30px #10b981',
              fontSize: '28px'
            }}>
              🏍️
            </div>
            <div style={{ fontWeight: 800, fontSize: '16px' }}>{selectedBike.regNo}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Lat: {selectedBike.lat} • Lng: {selectedBike.lng}</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Heading: {selectedBike.heading || 45}° North-East</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', zIndex: 2 }}>
            <span>Odometer: {selectedBike.totalDistance || '14,820 km'}</span>
            <span>Geofence: Inside Safe Boundary ✓</span>
          </div>
        </div>
      </div>
    );
  };

  const renderNextServicePreview = () => {
    const bikesToShow = serviceFilter === 'urgent' 
      ? mockBikes.filter(b => b.daysLeft <= 15)
      : mockBikes.slice(0, 3);

    return (
      <div className="service-slider-deck">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Upcoming Service Deadlines</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                type="button" 
                onClick={() => setServiceFilter('all')}
                style={{
                  background: serviceFilter === 'all' ? '#2563eb' : '#f1f5f9',
                  color: serviceFilter === 'all' ? '#fff' : '#64748b',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                All (12)
              </button>
              <button 
                type="button" 
                onClick={() => setServiceFilter('urgent')}
                style={{
                  background: serviceFilter === 'urgent' ? '#f59e0b' : '#f1f5f9',
                  color: serviceFilter === 'urgent' ? '#fff' : '#64748b',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Urgent &lt;15d (4)
              </button>
            </div>
          </div>

          <div className="service-urgency-list">
            {bikesToShow.map((b) => (
              <div key={b.id} className="service-card-item">
                <div className="service-item-bike">
                  <span className="service-item-reg">{b.regNo}</span>
                  <span className="service-item-sub">{b.model} • {b.customer}</span>
                </div>
                <div className="service-countdown-badge">
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 800, 
                    color: b.daysLeft <= 10 ? '#dc2626' : '#d97706' 
                  }}>
                    {b.daysLeft} Days Left
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Target: {b.nextServiceKm}</span>
                </div>
                <button 
                  type="button" 
                  className="service-notify-action-btn"
                  onClick={() => handleSendReminder(b.regNo, b.customer)}
                >
                  <Send size={12} /> Send Alert
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="service-rules-card">
          <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>Automation & Notification Health</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
              <span style={{ color: '#475569' }}>Advance Reminder Policy:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>30 Days Prior</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
              <span style={{ color: '#475569' }}>WhatsApp API Gateway:</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>Connected ✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
              <span style={{ color: '#475569' }}>SMS Dispatch Queue:</span>
              <span style={{ fontWeight: 700, color: '#2563eb' }}>0 Pending</span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-secondary" 
            style={{ marginTop: 'auto', fontSize: '12px', padding: '8px' }}
            onClick={() => showToast('Dispatched bulk reminders to all 12 bikes with upcoming service!')}
          >
            ⚡ Trigger Bulk Reminders (12 Bikes)
          </button>
        </div>
      </div>
    );
  };

  const renderJobCardsPreview = () => (
    <div className="jobs-pipeline-board">
      <div className="job-column">
        <div className="job-column-header">
          <span>OPEN QUEUE</span>
          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '4px' }}>3</span>
        </div>
        <div className="job-ticket-card">
          <div style={{ fontWeight: 800, color: '#2563eb' }}>JC-002</div>
          <div style={{ fontWeight: 600 }}>TN 28 CD 5678</div>
          <div style={{ color: '#64748b' }}>Priya • General Service</div>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', width: 'fit-content' }}>Advisor: Ramesh</span>
        </div>
        <div className="job-ticket-card">
          <div style={{ fontWeight: 800, color: '#2563eb' }}>JC-004</div>
          <div style={{ fontWeight: 600 }}>TN 30 GH 3456</div>
          <div style={{ color: '#64748b' }}>Anand • Brake Pad Replacement</div>
        </div>
      </div>

      <div className="job-column">
        <div className="job-column-header">
          <span>IN SERVICE</span>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px' }}>3</span>
        </div>
        <div className="job-ticket-card">
          <div style={{ fontWeight: 800, color: '#b45309' }}>JC-001</div>
          <div style={{ fontWeight: 600 }}>TN 30 AB 1234</div>
          <div style={{ color: '#64748b' }}>Bharath • Bay 2 (Mani)</div>
          <div style={{ height: 4, background: '#fde68a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '65%', height: '100%', background: '#d97706' }} />
          </div>
        </div>
      </div>

      <div className="job-column">
        <div className="job-column-header">
          <span>QUALITY CHECK</span>
          <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '1px 6px', borderRadius: '4px' }}>1</span>
        </div>
        <div className="job-ticket-card">
          <div style={{ fontWeight: 800, color: '#4338ca' }}>JC-005</div>
          <div style={{ fontWeight: 600 }}>TN 45 EF 9012</div>
          <div style={{ color: '#64748b' }}>Senthil • Road Test Done</div>
        </div>
      </div>

      <div className="job-column">
        <div className="job-column-header">
          <span>READY FOR PICKUP</span>
          <span style={{ background: '#d1fae5', color: '#065f46', padding: '1px 6px', borderRadius: '4px' }}>1</span>
        </div>
        <div className="job-ticket-card">
          <div style={{ fontWeight: 800, color: '#059669' }}>JC-003</div>
          <div style={{ fontWeight: 600 }}>TN 38 KL 2345</div>
          <div style={{ color: '#64748b' }}>Mani • Bill: ₹ 2,450</div>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', width: 'fit-content' }}>Paid & Ready</span>
        </div>
      </div>
    </div>
  );

  const renderUsersPreview = () => (
    <div className="users-slider-grid">
      {mockUsers.slice(0, 3).map((u) => (
        <div key={u.id} className="user-profile-tile">
          <div className="user-tile-avatar" style={{ background: u.role === 'Administrator' ? '#2563eb' : u.role === 'Technician' ? '#10b981' : '#8b5cf6' }}>
            {u.name.charAt(0)}
            <div className="user-tile-online-dot" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{u.name}</div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{u.role}</div>
          </div>
          <div style={{ fontSize: '11px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#334155' }}>
            📞 {u.phone}
          </div>
          <button 
            type="button" 
            style={{ 
              marginTop: '4px', 
              background: '#eff6ff', 
              color: '#2563eb', 
              border: '1px solid #bfdbfe', 
              borderRadius: '6px', 
              padding: '4px 10px', 
              fontSize: '11px', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
            onClick={() => showToast(`Initiated direct call / dispatch to ${u.name}`)}
          >
            Direct Contact
          </button>
        </div>
      ))}
    </div>
  );

  const renderBrandsPreview = () => (
    <div className="brands-slider-grid">
      {mockBikeBrands.slice(0, 8).map((b, idx) => (
        <div 
          key={b.id} 
          className={`brand-showcase-tile ${selectedBrandIndex === idx ? 'selected' : ''}`}
          onClick={() => {
            setSelectedBrandIndex(idx);
            showToast(`Selected OEM Brand: ${b.name} (${b.totalModels} Models registered)`);
          }}
        >
          <BrandLogo brand={b.name} size={36} />
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{b.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{b.totalModels} Models</div>
          <div style={{ fontSize: '10.5px', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
            {b.defaultInterval}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettingsPreview = () => (
    <div className="settings-slider-cockpit">
      <div className="setting-toggle-row">
        <div className="setting-toggle-info">
          <span className="setting-toggle-title">Automated SMS Reminders</span>
          <span className="setting-toggle-desc">Dispatch automatic notifications 30 days prior to next service</span>
        </div>
        <div 
          className={`switch-control ${settingsToggles.autoSms ? 'checked' : ''}`}
          onClick={() => toggleSetting('autoSms', 'Automated SMS Reminders')}
        >
          <div className="switch-handle" />
        </div>
      </div>

      <div className="setting-toggle-row">
        <div className="setting-toggle-info">
          <span className="setting-toggle-title">Speeding & Breach Alerts</span>
          <span className="setting-toggle-desc">Trigger instant notifications when bikes exceed 75 km/h</span>
        </div>
        <div 
          className={`switch-control ${settingsToggles.speedAlerts ? 'checked' : ''}`}
          onClick={() => toggleSetting('speedAlerts', 'Speeding & Breach Alerts')}
        >
          <div className="switch-handle" />
        </div>
      </div>

      <div className="setting-toggle-row">
        <div className="setting-toggle-info">
          <span className="setting-toggle-title">Auto-Generate Job Cards</span>
          <span className="setting-toggle-desc">Automatically create blank job sheets upon vehicle geo-arrival</span>
        </div>
        <div 
          className={`switch-control ${settingsToggles.autoJobCard ? 'checked' : ''}`}
          onClick={() => toggleSetting('autoJobCard', 'Auto-Generate Job Cards')}
        >
          <div className="switch-handle" />
        </div>
      </div>

      <div className="setting-toggle-row">
        <div className="setting-toggle-info">
          <span className="setting-toggle-title">WhatsApp Digital PDF Invoices</span>
          <span className="setting-toggle-desc">Send automated PDF invoices once job cards reach Ready state</span>
        </div>
        <div 
          className={`switch-control ${settingsToggles.whatsappInvoice ? 'checked' : ''}`}
          onClick={() => toggleSetting('whatsappInvoice', 'WhatsApp PDF Invoices')}
        >
          <div className="switch-handle" />
        </div>
      </div>
    </div>
  );

  const renderProfilePreview = () => (
    <div className="profile-slider-card">
      <div className="profile-id-pass">
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#38bdf8', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, marginBottom: 10 }}>
          A
        </div>
        <div style={{ fontWeight: 800, fontSize: '16px' }}>Admin User</div>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>administrator@bikeservice.com</div>
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
          🛡️ TIER 1 SUPERADMIN
        </div>
      </div>

      <div className="profile-details-table">
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Designation</div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>Chief Operations Manager</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Center</div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>Salem Central Hub #01</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Two-Factor Security (2FA)</div>
          <div style={{ fontWeight: 700, color: '#10b981' }}>Active & Enforced ✓</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Session Clearance</div>
          <div style={{ fontWeight: 700, color: '#2563eb' }}>Full Root Privileges</div>
        </div>
      </div>
    </div>
  );

  // Selector for preview content
  const renderSlideContent = (id) => {
    switch (id) {
      case 'dashboard':
        return renderDashboardPreview();
      case 'live-tracking':
        return renderLiveTrackingPreview();
      case 'next-service':
        return renderNextServicePreview();
      case 'job-cards':
        return renderJobCardsPreview();
      case 'users':
        return renderUsersPreview();
      case 'manage-brands':
        return renderBrandsPreview();
      case 'settings':
        return renderSettingsPreview();
      case 'profile':
        return renderProfilePreview();
      default:
        return renderDashboardPreview();
    }
  };

  const IconComponent = currentModule.icon;

  return (
    <div className="slider-overview-container">
      
      {/* 1. Top Controls Bar */}
      <div className="slider-top-bar">
        <div className="slider-top-left">
          <div className="slider-slide-counter-badge">
            <span className="slider-counter-dot" style={{ background: currentModule.color, boxShadow: `0 0 8px ${currentModule.color}` }} />
            <span>MODULE {String(currentModule.index).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</span>
          </div>

          <div className="slider-categories-nav">
            {['All', 'Operations', 'Service & Fleet', 'Management'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`slider-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  // Find first matching module in category
                  if (cat !== 'All') {
                    const match = modules.findIndex(m => m.category === cat);
                    if (match !== -1) setCurrentSlide(match);
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-top-right">
          {/* Autoplay Toggle */}
          <button
            type="button"
            className={`slider-autoplay-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title="Toggle automatic presentation carousel (Spacebar)"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Auto-Sliding' : 'Autoplay'}</span>
          </button>

          {/* View Modes */}
          <div className="slider-view-toggle">
            <button
              type="button"
              className={`slider-view-btn ${viewMode === 'showcase' ? 'active' : ''}`}
              onClick={() => setViewMode('showcase')}
              title="Showcase Slide Deck"
            >
              <Sparkles size={14} /> Slide Stage
            </button>
            <button
              type="button"
              className={`slider-view-btn ${viewMode === 'filmstrip' ? 'active' : ''}`}
              onClick={() => setViewMode('filmstrip')}
              title="Horizontal Filmstrip Carousel"
            >
              <Layers size={14} /> Filmstrip
            </button>
            <button
              type="button"
              className={`slider-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Classic Matrix Grid"
            >
              <Grid size={14} /> Grid
            </button>
          </div>

          <div className="slider-hint-pill">
            <span className="slider-hint-kbd">←</span>
            <span className="slider-hint-kbd">→</span>
            <span>slide</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Showcase Slide Stage */}
      {viewMode === 'showcase' && (
        <div 
          ref={stageRef}
          className="slider-stage-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
        >
          {/* Ambient Glow matching module color */}
          <div 
            className="slider-ambient-glow" 
            style={{ background: currentModule.glowColor }} 
          />

          {/* Navigation Arrows */}
          <button 
            type="button" 
            className="slider-nav-arrow prev"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            type="button" 
            className="slider-nav-arrow next"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* The Hero Slide Card */}
          <div className="slider-deck-track">
            <div className="slider-hero-card" key={currentModule.id}>
              
              {/* Slide Header */}
              <div className="slider-card-hero-header">
                <div className="slider-card-hero-left">
                  <span className="slider-hero-index-pill">
                    {String(currentModule.index).padStart(2, '0')}
                  </span>
                  
                  <div 
                    className="slider-hero-icon-box"
                    style={{ background: currentModule.color }}
                  >
                    <IconComponent size={24} />
                  </div>

                  <div className="slider-hero-title-group">
                    <div className="slider-hero-title-row">
                      <span className="slider-hero-title">{currentModule.title}</span>
                      <span 
                        className="slider-hero-tag"
                        style={{ 
                          background: currentModule.lightColor, 
                          color: currentModule.color 
                        }}
                      >
                        {currentModule.tag}
                      </span>
                    </div>
                    <span className="slider-hero-desc">{currentModule.desc}</span>
                  </div>
                </div>

                <div className="slider-card-hero-right">
                  <button
                    type="button"
                    className="slider-launch-btn"
                    style={{ background: currentModule.color }}
                    onClick={() => navigate(currentModule.path)}
                  >
                    <span>Launch Module</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slide Interactive Canvas */}
              <div className="slider-interactive-canvas">
                {renderSlideContent(currentModule.id)}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Filmstrip Mode (Horizontal continuous slide scroll) */}
      {viewMode === 'filmstrip' && (
        <div className="slider-filmstrip-track">
          {filteredModules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <div 
                key={mod.id} 
                className="slider-filmstrip-card"
                onClick={() => {
                  setCurrentSlide(modules.findIndex(m => m.id === mod.id));
                  setViewMode('showcase');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: mod.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ModIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{mod.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{mod.category}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: mod.color, background: mod.lightColor, padding: '2px 8px', borderRadius: '4px' }}>
                    #{mod.index}
                  </span>
                </div>
                <div style={{ padding: '16px', background: '#fafbfd', flex: 1, fontSize: '12px', color: '#475569' }}>
                  <p style={{ margin: '0 0 12px' }}>{mod.desc}</p>
                  <button 
                    type="button" 
                    className="btn-primary btn-sm"
                    style={{ background: mod.color, width: '100%', justifyContent: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(mod.path);
                    }}
                  >
                    Open Page &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Grid Mode (Matrix view) */}
      {viewMode === 'grid' && (
        <div className="overview-grid">
          {filteredModules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <div key={mod.id} className="overview-card">
                <div className="overview-card-header">
                  <div className="overview-card-title-group">
                    <span className="overview-number-badge">{mod.index}</span>
                    <div className="overview-icon-box" style={{ background: mod.color }}>
                      <ModIcon size={18} />
                    </div>
                    <div className="overview-text-wrap">
                      <span className="overview-title">{mod.title}</span>
                      <span className="overview-desc">{mod.desc}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-primary btn-sm"
                    style={{ background: mod.color }}
                    onClick={() => navigate(mod.path)}
                  >
                    Open &rarr;
                  </button>
                </div>
                <div className="overview-preview-area" style={{ padding: 12 }}>
                  {renderSlideContent(mod.id)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Bottom Thumbnails Navigator Dock */}
      <div className="slider-thumbnails-dock">
        {modules.map((mod, idx) => {
          const ModIcon = mod.icon;
          const isActive = currentSlide === idx;

          return (
            <button
              key={mod.id}
              type="button"
              className={`slider-thumb-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleGoTo(idx)}
            >
              <div 
                className="slider-thumb-icon-circle"
                style={{ 
                  background: isActive ? mod.color : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b'
                }}
              >
                <ModIcon size={16} />
              </div>
              <span className="slider-thumb-label">{mod.title}</span>
              {isActive && (
                <div 
                  className="slider-thumb-active-bar" 
                  style={{ background: mod.color }} 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 6. Floating Feedback Toast */}
      {toastMessage && (
        <div className="slider-toast-banner">
          <CheckCircle2 size={18} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
