import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  FileText, 
  Download, 
  Trash2, 
  CreditCard, 
  Send, 
  MessageSquare, 
  Smartphone, 
  ExternalLink, 
  Printer, 
  Bike, 
  X, 
  Filter, 
  Check, 
  Eye, 
  Sparkles,
  MapPin,
  Camera,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/common/Modal';

// Common offense presets with standard Motor Vehicles Act penalty amounts
const OFFENSE_PRESETS = [
  { label: 'Speed Limit Exceeded (Over-speeding)', defaultAmount: 1000 },
  { label: 'Riding Without Standard Certified Helmet', defaultAmount: 500 },
  { label: 'Red Light Signal Jumping Violation', defaultAmount: 1000 },
  { label: 'Triple Riding on Two-Wheeler', defaultAmount: 1000 },
  { label: 'Using Mobile Phone While Riding', defaultAmount: 1500 },
  { label: 'Defective Silencer / Excessive Noise Exhaust', defaultAmount: 1000 },
  { label: 'Riding Without Valid Third-Party Insurance', defaultAmount: 2000 },
  { label: 'Driving on Wrong Side of Road / One-Way Violation', defaultAmount: 1000 },
  { label: 'Dangerous / Rash Riding in Public Way', defaultAmount: 1500 },
  { label: 'No Valid Pollution Under Control (PUC) Certificate', defaultAmount: 500 },
  { label: 'Custom Violation', defaultAmount: 500 }
];

