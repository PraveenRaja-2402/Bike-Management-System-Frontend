import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  MapPin, 
  Wrench, 
  Clock, 
  Share2, 
  ArrowLeft, 
  MoreVertical, 
  Edit2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Home, 
  Bike as BikeIcon, 
  User, 
  Calendar, 
  ShieldCheck, 
  Droplet, 
  Disc, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Navigation
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import LeafletMap from '../../components/common/LeafletMap';
import Modal from '../../components/common/Modal';
import { 
  mockBikes, 
  mockCustomerServiceHistory, 
  mockCustomerAlerts 
} from '../../data/mockData';

export default function CustomerApp() {
  const navigate = useNavigate();
  const bharathBike = mockBikes[0]; // Yamaha FZ-S (TN 30 AB 1234)

  // Current active view: 'home', 'bike', 'service', 'profile', 'live-location', 'alerts', 'service-history'
  const [activeTab, setActiveTab] = useState('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [bookingForm, setBookingForm] = useState({
    serviceType: 'General Periodic Service',
    preferredDate: '2026-10-12',
    timeSlot: '10:00 AM - 12:00 PM',
    doorstepPickup: true,
    notes: 'Please check rear brake pad squeak and lubricate chain.'
  });

  const handleBookService = (e) => {
    e.preventDefault();
    setBookingModalOpen(false);
    setBookingSuccessMsg(`Service booked successfully for ${bookingForm.preferredDate}! Our advisor will contact you.`);
    setTimeout(() => setBookingSuccessMsg(''), 5000);
  };

  return (
    <div className="customer-view-wrapper">
      {/* Top bar controls for desktop users to return to Admin */}
      <div className="customer-top-bar-controls">
        <div className="customer-mode-badge">
          <span>📱 Customer App Preview</span>
        </div>
        <button
          type="button"
          className="customer-back-to-admin"
          onClick={() => navigate('/admin/all-pages')}
        >
          <ArrowLeft size={14} /> Back to Admin Panel
        </button>
      </div>

      {/* Mobile Device Mockup Frame */}
      <div className="mobile-device-frame">
        
        {/* iOS Status Bar */}
        <div className={`mobile-status-bar ${activeTab === 'home' ? 'light-text' : 'dark-text'}`}>
          <span>9:41</span>
          <div className="status-bar-icons">
            {/* Cellular signal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="8" width="3" height="3" rx="0.5" />
              <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
              <rect x="9" y="3" width="3" height="8" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
            </svg>
            {/* Wifi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
              <path d="M7.5 3C9.7 3 11.7 3.9 13.1 5.3L14.5 3.9C12.7 2.1 10.2 1 7.5 1C4.8 1 2.3 2.1 0.5 3.9L1.9 5.3C3.3 3.9 5.3 3 7.5 3Z" />
              <path d="M7.5 6.5C8.8 6.5 10 7 10.9 7.9L12.3 6.5C11.1 5.3 9.4 4.5 7.5 4.5C5.6 4.5 3.9 5.3 2.7 6.5L4.1 7.9C5 7 6.2 6.5 7.5 6.5Z" />
              <circle cx="7.5" cy="9.5" r="1.5" />
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
              <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" fill="none" stroke="currentColor" />
              <rect x="2" y="2" width="16" height="7" rx="1.5" />
              <path d="M20.5 3.5V7.5" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Global Toast if booking created */}
        {bookingSuccessMsg && (
          <div style={{
            position: 'absolute',
            top: '50px',
            left: '12px',
            right: '12px',
            zIndex: 1000,
            background: '#ecfdf5',
            border: '1px solid #10b981',
            color: '#065f46',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CheckCircle2 size={16} />
            <span>{bookingSuccessMsg}</span>
          </div>
        )}

        {/* Mobile Screen Content Router */}
        <div className="mobile-screen-content">
          
          {/* =================================================================
              SCREEN 1: HOME (Matching Design 1 Left Screen)
              ================================================================= */}
          {activeTab === 'home' && (
            <div className="customer-home-screen">
              {/* Blue Header Section */}
              <div className="home-header-bg">
                <div className="home-nav-row">
                  <button type="button" className="mobile-icon-btn" aria-label="Menu">
                    <Menu size={22} />
                  </button>
                  <button 
                    type="button" 
                    className="mobile-icon-btn" 
                    onClick={() => setActiveTab('alerts')}
                    aria-label="Alerts"
                    style={{ position: 'relative' }}
                  >
                    <Bell size={20} />
                    <span style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#ef4444'
                    }} />
                  </button>
                </div>

                <div className="home-user-greeting">
                  <h2 className="user-name-title">Hi Bharath</h2>
                  <div className="bike-safe-status">
                    <span>Your Bike is Safe</span>
                    <span className="bike-safe-dot" />
                  </div>
                </div>

                {/* Bike Selector Card */}
                <div className="bike-selector-card" onClick={() => setActiveTab('bike')}>
                  <BrandLogo brand="Yamaha" size={44} />
                  <div className="bike-card-info">
                    <div className="bike-card-reg-row">
                      <span>{bharathBike.regNo}</span>
                      <ChevronDown size={18} color="#64748b" />
                    </div>
                    <span className="bike-card-model">{bharathBike.model}</span>
                  </div>
                  <ChevronRight size={20} className="bike-chevron-right" />
                </div>
              </div>

              {/* 4 Quick Action Buttons */}
              <div className="home-quick-actions-grid">
                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('live-location')}
                >
                  <div className="action-icon-box action-tracking">
                    <MapPin size={24} />
                  </div>
                  <span className="action-label">Live Tracking</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('service')}
                >
                  <div className="action-icon-box action-service">
                    <Wrench size={24} />
                  </div>
                  <span className="action-label">Service</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('service-history')}
                >
                  <div className="action-icon-box action-history">
                    <Clock size={24} />
                  </div>
                  <span className="action-label">History</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('alerts')}
                >
                  <div className="action-icon-box action-alerts">
                    <Bell size={24} />
                  </div>
                  <span className="action-label">Alerts</span>
                </button>
              </div>

              {/* Live Location Section */}
              <div className="home-section-container">
                <div className="section-head-row">
                  <span className="section-title-bold">Live Location</span>
                  <button 
                    type="button" 
                    className="section-link-blue"
                    onClick={() => setActiveTab('live-location')}
                  >
                    View Full Map
                  </button>
                </div>

                {/* Live Location Interactive Map Preview */}
                <div className="home-map-card">
                  <LeafletMap
                    bikes={[bharathBike]}
                    selectedBike={bharathBike}
                    height="200px"
                    showControls={false}
                  />
                </div>

                {/* Location Details Info Card */}
                <div className="location-info-card">
                  <div className="location-info-row">
                    <div className="location-info-icon-wrap">
                      <MapPin size={16} />
                    </div>
                    <div className="location-info-texts">
                      <span className="location-info-label">Last Updated</span>
                      <span className="location-info-val">{bharathBike.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="location-info-row" onClick={() => setActiveTab('live-location')}>
                    <div className="location-info-icon-wrap">
                      <Navigation size={16} />
                    </div>
                    <div className="location-info-texts">
                      <span className="location-info-label">Last Parked Location</span>
                      <span className="location-info-val">{bharathBike.lastLocation}</span>
                    </div>
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 2: BIKE DETAILS (Matching Design 1 Center Screen)
              ================================================================= */}
          {activeTab === 'bike' && (
            <div className="customer-bike-details-screen">
              <div className="subscreen-header">
                <button 
                  type="button" 
                  className="subscreen-back-btn"
                  onClick={() => setActiveTab('home')}
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Bike Details</span>
                <button type="button" className="subscreen-back-btn">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Hero Bike Info */}
              <div className="bike-details-hero">
                <div className="bike-hero-logo">
                  <BrandLogo brand="Yamaha" size={72} />
                </div>
                <div className="bike-hero-reg-row">
                  <span>{bharathBike.regNo}</span>
                  <Edit2 size={16} color="#2563eb" style={{ cursor: 'pointer' }} />
                </div>
                <span className="bike-hero-model">{bharathBike.model}</span>
                <span className="bike-hero-purchased">Purchased on {bharathBike.purchasedDate}</span>
              </div>

              {/* Distance Metrics: 7 Days vs 1 Month */}
              <div className="bike-distance-stats-row">
                <div className="distance-stat-card">
                  <div className="stat-card-top-icon stat-icon-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span className="stat-card-label">7 Days Distance</span>
                  <span className="stat-card-value">{bharathBike.sevenDaysDistance}</span>
                  <span className="stat-card-trend">{bharathBike.sevenDaysChange}</span>
                </div>

                <div className="distance-stat-card">
                  <div className="stat-card-top-icon stat-icon-purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="20" x2="18" y2="6" />
                      <line x1="12" y1="20" x2="12" y2="12" />
                      <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                  </div>
                  <span className="stat-card-label">1 Month Distance</span>
                  <span className="stat-card-value">{bharathBike.oneMonthDistance}</span>
                  <span className="stat-card-trend">{bharathBike.oneMonthChange}</span>
                </div>
              </div>

              {/* Action List Cards matching Design 1 */}
              <div className="bike-action-list">
                <div className="bike-action-card-item" onClick={() => setActiveTab('live-location')}>
                  <div className="bike-action-icon-box bike-action-icon-blue">
                    <MapPin size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Live Location</span>
                    <span className="bike-action-sub">View current bike location</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                <div className="bike-action-card-item" onClick={() => setActiveTab('service-history')}>
                  <div className="bike-action-icon-box bike-action-icon-dark">
                    <Clock size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Ride History</span>
                    <span className="bike-action-sub">View previous trips</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                <div className="bike-action-card-item" onClick={() => alert('Location link copied to clipboard: https://bikeservice.app/track/TN30AB1234 (Mock action)')}>
                  <div className="bike-action-icon-box bike-action-icon-blue">
                    <Share2 size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Share Location</span>
                    <span className="bike-action-sub">Share live location</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 3: SERVICE (Matching Design 1 Right Screen)
              ================================================================= */}
          {activeTab === 'service' && (
            <div className="customer-service-screen">
              <div className="subscreen-header">
                <button 
                  type="button" 
                  className="subscreen-back-btn"
                  onClick={() => setActiveTab('home')}
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Service</span>
                <button 
                  type="button" 
                  className="subscreen-back-btn"
                  onClick={() => setActiveTab('alerts')}
                >
                  <Bell size={20} />
                </button>
              </div>

              <div className="service-screen-container">
                {/* Bike Card Pill */}
                <div className="service-bike-header-card" onClick={() => setActiveTab('bike')}>
                  <BrandLogo brand="Yamaha" size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{bharathBike.regNo}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{bharathBike.model}</div>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                {/* Next Service Due Highlight Card */}
                <div className="service-due-highlight-card">
                  <div className="due-card-header-row">
                    <div className="wrench-blue-box">
                      <Wrench size={24} />
                    </div>
                    <div className="due-card-texts">
                      <span className="due-title-sub">Next Service Due</span>
                      <span className="due-date-bold">{bharathBike.nextService}</span>
                      <span className="due-days-pill">(In {bharathBike.daysLeft} Days)</span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="book-service-btn-full"
                    onClick={() => setBookingModalOpen(true)}
                  >
                    Book Service
                  </button>
                </div>

                {/* Service Details Card matching Design 1 */}
                <div className="service-details-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Service Details</span>
                    <ChevronRight size={16} color="#94a3b8" />
                  </div>

                  <div className="service-detail-item-row">
                    <div className="detail-row-left">
                      <div className="detail-icon-circle icon-green-circle">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="detail-text-col">
                        <span className="detail-title">Last Service</span>
                        <span className="detail-date">{bharathBike.lastService}</span>
                      </div>
                    </div>
                    <span className="detail-km-badge">{bharathBike.lastServiceKm}</span>
                  </div>

                  <div className="service-detail-item-row">
                    <div className="detail-row-left">
                      <div className="detail-icon-circle icon-blue-circle">
                        <Clock size={16} />
                      </div>
                      <div className="detail-text-col">
                        <span className="detail-title">Next Service</span>
                        <span className="detail-date">{bharathBike.nextService}</span>
                      </div>
                    </div>
                    <span className="detail-km-badge">{bharathBike.nextServiceKm}</span>
                  </div>

                  <div className="service-detail-item-row">
                    <div className="detail-row-left">
                      <div className="detail-icon-circle icon-gray-circle">
                        <Wrench size={16} />
                      </div>
                      <div className="detail-text-col">
                        <span className="detail-title">Service Interval</span>
                      </div>
                    </div>
                    <span className="detail-km-badge">Every 5,000 km</span>
                  </div>
                </div>

                {/* Service History list matching Design 1 */}
                <div className="service-history-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Service History</span>
                    <button 
                      type="button" 
                      className="section-link-blue"
                      onClick={() => setActiveTab('service-history')}
                    >
                      View All
                    </button>
                  </div>

                  {mockCustomerServiceHistory.slice(0, 3).map((item) => {
                    const isGeneral = item.serviceType.includes('General');
                    const isOil = item.serviceType.includes('Oil');

                    return (
                      <div 
                        key={item.id} 
                        className="service-history-row"
                        onClick={() => alert(`Service details for ${item.serviceType}: ₹${item.cost} on ${item.date}`)}
                      >
                        <div className="detail-row-left">
                          <div className={`detail-icon-circle ${isGeneral ? 'icon-blue-circle' : isOil ? 'icon-green-circle' : 'icon-gray-circle'}`}>
                            {isGeneral ? <Wrench size={15} /> : isOil ? <Droplet size={15} /> : <Disc size={15} />}
                          </div>
                          <div className="detail-text-col">
                            <span className="detail-title">{item.serviceType}</span>
                            <span className="detail-date">{item.date}</span>
                          </div>
                        </div>
                        <span className="history-cost-tag">
                          {item.cost} <ChevronRight size={15} color="#94a3b8" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 4: FULL LIVE LOCATION
              ================================================================= */}
          {activeTab === 'live-location' && (
            <div className="customer-full-map-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Live Tracking</span>
                <div style={{ width: 24 }} />
              </div>

              <div style={{ height: 'calc(100% - 54px)', position: 'relative' }}>
                <LeafletMap
                  bikes={[bharathBike]}
                  selectedBike={bharathBike}
                  height="100%"
                />

                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '14px',
                  right: '14px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 1000
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{bharathBike.regNo}</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>{bharathBike.model}</span>
                    </div>
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      Speed: {bharathBike.speed}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>📍 Location: {bharathBike.lastLocation}</div>
                    <div>🕒 Updated: {bharathBike.lastUpdated}</div>
                    <div>🔋 Battery: {bharathBike.battery} | ⛽ Fuel: {bharathBike.fuel}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 5: SERVICE HISTORY
              ================================================================= */}
          {activeTab === 'service-history' && (
            <div className="customer-history-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('service')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Service Records</span>
                <div style={{ width: 24 }} />
              </div>

              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockCustomerServiceHistory.map((item) => (
                  <div 
                    key={item.id} 
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      padding: '14px 16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.serviceType}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>{item.cost}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {item.date} • Odometer: {item.odometer}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: ALERTS
              ================================================================= */}
          {activeTab === 'alerts' && (
            <div className="customer-alerts-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Alerts & Notices</span>
                <div style={{ width: 24 }} />
              </div>

              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockCustomerAlerts.map((al) => (
                  <div 
                    key={al.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '12px 14px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{al.title}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{al.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{al.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 7: PROFILE
              ================================================================= */}
          {activeTab === 'profile' && (
            <div className="customer-profile-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Account Profile</span>
                <div style={{ width: 24 }} />
              </div>

              <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    B
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Bharath</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>+91 98765 43210</div>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Active Customer Since 2024</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Registered Bike</span>
                    <strong>Yamaha FZ-S (TN 30 AB 1234)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Insurance Valid Until</span>
                    <strong>15 Dec 2027</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Emergency Service Helpline</span>
                    <strong style={{ color: '#2563eb' }}>1800-425-BIKE</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
                  onClick={() => alert('Profile settings saved! (Mock state)')}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Fixed Mobile Bottom Navigation Bar matching Design 1 */}
        <div className="mobile-bottom-nav">
          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'bike' ? 'active' : ''}`}
            onClick={() => setActiveTab('bike')}
          >
            <BikeIcon size={20} />
            <span>Bike</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'service' ? 'active' : ''}`}
            onClick={() => setActiveTab('service')}
          >
            <Wrench size={20} />
            <span>Service</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>

      </div>

      {/* Modal: Book Service Form */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Book Service Appointment"
        maxWidth="480px"
      >
        <form onSubmit={handleBookService}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '13px' }}>
            <div>Vehicle: <strong>Yamaha FZ-S ({bharathBike.regNo})</strong></div>
            <div>Owner: <strong>Bharath</strong> (9876543210)</div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Package *</label>
            <select
              className="form-input no-left-icon"
              value={bookingForm.serviceType}
              onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
            >
              <option value="General Periodic Service">General Periodic Service (₹1,250)</option>
              <option value="Quick Oil Change">Quick Oil Change & Filter (₹850)</option>
              <option value="Brake & Safety Inspection">Brake & Safety Inspection (₹600)</option>
              <option value="Major Engine Tuning">Major Engine Tuning & Valve Clearance (₹2,400)</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                className="form-input no-left-icon"
                value={bookingForm.preferredDate}
                onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-input no-left-icon"
                value={bookingForm.timeSlot}
                onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
              >
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={bookingForm.doorstepPickup}
                onChange={(e) => setBookingForm({ ...bookingForm, doorstepPickup: e.target.checked })}
              />
              <strong>Opt for Doorstep Bike Pickup & Drop (Salem city limit)</strong>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests / Symptoms</label>
            <textarea
              className="form-input no-left-icon"
              rows={2}
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setBookingModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
