import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Plus, 
  FileText, 
  CheckCircle, 
  Printer, 
  User, 
  Calendar,
  Clock,
  DollarSign,
  Coins,
  Sparkles,
  Store,
  Tag
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { mockJobCards, mockBikes } from '../../data/mockData';

export default function JobCardsPage() {
  const { membership, earnPoints } = useApp();
  const [jobCards, setJobCards] = useState(mockJobCards);
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [applySameBranchDiscount, setApplySameBranchDiscount] = useState(true);
  const [newJob, setNewJob] = useState({
    regNo: 'TN 30 AB 1234',
    customer: 'Bharath',
    brandModel: 'Yamaha FZ-S',
    serviceType: 'General Service',
    technician: 'Mani',
    estimatedCost: '₹750',
    notes: 'Engine oil replacement, oil filter check, brake adjustment. (Applied 500 GPS Loyalty Points discount)'
  });

  // View Modal State
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobCards = jobCards.filter((job) => {
    const matchesTab = filterTab === 'All' || job.status.toLowerCase() === filterTab.toLowerCase();
    const matchesSearch = job.jobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.brandModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const countByStatus = (status) => {
    if (status === 'All') return jobCards.length;
    return jobCards.filter(j => j.status.toLowerCase() === status.toLowerCase()).length;
  };

  const handleCreateJobCard = (e) => {
    e.preventDefault();
    const newId = jobCards.length + 1;
    const isDiscounted = applySameBranchDiscount && newJob.customer === 'Bharath';
    
    if (isDiscounted && membership.pointsBalance >= 500) {
      earnPoints(-500, `Redeemed: ₹500 Service Discount on Job Card #JC-00${newId} (Salem Central Hub)`);
    }

    const created = {
      id: newId,
      jobNo: `JC-00${newId}`,
      regNo: newJob.regNo,
      customer: newJob.customer,
      brandModel: newJob.brandModel,
      serviceType: newJob.serviceType,
      date: '18 Sep 2026',
      status: 'Open',
      estimatedCost: isDiscounted ? '₹750' : newJob.estimatedCost,
      originalCost: '₹1,250',
      discountApplied: isDiscounted ? '₹500 (500 GPS Points Redeemed)' : 'None',
      branch: 'Salem Central Mega Hub',
      technician: newJob.technician,
      notes: newJob.notes
    };
    setJobCards([created, ...jobCards]);
    setIsCreateModalOpen(false);
    setSelectedJob(created);
  };

  const handleUpdateStatus = (jobId, newStatus) => {
    const updated = jobCards.map(j => {
      if (j.id === jobId) {
        if (newStatus === 'Completed' && j.status !== 'Completed' && j.customer === 'Bharath') {
          earnPoints(150, `Repeat Visit Reward: Service Completed at Salem Central Mega Hub (${j.jobNo})`);
        }
        return { ...j, status: newStatus };
      }
      return j;
    });
    setJobCards(updated);
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, status: newStatus });
    }
  };

  return (
    <div className="job-cards-page">
      <div className="table-card">
        {/* Controls Bar */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <div className="filter-tabs">
              {['All', 'Open', 'In Service', 'Ready', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-pill ${filterTab === tab ? 'active' : ''}`}
                  onClick={() => setFilterTab(tab)}
                >
                  {tab} ({countByStatus(tab)})
                </button>
              ))}
            </div>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Job No, Reg No, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>

            <button 
              type="button" 
              className="btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} /> Create Job Card
            </button>
          </div>
        </div>

        {/* Job Cards Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Job No</th>
                <th>Reg No</th>
                <th>Customer</th>
                <th>Brand / Model</th>
                <th>Service Type</th>
                <th>Date</th>
                <th>Technician</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobCards.map((job, idx) => (
                <tr key={job.id}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: '#356DF3' }}>{job.jobNo}</td>
                  <td style={{ fontWeight: 600 }}>{job.regNo}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{job.customer}</span>
                      {job.customer === 'Bharath' && (
                        <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          GPS Loyalty
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: '#64748b' }}>{job.brandModel}</td>
                  <td>{job.serviceType}</td>
                  <td style={{ color: '#64748b' }}>{job.date}</td>
                  <td>
                    <span className="tech-badge">{job.technician}</span>
                  </td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-action-icon"
                      title="View Job Card"
                      onClick={() => setSelectedJob(job)}
                    >
                      <FileText size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Job Card */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Workshop Job Card"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateJobCard}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Bike Registration *</label>
              <select
                className="form-input no-left-icon"
                value={newJob.regNo}
                onChange={(e) => {
                  const reg = e.target.value;
                  const found = mockBikes.find(b => b.regNo === reg);
                  if (found) {
                    setNewJob({
                      ...newJob,
                      regNo: reg,
                      customer: found.owner,
                      brandModel: `${found.brand} ${found.model}`
                    });
                  } else {
                    setNewJob({ ...newJob, regNo: reg });
                  }
                }}
              >
                {mockBikes.map(b => (
                  <option key={b.id} value={b.regNo}>{b.regNo} - {b.brand} {b.model}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={newJob.customer}
                onChange={(e) => setNewJob({ ...newJob, customer: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Brand / Model *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={newJob.brandModel}
                onChange={(e) => setNewJob({ ...newJob, brandModel: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Service Type *</label>
              <select
                className="form-input no-left-icon"
                value={newJob.serviceType}
                onChange={(e) => setNewJob({ ...newJob, serviceType: e.target.value })}
              >
                <option value="General Service">General Service</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Brake Service">Brake Service</option>
                <option value="Engine Repair">Engine Repair</option>
                <option value="Battery Check">Battery Check</option>
                <option value="Chain & Sprocket">Chain & Sprocket</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Assigned Technician</label>
              <select
                className="form-input no-left-icon"
                value={newJob.technician}
                onChange={(e) => setNewJob({ ...newJob, technician: e.target.value })}
              >
                <option value="Mani">Mani</option>
                <option value="Anitha">Anitha</option>
                <option value="Karthik">Karthik</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Cost</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={newJob.estimatedCost}
                onChange={(e) => setNewJob({ ...newJob, estimatedCost: e.target.value })}
              />
            </div>
          </div>

          {/* Same-Branch Loyalty Points Deduction Option */}
          {newJob.customer === 'Bharath' && (
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Coins size={15} color="#16a34a" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#166534' }}>
                    GPS Bike Owner • Salem Central Mega Hub
                  </span>
                </div>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  {membership.pointsBalance} Points Available
                </span>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#14532d' }}>
                <input
                  type="checkbox"
                  checked={applySameBranchDiscount}
                  onChange={(e) => {
                    setApplySameBranchDiscount(e.target.checked);
                    setNewJob(prev => ({
                      ...prev,
                      estimatedCost: e.target.checked ? '₹750' : '₹1,250'
                    }));
                  }}
                />
                <span style={{ fontWeight: 700 }}>
                  Apply Same-Branch GPS Loyalty Discount (-₹500 using 500 Pts)
                </span>
              </label>

              <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px', opacity: 0.9 }}>
                Total invoice: {applySameBranchDiscount ? '₹750 (Saved ₹500 from ₹1,250)' : '₹1,250 (Full Rate)'} • +150 Points awarded to customer on job completion.
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Job Notes / Customer Complaints</label>
            <textarea
              className="form-input no-left-icon"
              rows={3}
              value={newJob.notes}
              onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Generate Job Card
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Job Card Details */}
      {selectedJob && (
        <Modal
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          title={`Job Card Details - ${selectedJob.jobNo}`}
          maxWidth="600px"
        >
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              padding: '14px 18px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{selectedJob.regNo}</span>
                <span style={{ display: 'block', fontSize: '13px', color: '#64748b' }}>{selectedJob.brandModel}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedJob.status} />
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Date: {selectedJob.date}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Customer Name</span>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{selectedJob.customer}</span>
                  {selectedJob.customer === 'Bharath' && (
                    <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      GPS Owner
                    </span>
                  )}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Assigned Technician</span>
                <strong>{selectedJob.technician}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Service Type</span>
                <strong>{selectedJob.serviceType}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Estimated Cost</span>
                <div>
                  <strong style={{ color: '#059669', fontSize: '16px' }}>{selectedJob.estimatedCost}</strong>
                  {selectedJob.discountApplied && selectedJob.discountApplied !== 'None' && (
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                      (-{selectedJob.discountApplied})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedJob.customer === 'Bharath' && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#166534', fontWeight: 700 }}>
                  <Store size={14} color="#16a34a" />
                  <span>Salem Central Mega Hub • Same-Branch GPS Loyalty Program</span>
                </div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                  +150 Pts on Completion
                </span>
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Service Notes
              </span>
              <p style={{ fontSize: '13px', color: '#1e293b', margin: 0 }}>{selectedJob.notes}</p>
            </div>

            {/* Quick Status Updater */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                Change Workshop Status:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Open', 'In Service', 'Ready', 'Completed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`tab-pill ${selectedJob.status === st ? 'active' : ''}`}
                    onClick={() => handleUpdateStatus(selectedJob.id, st)}
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => alert(`Printing Job Card #${selectedJob.jobNo}... (Mock print preview)`)}
              >
                <Printer size={15} /> Print Job Card
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setSelectedJob(null)}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