export default function PoliceFinesPage() {
  const { 
    customerFines, 
    addPoliceFine, 
    updatePoliceFine, 
    deletePoliceFine, 
    payFine, 
    bikesList, 
    sendCustomerWhatsApp, 
    sendCustomerSms 
  } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNPAID' | 'PAID'
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isSendNoticeModalOpen, setIsSendNoticeModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Form State for Adding New Challan
  const [newChallanForm, setNewChallanForm] = useState({
    vehicleNo: bikesList[0]?.regNo || 'TN 30 AB 1234',
    offenseType: OFFENSE_PRESETS[0].label,
    customOffense: '',
    amount: OFFENSE_PRESETS[0].defaultAmount,
    location: 'Salem Fort Junction, Salem',
    issuingAuthority: 'Salem City Traffic Police',
    dateTime: '',
    dueDate: '',
    cameraCode: 'CAM-04A-FORT',
    notes: ''
  });

  // Form State for Settling Payment
  const [settleForm, setSettleForm] = useState({
    paymentMethod: 'Online UPI (GPay / PhonePe / Paytm)',
    paymentRef: '',
    notes: ''
  });

  // Notice Dispatch State
  const [noticeForm, setNoticeForm] = useState({
    channel: 'whatsapp',
    message: ''
  });

  // Filtered List
  const filteredFines = useMemo(() => {
    return customerFines.filter((fine) => {
      // Status filter
      if (statusFilter === 'UNPAID' && fine.status !== 'Unpaid') return false;
      if (statusFilter === 'PAID' && fine.status !== 'Paid') return false;

      // Vehicle filter
      if (vehicleFilter !== 'ALL' && fine.vehicleNo !== vehicleFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchChallan = (fine.challanNo || '').toLowerCase().includes(q);
        const matchVehicle = (fine.vehicleNo || '').toLowerCase().includes(q);
        const matchOffense = (fine.offense || '').toLowerCase().includes(q);
        const matchLoc = (fine.location || '').toLowerCase().includes(q);
        const matchAuth = (fine.issuingAuthority || '').toLowerCase().includes(q);
        if (!matchChallan && !matchVehicle && !matchOffense && !matchLoc && !matchAuth) {
          return false;
        }
      }

      return true;
    });
  }, [customerFines, statusFilter, vehicleFilter, searchQuery]);

  // Metrics
  const totalChallans = customerFines.length;
  const unpaidFines = customerFines.filter(f => f.status === 'Unpaid');
  const paidFines = customerFines.filter(f => f.status === 'Paid');
  const totalUnpaidAmount = unpaidFines.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const totalPaidAmount = paidFines.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  // Open Settle Modal
  const handleOpenSettle = (fine) => {
    setSelectedFine(fine);
    setSettleForm({
      paymentMethod: 'Online UPI (GPay / PhonePe / Paytm)',
      paymentRef: `UPI-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: ''
    });
    setIsPayModalOpen(true);
  };

  // Submit Settlement
  const handleSettleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFine) return;
    payFine(selectedFine.id, `${settleForm.paymentMethod.split(' ')[0]}-${settleForm.paymentRef}`);
    setIsPayModalOpen(false);
    showToast(`Challan #${selectedFine.challanNo} successfully settled for ₹${selectedFine.amount}!`);
    setSelectedFine(null);
  };

  // Open Receipt Modal
  const handleOpenReceipt = (fine) => {
    setSelectedFine(fine);
    setIsReceiptModalOpen(true);
  };

  // Open Notice Modal
  const handleOpenNotice = (fine) => {
    setSelectedFine(fine);
    const bike = bikesList.find(b => b.regNo === fine.vehicleNo);
    const ownerName = bike?.ownerName || bike?.customer || 'Vehicle Owner';
    const msg = `Dear ${ownerName}, Traffic Police E-Challan #${fine.challanNo} of ₹${fine.amount} for offense "${fine.offense}" on vehicle ${fine.vehicleNo} at ${fine.location} is due on ${fine.dueDate}. Please settle at your earliest convenience to avoid legal impounding. - Bike Service Pro`;
    setNoticeForm({
      channel: 'whatsapp',
      message: msg
    });
    setIsSendNoticeModalOpen(true);
  };

  // Submit Notice Dispatch
  const handleSendNoticeSubmit = (e) => {
    e.preventDefault();
    if (!selectedFine) return;
    const bike = bikesList.find(b => b.regNo === selectedFine.vehicleNo);
    const phone = bike?.ownerPhone || bike?.phone || '9876543210';

    if (noticeForm.channel === 'whatsapp') {
      sendCustomerWhatsApp(phone, noticeForm.message);
      showToast(`Challan notice dispatched via WhatsApp to ${phone}!`);
    } else {
      sendCustomerSms(phone, noticeForm.message);
      showToast(`Challan notice SMS delivered to ${phone}!`);
    }
    setIsSendNoticeModalOpen(false);
    setSelectedFine(null);
  };

  // Delete Confirmation
  const handleDeleteFine = (fine) => {
    if (window.confirm(`Are you sure you want to remove Challan record #${fine.challanNo}?`)) {
      deletePoliceFine(fine.id);
      showToast(`Challan #${fine.challanNo} deleted.`);
    }
  };

  // Create New Challan
  const handleCreateChallanSubmit = (e) => {
    e.preventDefault();
    const offenseText = newChallanForm.offenseType === 'Custom Violation' 
      ? newChallanForm.customOffense 
      : newChallanForm.offenseType;

    if (!offenseText.trim()) {
      alert('Please provide offense details.');
      return;
    }

    const created = addPoliceFine({
      vehicleNo: newChallanForm.vehicleNo,
      offense: offenseText,
      amount: Number(newChallanForm.amount) || 500,
      location: newChallanForm.location,
      issuingAuthority: newChallanForm.issuingAuthority,
      dateTime: newChallanForm.dateTime,
      dueDate: newChallanForm.dueDate,
      cameraCode: newChallanForm.cameraCode,
      notes: newChallanForm.notes,
      status: 'Unpaid'
    });

    setIsAddModalOpen(false);
    showToast(`New Police Challan #${created.challanNo} registered for ${newChallanForm.vehicleNo}!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Challan No', 'Vehicle No', 'Offense', 'Location', 'Date Time', 'Amount', 'Status', 'Authority', 'Due Date', 'Paid On', 'Payment Ref'];
    const rows = customerFines.map(f => [
      `"${f.challanNo}"`,
      `"${f.vehicleNo}"`,
      `"${f.offense}"`,
      `"${f.location}"`,
      `"${f.dateTime}"`,
      f.amount,
      `"${f.status}"`,
      `"${f.issuingAuthority}"`,
      `"${f.dueDate || ''}"`,
      `"${f.paidOn || ''}"`,
      `"${f.paymentRef || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Traffic_Police_Fines_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Fines report exported as CSV!');
  };

  return (
    <div className="admin-page-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px',
          fontWeight: 600,
          border: '1px solid #334155'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(16, 24, 40, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(239, 68, 68, 0.25)',
            color: '#ffffff'
          }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#101828', margin: 0 }}>
                Traffic Police Fines & E-Challans
              </h1>
              <span style={{
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.4px'
              }}>
                STATE E-PORTAL SYNC
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#667085', margin: '4px 0 0 0' }}>
              Fleet-wide traffic violation monitoring, digital e-challan notices, and penalty settlements
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <Download size={15} />
            Export Fines CSV
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#356DF3'
            }}
          >
            <PlusCircle size={16} />
            Record New Challan
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Metric 1: Total Challans */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '18px 20px',
          boxShadow: '0 2px 6px rgba(16, 24, 40, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Logged Challans
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
              <FileText size={17} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#101828' }}>
            {totalChallans}
          </div>
          <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '4px' }}>
            Across all {bikesList.length} registered bikes
          </div>
        </div>

        {/* Metric 2: Pending Unpaid Fines */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #fecdd3',
          borderRadius: '14px',
          padding: '18px 20px',
          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Penalties Due
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <AlertTriangle size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#dc2626' }}>
              ₹{totalUnpaidAmount.toLocaleString()}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e11d48', background: '#ffe4e6', padding: '1px 8px', borderRadius: '6px' }}>
              {unpaidFines.length} Unpaid
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#991b1b', marginTop: '4px' }}>
            Awaiting owner or workshop settlement
          </div>
        </div>

        {/* Metric 3: Paid & Settled */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #bbf7d0',
          borderRadius: '14px',
          padding: '18px 20px',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Settled Fines
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#16a34a' }}>
              ₹{totalPaidAmount.toLocaleString()}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '1px 8px', borderRadius: '6px' }}>
              {paidFines.length} Settled
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '4px' }}>
            Verified with official receipt references
          </div>
        </div>

        {/* Metric 4: Compliance Status */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '18px 20px',
          boxShadow: '0 2px 6px rgba(16, 24, 40, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Fleet Clearance Rate
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#356DF3' }}>
              <Bike size={17} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#356DF3' }}>
            {totalChallans > 0 ? Math.round((paidFines.length / totalChallans) * 100) : 100}%
          </div>
          <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '4px' }}>
            {unpaidFines.length === 0 ? 'All fleet violations cleared!' : `${unpaidFines.length} violation(s) pending`}
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={`tab-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: statusFilter === 'ALL' ? '1px solid #356DF3' : '1px solid #e2e8f0',
              background: statusFilter === 'ALL' ? '#eff6ff' : '#ffffff',
              color: statusFilter === 'ALL' ? '#356DF3' : '#475569',
              cursor: 'pointer'
            }}
          >
            All Challans ({customerFines.length})
          </button>
          <button
            type="button"
            className={`tab-pill ${statusFilter === 'UNPAID' ? 'active' : ''}`}
            onClick={() => setStatusFilter('UNPAID')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: statusFilter === 'UNPAID' ? '1px solid #ef4444' : '1px solid #e2e8f0',
              background: statusFilter === 'UNPAID' ? '#fee2e2' : '#ffffff',
              color: statusFilter === 'UNPAID' ? '#dc2626' : '#475569',
              cursor: 'pointer'
            }}
          >
            Unpaid Penalties ({unpaidFines.length})
          </button>
          <button
            type="button"
            className={`tab-pill ${statusFilter === 'PAID' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PAID')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              border: statusFilter === 'PAID' ? '1px solid #10b981' : '1px solid #e2e8f0',
              background: statusFilter === 'PAID' ? '#dcfce7' : '#ffffff',
              color: statusFilter === 'PAID' ? '#16a34a' : '#475569',
              cursor: 'pointer'
            }}
          >
            Settled / Paid ({paidFines.length})
          </button>
        </div>

        {/* Right Controls: Vehicle Selector & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Vehicle Dropdown */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Fleet Vehicles</option>
            {bikesList.map(b => (
              <option key={b.id} value={b.regNo}>
                {b.regNo} - {b.model || b.brand}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search challan, reg, offense..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Fines Table Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(16, 24, 40, 0.04)'
      }}>
        {filteredFines.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
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
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#101828', margin: '0 0 6px 0' }}>
              No traffic police fines found
            </h3>
            <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>
              {searchQuery || statusFilter !== 'ALL' || vehicleFilter !== 'ALL' 
                ? 'Try modifying your search or filter selections.' 
                : 'All fleet bikes have a clean record with zero pending police violations!'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  <th style={{ padding: '14px 18px' }}>Challan Reference</th>
                  <th style={{ padding: '14px 18px' }}>Vehicle & Owner</th>
                  <th style={{ padding: '14px 18px' }}>Offense / Violation</th>
                  <th style={{ padding: '14px 18px' }}>Location & Authority</th>
                  <th style={{ padding: '14px 18px' }}>Violation Date</th>
                  <th style={{ padding: '14px 18px' }}>Amount & Due</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFines.map((fine) => {
                  const isUnpaid = fine.status === 'Unpaid';
                  const bike = bikesList.find(b => b.regNo === fine.vehicleNo);
                  const ownerName = bike?.ownerName || bike?.customer || 'Fleet Vehicle';
                  const ownerPhone = bike?.ownerPhone || bike?.phone || '';

                  return (
                    <tr 
                      key={fine.id} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: isUnpaid ? '#fffbfb' : '#ffffff',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Challan Ref */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 800, color: '#101828', fontFamily: 'monospace', fontSize: '13px' }}>
                          {fine.challanNo}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', marginTop: '4px' }}>
                          <Camera size={11} />
                          <span>{fine.cameraCode || 'RADAR-CAM'}</span>
                        </div>
                      </td>

                      {/* Vehicle & Owner */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                        <div style={{ display: 'inline-block', fontWeight: 800, color: '#0f172a', background: '#fef08a', border: '1px solid #eab308', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', letterSpacing: '0.5px' }}>
                          {fine.vehicleNo}
                        </div>
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600, marginTop: '3px' }}>
                          {bike?.model || 'Motorcycle'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {ownerName} {ownerPhone ? `• ${ownerPhone}` : ''}
                        </div>
                      </td>

                      {/* Offense */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top', maxWidth: '280px' }}>
                        <div style={{ fontWeight: 700, color: isUnpaid ? '#b91c1c' : '#1e293b', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px', color: isUnpaid ? '#ef4444' : '#64748b' }} />
                          <span>{fine.offense}</span>
                        </div>
                        {fine.notes && (
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                            Notes: {fine.notes}
                          </div>
                        )}
                      </td>

                      {/* Location & Authority */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#334155', fontWeight: 500 }}>
                          <MapPin size={13} color="#64748b" />
                          <span>{fine.location}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                          🏛️ {fine.issuingAuthority}
                        </div>
                      </td>

                      {/* Violation Date */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ color: '#334155', fontWeight: 600 }}>
                          {fine.dateTime}
                        </div>
                      </td>

                      {/* Amount & Due */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: isUnpaid ? '#dc2626' : '#16a34a' }}>
                          ₹{(Number(fine.amount) || 0).toLocaleString()}
                        </div>
                        {isUnpaid && fine.dueDate && (
                          <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 600, marginTop: '2px' }}>
                            Due: {fine.dueDate}
                          </div>
                        )}
                        {fine.paidOn && (
                          <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 500, marginTop: '2px' }}>
                            Settled: {fine.paidOn}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                        {isUnpaid ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecdd3',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}>
                            <Clock size={12} />
                            Pending Payment
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}>
                            <CheckCircle2 size={12} />
                            Settled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {isUnpaid ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenSettle(fine)}
                                className="btn-primary"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '11.5px',
                                  background: '#dc2626',
                                  borderColor: '#dc2626',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Record fine settlement / payment"
                              >
                                <CreditCard size={12} />
                                Settle Fine
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenNotice(fine)}
                                className="btn-secondary"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  color: '#2563eb',
                                  borderColor: '#bfdbfe',
                                  background: '#eff6ff'
                                }}
                                title="Dispatch WhatsApp / SMS notice to vehicle owner"
                              >
                                <Send size={12} />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenReceipt(fine)}
                              className="btn-secondary"
                              style={{
                                padding: '5px 12px',
                                fontSize: '11.5px',
                                color: '#15803d',
                                borderColor: '#bbf7d0',
                                background: '#f0fdf4',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="View official digital receipt"
                            >
                              <FileText size={12} />
                              Receipt
                            </button>
                          )}

                          {/* Full Official Notice View */}
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(fine)}
                            className="btn-secondary"
                            style={{
                              padding: '5px 8px',
                              fontSize: '11.5px'
                            }}
                            title="View official e-challan notice"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteFine(fine)}
                            className="btn-secondary"
                            style={{
                              padding: '5px 8px',
                              fontSize: '11.5px',
                              color: '#94a3b8'
                            }}
                            title="Delete challan record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: RECORD NEW POLICE CHALLAN
      ========================================================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record New Police Challan / E-Notice"
          size="md"
        >
          <form onSubmit={handleCreateChallanSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Vehicle Select */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select Vehicle *
                </label>
                <select
                  value={newChallanForm.vehicleNo}
                  onChange={(e) => setNewChallanForm({ ...newChallanForm, vehicleNo: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  required
                >
                  {bikesList.map(b => (
                    <option key={b.id} value={b.regNo}>
                      {b.regNo} — {b.model || b.brand} (Owner: {b.ownerName || b.customer || 'Customer'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Offense Preset Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Traffic Violation / Offense *
                </label>
                <select
                  value={newChallanForm.offenseType}
                  onChange={(e) => {
                    const selected = OFFENSE_PRESETS.find(p => p.label === e.target.value);
                    setNewChallanForm({
                      ...newChallanForm,
                      offenseType: e.target.value,
                      amount: selected?.defaultAmount || newChallanForm.amount
                    });
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: newChallanForm.offenseType === 'Custom Violation' ? '8px' : '0' }}
                >
                  {OFFENSE_PRESETS.map((p, idx) => (
                    <option key={idx} value={p.label}>
                      {p.label} (Standard Penalty: ₹{p.defaultAmount})
                    </option>
                  ))}
                </select>

                {newChallanForm.offenseType === 'Custom Violation' && (
                  <input
                    type="text"
                    placeholder="Enter custom traffic rule violation..."
                    value={newChallanForm.customOffense}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, customOffense: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                )}
              </div>

              {/* Amount & Due Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Penalty Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={newChallanForm.amount}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={newChallanForm.dueDate}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Location & Authority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Violation Location
                  </label>
                  <input
                    type="text"
                    value={newChallanForm.location}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, location: e.target.value })}
                    placeholder="e.g. Salem Fort Junction"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={newChallanForm.issuingAuthority}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, issuingAuthority: e.target.value })}
                    placeholder="e.g. Salem City Traffic Police"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {/* Camera Code & Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Radar / Camera Ref
                  </label>
                  <input
                    type="text"
                    value={newChallanForm.cameraCode}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, cameraCode: e.target.value })}
                    placeholder="e.g. CAM-04A-FORT"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Internal Workshop Notes
                  </label>
                  <input
                    type="text"
                    value={newChallanForm.notes}
                    onChange={(e) => setNewChallanForm({ ...newChallanForm, notes: e.target.value })}
                    placeholder="Optional notes"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ background: '#356DF3' }}
              >
                Save & Record Challan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================
          MODAL 2: SETTLE / PAY FINE
      ========================================================= */}
      {isPayModalOpen && selectedFine && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Settle Traffic Fine: Challan #${selectedFine.challanNo}`}
          size="md"
        >
          <form onSubmit={handleSettleSubmit}>
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#9f1239', textTransform: 'uppercase' }}>
                    Vehicle: {selectedFine.vehicleNo}
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#881337', marginTop: '2px' }}>
                    {selectedFine.offense}
                  </div>
                  <div style={{ fontSize: '12px', color: '#be123c', marginTop: '4px' }}>
                    📍 {selectedFine.location} • 🏛️ {selectedFine.issuingAuthority}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#9f1239', display: 'block' }}>Fine Amount</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#9f1239' }}>
                    ₹{selectedFine.amount}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Settlement / Payment Method *
                </label>
                <select
                  value={settleForm.paymentMethod}
                  onChange={(e) => setSettleForm({ ...settleForm, paymentMethod: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  required
                >
                  <option value="Online UPI (GPay / PhonePe / Paytm)">Online UPI (GPay / PhonePe / QR)</option>
                  <option value="Cash at Workshop Counter">Cash Collected at Workshop Counter</option>
                  <option value="Debit / Credit Card (POS Swipe)">Debit / Credit Card (POS Swipe)</option>
                  <option value="Direct State E-Challan Web Portal">Direct State E-Challan Portal Settle</option>
                  <option value="Bank NetBanking Transfer">Bank NetBanking Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Transaction Reference / Receipt ID *
                </label>
                <input
                  type="text"
                  value={settleForm.paymentRef}
                  onChange={(e) => setSettleForm({ ...settleForm, paymentRef: e.target.value })}
                  placeholder="e.g. UPI-REF-492102"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Settlement Remarks
                </label>
                <input
                  type="text"
                  value={settleForm.notes}
                  onChange={(e) => setSettleForm({ ...settleForm, notes: e.target.value })}
                  placeholder="e.g. Cleared by customer during general service"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsPayModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ background: '#16a34a', borderColor: '#16a34a' }}
              >
                Confirm Payment & Clear Fine
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================================================
          MODAL 3: OFFICIAL DIGITAL E-CHALLAN & RECEIPT
      ========================================================= */}
      {isReceiptModalOpen && selectedFine && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title={`E-Challan Official Notice #${selectedFine.challanNo}`}
          size="md"
        >
          <div style={{
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '12px',
            padding: '24px',
            fontFamily: 'Inter, sans-serif',
            color: '#0f172a'
          }}>
            {/* Gov Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #94a3b8', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: '#475569', textTransform: 'uppercase' }}>
                GOVERNMENT OF TAMIL NADU • MOTOR VEHICLES DEPARTMENT
              </div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                {selectedFine.issuingAuthority.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Official E-Challan Notice Under Motor Vehicles Act 1988
              </div>
            </div>

            {/* Status Stamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Challan Reference:</span>
                <div style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace' }}>
                  {selectedFine.challanNo}
                </div>
              </div>
              <div>
                {selectedFine.status === 'Paid' ? (
                  <span style={{
                    display: 'inline-block',
                    border: '2px solid #16a34a',
                    color: '#16a34a',
                    fontWeight: 900,
                    fontSize: '13px',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    ✓ PAID & CLEARED
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-block',
                    border: '2px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 900,
                    fontSize: '13px',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    ⚠ UNPAID VIOLATION
                  </span>
                )}
              </div>
            </div>

            {/* Violation Details Grid */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12.5px',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Vehicle Registration</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedFine.vehicleNo}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Detection Camera Code</span>
                <strong>{selectedFine.cameraCode || 'CAM-AUTO'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Offense / Infraction</span>
                <strong style={{ color: '#b91c1c' }}>{selectedFine.offense}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Location of Offense</span>
                <span>{selectedFine.location}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Timestamp</span>
                <span>{selectedFine.dateTime}</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Statutory Fine Amount</span>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                  ₹{(Number(selectedFine.amount) || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {selectedFine.status === 'Paid' ? (
                  <div>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>Settled on: {selectedFine.paidOn}</span>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Tx Ref: {selectedFine.paymentRef}</div>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>Payment Due Date:</span>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>{selectedFine.dueDate || 'Immediate'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.print()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              Print Official Notice
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsReceiptModalOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* =========================================================
          MODAL 4: DISPATCH OWNER NOTICE (WHATSAPP / SMS)
      ========================================================= */}
      {isSendNoticeModalOpen && selectedFine && (
        <Modal
          isOpen={isSendNoticeModalOpen}
          onClose={() => setIsSendNoticeModalOpen(false)}
          title={`Dispatch Fine Alert • ${selectedFine.vehicleNo}`}
          size="md"
        >
          <form onSubmit={handleSendNoticeSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Delivery Channel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setNoticeForm({ ...noticeForm, channel: 'whatsapp' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: noticeForm.channel === 'whatsapp' ? '2px solid #25D366' : '1px solid #cbd5e1',
                      background: noticeForm.channel === 'whatsapp' ? '#f0fdf4' : '#ffffff',
                      color: noticeForm.channel === 'whatsapp' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageSquare size={16} color="#25D366" />
                    WhatsApp Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoticeForm({ ...noticeForm, channel: 'sms' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: noticeForm.channel === 'sms' ? '2px solid #356DF3' : '1px solid #cbd5e1',
                      background: noticeForm.channel === 'sms' ? '#eff6ff' : '#ffffff',
                      color: noticeForm.channel === 'sms' ? '#1d4ed8' : '#475569',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Smartphone size={16} color="#356DF3" />
                    SMS Notification
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Notice Text
                </label>
                <textarea
                  rows={4}
                  value={noticeForm.message}
                  onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsSendNoticeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  background: noticeForm.channel === 'whatsapp' ? '#16a34a' : '#356DF3',
                  borderColor: noticeForm.channel === 'whatsapp' ? '#16a34a' : '#356DF3',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} />
                Send Alert Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
