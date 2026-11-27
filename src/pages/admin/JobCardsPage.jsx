import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  Calendar,
  Gauge,
  User,
  Printer,
  ArrowRight,
  Bell
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import MetricCard from '../../components/common/MetricCard';
import { useApp } from '../../context/AppContext';

const WORKFLOW_STAGES = [
  'Service Booking',
  'Job In Progress',
  'Job Completed',
  'Next Service Reminder'
];

// Map legacy mockJobCards statuses cleanly into the 4-stage workflow
const mapLegacyStage = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'open' || s === 'service booking') return 'Service Booking';
  if (s === 'in service' || s === 'ready' || s === 'job in progress') return 'Job In Progress';
  if (s === 'completed' || s === 'job completed') return 'Job Completed';
  if (s === 'next service reminder') return 'Next Service Reminder';
  return 'Service Booking';
};

export default function JobCardsPage() {
  const {
    bikesList,
    membership,
    earnPoints,
    sendCustomerWhatsApp,
    jobCardsList,
    addJobCard,
    updateJobCardStage
  } = useApp();

  const jobs = useMemo(() =>
    (jobCardsList || []).map((j, idx) => {
      const matchedBike = bikesList.find(b => b.regNo === j.regNo) || bikesList[idx % Math.max(1, bikesList.length)];
      const odo = Number(j.odometerReading) || matchedBike?.currentKm || 12400;
      const partsCost = Number(j.partsCost ?? 650);
      const labourCost = Number(j.labourCost ?? j.labourCharges ?? 350);
      const totalAmount = Number(j.totalAmount ?? j.totalCost ?? (partsCost + labourCost));
      const stage = j.stage || mapLegacyStage(j.status);
      return {
        ...j,
        stage,
        status: j.status || stage,
        customerPhone: j.customerPhone || matchedBike?.ownerPhone || matchedBike?.phone || '9876543210',
        workPerformed: j.workPerformed || j.notes || 'Engine oil replacement, oil filter clean, chain tension & brake inspection',
        partsReplaced: j.partsReplaced || 'Synthetic Engine Oil (1L), Oil Filter, Brake Pad Kit',
        partsCost,
        labourCost,
        totalAmount,
        completionDate: j.completionDate || (stage === 'Job Completed' ? j.date : 'Pending'),
        odometerReading: odo,
        nextServiceDate: j.nextServiceDate || matchedBike?.nextServiceDate || '2026-10-15',
        nextServiceKm: Number(j.nextServiceKm) || matchedBike?.nextServiceKm || odo + 3000
      };
    }),
  [jobCardsList, bikesList]);

  const [filterStage, setFilterStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applySameBranchDiscount, setApplySameBranchDiscount] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [newJobForm, setNewJobForm] = useState({
    regNo: bikesList[0]?.regNo || 'TN 30 AB 1234',
    customer: bikesList[0]?.ownerName || 'Bharath',
    customerPhone: bikesList[0]?.ownerPhone || '9876543210',
    brandModel: bikesList[0] ? `${bikesList[0].brand} ${bikesList[0].model}` : 'Yamaha FZ-S',
    serviceType: 'General Periodic Service',
    workPerformed: 'Engine oil & filter change, chain lube, brake adjustment',
    partsReplaced: 'Motul 10W40 Oil, OEM Oil Filter',
    partsCost: 750,
    labourCost: 350,
    odometerReading: bikesList[0]?.currentKm || 12450,
    nextServiceDate: '2026-12-20',
    nextServiceKm: (bikesList[0]?.currentKm || 12450) + 3000,
    technician: 'Mani'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Upcoming & Overdue Reminders summary from Fleet + Completed Jobs
  const { overdueReminders, upcomingReminders } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = [];
    const upcoming = [];

    bikesList.forEach(b => {
      const curKm = parseInt(b.currentKm, 10) || 0;
      const nextKm = parseInt(b.nextServiceKm, 10) || (curKm + 3000);
      const kmLeft = nextKm - curKm;
      let daysLeft = 999;
      if (b.nextServiceDate) {
        const d = new Date(b.nextServiceDate);
        d.setHours(0, 0, 0, 0);
        daysLeft = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
      }
      if (kmLeft <= 0 || daysLeft < 0) {
        overdue.push({ ...b, kmLeft, daysLeft });
      } else if (kmLeft <= 500 || daysLeft <= 15) {
        upcoming.push({ ...b, kmLeft, daysLeft });
      }
    });
    return { overdueReminders: overdue, upcomingReminders: upcoming };
  }, [bikesList]);

  const filteredJobs = jobs.filter(job => {
    const matchStage = filterStage === 'All' || job.stage === filterStage;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      job.jobNo.toLowerCase().includes(q) ||
      job.regNo.toLowerCase().includes(q) ||
      job.customer.toLowerCase().includes(q) ||
      job.brandModel.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  const handleStageChange = (jobId, nextStage) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const todayIso = new Date().toISOString().split('T')[0];
    if (nextStage === 'Job Completed' && targetJob.stage !== 'Job Completed' && targetJob.customer === 'Bharath') {
      earnPoints(150, `Service Completed (${targetJob.jobNo}) at Salem Central Mega Hub`);
    }

    const updated = updateJobCardStage(jobId, nextStage, {
      stage: nextStage,
      status: nextStage,
      completionDate: nextStage === 'Job Completed' || nextStage === 'Next Service Reminder'
        ? (targetJob.completionDate && targetJob.completionDate !== 'Pending' ? targetJob.completionDate : todayIso)
        : targetJob.completionDate,
      partsCost: targetJob.partsCost,
      labourCost: targetJob.labourCost,
      labourCharges: targetJob.labourCost,
      totalAmount: targetJob.totalAmount,
      totalCost: targetJob.totalAmount,
      partsReplaced: targetJob.partsReplaced,
      workPerformed: targetJob.workPerformed,
      odometerReading: targetJob.odometerReading,
      nextServiceDate: targetJob.nextServiceDate,
      nextServiceKm: targetJob.nextServiceKm
    });

    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({
        ...prev,
        ...(updated || {}),
        stage: nextStage,
        status: nextStage
      }));
    }
    showToast(
      nextStage === 'Job Completed'
        ? `Job moved to "${nextStage}" & synced with Service History & Bike Next Service.`
        : `Job moved to "${nextStage}" stage.`
    );
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    const nextSeq = jobs.length + 1;
    const isDiscounted = applySameBranchDiscount && newJobForm.customer === 'Bharath' && membership.pointsBalance >= 500;
    if (isDiscounted) {
      earnPoints(-500, `Redeemed ₹500 Loyalty Discount on Job #JC-00${nextSeq}`);
    }
    const rawTotal = Number(newJobForm.partsCost || 0) + Number(newJobForm.labourCost || 0);
    const finalTotal = isDiscounted ? Math.max(0, rawTotal - 500) : rawTotal;

    const created = addJobCard({
      jobNo: `JC-${String(nextSeq).padStart(3, '0')}`,
      regNo: newJobForm.regNo,
      customer: newJobForm.customer,
      customerPhone: newJobForm.customerPhone,
      brandModel: newJobForm.brandModel,
      serviceType: newJobForm.serviceType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      stage: 'Service Booking',
      status: 'Service Booking',
      workPerformed: newJobForm.workPerformed,
      partsReplaced: newJobForm.partsReplaced,
      partsCost: Number(newJobForm.partsCost || 0),
      labourCost: Number(newJobForm.labourCost || 0),
      labourCharges: Number(newJobForm.labourCost || 0),
      totalAmount: finalTotal,
      totalCost: finalTotal,
      estimatedCost: `₹${finalTotal.toLocaleString()}`,
      discountApplied: isDiscounted ? '₹500 (500 Loyalty Points)' : 'None',
      completionDate: 'Pending',
      odometerReading: Number(newJobForm.odometerReading || 0),
      nextServiceDate: newJobForm.nextServiceDate,
      nextServiceKm: Number(newJobForm.nextServiceKm || 0),
      technician: newJobForm.technician,
      branch: 'Salem Central Mega Hub'
    });

    setIsCreateModalOpen(false);
    setSelectedJob(created);
    showToast(`Created Service Booking #${created.jobNo}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', background: '#101828', color: '#fff',
          padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, zIndex: 99999,
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <CheckCircle2 size={16} color="#12b76a" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 4-Stage Workflow Visual Strip */}
      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
          Service & Job Completion Pipeline
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
          {WORKFLOW_STAGES.map((stage, i) => {
            const count = jobs.filter(j => j.stage === stage).length;
            const isActive = filterStage === stage;
            return (
              <div
                key={stage}
                onClick={() => setFilterStage(isActive ? 'All' : stage)}
                style={{
                  background: isActive ? '#eff6ff' : '#f8fafc',
                  border: isActive ? '1.5px solid #356DF3' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>STAGE {i + 1}</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{stage}</div>
                </div>
                <span style={{
                  fontSize: '15px', fontWeight: 800, color: isActive ? '#356DF3' : '#101828',
                  background: '#ffffff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0'
                }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="metrics-row">
        <MetricCard
          title="Jobs Completed"
          value={jobs.filter(j => j.stage === 'Job Completed' || j.stage === 'Next Service Reminder').length}
          icon={CheckCircle2}
          color="green"
          trend="Ready for Reminder"
          trendType="up"
          subtitle="Completed service records"
        />
        <MetricCard
          title="Jobs In Progress"
          value={jobs.filter(j => j.stage === 'Job In Progress').length}
          icon={Wrench}
          color="blue"
          trend="Active Bays"
          trendType="neutral"
          subtitle="Currently being serviced"
        />
        <MetricCard
          title="Upcoming Reminders"
          value={upcomingReminders.length}
          icon={Clock}
          color="amber"
          trend="Due ≤ 500 km / 15d"
          trendType="warning"
          subtitle="Next service approaching"
        />
        <MetricCard
          title="Overdue Reminders"
          value={overdueReminders.length}
          icon={AlertTriangle}
          color="red"
          trend="Action Required"
          trendType="warning"
          subtitle="Exceeded date or KM"
        />
      </div>

      {/* Main Job Completion Table */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <div className="table-title-icon">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#101828', lineHeight: 1.25 }}>
                Job Completion & Service Reminders
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#667085', marginTop: '2px' }}>
                Track Service Booking → Job In Progress → Job Completed → Next Service Reminder
              </div>
            </div>
          </div>
          <button type="button" className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} /> New Service Booking
          </button>
        </div>

        <div className="table-controls-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="controls-left" style={{ flexWrap: 'wrap', gap: '6px' }}>
            {['All', ...WORKFLOW_STAGES].map(tab => (
              <button
                key={tab}
                type="button"
                className={`tab-pill ${filterStage === tab ? 'active' : ''}`}
                onClick={() => setFilterStage(tab)}
              >
                {tab} ({tab === 'All' ? jobs.length : jobs.filter(j => j.stage === tab).length})
              </button>
            ))}
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search reg no, customer, job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn" aria-label="Search">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Job & Reg No</th>
                <th>Customer & Bike</th>
                <th>Work Performed & Parts</th>
                <th>Costs (Labour / Total)</th>
                <th>Odometer & Completion</th>
                <th>Next Service Target</th>
                <th>Workflow Stage</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#356DF3', marginBottom: '4px' }}>{job.jobNo}</div>
                    <span style={{
                      display: 'inline-block',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '3px 9px',
                      fontWeight: 800,
                      color: '#101828',
                      fontSize: '12.5px',
                      letterSpacing: '0.3px',
                      whiteSpace: 'nowrap'
                    }}>
                      {job.regNo}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{job.customer}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{job.brandModel}</div>
                  </td>
                  <td style={{ maxWidth: '220px' }}>
                    <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>{job.workPerformed}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Parts: {job.partsReplaced}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Labour: ₹{job.labourCost}</div>
                    <strong style={{ fontSize: '13.5px', color: '#10b981' }}>Total: ₹{job.totalAmount.toLocaleString()}</strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{job.odometerReading.toLocaleString()} km</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>Done: {job.completionDate}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#356DF3' }}>{job.nextServiceDate}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>At {job.nextServiceKm.toLocaleString()} km</div>
                  </td>
                  <td>
                    <StatusBadge status={job.stage === 'Job Completed' ? 'Completed' : job.stage === 'Job In Progress' ? 'In Service' : 'Pending'} />
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginTop: '3px' }}>{job.stage}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'nowrap' }}>
                      <button type="button" className="btn-outline-blue btn-sm" onClick={() => setSelectedJob(job)}>
                        Details
                      </button>
                      {job.stage !== 'Next Service Reminder' && (
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => {
                            const nextIdx = WORKFLOW_STAGES.indexOf(job.stage) + 1;
                            if (nextIdx < WORKFLOW_STAGES.length) handleStageChange(job.id, WORKFLOW_STAGES[nextIdx]);
                          }}
                          title="Advance to next workflow stage"
                        >
                          <span>Next</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming & Overdue Service Reminders Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={18} color="#ef4444" />
              <span>Overdue Service Reminders ({overdueReminders.length})</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {overdueReminders.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#64748b' }}>No overdue service reminders.</div>
            ) : (
              overdueReminders.map(b => (
                <div key={b.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#991b1b' }}>{b.regNo} • {b.ownerName || b.customer}</strong>
                    <div style={{ fontSize: '11.5px', color: '#b91c1c' }}>
                      {b.brand} {b.model} • Current: {(b.currentKm || 0).toLocaleString()} km (Target: {(b.nextServiceKm || 0).toLocaleString()} km)
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => {
                      sendCustomerWhatsApp(b.ownerPhone || b.phone, `Reminder: Your ${b.model} (${b.regNo}) is due for service.`);
                      showToast(`Reminder sent to ${b.ownerName || b.customer}`);
                    }}
                  >
                    <Bell size={13} /> Remind
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="#f59e0b" />
              <span>Upcoming Service Reminders ({upcomingReminders.length})</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingReminders.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#64748b' }}>No upcoming reminders in the next 15 days / 500 km.</div>
            ) : (
              upcomingReminders.map(b => (
                <div key={b.id} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#92400e' }}>{b.regNo} • {b.ownerName || b.customer}</strong>
                    <div style={{ fontSize: '11.5px', color: '#b45309' }}>
                      Due Date: {b.nextServiceDate || 'Scheduled'} • {b.kmLeft} km remaining
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-outline-blue btn-sm"
                    onClick={() => {
                      sendCustomerWhatsApp(b.ownerPhone || b.phone, `Upcoming service reminder for ${b.model} (${b.regNo}).`);
                      showToast(`Upcoming reminder sent to ${b.ownerName || b.customer}`);
                    }}
                  >
                    <Bell size={13} /> Notify
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Service Booking Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Service Booking & Job Completion Record"
        size="md"
      >
        <form onSubmit={handleCreateJob}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Select Vehicle *</label>
              <select
                className="form-input no-left-icon"
                value={newJobForm.regNo}
                onChange={(e) => {
                  const found = bikesList.find(b => b.regNo === e.target.value);
                  if (found) {
                    const curKm = found.currentKm || 10000;
                    setNewJobForm({
                      ...newJobForm,
                      regNo: found.regNo,
                      customer: found.ownerName || found.customer,
                      customerPhone: found.ownerPhone || found.phone || '9876543210',
                      brandModel: `${found.brand} ${found.model}`,
                      odometerReading: curKm,
                      nextServiceKm: curKm + 3000
                    });
                  }
                }}
              >
                {bikesList.map(b => (
                  <option key={b.id} value={b.regNo}>{b.regNo} — {b.brand} {b.model} ({b.ownerName || b.customer})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={newJobForm.customer}
                onChange={(e) => setNewJobForm({ ...newJobForm, customer: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Work Performed *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              value={newJobForm.workPerformed}
              onChange={(e) => setNewJobForm({ ...newJobForm, workPerformed: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parts Replaced</label>
            <input
              type="text"
              className="form-input no-left-icon"
              value={newJobForm.partsReplaced}
              onChange={(e) => setNewJobForm({ ...newJobForm, partsReplaced: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Parts Cost (₹)</label>
              <input
                type="number"
                className="form-input no-left-icon"
                value={newJobForm.partsCost}
                onChange={(e) => setNewJobForm({ ...newJobForm, partsCost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Labour Cost (₹)</label>
              <input
                type="number"
                className="form-input no-left-icon"
                value={newJobForm.labourCost}
                onChange={(e) => setNewJobForm({ ...newJobForm, labourCost: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Odometer Reading (km)</label>
              <input
                type="number"
                className="form-input no-left-icon"
                value={newJobForm.odometerReading}
                onChange={(e) => setNewJobForm({ ...newJobForm, odometerReading: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Next Service KM Target</label>
              <input
                type="number"
                className="form-input no-left-icon"
                value={newJobForm.nextServiceKm}
                onChange={(e) => setNewJobForm({ ...newJobForm, nextServiceKm: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Next Service Date</label>
              <input
                type="date"
                className="form-input no-left-icon"
                value={newJobForm.nextServiceDate}
                onChange={(e) => setNewJobForm({ ...newJobForm, nextServiceDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Technician</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={newJobForm.technician}
                onChange={(e) => setNewJobForm({ ...newJobForm, technician: e.target.value })}
              />
            </div>
          </div>

          {newJobForm.customer === 'Bharath' && membership.pointsBalance >= 500 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', background: '#fef3c7', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={applySameBranchDiscount}
                onChange={(e) => setApplySameBranchDiscount(e.target.checked)}
              />
              <span>Redeem 500 Loyalty Points for ₹500 service discount</span>
            </label>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Service Booking</button>
          </div>
        </form>
      </Modal>

      {/* Job Completion Detail Modal */}
      {selectedJob && (
        <Modal
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          title={`Job Completion Record — ${selectedJob.jobNo}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>{selectedJob.regNo} • {selectedJob.brandModel}</strong>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {selectedJob.customer} ({selectedJob.customerPhone})
                </div>
              </div>
              <StatusBadge status={selectedJob.stage === 'Job Completed' ? 'Completed' : 'Pending'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div><span style={{ color: '#64748b' }}>Odometer:</span> <strong>{selectedJob.odometerReading.toLocaleString()} km</strong></div>
              <div><span style={{ color: '#64748b' }}>Completion Date:</span> <strong>{selectedJob.completionDate}</strong></div>
              <div><span style={{ color: '#64748b' }}>Next Service Date:</span> <strong style={{ color: '#356DF3' }}>{selectedJob.nextServiceDate}</strong></div>
              <div><span style={{ color: '#64748b' }}>Next Service KM:</span> <strong style={{ color: '#356DF3' }}>{selectedJob.nextServiceKm.toLocaleString()} km</strong></div>
              <div><span style={{ color: '#64748b' }}>Labour Cost:</span> <strong>₹{selectedJob.labourCost}</strong></div>
              <div><span style={{ color: '#64748b' }}>Total Service Amount:</span> <strong style={{ color: '#10b981' }}>₹{selectedJob.totalAmount.toLocaleString()}</strong></div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <div><strong>Work Performed:</strong> {selectedJob.workPerformed}</div>
              <div style={{ marginTop: '6px' }}><strong>Parts Replaced:</strong> {selectedJob.partsReplaced}</div>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Update Workflow Stage:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {WORKFLOW_STAGES.map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`tab-pill ${selectedJob.stage === st ? 'active' : ''}`}
                    onClick={() => handleStageChange(selectedJob.id, st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Printer size={14} /> Print Summary
              </button>
              <button type="button" className="btn-primary" onClick={() => setSelectedJob(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
