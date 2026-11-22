import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Filter,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Phone,
  User,
  Wrench,
  Check,
  ExternalLink,
  Edit2,
  RefreshCw,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';

export default function NextServicePage() {
  const { 
    bikesList, 
    serviceIntervals, 
    updateBikeKm, 
    sendCustomerWhatsApp, 
    sendCustomerSms,
    branding 
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'overdue', 'upcoming', 'insurance', 'good'
  const [brandFilter, setBrandFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Modal State
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [activeBikeForNotify, setActiveBikeForNotify] = useState(null);
  const [notificationType, setNotificationType] = useState('whatsapp'); // 'whatsapp' | 'sms'
  const [customMsg, setCustomMsg] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  // Quick KM Update Modal
  const [kmModalOpen, setKmModalOpen] = useState(false);
  const [bikeForKm, setBikeForKm] = useState(null);
  const [newKmInput, setNewKmInput] = useState('');

  // Calculate reminder statuses for all bikes
  const enrichedBikes = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bikesList.map((bike) => {
      const curKm = parseInt(bike.currentKm, 10) || 0;
      const nextKm = parseInt(bike.nextServiceKm, 10) || (curKm + 3000);
      const kmRemaining = nextKm - curKm;

      // Next Service Date calculations
      let daysRemaining = 999;
      if (bike.nextServiceDate) {
        const nextDate = new Date(bike.nextServiceDate);
        nextDate.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      }

      // Insurance expiry calculations
      let insuranceDaysRemaining = null;
      let isInsuranceExpired = false;
      let isInsuranceExpiringSoon = false;
      if (bike.insuranceExpiryDate) {
        const insDate = new Date(bike.insuranceExpiryDate);
        insDate.setHours(0, 0, 0, 0);
        insuranceDaysRemaining = Math.ceil((insDate - today) / (1000 * 60 * 60 * 24));
        isInsuranceExpired = insuranceDaysRemaining < 0;
        isInsuranceExpiringSoon = insuranceDaysRemaining >= 0 && insuranceDaysRemaining <= (serviceIntervals.insuranceNoticeDays || 30);
      }

      // Overdue condition: either KM exceeded OR due date has passed
      const isKmOverdue = kmRemaining <= 0;
      const isDateOverdue = daysRemaining < 0;
      const isOverdue = isKmOverdue || isDateOverdue;

      // Upcoming condition: due within 500 KM or within 15 days
      const isKmUpcoming = kmRemaining > 0 && kmRemaining <= 500;
      const isDateUpcoming = daysRemaining >= 0 && daysRemaining <= 15;
      const isUpcoming = !isOverdue && (isKmUpcoming || isDateUpcoming);

      // Urgency score for sorting
      let urgencyScore = 0;
      if (isOverdue) {
        urgencyScore = 10000 + Math.abs(kmRemaining) + (Math.abs(daysRemaining) * 50);
      } else if (isUpcoming) {
        urgencyScore = 5000 - kmRemaining;
      } else {
        urgencyScore = 1000 - kmRemaining;
      }

      return {
        ...bike,
        kmRemaining,
        daysRemaining,
        insuranceDaysRemaining,
        isInsuranceExpired,
        isInsuranceExpiringSoon,
        isKmOverdue,
        isDateOverdue,
        isOverdue,
        isUpcoming,
        isGood: !isOverdue && !isUpcoming,
        urgencyScore
      };
    }).sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [bikesList, serviceIntervals]);

  // Overall metric counts
  const totalBikesCount = enrichedBikes.length;
  const overdueCount = enrichedBikes.filter(b => b.isOverdue).length;
  const upcomingCount = enrichedBikes.filter(b => b.isUpcoming).length;
  const insuranceAlertCount = enrichedBikes.filter(b => b.isInsuranceExpired || b.isInsuranceExpiringSoon).length;
  const goodCount = enrichedBikes.filter(b => b.isGood).length;

  // Filtered bikes
  const filteredBikes = useMemo(() => {
    return enrichedBikes.filter((b) => {
      // Tab filter
      if (activeTab === 'overdue' && !b.isOverdue) return false;
      if (activeTab === 'upcoming' && !b.isUpcoming) return false;
      if (activeTab === 'insurance' && !(b.isInsuranceExpired || b.isInsuranceExpiringSoon)) return false;
      if (activeTab === 'good' && !b.isGood) return false;

      // Brand filter
      if (brandFilter !== 'All' && b.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesReg = b.regNo.toLowerCase().includes(q);
        const matchesOwner = (b.ownerName || '').toLowerCase().includes(q);
        const matchesPhone = (b.ownerPhone || '').includes(q);
        const matchesModel = (b.model || '').toLowerCase().includes(q);
        if (!matchesReg && !matchesOwner && !matchesPhone && !matchesModel) return false;
      }

      return true;
    });
  }, [enrichedBikes, activeTab, brandFilter, searchQuery]);

  // Open notification modal
  const handleOpenNotify = (bike, type = 'whatsapp') => {
    setActiveBikeForNotify(bike);
    setNotificationType(type);

    let reason = '';
    if (bike.isOverdue) {
      if (bike.kmRemaining <= 0 && bike.daysRemaining < 0) {
        reason = `exceeded service benchmark by ${Math.abs(bike.kmRemaining).toLocaleString()} km and is overdue by ${Math.abs(bike.daysRemaining)} days`;
      } else if (bike.kmRemaining <= 0) {
        reason = `reached ${bike.currentKm?.toLocaleString()} km, exceeding the scheduled ${bike.nextServiceKm?.toLocaleString()} km interval by ${Math.abs(bike.kmRemaining).toLocaleString()} km`;
      } else {
        reason = `overdue for periodic maintenance since ${bike.nextServiceDate} (${Math.abs(bike.daysRemaining)} days overdue)`;
      }
    } else if (bike.isUpcoming) {
      reason = `due for scheduled maintenance soon (only ${bike.kmRemaining} km or ${bike.daysRemaining} days left)`;
    } else if (bike.isInsuranceExpiringSoon || bike.isInsuranceExpired) {
      reason = bike.isInsuranceExpired 
        ? `insurance has EXPIRED on ${bike.insuranceExpiryDate}. Please renew immediately for safety and legal compliance`
        : `insurance is due for renewal on ${bike.insuranceExpiryDate} (${bike.insuranceDaysRemaining} days remaining)`;
    } else {
      reason = `due for periodic servicing on ${bike.nextServiceDate} or at ${bike.nextServiceKm?.toLocaleString()} km`;
    }

    const message = `Hello ${bike.ownerName || 'Customer'}, this is a priority reminder from ${branding.companyName || 'Salem Bike Service Center'}. Your ${bike.brand} ${bike.model} (${bike.regNo}) is ${reason}. Please schedule your maintenance slot today or reply to confirm convenient drop-off time. Thank you!`;

    setCustomMsg(message);
    setNotifyModalOpen(true);
  };

  // Dispatch notification
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!activeBikeForNotify) return;

    if (notificationType === 'whatsapp') {
      sendCustomerWhatsApp(activeBikeForNotify.ownerPhone, customMsg);
      setAlertSuccess(`✅ WhatsApp reminder generated for ${activeBikeForNotify.ownerName} (${activeBikeForNotify.regNo}). Chat opened!`);
    } else {
      sendCustomerSms(activeBikeForNotify.ownerPhone, customMsg);
      setAlertSuccess(`✅ SMS notification queued and dispatched to ${activeBikeForNotify.ownerPhone}!`);
    }

    setNotifyModalOpen(false);
    setTimeout(() => setAlertSuccess(''), 6000);
  };

  // Direct 1-click WhatsApp
  const handleDirectWhatsApp = (bike) => {
    const text = `Hello ${bike.ownerName || 'Customer'}, friendly maintenance reminder from ${branding.companyName || 'Salem Bike Service Center'}. Your bike ${bike.regNo} (${bike.model}) is due for scheduled service at ${bike.nextServiceKm?.toLocaleString()} km (Current: ${bike.currentKm?.toLocaleString()} km). Please contact us to book your service slot.`;
    sendCustomerWhatsApp(bike.ownerPhone, text);
    setAlertSuccess(`✅ Direct WhatsApp opened for ${bike.ownerName} (${bike.regNo})`);
    setTimeout(() => setAlertSuccess(''), 5000);
  };

  // Open Quick KM Update Modal
  const handleOpenKmModal = (bike) => {
    setBikeForKm(bike);
    setNewKmInput(bike.currentKm || '');
    setKmModalOpen(true);
  };

  const handleSaveKm = (e) => {
    e.preventDefault();
    if (!bikeForKm) return;
    const kmNum = parseInt(newKmInput, 10);
    if (isNaN(kmNum) || kmNum < 0) {
      alert('Please enter a valid kilometre reading');
      return;
    }
    updateBikeKm(bikeForKm.id, kmNum);
    setKmModalOpen(false);
    setAlertSuccess(`✅ Updated odometer for ${bikeForKm.regNo} to ${kmNum.toLocaleString()} km`);
    setTimeout(() => setAlertSuccess(''), 5000);
  };

  return (
    <div className="next-service-page" style={{ paddingBottom: '32px' }}>
      {/* Header Banner - Premium Light SaaS Style */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #EAECF0',
        borderRadius: '14px',
        padding: '18px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.08), 0px 1px 2px rgba(16, 24, 40, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FEF3F2, #FEE4E2)',
            color: '#F04438',
            border: '1px solid #FECDCA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={22} />
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Service Alerts & Maintenance Reminders</span>
              <span style={{ 
                fontSize: '11px', 
                background: '#FEF3F2', 
                color: '#F04438', 
                border: '1px solid #FECDCA',
                padding: '2px 8px', 
                borderRadius: '9999px', 
                fontWeight: 700 
              }}>
                {overdueCount} CRITICAL OVERDUE
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#667085', marginTop: '2px' }}>
              Automatic KM and Date threshold calculations • Insurance expiry tracking • 1-click WhatsApp & SMS reminder dispatch
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link 
            to="/admin/settings" 
            className="btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <Settings size={14} /> Configure Intervals
          </Link>
          <Link 
            to="/admin/services" 
            className="btn-primary btn-sm"
          >
            <Wrench size={14} /> Log New Service
          </Link>
        </div>
      </div>

      {/* Success banner */}
      {alertSuccess && (
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
          <CheckCircle2 size={18} />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Quick Metric KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div 
          onClick={() => setActiveTab('all')}
          style={{
            background: activeTab === 'all' ? '#f0f9ff' : '#ffffff',
            border: activeTab === 'all' ? '2px solid #0284c7' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
            <span>Total Monitored Bikes</span>
            <Gauge size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            {totalBikesCount}
          </div>
          <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '4px', fontWeight: 500 }}>
            All registered customer vehicles
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('overdue')}
          style={{
            background: activeTab === 'overdue' ? '#fef2f2' : '#ffffff',
            border: activeTab === 'overdue' ? '2px solid #ef4444' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
            <span>Overdue Services</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626', marginTop: '6px' }}>
            {overdueCount}
          </div>
          <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px', fontWeight: 500 }}>
            KM or target date exceeded
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('upcoming')}
          style={{
            background: activeTab === 'upcoming' ? '#fffbeb' : '#ffffff',
            border: activeTab === 'upcoming' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#d97706', fontSize: '13px', fontWeight: 600 }}>
            <span>Upcoming Reminders</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>
            {upcomingCount}
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', fontWeight: 500 }}>
            Due within 500 km or 15 days
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('insurance')}
          style={{
            background: activeTab === 'insurance' ? '#faf5ff' : '#ffffff',
            border: activeTab === 'insurance' ? '2px solid #9333ea' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#7e22ce', fontSize: '13px', fontWeight: 600 }}>
            <span>Insurance Expiry Alerts</span>
            <ShieldAlert size={18} color="#9333ea" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#7e22ce', marginTop: '6px' }}>
            {insuranceAlertCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b21a8', marginTop: '4px', fontWeight: 500 }}>
            Expires within 30 days or expired
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('good')}
          style={{
            background: activeTab === 'good' ? '#f0fdf4' : '#ffffff',
            border: activeTab === 'good' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#15803d', fontSize: '13px', fontWeight: 600 }}>
            <span>Good Condition</span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#15803d', marginTop: '6px' }}>
            {goodCount}
          </div>
          <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px', fontWeight: 500 }}>
            Adequate KM & time margin
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        {/* Controls Bar */}
        <div className="table-controls-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all')}
            >
              All Bikes ({totalBikesCount})
            </button>
            <button
              type="button"
              className={`btn-sm ${activeTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'overdue' ? { background: '#ef4444', borderColor: '#ef4444' } : {}}
              onClick={() => setActiveTab('overdue')}
            >
              ⚠️ Overdue ({overdueCount})
            </button>
            <button
              type="button"
              className={`btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'upcoming' ? { background: '#f59e0b', borderColor: '#f59e0b' } : {}}
              onClick={() => setActiveTab('upcoming')}
            >
              🔔 Upcoming ({upcomingCount})
            </button>
            <button
              type="button"
              className={`btn-sm ${activeTab === 'insurance' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'insurance' ? { background: '#9333ea', borderColor: '#9333ea' } : {}}
              onClick={() => setActiveTab('insurance')}
            >
              🛡️ Insurance ({insuranceAlertCount})
            </button>
            <button
              type="button"
              className={`btn-sm ${activeTab === 'good' ? 'btn-primary' : 'btn-secondary'}`}
              style={activeTab === 'good' ? { background: '#16a34a', borderColor: '#16a34a' } : {}}
              onClick={() => setActiveTab('good')}
            >
              ✅ Good ({goodCount})
            </button>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              className="filter-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              style={{ minWidth: '130px' }}
            >
              <option value="All">All Brands</option>
              <option value="Yamaha">Yamaha</option>
              <option value="Honda">Honda</option>
              <option value="Royal Enfield">Royal Enfield</option>
              <option value="TVS">TVS</option>
              <option value="Bajaj">Bajaj</option>
              <option value="KTM">KTM</option>
              <option value="Hero">Hero</option>
              <option value="Suzuki">Suzuki</option>
            </select>

            <div className="search-box-wrapper" style={{ minWidth: '220px' }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search Reg No, Owner, Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle & Customer</th>
                <th>Current KM</th>
                <th>Next Service Benchmark</th>
                <th>Due In (KM / Days)</th>
                <th>Insurance Status</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Reminder Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBikes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>No bikes match the selected reminder criteria</p>
                    <p style={{ fontSize: '13px' }}>Try switching tabs or resetting your search filter</p>
                  </td>
                </tr>
              ) : (
                filteredBikes.map((bike) => {
                  return (
                    <tr 
                      key={bike.id}
                      style={bike.isOverdue ? { background: '#fff5f5' } : bike.isUpcoming ? { background: '#fffdf5' } : {}}
                    >
                      {/* Vehicle & Customer */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: bike.isOverdue ? '#fee2e2' : bike.isUpcoming ? '#fef3c7' : '#e0f2fe',
                            color: bike.isOverdue ? '#dc2626' : bike.isUpcoming ? '#d97706' : '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px'
                          }}>
                            {bike.brand?.slice(0, 2).toUpperCase() || 'BK'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                              {bike.regNo}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {bike.brand} {bike.model}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <User size={11} /> <strong>{bike.ownerName}</strong> • {bike.ownerPhone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current KM */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                            {bike.currentKm?.toLocaleString()} km
                          </span>
                          <button
                            type="button"
                            title="Update Odometer KM"
                            onClick={() => handleOpenKmModal(bike)}
                            style={{
                              background: '#f1f5f9',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              color: '#475569'
                            }}
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Last: {bike.lastServiceKm?.toLocaleString()} km
                        </div>
                      </td>

                      {/* Next Service Benchmark */}
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
                          Target: {bike.nextServiceKm?.toLocaleString()} km
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Calendar size={12} /> {bike.nextServiceDate || 'Not Set'}
                        </div>
                      </td>

                      {/* Due In (KM / Days) */}
                      <td>
                        {bike.isOverdue ? (
                          <div>
                            {bike.kmRemaining <= 0 && (
                              <div style={{ color: '#dc2626', fontWeight: 800, fontSize: '13px' }}>
                                ⚠️ Over by {Math.abs(bike.kmRemaining).toLocaleString()} km
                              </div>
                            )}
                            {bike.daysRemaining < 0 && (
                              <div style={{ color: '#b91c1c', fontSize: '12px', fontWeight: 600 }}>
                                🕒 {Math.abs(bike.daysRemaining)} days past due
                              </div>
                            )}
                          </div>
                        ) : bike.isUpcoming ? (
                          <div>
                            <div style={{ color: '#d97706', fontWeight: 800, fontSize: '13px' }}>
                              🔔 {bike.kmRemaining.toLocaleString()} km left
                            </div>
                            <div style={{ color: '#b45309', fontSize: '12px' }}>
                              🕒 {bike.daysRemaining} days remaining
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ color: '#15803d', fontWeight: 600, fontSize: '13px' }}>
                              ✅ {bike.kmRemaining.toLocaleString()} km left
                            </div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>
                              🕒 {bike.daysRemaining} days
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Insurance Status */}
                      <td>
                        {bike.insuranceExpiryDate ? (
                          bike.isInsuranceExpired ? (
                            <div>
                              <span style={{ 
                                display: 'inline-block',
                                background: '#fee2e2', 
                                color: '#dc2626', 
                                fontSize: '11px', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 700 
                              }}>
                                🛑 EXPIRED
                              </span>
                              <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '2px' }}>
                                {bike.insuranceExpiryDate}
                              </div>
                            </div>
                          ) : bike.isInsuranceExpiringSoon ? (
                            <div>
                              <span style={{ 
                                display: 'inline-block',
                                background: '#f3e8ff', 
                                color: '#7e22ce', 
                                fontSize: '11px', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 700 
                              }}>
                                ⚠️ {bike.insuranceDaysRemaining} days left
                              </span>
                              <div style={{ fontSize: '11px', color: '#6b21a8', marginTop: '2px' }}>
                                Exp: {bike.insuranceExpiryDate}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span style={{ 
                                display: 'inline-block',
                                background: '#f0fdf4', 
                                color: '#16a34a', 
                                fontSize: '11px', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 600 
                              }}>
                                Valid
                              </span>
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                Exp: {bike.insuranceExpiryDate}
                              </div>
                            </div>
                          )
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Not Recorded</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td>
                        {bike.isOverdue ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontWeight: 700,
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            <AlertTriangle size={11} /> OVERDUE
                          </span>
                        ) : bike.isUpcoming ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fef3c7',
                            color: '#b45309',
                            fontWeight: 700,
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            <Clock size={11} /> DUE SOON
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#dcfce7',
                            color: '#15803d',
                            fontWeight: 700,
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '9999px'
                          }}>
                            <Check size={11} /> UP-TO-DATE
                          </span>
                        )}
                      </td>

                      {/* Reminder Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            title="Direct WhatsApp Reminder"
                            onClick={() => handleDirectWhatsApp(bike)}
                            style={{
                              background: '#25D366',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 1px 3px rgba(37, 211, 102, 0.3)'
                            }}
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </button>

                          <button
                            type="button"
                            title="SMS Notification"
                            onClick={() => handleOpenNotify(bike, 'sms')}
                            className="btn-secondary btn-sm"
                            style={{ padding: '6px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Smartphone size={13} /> SMS
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER NOTIFICATION MODAL */}
      <Modal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        title={notificationType === 'whatsapp' ? '💬 Dispatch WhatsApp Service Reminder' : '📱 Dispatch SMS Service Reminder'}
        maxWidth="540px"
      >
        {activeBikeForNotify && (
          <form onSubmit={handleSendNotification}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Recipient Details:</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginTop: '2px' }}>
                {activeBikeForNotify.ownerName} ({activeBikeForNotify.ownerPhone})
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                Vehicle: <strong>{activeBikeForNotify.regNo}</strong> • {activeBikeForNotify.brand} {activeBikeForNotify.model}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Notification Channel</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="notifyType"
                    checked={notificationType === 'whatsapp'}
                    onChange={() => setNotificationType('whatsapp')}
                  />
                  <span>WhatsApp (Direct Web/App)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="notifyType"
                    checked={notificationType === 'sms'}
                    onChange={() => setNotificationType('sms')}
                  />
                  <span>SMS Gateway</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Message Preview & Customization *</label>
              <textarea
                className="form-input no-left-icon"
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                required
                style={{ fontSize: '13px', lineHeight: '1.5' }}
              />
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Character count: {customMsg.length} • Includes vehicle registration & workshop details
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setNotifyModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={notificationType === 'whatsapp' ? { background: '#25D366', borderColor: '#25D366' } : {}}
              >
                <Send size={15} /> Send Reminder
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* QUICK KM UPDATE MODAL */}
      <Modal
        isOpen={kmModalOpen}
        onClose={() => setKmModalOpen(false)}
        title="⚡ Update Bike Current Kilometres"
        maxWidth="440px"
      >
        {bikeForKm && (
          <form onSubmit={handleSaveKm}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                {bikeForKm.regNo} • {bikeForKm.brand} {bikeForKm.model}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                Owner: {bikeForKm.ownerName} ({bikeForKm.ownerPhone})
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">New Kilometre Reading (KM) *</label>
              <input
                type="number"
                min="0"
                step="1"
                className="form-input no-left-icon"
                value={newKmInput}
                onChange={(e) => setNewKmInput(e.target.value)}
                required
                autoFocus
                placeholder="e.g. 15400"
              />
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                Previous reading: {bikeForKm.currentKm?.toLocaleString()} km. Next service scheduled at {bikeForKm.nextServiceKm?.toLocaleString()} km.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setKmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Check size={15} /> Save & Recalculate
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

