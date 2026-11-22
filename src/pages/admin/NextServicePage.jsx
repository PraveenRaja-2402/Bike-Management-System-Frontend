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
  Settings,
  LayoutGrid,
  List,
  ChevronRight,
  TrendingUp,
  MapPin
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

  // Active Filter Tabs: 'all' | 'overdue' | 'upcoming' | 'insurance' | 'good'
  const [activeTab, setActiveTab] = useState('all');
  const [brandFilter, setBrandFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // View Mode: 'cards' (spacious visual grid) vs 'table' (roomy enterprise table)
  const [viewMode, setViewMode] = useState('cards');

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

      // Percentage of service interval completed
      const lastKm = parseInt(bike.lastServiceKm, 10) || 0;
      const intervalSpan = Math.max(nextKm - lastKm, 1000);
      const drivenInInterval = Math.max(curKm - lastKm, 0);
      const progressPercent = Math.min(Math.round((drivenInInterval / intervalSpan) * 100), 100);

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
        progressPercent,
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

    const message = `Hello ${bike.ownerName || 'Customer'}, this is a priority reminder from ${branding.companyName || 'Bike Service Pro'}. Your ${bike.brand} ${bike.model} (${bike.regNo}) is ${reason}. Please schedule your maintenance slot today or reply to confirm convenient drop-off time. Thank you!`;

    setCustomMsg(message);
    setNotifyModalOpen(true);
  };

  // Dispatch notification
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!activeBikeForNotify) return;

    if (notificationType === 'whatsapp') {
      sendCustomerWhatsApp(activeBikeForNotify.ownerPhone, customMsg);
      setAlertSuccess(`WhatsApp reminder generated for ${activeBikeForNotify.ownerName} (${activeBikeForNotify.regNo}). Chat opened!`);
    } else {
      sendCustomerSms(activeBikeForNotify.ownerPhone, customMsg);
      setAlertSuccess(`SMS notification queued and dispatched to ${activeBikeForNotify.ownerPhone}!`);
    }

    setNotifyModalOpen(false);
    setTimeout(() => setAlertSuccess(''), 5000);
  };

  // Direct 1-click WhatsApp
  const handleDirectWhatsApp = (bike) => {
    const text = `Hello ${bike.ownerName || 'Customer'}, friendly maintenance reminder from ${branding.companyName || 'Bike Service Pro'}. Your bike ${bike.regNo} (${bike.model}) is due for scheduled service at ${bike.nextServiceKm?.toLocaleString()} km (Current: ${bike.currentKm?.toLocaleString()} km). Please contact us to book your service slot.`;
    sendCustomerWhatsApp(bike.ownerPhone, text);
    setAlertSuccess(`Direct WhatsApp opened for ${bike.ownerName} (${bike.regNo})`);
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
    setAlertSuccess(`Updated odometer for ${bikeForKm.regNo} to ${kmNum.toLocaleString()} km`);
    setTimeout(() => setAlertSuccess(''), 5000);
  };

  return (
    <div className="next-service-page" style={{ paddingBottom: '40px' }}>
      {/* Toast Feedback */}
      {alertSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13.5px',
          fontWeight: 600,
          border: '1px solid #334155'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Header Banner - Spacious Enterprise SaaS */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 2px 10px rgba(16, 24, 40, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecdd3 100%)',
            color: '#dc2626',
            border: '1px solid #fecdd3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
            flexShrink: 0
          }}>
            <Bell size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '21px', fontWeight: 800, color: '#101828', margin: 0 }}>
                Alerts & Maintenance Reminders
              </h1>
              {overdueCount > 0 && (
                <span style={{ 
                  fontSize: '11.5px', 
                  background: '#fee2e2', 
                  color: '#dc2626', 
                  border: '1px solid #fecdd3',
                  padding: '3px 10px', 
                  borderRadius: '9999px', 
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertTriangle size={12} />
                  {overdueCount} CRITICAL OVERDUE
                </span>
              )}
            </div>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: '6px 0 0 0', lineHeight: 1.5 }}>
              Continuous odometer and calendar monitoring • Insurance expiry alerts • 1-Click WhatsApp & SMS dispatch
            </p>
          </div>
        </div>

        {/* Action Buttons with clear contrast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link 
            to="/admin/settings" 
            className="btn-secondary"
            style={{ 
              background: '#ffffff', 
              color: '#344054', 
              borderColor: '#d0d5dd',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Settings size={15} /> 
            Configure Intervals
          </Link>
          <Link 
            to="/admin/services" 
            className="btn-primary"
            style={{ 
              background: '#356DF3', 
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Wrench size={15} /> 
            Log New Service
          </Link>
        </div>
      </div>

      {/* 5 Spacious KPI Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Total Bikes */}
        <div 
          onClick={() => setActiveTab('all')}
          style={{
            background: activeTab === 'all' ? '#eff6ff' : '#ffffff',
            border: activeTab === 'all' ? '2px solid #356DF3' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: activeTab === 'all' ? '0 6px 16px rgba(53, 109, 243, 0.12)' : '0 2px 6px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Monitored
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#356DF3' }}>
              <Gauge size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#101828', margin: '10px 0 4px 0', lineHeight: 1.2 }}>
            {totalBikesCount}
          </div>
          <div style={{ fontSize: '12px', color: '#356DF3', fontWeight: 600 }}>
            All active fleet bikes
          </div>
        </div>

        {/* Card 2: Overdue Services */}
        <div 
          onClick={() => setActiveTab('overdue')}
          style={{
            background: activeTab === 'overdue' ? '#fff1f2' : '#ffffff',
            border: activeTab === 'overdue' ? '2px solid #ef4444' : '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '20px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: activeTab === 'overdue' ? '0 6px 16px rgba(239, 68, 68, 0.15)' : '0 2px 6px rgba(239, 68, 68, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Critical Overdue
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#dc2626', margin: '10px 0 4px 0', lineHeight: 1.2 }}>
            {overdueCount}
          </div>
          <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
            Exceeded KM or target date
          </div>
        </div>

        {/* Card 3: Upcoming Reminders */}
        <div 
          onClick={() => setActiveTab('upcoming')}
          style={{
            background: activeTab === 'upcoming' ? '#fffbeb' : '#ffffff',
            border: activeTab === 'upcoming' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: activeTab === 'upcoming' ? '0 6px 16px rgba(245, 158, 11, 0.15)' : '0 2px 6px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Due Soon
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', margin: '10px 0 4px 0', lineHeight: 1.2 }}>
            {upcomingCount}
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 600 }}>
            Within 500 km or 15 days
          </div>
        </div>

        {/* Card 4: Insurance Expiry Alerts */}
        <div 
          onClick={() => setActiveTab('insurance')}
          style={{
            background: activeTab === 'insurance' ? '#faf5ff' : '#ffffff',
            border: activeTab === 'insurance' ? '2px solid #9333ea' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: activeTab === 'insurance' ? '0 6px 16px rgba(147, 51, 234, 0.15)' : '0 2px 6px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Insurance Alerts
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#7e22ce', margin: '10px 0 4px 0', lineHeight: 1.2 }}>
            {insuranceAlertCount}
          </div>
          <div style={{ fontSize: '12px', color: '#6b21a8', fontWeight: 600 }}>
            Expiring or lapsed policies
          </div>
        </div>

        {/* Card 5: Good Condition */}
        <div 
          onClick={() => setActiveTab('good')}
          style={{
            background: activeTab === 'good' ? '#f0fdf4' : '#ffffff',
            border: activeTab === 'good' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 22px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: activeTab === 'good' ? '0 6px 16px rgba(22, 163, 74, 0.15)' : '0 2px 6px rgba(16, 24, 40, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Healthy Fleet
            </span>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', margin: '10px 0 4px 0', lineHeight: 1.2 }}>
            {goodCount}
          </div>
          <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
            Adequate KM & time margins
          </div>
        </div>
      </div>

      {/* Spacious Filter & Control Toolbar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px 22px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 6px rgba(16, 24, 40, 0.03)'
      }}>
        {/* Status Filter Tabs with generous touch targets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className={`tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'all' ? '1px solid #356DF3' : '1px solid #e2e8f0',
              background: activeTab === 'all' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'all' ? '#356DF3' : '#475569'
            }}
          >
            All Bikes ({totalBikesCount})
          </button>

          <button
            type="button"
            className={`tab-pill ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'overdue' ? '1px solid #ef4444' : '1px solid #e2e8f0',
              background: activeTab === 'overdue' ? '#fee2e2' : '#ffffff',
              color: activeTab === 'overdue' ? '#dc2626' : '#475569'
            }}
          >
            ⚠️ Overdue ({overdueCount})
          </button>

          <button
            type="button"
            className={`tab-pill ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'upcoming' ? '1px solid #f59e0b' : '1px solid #e2e8f0',
              background: activeTab === 'upcoming' ? '#fef3c7' : '#ffffff',
              color: activeTab === 'upcoming' ? '#d97706' : '#475569'
            }}
          >
            🔔 Upcoming ({upcomingCount})
          </button>

          <button
            type="button"
            className={`tab-pill ${activeTab === 'insurance' ? 'active' : ''}`}
            onClick={() => setActiveTab('insurance')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'insurance' ? '1px solid #9333ea' : '1px solid #e2e8f0',
              background: activeTab === 'insurance' ? '#f3e8ff' : '#ffffff',
              color: activeTab === 'insurance' ? '#7e22ce' : '#475569'
            }}
          >
            🛡️ Insurance ({insuranceAlertCount})
          </button>

          <button
            type="button"
            className={`tab-pill ${activeTab === 'good' ? 'active' : ''}`}
            onClick={() => setActiveTab('good')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'good' ? '1px solid #16a34a' : '1px solid #e2e8f0',
              background: activeTab === 'good' ? '#dcfce7' : '#ffffff',
              color: activeTab === 'good' ? '#15803d' : '#475569'
            }}
          >
            ✅ Healthy ({goodCount})
          </button>
        </div>

        {/* Right Controls: Brand Selector, Search Bar, and View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Brand Dropdown */}
          <select 
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Manufacturers</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Honda">Honda</option>
            <option value="Royal Enfield">Royal Enfield</option>
            <option value="TVS">TVS</option>
            <option value="Bajaj">Bajaj</option>
            <option value="KTM">KTM</option>
            <option value="Hero">Hero</option>
            <option value="Suzuki">Suzuki</option>
          </select>

          {/* Search Box with generous width */}
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search reg, owner, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* View Toggle: Cards vs Table */}
          <div style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Spacious Cards Grid View"
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                border: 'none',
                background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                color: viewMode === 'cards' ? '#101828' : '#64748b',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <LayoutGrid size={15} />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Data Table View"
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#101828' : '#64748b',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <List size={15} />
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredBikes.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(16, 24, 40, 0.04)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#94a3b8'
          }}>
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0' }}>
            No vehicles match this filter criteria
          </h3>
          <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
            {searchQuery || activeTab !== 'all' || brandFilter !== 'All'
              ? 'Try adjusting your search terms or clearing filter tags.'
              : 'All registered motorcycles are currently within acceptable maintenance thresholds.'}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* =========================================================
           VIEW MODE 1: SPACIOUS VEHICLE REMINDER CARDS (GRID VIEW)
           High visual breathing room, progress bars, owner actions
        ========================================================= */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {filteredBikes.map((bike) => {
            return (
              <div
                key={bike.id}
                style={{
                  background: '#ffffff',
                  border: bike.isOverdue 
                    ? '1.5px solid #fca5a5' 
                    : bike.isUpcoming 
                    ? '1.5px solid #fde68a' 
                    : '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '22px',
                  boxShadow: bike.isOverdue
                    ? '0 4px 16px rgba(239, 68, 68, 0.08)'
                    : '0 2px 8px rgba(16, 24, 40, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Top Header: Plate Tag, Brand/Model & Status Badge */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <div>
                      <div style={{
                        display: 'inline-block',
                        fontWeight: 900,
                        color: '#0f172a',
                        background: '#fef08a',
                        border: '1.5px solid #eab308',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        letterSpacing: '0.6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                      }}>
                        {bike.regNo}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#101828', marginTop: '6px' }}>
                        {bike.brand} {bike.model}
                      </div>
                    </div>

                    {/* Status Chip */}
                    <div>
                      {bike.isOverdue ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecdd3',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.4px'
                        }}>
                          <AlertTriangle size={12} />
                          OVERDUE
                        </span>
                      ) : bike.isUpcoming ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.4px'
                        }}>
                          <Clock size={12} />
                          DUE SOON
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#dcfce7',
                          color: '#15803d',
                          border: '1px solid #bbf7d0',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.4px'
                        }}>
                          <Check size={12} />
                          HEALTHY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer Information Row */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                          {bike.ownerName || 'Customer'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {bike.ownerPhone || 'No contact on file'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenKmModal(bike)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Update Odometer"
                    >
                      <Edit2 size={11} />
                      KM
                    </button>
                  </div>

                  {/* Maintenance Benchmark & Progress Bar */}
                  <div style={{
                    background: bike.isOverdue ? '#fff5f5' : bike.isUpcoming ? '#fffdf0' : '#ffffff',
                    border: bike.isOverdue ? '1px solid #fecdd3' : bike.isUpcoming ? '1px solid #fef08a' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Current Odometer</span>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                          {bike.currentKm?.toLocaleString()} km
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Service Target</span>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: bike.isOverdue ? '#dc2626' : '#2563eb' }}>
                          {bike.nextServiceKm?.toLocaleString()} km
                        </div>
                      </div>
                    </div>

                    {/* Linear Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      margin: '8px 0'
                    }}>
                      <div style={{
                        width: `${bike.isOverdue ? 100 : bike.progressPercent}%`,
                        height: '100%',
                        background: bike.isOverdue 
                          ? 'linear-gradient(90deg, #f87171, #dc2626)' 
                          : bike.isUpcoming 
                          ? 'linear-gradient(90deg, #fbbf24, #d97706)' 
                          : 'linear-gradient(90deg, #34d399, #10b981)',
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    {/* Exceeded / Remaining Explanatory Text */}
                    <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>
                      {bike.isOverdue ? (
                        <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={13} />
                          Exceeded by {Math.abs(bike.kmRemaining).toLocaleString()} km • {Math.abs(bike.daysRemaining)} days overdue
                        </span>
                      ) : bike.isUpcoming ? (
                        <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} />
                          {bike.kmRemaining.toLocaleString()} km left • Due in {bike.daysRemaining} days ({bike.nextServiceDate})
                        </span>
                      ) : (
                        <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          {bike.kmRemaining.toLocaleString()} km remaining • Next due {bike.nextServiceDate || 'on schedule'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Insurance Notice Banner */}
                  {bike.insuranceExpiryDate && (
                    <div style={{
                      background: bike.isInsuranceExpired ? '#fee2e2' : bike.isInsuranceExpiringSoon ? '#f3e8ff' : '#f8fafc',
                      border: bike.isInsuranceExpired ? '1px solid #fecdd3' : bike.isInsuranceExpiringSoon ? '1px solid #e9d5ff' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldAlert size={14} color={bike.isInsuranceExpired ? '#dc2626' : bike.isInsuranceExpiringSoon ? '#7e22ce' : '#64748b'} />
                        <span style={{ fontWeight: 600, color: bike.isInsuranceExpired ? '#991b1b' : bike.isInsuranceExpiringSoon ? '#581c87' : '#475569' }}>
                          Insurance: {bike.isInsuranceExpired ? 'EXPIRED' : bike.isInsuranceExpiringSoon ? `${bike.insuranceDaysRemaining}d Left` : 'Active'}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {bike.insuranceExpiryDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer with ample breathing room */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    type="button"
                    onClick={() => handleDirectWhatsApp(bike)}
                    style={{
                      flex: 1,
                      background: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '9px',
                      padding: '9px 12px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)'
                    }}
                  >
                    <MessageSquare size={15} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenNotify(bike, 'sms')}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '9px',
                      border: '1px solid #bfdbfe',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Send SMS"
                  >
                    <Smartphone size={15} />
                    SMS
                  </button>

                  <Link
                    to="/admin/services"
                    style={{
                      padding: '9px 12px',
                      borderRadius: '9px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Log Service Record"
                  >
                    <Wrench size={14} />
                    Service
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================
           VIEW MODE 2: SPACIOUS ENTERPRISE DATA TABLE
           With ample cell padding, clear column separation & no crowding
        ========================================================= */
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(16, 24, 40, 0.04)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  <th style={{ padding: '16px 20px', minWidth: '220px' }}>Vehicle & Customer</th>
                  <th style={{ padding: '16px 20px', minWidth: '150px' }}>Current Odometer</th>
                  <th style={{ padding: '16px 20px', minWidth: '180px' }}>Service Benchmark</th>
                  <th style={{ padding: '16px 20px', minWidth: '180px' }}>Due Status (KM / Time)</th>
                  <th style={{ padding: '16px 20px', minWidth: '150px' }}>Insurance</th>
                  <th style={{ padding: '16px 20px', minWidth: '130px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right', minWidth: '190px' }}>Reminder Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBikes.map((bike) => {
                  return (
                    <tr 
                      key={bike.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: bike.isOverdue ? '#fffdfd' : bike.isUpcoming ? '#fffefc' : '#ffffff',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Vehicle & Customer */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        <div style={{ display: 'inline-block', fontWeight: 800, color: '#0f172a', background: '#fef08a', border: '1px solid #eab308', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', letterSpacing: '0.5px' }}>
                          {bike.regNo}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#101828', marginTop: '4px' }}>
                          {bike.brand} {bike.model}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                          <User size={13} color="#94a3b8" />
                          <strong style={{ color: '#334155' }}>{bike.ownerName}</strong> • {bike.ownerPhone}
                        </div>
                      </td>

                      {/* Current Odometer */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                            {bike.currentKm?.toLocaleString()} km
                          </span>
                          <button
                            type="button"
                            title="Update Odometer KM"
                            onClick={() => handleOpenKmModal(bike)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '5px',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              color: '#475569',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                          Last: {bike.lastServiceKm?.toLocaleString()} km
                        </div>
                      </td>

                      {/* Service Benchmark */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: bike.isOverdue ? '#dc2626' : '#2563eb' }}>
                          Target: {bike.nextServiceKm?.toLocaleString()} km
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                          <Calendar size={13} color="#94a3b8" />
                          <span>{bike.nextServiceDate || 'Not specified'}</span>
                        </div>
                      </td>

                      {/* Due Status */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        {bike.isOverdue ? (
                          <div>
                            <div style={{ color: '#dc2626', fontWeight: 800, fontSize: '13px' }}>
                              ⚠️ Over by {Math.abs(bike.kmRemaining).toLocaleString()} km
                            </div>
                            <div style={{ color: '#b91c1c', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                              🕒 {Math.abs(bike.daysRemaining)} days overdue
                            </div>
                          </div>
                        ) : bike.isUpcoming ? (
                          <div>
                            <div style={{ color: '#d97706', fontWeight: 800, fontSize: '13px' }}>
                              🔔 {bike.kmRemaining.toLocaleString()} km left
                            </div>
                            <div style={{ color: '#b45309', fontSize: '12px', marginTop: '2px' }}>
                              🕒 Due in {bike.daysRemaining} days
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ color: '#15803d', fontWeight: 700, fontSize: '13px' }}>
                              ✅ {bike.kmRemaining.toLocaleString()} km left
                            </div>
                            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                              🕒 Due in {bike.daysRemaining} days
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Insurance */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        {bike.insuranceExpiryDate ? (
                          bike.isInsuranceExpired ? (
                            <div>
                              <span style={{ 
                                display: 'inline-block',
                                background: '#fee2e2', 
                                color: '#dc2626', 
                                fontSize: '11px', 
                                padding: '2px 8px', 
                                borderRadius: '5px', 
                                fontWeight: 800 
                              }}>
                                🛑 EXPIRED
                              </span>
                              <div style={{ fontSize: '11.5px', color: '#dc2626', marginTop: '3px' }}>
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
                                padding: '2px 8px', 
                                borderRadius: '5px', 
                                fontWeight: 800 
                              }}>
                                ⚠️ {bike.insuranceDaysRemaining}d Left
                              </span>
                              <div style={{ fontSize: '11.5px', color: '#6b21a8', marginTop: '3px' }}>
                                {bike.insuranceExpiryDate}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span style={{ 
                                display: 'inline-block',
                                background: '#f0fdf4', 
                                color: '#16a34a', 
                                fontSize: '11px', 
                                padding: '2px 8px', 
                                borderRadius: '5px', 
                                fontWeight: 700 
                              }}>
                                Valid
                              </span>
                              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                                {bike.insuranceExpiryDate}
                              </div>
                            </div>
                          )
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Not Recorded</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top' }}>
                        {bike.isOverdue ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontWeight: 800,
                            fontSize: '11.5px',
                            padding: '3px 9px',
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
                            fontWeight: 800,
                            fontSize: '11.5px',
                            padding: '3px 9px',
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
                            fontWeight: 800,
                            fontSize: '11.5px',
                            padding: '3px 9px',
                            borderRadius: '9999px'
                          }}>
                            <Check size={11} /> HEALTHY
                          </span>
                        )}
                      </td>

                      {/* Reminder Actions */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            title="Direct WhatsApp Reminder"
                            onClick={() => handleDirectWhatsApp(bike)}
                            style={{
                              background: '#25D366',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '7px',
                              padding: '7px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              boxShadow: '0 2px 5px rgba(37, 211, 102, 0.25)'
                            }}
                          >
                            <MessageSquare size={14} /> WhatsApp
                          </button>

                          <button
                            type="button"
                            title="Custom SMS or WhatsApp Notice"
                            onClick={() => handleOpenNotify(bike, 'sms')}
                            className="btn-secondary"
                            style={{ padding: '7px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Smartphone size={14} /> SMS
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: CUSTOMER NOTIFICATION DISPATCH (WHATSAPP / SMS)
      ========================================================= */}
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
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Recipient Customer:</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', marginTop: '3px' }}>
                {activeBikeForNotify.ownerName} ({activeBikeForNotify.ownerPhone})
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Vehicle: <strong>{activeBikeForNotify.regNo}</strong> • {activeBikeForNotify.brand} {activeBikeForNotify.model}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Select Notification Channel
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setNotificationType('whatsapp')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: notificationType === 'whatsapp' ? '2px solid #25D366' : '1px solid #cbd5e1',
                    background: notificationType === 'whatsapp' ? '#f0fdf4' : '#ffffff',
                    color: notificationType === 'whatsapp' ? '#15803d' : '#475569',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageSquare size={17} color="#25D366" />
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('sms')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: notificationType === 'sms' ? '2px solid #356DF3' : '1px solid #cbd5e1',
                    background: notificationType === 'sms' ? '#eff6ff' : '#ffffff',
                    color: notificationType === 'sms' ? '#1d4ed8' : '#475569',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Smartphone size={17} color="#356DF3" />
                  SMS Gateway
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Message Preview & Customization *
              </label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                Character count: {customMsg.length} • Tailored with vehicle registration and current service status
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
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
                style={{
                  background: notificationType === 'whatsapp' ? '#25D366' : '#356DF3',
                  borderColor: notificationType === 'whatsapp' ? '#25D366' : '#356DF3',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} /> 
                Send Reminder Now
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* =========================================================
          MODAL 2: QUICK KM UPDATE MODAL
      ========================================================= */}
      <Modal
        isOpen={kmModalOpen}
        onClose={() => setKmModalOpen(false)}
        title="⚡ Update Vehicle Odometer KM"
        maxWidth="440px"
      >
        {bikeForKm && (
          <form onSubmit={handleSaveKm}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '18px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                {bikeForKm.regNo} • {bikeForKm.brand} {bikeForKm.model}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
                Registered Owner: {bikeForKm.ownerName} ({bikeForKm.ownerPhone})
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                New Kilometre Reading (KM) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={newKmInput}
                onChange={(e) => setNewKmInput(e.target.value)}
                required
                autoFocus
                placeholder="e.g. 15400"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '15px',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                Previous reading: <strong>{bikeForKm.currentKm?.toLocaleString()} km</strong>. Next benchmark scheduled at <strong>{bikeForKm.nextServiceKm?.toLocaleString()} km</strong>.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
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
                style={{ background: '#356DF3' }}
              >
                <Check size={15} /> 
                Save & Recalculate
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
