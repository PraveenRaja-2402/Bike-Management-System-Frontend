import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Navigation,
  DollarSign,
  CreditCard,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Award,
  Gift,
  ShieldAlert,
  Compass,
  Lock,
  Unlock,
  Volume2,
  Check,
  Zap,
  Battery,
  Fuel,
  Activity,
  QrCode,
  Coins,
  Tag,
  Store,
  Percent,
  BadgePercent,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';
import LeafletMap from '../../components/common/LeafletMap';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import DynamicBrandLogo from '../../components/common/DynamicBrandLogo';
import roninMobileHero from '../../assets/ronin-mobile-hero.jpg';
import { 
  mockCustomerServiceHistory, 
  mockCustomerAlerts,
  mockRoutePlaybackTrip
} from '../../data/mockData';

export default function CustomerApp() {
  const navigate = useNavigate();
  const { 
    branding, 
    bikesList, 
    serviceRecords,
    serviceIntervals,
    customerFines, 
    payFine, 
    membership, 
    redeemReward, 
    earnPoints, 
    geofences, 
    toggleGeofenceAlert,
    currentCustomer,
    loginCustomer,
    logoutCustomer
  } = useApp();

  // Rider's assigned bike (matches assignedBike, ownerPhone, or ownerName; safe fallback if none assigned yet)
  const normalizePhoneDigits = (val) => String(val || '').replace(/[\s\-\+]/g, '').replace(/^91/, '').trim();
  const matchedCustomerBike = currentCustomer
    ? bikesList.find(b => {
        const regMatch = currentCustomer.assignedBike && b.regNo &&
          b.regNo.trim().toUpperCase() === currentCustomer.assignedBike.trim().toUpperCase();
        const phoneMatch = currentCustomer.phone && b.ownerPhone &&
          normalizePhoneDigits(b.ownerPhone) === normalizePhoneDigits(currentCustomer.phone);
        const ownerStr = (b.ownerName || b.customer || '').toLowerCase();
        const nameFirst = (currentCustomer.name || '').toLowerCase().split(' ')[0];
        const nameMatch = Boolean(nameFirst && ownerStr && ownerStr.includes(nameFirst));
        return regMatch || phoneMatch || nameMatch;
      })
    : bikesList[0];

  const bharathBike = matchedCustomerBike || {
    regNo: currentCustomer?.assignedBike || 'No Bike Linked',
    model: 'No Vehicle Assigned',
    brand: 'Yamaha',
    battery: '12.6V',
    fuel: 'N/A',
    status: 'Offline',
    lastUpdated: 'Just now',
    lastLocation: 'Not linked to GPS yet',
    nextService: 'Not scheduled',
    daysLeft: '--',
    lastService: 'Not recorded',
    lastServiceKm: '0 km',
    nextServiceKm: '3,000 km',
    purchasedDate: 'N/A',
    sevenDaysDistance: '0 km',
    sevenDaysChange: '--',
    oneMonthDistance: '0 km',
    oneMonthChange: '--'
  };

  // Rider Login State
  const [customerLoginError, setCustomerLoginError] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  const handleCustomerLoginSubmit = (e) => {
    e.preventDefault();
    setCustomerLoginError('');
    const res = loginCustomer(loginPhone, loginPin);
    if (!res.success) {
      setCustomerLoginError(res.error);
    }
  };

  const handleQuickCustomerSelect = (ph, pn) => {
    setCustomerLoginError('');
    setLoginPhone(ph);
    setLoginPin(pn);
    loginCustomer(ph, pn);
  };

  // Navigation tab: 'home', 'bike', 'distance', 'playback', 'geolocation', 'fines', 'membership', 'service', 'service-history', 'alerts', 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Distance mode: 'weekly' or 'monthly'
  const [distanceMode, setDistanceMode] = useState('weekly');
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  // Route playback player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x
  const [currentPlaybackIndex, setCurrentPlaybackIndex] = useState(0);
  const playbackTimerRef = useRef(null);

  // Fines / Challan payment modal
  const [selectedFineForPay, setSelectedFineForPay] = useState(null);
  const [payMethod, setPayMethod] = useState('UPI');
  const [paymentSuccessToast, setPaymentSuccessToast] = useState('');

  // Rewards redemption modal
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState(null);

  // Bike remote lock state
  const [isEngineLocked, setIsEngineLocked] = useState(false);

  // Service Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [bookingForm, setBookingForm] = useState({
    branch: 'Salem Central Mega Hub',
    serviceType: 'General Periodic Service',
    baseCost: 1250,
    preferredDate: '2026-10-12',
    timeSlot: '10:00 AM - 12:00 PM',
    doorstepPickup: true,
    applyBranchPointsDiscount: true,
    discountPoints: 500,
    discountAmount: 500,
    notes: 'Please check rear brake pad squeak and lubricate chain.'
  });

  const userFines = useMemo(() => {
    const matched = customerFines.filter(f => !f.vehicleNo || f.vehicleNo === bharathBike?.regNo);
    return matched.length > 0 ? matched : customerFines;
  }, [customerFines, bharathBike]);

  const unpaidFines = userFines.filter(f => f.status === 'Unpaid');
  const totalUnpaidFineAmount = unpaidFines.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const riderServiceHistory = useMemo(() => {
    const regUpper = (bharathBike?.regNo || '').trim().toUpperCase();
    const live = (serviceRecords || [])
      .filter(sr => regUpper && (sr.regNo || '').trim().toUpperCase() === regUpper)
      .sort((a, b) => new Date(b.serviceDate || 0) - new Date(a.serviceDate || 0))
      .map(sr => ({
        id: sr.id,
        serviceType: sr.serviceType || 'General Periodic Service',
        cost: `₹${(Number(sr.serviceCost) || 0).toLocaleString()}`,
        date: sr.serviceDate || 'N/A',
        odometer: `${(Number(sr.serviceKm) || 0).toLocaleString()} km`,
        technician: sr.technician || 'Workshop Team'
      }));
    if (live.length > 0) return live;
    if (regUpper === 'TN 30 AB 1234') return mockCustomerServiceHistory;
    return [];
  }, [serviceRecords, bharathBike]);

  const serviceIntervalKm = Number(serviceIntervals?.generalServiceKm) || 3000;
  const currentBikeKm = Number(String(bharathBike?.currentKm ?? 0).replace(/[^0-9]/g, '')) || 0;
  const lastSrvKm = Number(String(bharathBike?.lastServiceKm ?? 0).replace(/[^0-9]/g, '')) || 0;
  const nextSrvKm = Number(String(bharathBike?.nextServiceKm ?? 0).replace(/[^0-9]/g, '')) || (lastSrvKm + serviceIntervalKm);
  const kmProgressPct = nextSrvKm > lastSrvKm
    ? Math.min(100, Math.max(8, Math.round(((currentBikeKm - lastSrvKm) / (nextSrvKm - lastSrvKm)) * 100)))
    : 40;
  const kmRemaining = Math.max(0, nextSrvKm - currentBikeKm);

  // Playback player loop
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setCurrentPlaybackIndex(prev => {
          if (prev >= mockRoutePlaybackTrip.points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (currentPlaybackIndex >= mockRoutePlaybackTrip.points.length - 1) {
      setCurrentPlaybackIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setCurrentPlaybackIndex(0);
  };

  const handlePayFineSubmit = (e) => {
    e.preventDefault();
    if (!selectedFineForPay) return;

    payFine(selectedFineForPay.id, `${payMethod}-${Date.now().toString().slice(-6)}`);
    setPaymentSuccessToast(`Fine payment of ₹${selectedFineForPay.amount} for Challan #${selectedFineForPay.challanNo} successful!`);
    setSelectedFineForPay(null);
    setTimeout(() => setPaymentSuccessToast(''), 4500);
  };

  const handleRedeemClick = (reward) => {
    const res = redeemReward(reward);
    if (res.success) {
      setRedeemedVoucher({ reward, code: res.voucherCode });
      setSelectedRewardToRedeem(null);
    } else {
      alert(res.message);
    }
  };

  const handleBookService = (e) => {
    e.preventDefault();
    setBookingModalOpen(false);

    const isSameBranch = bookingForm.branch === 'Salem Central Mega Hub';
    const canApplyDiscount = isSameBranch && bookingForm.applyBranchPointsDiscount && membership.pointsBalance >= bookingForm.discountPoints;

    if (canApplyDiscount) {
      earnPoints(-bookingForm.discountPoints, `Redeemed: ₹${bookingForm.discountAmount} Discount on ${bookingForm.serviceType} (Salem Central Mega Hub)`);
      const finalPayable = bookingForm.baseCost - bookingForm.discountAmount;
      setBookingSuccessMsg(`Service booked at Salem Central Mega Hub! ₹${bookingForm.discountAmount} same-branch GPS discount applied (${bookingForm.discountPoints} pts redeemed). Total to pay: ₹${finalPayable}.`);
    } else {
      setBookingSuccessMsg(`Service booked at ${bookingForm.branch} for ${bookingForm.preferredDate}! Total: ₹${bookingForm.baseCost}.`);
    }

    setTimeout(() => setBookingSuccessMsg(''), 6000);
  };

  // Weekly & Monthly chart data
  const weeklyData = [
    { day: 'Mon', km: 18, heightPct: 45, trips: 2, duration: '42m' },
    { day: 'Tue', km: 24, heightPct: 60, trips: 3, duration: '55m' },
    { day: 'Wed', km: 16, heightPct: 40, trips: 2, duration: '35m' },
    { day: 'Thu', km: 28, heightPct: 70, trips: 4, duration: '1h 10m' },
    { day: 'Fri', km: 34, heightPct: 88, isMax: true, trips: 5, duration: '1h 24m' },
    { day: 'Sat', km: 12, heightPct: 30, trips: 1, duration: '25m' },
    { day: 'Sun', km: 20, heightPct: 50, trips: 2, duration: '48m' }
  ];

  const monthlyData = [
    { label: 'Week 1', km: 135, heightPct: 65, avg: '19.2 km/day' },
    { label: 'Week 2', km: 155, heightPct: 75, avg: '22.1 km/day' },
    { label: 'Week 3', km: 140, heightPct: 68, avg: '20.0 km/day' },
    { label: 'Week 4', km: 180, heightPct: 90, isMax: true, avg: '25.7 km/day' }
  ];

  return (
    <div className="customer-view-wrapper">
      {/* Standalone Mobile Device Viewport */}
      <div className="mobile-device-frame">
        {!currentCustomer ? (
          <div className="rider-login-container">
            {/* Lifestyle Motorcycle Hero Header */}
            <div
              className="rider-login-hero-banner"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.35) 0%, rgba(16, 24, 40, 0.92) 100%), url(${roninMobileHero})`
              }}
            >
              <div className="rider-hero-top-row">
                <div className="rider-logo-circle">
                  <DynamicBrandLogo size={26} />
                </div>
                <span className="rider-portal-badge">Rider Portal</span>
              </div>

              <div className="rider-hero-copy">
                <h2 className="rider-portal-title">{branding.companyName}</h2>
                <p className="rider-portal-subtitle">
                  Your ride, always road-ready. Track servicing, upcoming care, and vehicle health in one place.
                </p>
                <div className="rider-hero-pills">
                  <span>Service History</span>
                  <span>Reminders</span>
                  <span>Bike Health</span>
                </div>
              </div>
            </div>

            {/* Clean Comfort White Sheet for Login */}
            <div className="rider-login-sheet">
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                  Welcome, Rider
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Sign in with your workshop-registered mobile number &amp; PIN.
                </div>
              </div>

              {/* Error Alert */}
              {customerLoginError && (
                <div className="rider-login-error">
                  <AlertTriangle size={16} />
                  <span>{customerLoginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleCustomerLoginSubmit} className="rider-login-form">
                <div>
                  <label className="rider-form-label">Registered Mobile Number</label>
                  <div className="rider-input-group">
                    <span className="rider-input-prefix">+91</span>
                    <input
                      type="tel"
                      className="rider-input-field"
                      placeholder="e.g. 98765 43210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="rider-form-label">4-Digit Security PIN</label>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Default: 1234</span>
                  </div>
                  <div className="rider-input-group">
                    <Lock size={16} className="rider-input-icon" />
                    <input
                      type={showLoginPin ? "text" : "password"}
                      maxLength={6}
                      className="rider-input-field"
                      placeholder="••••"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="rider-input-toggle"
                      onClick={() => setShowLoginPin(!showLoginPin)}
                    >
                      {showLoginPin ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="rider-submit-btn">
                  <span>Sign In to My Bike</span>
                  <ArrowRight size={17} />
                </button>
              </form>

              <div style={{
                marginTop: '12px',
                padding: '9px 12px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '11.5px',
                color: '#475569',
                lineHeight: 1.45
              }}>
                New rider? Your profile &amp; PIN are created when your bike is registered at the workshop.
              </div>
            </div>

            {/* 1-Tap Quick Demo Riders */}
            <div className="quick-demo-section">
              <div className="quick-demo-title">
                <span>⚡ 1-Tap Instant Rider Login (Demo)</span>
              </div>
              <div className="quick-demo-cards">
                <button
                  type="button"
                  className="quick-demo-card"
                  onClick={() => handleQuickCustomerSelect('9876543210', '1234')}
                >
                  <div className="quick-demo-avatar">BK</div>
                  <div className="quick-demo-info">
                    <div className="quick-demo-name">Bharath Kumar</div>
                    <div className="quick-demo-bike">Yamaha FZ-S • TN 30 AB 1234</div>
                  </div>
                  <span className="quick-demo-pin">PIN: 1234</span>
                </button>

                <button
                  type="button"
                  className="quick-demo-card"
                  onClick={() => handleQuickCustomerSelect('9845011223', '1234')}
                >
                  <div className="quick-demo-avatar" style={{ background: '#7c3aed' }}>SR</div>
                  <div className="quick-demo-info">
                    <div className="quick-demo-name">Sneha Reddy</div>
                    <div className="quick-demo-bike">Hunter 350 • TN 27 BK 9021</div>
                  </div>
                  <span className="quick-demo-pin">PIN: 1234</span>
                </button>
              </div>
            </div>

            {/* Workshop Handover Notice */}
            <div className="rider-help-notice">
              <ShieldCheck size={16} color="#059669" />
              <div>
                <strong>Account created by your service workshop?</strong>
                <p>
                  Your account credentials are provided by your workshop service manager upon vehicle drop-off.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dynamic Island */}
            <div className="dynamic-island">
              <div className="dynamic-island-camera" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' }}>
              {isEngineLocked ? 'SECURED' : 'CONNECTED'}
            </span>
          </div>
          <div className="dynamic-island-sensor" />
        </div>

        {/* iOS Status Bar */}
        <div className={`mobile-status-bar ${activeTab === 'home' || activeTab === 'playback' ? 'light-text' : 'dark-text'}`}>
          <span>9:41</span>
          <div className="status-bar-icons">
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="8" width="3" height="3" rx="0.5" />
              <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
              <rect x="9" y="3" width="3" height="8" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
              <path d="M7.5 3C9.7 3 11.7 3.9 13.1 5.3L14.5 3.9C12.7 2.1 10.2 1 7.5 1C4.8 1 2.3 2.1 0.5 3.9L1.9 5.3C3.3 3.9 5.3 3 7.5 3Z" />
              <path d="M7.5 6.5C8.8 6.5 10 7 10.9 7.9L12.3 6.5C11.1 5.3 9.4 4.5 7.5 4.5C5.6 4.5 3.9 5.3 2.7 6.5L4.1 7.9C5 7 6.2 6.5 7.5 6.5Z" />
              <circle cx="7.5" cy="9.5" r="1.5" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
              <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" fill="none" stroke="currentColor" />
              <rect x="2" y="2" width="16" height="7" rx="1.5" />
              <path d="M20.5 3.5V7.5" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Global Toast if booking created or fine paid */}
        {(bookingSuccessMsg || paymentSuccessToast) && (
          <div style={{
            position: 'absolute',
            top: '56px',
            left: '14px',
            right: '14px',
            zIndex: 1000,
            background: '#ecfdf5',
            border: '1px solid #10b981',
            color: '#065f46',
            padding: '12px 14px',
            borderRadius: '14px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }}>
            <CheckCircle2 size={16} />
            <span>{bookingSuccessMsg || paymentSuccessToast}</span>
          </div>
        )}

        {/* Mobile Screen Content Router */}
        <div className="mobile-screen-content">
          
          {/* =================================================================
              SCREEN 1: HOME (Ultra-Premium Automotive View)
              ================================================================= */}
          {activeTab === 'home' && (
            <div className="customer-home-screen">
              {/* Deep Sapphire Header with Dynamic Branding */}
              <div className="home-header-bg">
                <div className="home-nav-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DynamicBrandLogo size={24} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                      {branding.companyName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      type="button" 
                      className="mobile-icon-btn" 
                      onClick={() => setActiveTab('alerts')}
                      aria-label="Alerts"
                      style={{ position: 'relative' }}
                    >
                      <Bell size={18} />
                      <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 6px #ef4444'
                      }} />
                    </button>
                  </div>
                </div>

                <div className="home-user-greeting">
                  <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600 }}>Salem, TN • 28°C Clear ☀️</span>
                  <h2 className="user-name-title">Hello, {currentCustomer?.name?.split(' ')[0] || 'Rider'}</h2>
                  <div className="bike-safe-status">
                    <span className="bike-safe-dot" />
                    <span>Live GPS Telemetry Active • Safe Zone</span>
                  </div>
                </div>

                {/* Vehicle Selector Card with Live Telemetry Chips */}
                <div className="bike-selector-card" onClick={() => setActiveTab('bike')}>
                  <BrandLogo brand={bharathBike.brand || 'Yamaha'} size={44} />
                  <div className="bike-card-info">
                    <div className="bike-card-reg-row">
                      <span>{bharathBike.regNo}</span>
                      <ChevronDown size={17} color="#64748b" />
                    </div>
                    <span className="bike-card-model">{bharathBike.model}</span>
                  </div>
                  <ChevronRight size={20} className="bike-chevron-right" />
                </div>

                {/* 3 Live Telemetry Stat Pills (Battery, Fuel, Speed) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Battery size={16} color="#34d399" />
                    <div>
                      <div style={{ fontSize: '9px', opacity: 0.8, textTransform: 'uppercase' }}>Battery</div>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>{bharathBike.battery}</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Fuel size={16} color="#fbbf24" />
                    <div>
                      <div style={{ fontSize: '9px', opacity: 0.8, textTransform: 'uppercase' }}>Fuel</div>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>{bharathBike.fuel}</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Zap size={16} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '9px', opacity: 0.8, textTransform: 'uppercase' }}>Status</div>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>{bharathBike.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature TVS Ronin Charcoal Ember Hero Card */}
              <div style={{ padding: '14px 16px 0 16px' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#101828',
                  backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.25) 0%, rgba(16, 24, 40, 0.92) 100%), url(${roninMobileHero})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '150px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff',
                  border: '1px solid rgba(53, 109, 243, 0.28)',
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.18)'
                }}>
                  <span style={{
                    alignSelf: 'flex-start',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                    background: 'rgba(53, 109, 243, 0.28)',
                    color: '#93c5fd',
                    border: '1px solid rgba(96, 165, 250, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    marginBottom: '6px'
                  }}>
                    TVS Ronin • Charcoal Ember
                  </span>
                  <div style={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.2px' }}>
                    Every Ride Deserves Better Care.
                  </div>
                </div>
              </div>

              {/* 3 Core Ownership Summary Cards: My Bikes, Upcoming Services, Completed Services */}
              <div style={{
                padding: '12px 16px 0 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('bike')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '10px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>My Bikes</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {matchedCustomerBike ? '1 Active' : '0 Linked'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bharathBike.regNo}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('service')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '10px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>Upcoming</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {kmRemaining.toLocaleString()} km
                  </div>
                  <div style={{ fontSize: '10px', color: '#d97706', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bharathBike.nextServiceDate || bharathBike.nextService || 'Schedule'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('service-history')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '10px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>Completed</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {riderServiceHistory.length} Done
                  </div>
                  <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                    View History
                  </div>
                </button>
              </div>

              {/* Priority Alert Banners: Traffic Fines & Membership Points */}
              <div style={{ padding: '14px 16px 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* Traffic Fine Banner */}
                {unpaidFines.length > 0 && (
                  <div 
                    onClick={() => setActiveTab('fines')}
                    style={{
                      background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                      border: '1px solid #fecdd3',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(225, 29, 72, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '10px', background: '#e11d48', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#9f1239' }}>
                          {unpaidFines.length} Traffic Challans Due
                        </div>
                        <div style={{ fontSize: '11px', color: '#be123c' }}>
                          Total Fine: ₹{totalUnpaidFineAmount} • Tap for 1-Click UPI Payment
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#e11d48" />
                  </div>
                )}

                {/* GPS Bike Purchase & Branch Loyalty Banner */}
                <div 
                  onClick={() => setActiveTab('membership')}
                  style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    borderRadius: '16px',
                    padding: '13px 15px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.25)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: '11px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                      flexShrink: 0
                    }}>
                      <Coins size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Salem Central Mega Hub</span>
                        <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.5)', padding: '1px 6px', borderRadius: '4px', fontWeight: 900 }}>
                          {membership.pointsBalance} PTS
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        GPS Bike Privilege: Save up to <strong style={{ color: '#fbbf24' }}>₹{membership.monetaryValue}</strong> on services
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#fbbf24" />
                </div>
              </div>

              {/* Quick Actions Dock: Fines, Distance, Playback, Geo Location */}
              <div className="home-quick-actions-grid">
                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('fines')}
                >
                  <div className="action-icon-box" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                    <ShieldAlert size={22} strokeWidth={2.2} />
                  </div>
                  <span className="action-label">Fines</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('distance')}
                >
                  <div className="action-icon-box" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <Activity size={22} strokeWidth={2.2} />
                  </div>
                  <span className="action-label">Distance</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('playback')}
                >
                  <div className="action-icon-box" style={{ background: 'linear-gradient(135deg, #a855f7, #7e22ce)' }}>
                    <Play size={21} strokeWidth={2.2} />
                  </div>
                  <span className="action-label">Playback</span>
                </button>

                <button 
                  type="button" 
                  className="quick-action-item"
                  onClick={() => setActiveTab('geolocation')}
                >
                  <div className="action-icon-box" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <MapPin size={22} strokeWidth={2.2} />
                  </div>
                  <span className="action-label">Geo Zone</span>
                </button>
              </div>

              {/* Live Location Section with Interactive Map */}
              <div className="home-section-container">
                <div className="section-head-row">
                  <span className="section-title-bold">Live Vehicle Location</span>
                  <button 
                    type="button" 
                    className="section-link-blue"
                    onClick={() => setActiveTab('geolocation')}
                  >
                    Safe Zones &rarr;
                  </button>
                </div>

                <div className="home-map-card">
                  <LeafletMap
                    bikes={[bharathBike]}
                    selectedBike={bharathBike}
                    height="190px"
                    showControls={false}
                  />
                </div>

                <div className="location-info-card">
                  <div className="location-info-row">
                    <div className="location-info-icon-wrap">
                      <Clock size={16} />
                    </div>
                    <div className="location-info-texts">
                      <span className="location-info-label">Signal Telemetry</span>
                      <span className="location-info-val">{bharathBike.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="location-info-row" onClick={() => setActiveTab('geolocation')}>
                    <div className="location-info-icon-wrap">
                      <MapPin size={16} />
                    </div>
                    <div className="location-info-texts">
                      <span className="location-info-label">Parked Coordinates</span>
                      <span className="location-info-val">{bharathBike.lastLocation}</span>
                    </div>
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                </div>
              </div>

              {/* Next Service Due Highlight Card */}
              <div style={{ padding: '0 18px 18px 18px' }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#eff6ff', color: '#356DF3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wrench size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Next Scheduled Service</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        Due on <strong>{bharathBike.nextService}</strong> (in {bharathBike.daysLeft} days)
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => setActiveTab('service')}
                  >
                    Details
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* =================================================================
              SCREEN 2: FINES & E-CHALLANS (Requirement: fine)
              ================================================================= */}
          {activeTab === 'fines' && (
            <div className="customer-fines-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Traffic Fines & Challans</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Total Fine Summary Box */}
                <div style={{
                  background: unpaidFines.length > 0 ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 10px 25px rgba(225, 29, 72, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ fontSize: '11.5px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Registration: {bharathBike.regNo}
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 900, margin: '4px 0', letterSpacing: '-0.5px' }}>
                    ₹{totalUnpaidFineAmount}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {unpaidFines.length > 0 ? (
                      <>
                        <AlertTriangle size={14} />
                        <span>{unpaidFines.length} pending traffic violations awaiting clearance</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>All challans settled! Clean riding record.</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Challans list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Official Challan Records</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Salem Traffic Police Portal</span>
                  </div>

                  {userFines.map((fine) => {
                    const isUnpaid = fine.status === 'Unpaid';

                    return (
                      <div key={fine.id} className={`challan-item-card ${isUnpaid ? 'unpaid' : 'paid'}`}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: isUnpaid ? '#e11d48' : '#059669',
                              background: isUnpaid ? '#ffe4e6' : '#ecfdf5',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}>
                              {fine.challanNo}
                            </span>
                            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                              {fine.offense}
                            </div>
                          </div>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            ₹{fine.amount}
                          </span>
                        </div>

                        <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
                          <div>📍 <strong>Location:</strong> {fine.location}</div>
                          <div>🕒 <strong>Date & Time:</strong> {fine.dateTime}</div>
                          <div>🏛️ <strong>Authority:</strong> {fine.issuingAuthority}</div>
                          {fine.paidOn && (
                            <div style={{ color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                              ✓ Settled on {fine.paidOn} • Ref: {fine.paymentRef}
                            </div>
                          )}
                        </div>

                        {isUnpaid && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            <span style={{ fontSize: '11px', color: '#e11d48', fontWeight: 600 }}>Due: {fine.dueDate}</span>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ padding: '7px 16px', fontSize: '12px', background: '#e11d48', borderColor: '#e11d48' }}
                              onClick={() => setSelectedFineForPay(fine)}
                            >
                              <CreditCard size={13} /> Pay ₹{fine.amount} Online
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 3: DISTANCE (WEEKLY / MONTHLY) (Requirement: distance)
              ================================================================= */}
          {activeTab === 'distance' && (
            <div className="customer-distance-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Distance & Telemetry</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Switcher Pill: Weekly vs Monthly */}
                <div style={{
                  background: '#e2e8f0',
                  borderRadius: '14px',
                  padding: '4px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setDistanceMode('weekly')}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '9px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: distanceMode === 'weekly' ? '#ffffff' : 'transparent',
                      color: distanceMode === 'weekly' ? '#356DF3' : '#64748b',
                      boxShadow: distanceMode === 'weekly' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    📅 Weekly Distance
                  </button>

                  <button
                    type="button"
                    onClick={() => setDistanceMode('monthly')}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '9px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      background: distanceMode === 'monthly' ? '#ffffff' : 'transparent',
                      color: distanceMode === 'monthly' ? '#356DF3' : '#64748b',
                      boxShadow: distanceMode === 'monthly' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    📆 Monthly Distance
                  </button>
                </div>

                {/* Big Distance Stat Highlight Card */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {distanceMode === 'weekly' ? 'Past 7 Days Odometer Trend' : 'October 2026 Fleet Distance'}
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: '4px 0', letterSpacing: '-0.8px' }}>
                    {distanceMode === 'weekly' ? '142 km' : '580 km'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 700 }}>
                    {distanceMode === 'weekly' ? '↑ 12% vs previous 7 days (Avg: 20.2 km/day)' : '↑ 8% vs September (520 km total)'}
                  </div>

                  {/* Interactive Bar Chart Visualization */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
                      <span>{distanceMode === 'weekly' ? 'Daily Kilometer Distribution' : 'Weekly Progression (Oct 2026)'}</span>
                      <span>Tap bar for stats</span>
                    </div>

                    <div className="distance-bar-chart">
                      {distanceMode === 'weekly' ? (
                        weeklyData.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="distance-bar-col"
                            onClick={() => setSelectedDayDetail(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="distance-bar-val">{item.km}k</span>
                            <div
                              className={`distance-bar-fill ${item.isMax ? 'active' : ''}`}
                              style={{ height: `${item.heightPct}%` }}
                            />
                            <span className="distance-bar-label">{item.day}</span>
                          </div>
                        ))
                      ) : (
                        monthlyData.map((item, idx) => (
                          <div key={idx} className="distance-bar-col">
                            <span className="distance-bar-val">{item.km}k</span>
                            <div
                              className={`distance-bar-fill ${item.isMax ? 'active' : ''}`}
                              style={{ height: `${item.heightPct}%` }}
                            />
                            <span className="distance-bar-label">{item.label}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Ride Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Average Speed</span>
                    <strong style={{ fontSize: '17px', color: '#0f172a' }}>32.4 km/h</strong>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Fuel Efficiency</span>
                    <strong style={{ fontSize: '17px', color: '#356DF3' }}>48.5 km/L</strong>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Peak Velocity</span>
                    <strong style={{ fontSize: '17px', color: '#0f172a' }}>62 km/h</strong>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Eco Riding Score</span>
                    <strong style={{ fontSize: '17px', color: '#10b981' }}>88 / 100</strong>
                  </div>
                </div>

                {/* Route Playback Shortcut Banner */}
                <div 
                  onClick={() => setActiveTab('playback')}
                  style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #bfdbfe',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#356DF3', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e3a8a' }}>Trip Route Playback</div>
                      <div style={{ fontSize: '11px', color: '#356DF3' }}>Replay morning route with speedometer HUD</div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#356DF3" />
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 4: PLAY BACK (Requirement: play back)
              ================================================================= */}
          {activeTab === 'playback' && (
            <div className="customer-playback-screen" style={{ height: '100%', position: 'relative' }}>
              <div className="subscreen-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1001, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}>
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Trip Route Playback</span>
                <button 
                  type="button" 
                  className="subscreen-back-btn"
                  onClick={handleResetPlayback}
                  title="Reset to Start"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              {/* Full Interactive Playback Map */}
              <div style={{ height: '100%', width: '100%' }}>
                <LeafletMap
                  playbackRoute={mockRoutePlaybackTrip.points}
                  playbackIndex={currentPlaybackIndex}
                  height="100%"
                  showControls={false}
                />
              </div>

              {/* Futuristic Automotive HUD Overlay */}
              <div className="playback-hud-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, letterSpacing: '-0.2px' }}>
                      {mockRoutePlaybackTrip.tripTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#38bdf8" />
                      <span>{mockRoutePlaybackTrip.points[currentPlaybackIndex]?.label || 'Route Trajectory'}</span>
                    </div>
                  </div>

                  {/* Circular Tachometer Speed Badge */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)',
                    border: '2px solid #38bdf8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                      {(mockRoutePlaybackTrip.points[currentPlaybackIndex]?.speed || '0').replace(' km/h', '')}
                    </span>
                    <span style={{ fontSize: '7.5px', color: '#38bdf8', fontWeight: 700 }}>KM/H</span>
                  </div>
                </div>

                {/* Scrubber slider */}
                <input
                  type="range"
                  min="0"
                  max={mockRoutePlaybackTrip.points.length - 1}
                  value={currentPlaybackIndex}
                  onChange={(e) => {
                    setCurrentPlaybackIndex(parseInt(e.target.value, 10));
                    setIsPlaying(false);
                  }}
                  className="playback-scrubber"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                  <span>{mockRoutePlaybackTrip.points[0]?.time}</span>
                  <span>Checkpoint {currentPlaybackIndex + 1} / {mockRoutePlaybackTrip.points.length}</span>
                  <span>{mockRoutePlaybackTrip.points[mockRoutePlaybackTrip.points.length - 1]?.time}</span>
                </div>

                {/* Player Controls Dock */}
                <div className="playback-controls-row">
                  {/* Speed toggle pill */}
                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '7px 14px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {playbackSpeed}x SPEED
                  </button>

                  {/* Big Play / Pause button */}
                  <button
                    type="button"
                    className="playback-play-btn"
                    onClick={handleTogglePlay}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                  </button>

                  {/* Trip Statistics */}
                  <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>{mockRoutePlaybackTrip.totalDistance}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Top: {mockRoutePlaybackTrip.topSpeed}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 5: GEO LOCATION & GEOFENCE (Requirement: geo location)
              ================================================================= */}
          {activeTab === 'geolocation' && (
            <div className="customer-geolocation-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Geo Location & Safe Zones</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Real-time Map with Geofences */}
                <div style={{ borderRadius: '18px', overflow: 'hidden', height: '220px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                  <LeafletMap
                    bikes={[bharathBike]}
                    selectedBike={bharathBike}
                    geofences={geofences}
                    height="100%"
                    showControls={false}
                  />
                </div>

                {/* Distance to Bike Compass Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #356DF3 100%)',
                  borderRadius: '18px',
                  padding: '16px 18px',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Compass size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 600 }}>Proximity To Your Bike</div>
                      <div style={{ fontSize: '22px', fontWeight: 900 }}>1.2 km away</div>
                      <div style={{ fontSize: '11px', opacity: 0.85 }}>Anna Park, Salem Central</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      color: '#356DF3',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => alert(`Starting GPS directions to ${bharathBike.regNo} at Anna Park, Salem...`)}
                  >
                    Directions
                  </button>
                </div>

                {/* Anti-Theft Security Controls */}
                <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '12px' }}>
                    Remote Bike Security Controls
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEngineLocked(!isEngineLocked);
                        alert(isEngineLocked ? 'Engine unlocked successfully.' : 'Remote Immobilizer Activated! Engine is securely locked.');
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: isEngineLocked ? '1.5px solid #ef4444' : '1px solid #e2e8f0',
                        background: isEngineLocked ? '#fef2f2' : '#f8fafc',
                        color: isEngineLocked ? '#dc2626' : '#0f172a',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      {isEngineLocked ? <Lock size={22} color="#dc2626" /> : <Unlock size={22} color="#64748b" />}
                      <span>{isEngineLocked ? 'Engine Locked' : 'Lock Engine'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert('Bike horn beeped 3 times & indicators flashed! (Anti-theft locator)')}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        color: '#0f172a',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      <Volume2 size={22} color="#356DF3" />
                      <span>Find Bike (Beep)</span>
                    </button>
                  </div>
                </div>

                {/* Geofence Safe Zones List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Configured Safe Zones</span>

                  {geofences.map((gf) => (
                    <div key={gf.id} className="geofence-item-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: gf.color, boxShadow: `0 0 8px ${gf.color}` }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{gf.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{gf.location} • {gf.radiusMeters}m radius</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: gf.status === 'Inside' ? '#ecfdf5' : '#f1f5f9',
                          color: gf.status === 'Inside' ? '#059669' : '#64748b'
                        }}>
                          {gf.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: BRANCH LOYALTY POINTS & SERVICE DISCOUNTS
              ================================================================= */}
          {activeTab === 'membership' && (
            <div className="customer-membership-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Branch Loyalty Points</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Store size={16} color="#356DF3" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#356DF3' }}>Salem Central</span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Branch Loyalty Ledger Hero Card (Clean & Modern, NO fake credit card) */}
                <div className="branch-loyalty-hero-card">
                  {/* Top Branch Affinity Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Store size={15} color="#38bdf8" />
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#f1f5f9' }}>
                        {membership.purchasedBranch || "Salem Central Mega Hub"}
                      </span>
                    </div>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.16)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                      Same-Branch Discount Active
                    </span>
                  </div>

                  {/* Main Points Counter */}
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#94a3b8', fontWeight: 700 }}>
                    Available Loyalty Balance
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 6px 0' }}>
                    <span style={{ fontSize: '38px', fontWeight: 900, color: '#fbbf24', letterSpacing: '-1px', lineHeight: 1 }}>
                      {membership.pointsBalance}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#cbd5e1' }}>Points</span>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(251, 191, 36, 0.12)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    color: '#fbbf24',
                    fontWeight: 700,
                    marginBottom: '16px'
                  }}>
                    <BadgePercent size={14} />
                    <span>Worth ₹{membership.monetaryValue} Instant Cash Discount on Next Service</span>
                  </div>

                  {/* Business Model Explanation Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '11.5px',
                    lineHeight: 1.5,
                    color: '#cbd5e1'
                  }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Coins size={14} color="#fbbf24" />
                      <span>How Your GPS Purchase Points Work:</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li><strong>Earned On Purchase:</strong> You received 1,000 Points upon buying your GPS-equipped Yamaha FZ-S.</li>
                      <li><strong>Same-Branch Discount:</strong> When visiting <strong>Salem Central Mega Hub</strong>, redeem these points for direct deductions on your service bill!</li>
                      <li><strong>Repeat Visits:</strong> Every completed service at Salem Central Hub credits an additional <strong>+150 Points</strong> back to you.</li>
                    </ul>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setBookingForm(prev => ({
                        ...prev,
                        branch: 'Salem Central Mega Hub',
                        applyBranchPointsDiscount: true
                      }));
                      setBookingModalOpen(true);
                    }}
                    style={{
                      marginTop: '14px',
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #356DF3, #2957CC)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                    }}
                  >
                    <Wrench size={15} />
                    <span>Book Service with Points Discount</span>
                  </button>
                </div>

                {/* Available Same-Branch Service Discounts */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      Salem Central Hub Service Discounts
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      1 Point = ₹1 Discount
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(membership.availableDiscounts || membership.availableRewards).map((discount) => (
                      <div
                        key={discount.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                              {discount.serviceTitle || discount.title}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              {discount.desc}
                            </div>
                          </div>
                          <span style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap'
                          }}>
                            {discount.category}
                          </span>
                        </div>

                        {/* Pricing and Points Bar */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid #f1f5f9'
                        }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              Workshop Rate
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                              <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                ₹{discount.originalPrice || (discount.finalPrice ? discount.finalPrice + discount.discountAmount : 1250)}
                              </span>
                              <span style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>
                                ₹{discount.finalPrice || 750}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#b45309',
                              background: '#fef3c7',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              display: 'inline-block'
                            }}>
                              Save ₹{discount.discountAmount || 500} ({discount.pointsRequired || discount.pointsCost} Pts)
                            </span>
                          </div>
                        </div>

                        {/* Action Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Store size={12} color="#64748b" />
                            <span>Valid at Salem Central Mega Hub</span>
                          </span>

                          <button
                            type="button"
                            className="btn-primary"
                            style={{
                              padding: '7px 14px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              background: membership.pointsBalance >= (discount.pointsRequired || discount.pointsCost) ? '#356DF3' : '#94a3b8'
                            }}
                            onClick={() => handleRedeemClick(discount)}
                            disabled={membership.pointsBalance < (discount.pointsRequired || discount.pointsCost)}
                          >
                            Redeem & Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Points Activity Ledger */}
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                    Points Activity Log
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {membership.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #f1f5f9',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{tx.title}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span>{tx.date}</span>
                            {tx.badge && (
                              <span style={{ background: '#eff6ff', color: '#356DF3', padding: '1px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 700 }}>
                                {tx.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '13.5px',
                            fontWeight: 900,
                            color: tx.points > 0 ? '#10b981' : '#ef4444'
                          }}>
                            {tx.points > 0 ? `+${tx.points}` : tx.points} Pts
                          </span>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                            Bal: {tx.balanceAfter}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 7: SERVICE (Existing + VIP Booking)
              ================================================================= */}
          {activeTab === 'service' && (
            <div className="customer-service-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Service Management</span>
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('alerts')}>
                  <Bell size={20} />
                </button>
              </div>

              <div className="service-screen-container" style={{ gap: '14px', paddingBottom: '24px' }}>
                {/* Vehicle Summary Strip */}
                <div
                  className="service-bike-header-card"
                  onClick={() => setActiveTab('bike')}
                  style={{
                    borderRadius: '16px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <BrandLogo brand={bharathBike.brand || 'Yamaha'} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{bharathBike.regNo}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{bharathBike.model}</div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#eff6ff',
                    color: '#2563eb',
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}>
                    {currentBikeKm.toLocaleString()} km
                  </span>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                {/* Next Service Hero Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                  borderRadius: '20px',
                  padding: '18px',
                  color: '#ffffff',
                  boxShadow: '0 12px 24px -6px rgba(30, 58, 138, 0.38)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.14)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Wrench size={22} color="#93c5fd" strokeWidth={2.2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Next Scheduled Service
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                          {bharathBike.nextServiceDate || bharathBike.nextService || 'Not scheduled'}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: kmRemaining <= 300 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(16, 185, 129, 0.22)',
                      color: kmRemaining <= 300 ? '#fcd34d' : '#6ee7b7',
                      border: `1px solid ${kmRemaining <= 300 ? 'rgba(251, 191, 36, 0.45)' : 'rgba(52, 211, 153, 0.45)'}`
                    }}>
                      {kmRemaining <= 0 ? 'Due Now' : `${kmRemaining.toLocaleString()} km left`}
                    </span>
                  </div>

                  {/* Odometer Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px' }}>
                      <span>Service Cycle Progress</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{kmProgressPct}%</span>
                    </div>
                    <div style={{ height: '7px', background: 'rgba(255,255,255,0.16)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${kmProgressPct}%`,
                        height: '100%',
                        background: kmRemaining <= 300 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #38bdf8, #34d399)',
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setBookingModalOpen(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '13px',
                      border: 'none',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Calendar size={17} color="#2563eb" strokeWidth={2.3} />
                    <span>Book Service Slot</span>
                  </button>
                </div>

                {/* 2-Column Quick Service Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '13px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>Last Service</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {bharathBike.lastServiceDate || bharathBike.lastService || 'Not recorded'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      At {lastSrvKm.toLocaleString()} km
                    </div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '13px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                      <Clock size={14} color="#2563eb" />
                      <span>Service Interval</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      Every {serviceIntervalKm.toLocaleString()} km
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Next target: {nextSrvKm.toLocaleString()} km
                    </div>
                  </div>
                </div>

                {/* Component Health Checklist */}
                <div className="service-details-card" style={{ borderRadius: '18px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Component Health</span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Auto-monitored</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { name: 'Engine Oil', ok: kmRemaining > 400 },
                      { name: 'Brake Pads', ok: kmRemaining > 300 },
                      { name: 'Chain & Lube', ok: (currentBikeKm - lastSrvKm) < (Number(serviceIntervals?.chainMaintenanceKm) || 500) },
                      { name: 'Air Filter', ok: (currentBikeKm - lastSrvKm) < (Number(serviceIntervals?.airFilterKm) || 6000) }
                    ].map(part => (
                      <div key={part.name} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 12px'
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{part.name}</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: part.ok ? '#059669' : '#d97706',
                          background: part.ok ? '#ecfdf5' : '#fffbeb',
                          padding: '2px 7px',
                          borderRadius: '9999px'
                        }}>
                          {part.ok ? 'Good' : 'Check'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service History */}
                <div className="service-history-card" style={{ borderRadius: '18px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Service History</span>
                    <button 
                      type="button" 
                      className="section-link-blue"
                      onClick={() => setActiveTab('service-history')}
                    >
                      View All &rarr;
                    </button>
                  </div>

                  {riderServiceHistory.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px 12px',
                      background: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '12px',
                      color: '#64748b',
                      fontSize: '12px'
                    }}>
                      No completed service records for {bharathBike.regNo} yet.
                    </div>
                  ) : (
                    riderServiceHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="service-history-row" style={{ padding: '10px 0' }}>
                        <div className="detail-row-left">
                          <div className="detail-icon-circle icon-blue-circle">
                            <Wrench size={15} />
                          </div>
                          <div className="detail-text-col">
                            <span className="detail-title">{item.serviceType}</span>
                            <span className="detail-date">{item.date} • {item.odometer}</span>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#2563eb',
                          background: '#eff6ff',
                          padding: '4px 10px',
                          borderRadius: '9999px'
                        }}>
                          {item.cost}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 8: BIKE DETAILS
              ================================================================= */}
          {activeTab === 'bike' && (
            <div className="customer-bike-details-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Vehicle Specifications</span>
                <div style={{ width: 32 }} />
              </div>

              <div className="bike-details-hero">
                <div className="bike-hero-logo">
                  <BrandLogo brand="Yamaha" size={72} />
                </div>
                <div className="bike-hero-reg-row">
                  <span>{bharathBike.regNo}</span>
                  <Edit2 size={16} color="#356DF3" style={{ cursor: 'pointer' }} />
                </div>
                <span className="bike-hero-model">{bharathBike.model}</span>
                <span className="bike-hero-purchased">Purchased on {bharathBike.purchasedDate}</span>
              </div>

              <div className="bike-distance-stats-row">
                <div className="distance-stat-card" onClick={() => { setDistanceMode('weekly'); setActiveTab('distance'); }}>
                  <div className="stat-card-top-icon stat-icon-blue">
                    <Navigation size={18} />
                  </div>
                  <span className="stat-card-label">7 Days Distance</span>
                  <span className="stat-card-value">{bharathBike.sevenDaysDistance}</span>
                  <span className="stat-card-trend">{bharathBike.sevenDaysChange}</span>
                </div>

                <div className="distance-stat-card" onClick={() => { setDistanceMode('monthly'); setActiveTab('distance'); }}>
                  <div className="stat-card-top-icon stat-icon-purple">
                    <Calendar size={18} />
                  </div>
                  <span className="stat-card-label">1 Month Distance</span>
                  <span className="stat-card-value">{bharathBike.oneMonthDistance}</span>
                  <span className="stat-card-trend">{bharathBike.oneMonthChange}</span>
                </div>
              </div>

              <div className="bike-action-list">
                <div className="bike-action-card-item" onClick={() => setActiveTab('geolocation')}>
                  <div className="bike-action-icon-box bike-action-icon-blue">
                    <MapPin size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Geo Location</span>
                    <span className="bike-action-sub">View live location and safe zones</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                <div className="bike-action-card-item" onClick={() => setActiveTab('playback')}>
                  <div className="bike-action-icon-box bike-action-icon-dark">
                    <Play size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Trip Playback</span>
                    <span className="bike-action-sub">Replay route trips on map</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>

                <div className="bike-action-card-item" onClick={() => setActiveTab('fines')}>
                  <div className="bike-action-icon-box" style={{ background: '#ffe4e6', color: '#e11d48' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <div className="bike-action-text-wrap">
                    <span className="bike-action-title">Traffic Fines</span>
                    <span className="bike-action-sub">{unpaidFines.length} Pending violations</span>
                  </div>
                  <ChevronRight size={18} color="#94a3b8" />
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 9: PROFILE
              ================================================================= */}
          {activeTab === 'profile' && (
            <div className="customer-profile-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Account Profile</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #356DF3, #2957CC)', color: '#fff', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentCustomer?.name ? currentCustomer.name.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{currentCustomer?.name || 'Rider'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{currentCustomer?.phone || 'Not provided'}</div>
                    <div style={{ fontSize: '11.5px', color: '#f59e0b', fontWeight: 800, marginTop: '2px' }}>
                      ⭐ GPS Loyalty Member ({currentCustomer?.membershipPoints ?? membership.pointsBalance} Points)
                    </div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Registered Vehicle</span>
                    <strong>{bharathBike.model} ({bharathBike.regNo})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Insurance Valid Until</span>
                    <strong>15 Dec 2027</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Assigned Service Hub</span>
                    <strong>Salem Central Mega Hub</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Emergency Helpline</span>
                    <strong style={{ color: '#356DF3' }}>{branding.supportPhone}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fecdd3',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    logoutCustomer();
                    setActiveTab('home');
                  }}
                >
                  <LogOut size={16} /> Log Out of Rider App
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 10: ALERTS
              ================================================================= */}
          {activeTab === 'alerts' && (
            <div className="customer-alerts-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('home')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Alerts & Notices</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockCustomerAlerts.map((al) => (
                  <div 
                    key={al.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      padding: '14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{al.title}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{al.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{al.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 11: SERVICE HISTORY
              ================================================================= */}
          {activeTab === 'service-history' && (
            <div className="customer-history-screen">
              <div className="subscreen-header">
                <button type="button" className="subscreen-back-btn" onClick={() => setActiveTab('service')}>
                  <ArrowLeft size={20} />
                </button>
                <span className="subscreen-title">Service Records</span>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockCustomerServiceHistory.map((item) => (
                  <div 
                    key={item.id} 
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '14px 16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{item.serviceType}</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#356DF3' }}>{item.cost}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {item.date} • Odometer: {item.odometer}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', margin: 0 }}>
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <div className="mobile-bottom-nav">
          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} strokeWidth={activeTab === 'home' ? 2.4 : 1.9} />
            <span>Home</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'distance' ? 'active' : ''}`}
            onClick={() => setActiveTab('distance')}
          >
            <Activity size={20} strokeWidth={activeTab === 'distance' ? 2.4 : 1.9} />
            <span>Distance</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'playback' ? 'active' : ''}`}
            onClick={() => setActiveTab('playback')}
          >
            <Play size={20} strokeWidth={activeTab === 'playback' ? 2.4 : 1.9} />
            <span>Playback</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'membership' ? 'active' : ''}`}
            onClick={() => setActiveTab('membership')}
          >
            <Award size={20} strokeWidth={activeTab === 'membership' ? 2.4 : 1.9} />
            <span>Points</span>
          </button>

          <button 
            type="button" 
            className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} strokeWidth={activeTab === 'profile' ? 2.4 : 1.9} />
            <span>Profile</span>
          </button>
        </div>

        {/* Bottom iOS Home Indicator */}
        <div className="mobile-home-indicator-bar" />
      </>
    )}
  </div>

      {/* Modal: Pay Fine Online */}
      {selectedFineForPay && (
        <Modal
          isOpen={Boolean(selectedFineForPay)}
          onClose={() => setSelectedFineForPay(null)}
          title={`Pay Traffic Fine • ₹${selectedFineForPay.amount}`}
        >
          <form onSubmit={handlePayFineSubmit}>
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#9f1239' }}>{selectedFineForPay.offense}</div>
              <div style={{ fontSize: '11px', color: '#be123c', marginTop: '3px' }}>
                Challan #{selectedFineForPay.challanNo} • {selectedFineForPay.location}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {['UPI (GPay/PhonePe)', 'Debit Card', 'NetBanking'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMethod(m)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '10px',
                      border: payMethod === m ? '2px solid #356DF3' : '1px solid #cbd5e1',
                      background: payMethod === m ? '#eff6ff' : '#ffffff',
                      color: payMethod === m ? '#356DF3' : '#475569',
                      fontWeight: 700,
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payer UPI ID / Account</label>
              <input
                type="text"
                className="form-input no-left-icon"
                defaultValue="bharath@okaxis"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
              <button type="button" className="btn-cancel" onClick={() => setSelectedFineForPay(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ background: '#e11d48', borderColor: '#e11d48' }}>
                Authorize Pay ₹{selectedFineForPay.amount}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Redeemed Voucher Code Popup */}
      {redeemedVoucher && (
        <Modal
          isOpen={Boolean(redeemedVoucher)}
          onClose={() => setRedeemedVoucher(null)}
          title="Branch Service Discount Voucher"
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Check size={30} />
            </div>

            <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              {redeemedVoucher.reward.serviceTitle || redeemedVoucher.reward.title}
            </h4>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginBottom: '8px' }}>
              Instant ₹{redeemedVoucher.reward.discountAmount || 500} Cash Discount Applied
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
              Valid exclusively at <strong>Salem Central Mega Hub</strong> for Yamaha FZ-S (TN 30 AB 1234). Present this digital coupon code at the service reception desk:
            </p>

            <div style={{
              background: '#f8fafc',
              border: '2px dashed #356DF3',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '22px',
              fontWeight: 900,
              color: '#356DF3',
              letterSpacing: '2px',
              marginBottom: '18px'
            }}>
              {redeemedVoucher.code}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontWeight: 800 }}
                onClick={() => {
                  setBookingForm(prev => ({
                    ...prev,
                    branch: 'Salem Central Mega Hub',
                    serviceType: redeemedVoucher.reward.serviceTitle || prev.serviceType,
                    baseCost: redeemedVoucher.reward.originalPrice || prev.baseCost,
                    discountAmount: redeemedVoucher.reward.discountAmount || prev.discountAmount,
                    discountPoints: redeemedVoucher.reward.pointsCost || prev.discountPoints,
                    applyBranchPointsDiscount: true
                  }));
                  setRedeemedVoucher(null);
                  setBookingModalOpen(true);
                }}
              >
                <Wrench size={16} /> Book Service with this Discount Now
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', padding: '10px' }}
                onClick={() => setRedeemedVoucher(null)}
              >
                Done & Return to Points
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Book Service Form */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Book Service Appointment"
        size="md"
      >
        <form onSubmit={handleBookService}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Vehicle: <strong>{bharathBike.model} ({bharathBike.regNo})</strong></span>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '11px' }}>● GPS Module Online</span>
            </div>
            <div>Registered Owner: <strong>{currentCustomer?.name || 'Rider'}</strong> ({currentCustomer?.phone || 'N/A'})</div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Workshop Branch *</label>
            <select
              className="form-input no-left-icon"
              value={bookingForm.branch}
              onChange={(e) => setBookingForm({ ...bookingForm, branch: e.target.value })}
            >
              <option value="Salem Central Mega Hub">Salem Central Mega Hub (Purchased Hub • Points Eligible)</option>
              <option value="Fairlands Express Workshop">Fairlands Express Workshop</option>
              <option value="Omalur Expressway Service Hub">Omalur Expressway Service Hub</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service Package *</label>
            <select
              className="form-input no-left-icon"
              value={bookingForm.serviceType}
              onChange={(e) => {
                const type = e.target.value;
                let cost = 1250;
                let disc = 500;
                let pts = 500;
                if (type === 'Quick Oil Change & Filter') { cost = 850; disc = 350; pts = 350; }
                else if (type === 'Brake & Safety Inspection') { cost = 600; disc = 250; pts = 250; }
                else if (type === 'Major Engine Tuning & Valve Clearance') { cost = 2400; disc = 1000; pts = 1000; }
                setBookingForm({
                  ...bookingForm,
                  serviceType: type,
                  baseCost: cost,
                  discountAmount: disc,
                  discountPoints: pts
                });
              }}
            >
              <option value="General Periodic Service">General Periodic Service (Regular: ₹1,250)</option>
              <option value="Quick Oil Change & Filter">Quick Oil Change & Filter (Regular: ₹850)</option>
              <option value="Brake & Safety Inspection">Brake & Safety Inspection (Regular: ₹600)</option>
              <option value="Major Engine Tuning & Valve Clearance">Major Engine Tuning & Valve Clearance (Regular: ₹2,400)</option>
            </select>
          </div>

          {/* Same-Branch Loyalty Discount Toggle & Live Breakdown */}
          {bookingForm.branch === 'Salem Central Mega Hub' ? (
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '14px'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '3px' }}
                  checked={bookingForm.applyBranchPointsDiscount}
                  onChange={(e) => setBookingForm({ ...bookingForm, applyBranchPointsDiscount: e.target.checked })}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                    Apply Same-Branch GPS Loyalty Discount (-₹{bookingForm.discountAmount})
                  </div>
                  <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                    Redeems {bookingForm.discountPoints} Points from your balance of {membership.pointsBalance} Points.
                  </div>
                </div>
              </label>

              {/* Dynamic Price Breakdown */}
              <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #dcfce7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: '#475569' }}>Standard: </span>
                  <span style={{ textDecoration: bookingForm.applyBranchPointsDiscount ? 'line-through' : 'none', color: '#64748b' }}>
                    ₹{bookingForm.baseCost}
                  </span>
                  {bookingForm.applyBranchPointsDiscount && (
                    <span style={{ color: '#059669', fontWeight: 700, marginLeft: '6px' }}>
                      -₹{bookingForm.discountAmount}
                    </span>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#475569', display: 'block' }}>Net Workshop Bill:</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#166534' }}>
                    ₹{bookingForm.applyBranchPointsDiscount ? (bookingForm.baseCost - bookingForm.discountAmount) : bookingForm.baseCost}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '10.5px', color: '#15803d', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} />
                <span>+150 Loyalty Points will be credited on service completion at Salem Central Hub!</span>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '11.5px',
              color: '#92400e',
              marginBottom: '14px'
            }}>
              ⚠️ Note: GPS Loyalty points discounts can only be redeemed when visiting your purchase branch (<strong>Salem Central Mega Hub</strong>).
            </div>
          )}

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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={bookingForm.doorstepPickup}
                onChange={(e) => setBookingForm({ ...bookingForm, doorstepPickup: e.target.checked })}
              />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Complimentary doorstep pickup within 10 km from Salem Central Hub</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-cancel" onClick={() => setBookingModalOpen(false)}>
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

