import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Phone, 
  FileText, 
  Filter, 
  Search, 
  Wrench, 
  Calendar, 
  Building2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export default function PendingServicePage() {
  const navigate = useNavigate();
  const { pendingServices, updatePendingServiceStage, sendPendingReminder, storesList } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [activeItemForAction, setActiveItemForAction] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredItems = pendingServices.filter((item) => {
    const matchesSearch = item.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUrgency = urgencyFilter === 'All' || 
      (urgencyFilter === 'Overdue' && item.serviceDueDays < 0) ||
      (urgencyFilter === '7Days' && item.serviceDueDays >= 0 && item.serviceDueDays <= 7) ||
      (urgencyFilter === 'Upcoming' && item.serviceDueDays > 7);

    const matchesBranch = branchFilter === 'All' || item.storeBranch === branchFilter;

    return matchesSearch && matchesUrgency && matchesBranch;
  });

  const criticalCount = pendingServices.filter(s => s.serviceDueDays < 0).length;
  const dueSoonCount = pendingServices.filter(s => s.serviceDueDays >= 0 && s.serviceDueDays <= 7).length;
  const totalPendingRevenue = pendingServices.reduce((sum, s) => {
    const num = parseInt(s.estimatedCost.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + num;
  }, 0);

  const handleSendReminder = (item) => {
    sendPendingReminder(item.id, "SMS & WhatsApp");
    setToastMessage(`Urgent reminder dispatched to ${item.customer} (${item.phone}) for ${item.regNo}!`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleStageChange = (item, newStage) => {
    updatePendingServiceStage(item.id, newStage);
    setToastMessage(`Service status for ${item.regNo} updated to "${newStage}"`);
    setTimeout(() => setToastMessage(''), 4000);
    setActionModalOpen(false);
  };

  const handleCreateJobCard = (item) => {
    // Navigate to job cards or confirm
    setToastMessage(`Job card generated for ${item.regNo}! Moving to Job Cards module...`);
    setTimeout(() => {
      navigate('/admin/job-cards');
    }, 1500);
  };

  return (
    <div className="pending-service-page">
      {toastMessage && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Highlight Cards for Service Pending Monitoring */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Critical Overdue</span>
            <AlertCircle size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{criticalCount} Bikes</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Overdue maintenance past interval</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Due in &lt; 7 Days</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{dueSoonCount} Bikes</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>High priority slots required</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>Pending Work Value</span>
            <TrendingUp size={20} color="#2563eb" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>₹{totalPendingRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Estimated revenue from pending services</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Total Monitoring</span>
            <Wrench size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{pendingServices.length} Vehicles</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>In pending service lifecycle</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        {/* Table Filters */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <select
              className="filter-select"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <option value="All">All Urgency Levels</option>
              <option value="Overdue">Critical Overdue (&lt; 0 Days)</option>
              <option value="7Days">Due within 7 Days</option>
              <option value="Upcoming">Upcoming (8-30 Days)</option>
            </select>

            <select
              className="filter-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="All">All Workshop Hubs</option>
              {storesList.map(st => (
                <option key={st.id} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search by reg no, customer, bike model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Pending Services Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Vehicle & Model</th>
                <th>Customer Contact</th>
                <th>Due In</th>
                <th>Odometer Status</th>
                <th>Package & Est. Cost</th>
                <th>Monitoring Stage</th>
                <th>Assigned Hub</th>
                <th style={{ textAlign: 'center' }}>Immediate Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isOverdue = item.serviceDueDays < 0;

                return (
                  <tr key={item.id} style={{ background: isOverdue ? '#fff8f8' : 'inherit' }}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.regNo}</span>
                          {isOverdue && (
                            <span style={{ fontSize: '10px', background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              OVERDUE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.model}</div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{item.customer}</span>
                        {item.customer === 'Bharath' && (
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            1,250 GPS Pts
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.phone}</div>
                    </td>

                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: isOverdue ? '#fef2f2' : item.serviceDueDays <= 7 ? '#fffbeb' : '#eff6ff',
                        color: isOverdue ? '#dc2626' : item.serviceDueDays <= 7 ? '#d97706' : '#2563eb'
                      }}>
                        <Clock size={13} />
                        <span>{isOverdue ? `${Math.abs(item.serviceDueDays)} Days Overdue` : `${item.serviceDueDays} Days Left`}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>{item.odometerCurrent}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Due at: {item.odometerDueAt}</div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2563eb' }}>{item.estimatedCost}</div>
                      <div style={{ fontSize: '11px', color: '#475569', maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.serviceCategory}
                      </div>
                    </td>

                    <td>
                      <span style={{
                        fontSize: '11.5px',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: item.stage.includes('Booking') ? '#fff7ed' : item.stage.includes('Sent') ? '#f0fdf4' : '#f1f5f9',
                        color: item.stage.includes('Booking') ? '#c2410c' : item.stage.includes('Sent') ? '#15803d' : '#334155',
                        fontWeight: 600
                      }}>
                        {item.stage}
                      </span>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                        Notified: {item.lastNotified}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={13} color="#64748b" />
                        <span>{item.storeBranch}</span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => handleSendReminder(item)}
                          title="Dispatch Urgent SMS & WhatsApp alert"
                        >
                          <Send size={12} /> Remind
                        </button>
                        <button
                          type="button"
                          className="btn-outline-blue btn-sm"
                          onClick={() => handleCreateJobCard(item)}
                          title="Generate Job Card"
                        >
                          <FileText size={12} /> Job Card
                        </button>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setActiveItemForAction(item);
                            setActionModalOpen(true);
                          }}
                          title="Change Stage"
                        >
                          Status
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

      {/* Modal: Update Stage */}
      {activeItemForAction && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Update Monitoring Stage • ${activeItemForAction.regNo}`}
        >
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
              Customer: <strong>{activeItemForAction.customer}</strong> ({activeItemForAction.phone})
            </div>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Vehicle: <strong>{activeItemForAction.model}</strong> • {activeItemForAction.serviceDueDays < 0 ? 'Overdue' : 'Due Soon'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => handleStageChange(activeItemForAction, 'Pending Customer Booking')}
            >
              <div>
                <strong>Pending Customer Booking</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Waiting for customer to select appointment slot</div>
              </div>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => handleStageChange(activeItemForAction, 'Pending Slot Confirmation')}
            >
              <div>
                <strong>Pending Slot Confirmation</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Slot selected, awaiting workshop bay assignment</div>
              </div>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => handleStageChange(activeItemForAction, 'Pending Parts Arrival')}
            >
              <div>
                <strong>Pending Parts Arrival</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Special spares/oil ordered before intake</div>
              </div>
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => handleStageChange(activeItemForAction, 'Ready for Workshop Intake')}
            >
              <div>
                <strong>Ready for Workshop Intake</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Vehicle arriving at branch today</div>
              </div>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

