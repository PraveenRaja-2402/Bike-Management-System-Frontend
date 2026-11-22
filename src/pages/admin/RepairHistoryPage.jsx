import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Calendar, 
  Wrench, 
  DollarSign, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  Printer, 
  Bike as BikeIcon, 
  Package, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export default function RepairHistoryPage() {
  const { 
    bikesList, 
    repairRecords, 
    addRepairRecord, 
    deleteRepairRecord, 
    branding 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [bikeFilter, setBikeFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewRepairModal, setViewRepairModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Log Repair (Requirement 4)
  const [selectedBikeId, setSelectedBikeId] = useState(bikesList[0]?.id || '');
  const [formData, setFormData] = useState({
    repairDate: new Date().toISOString().split('T')[0],
    repairKm: bikesList[0]?.currentKm || 15000,
    repairDetails: '',
    laborCost: 350,
    technician: 'Mani',
    status: 'Completed',
    partsReplaced: [
      { partName: '', quantity: 1, unitCost: 0, total: 0 }
    ]
  });

  const handleOpenAddModal = () => {
    const targetBike = bikesList[0] || {};
    setSelectedBikeId(targetBike.id || '');
    setFormData({
      repairDate: new Date().toISOString().split('T')[0],
      repairKm: targetBike.currentKm || 15000,
      repairDetails: '',
      laborCost: 350,
      technician: 'Mani',
      status: 'Completed',
      partsReplaced: [
        { partName: '', quantity: 1, unitCost: 0, total: 0 }
      ]
    });
    setIsAddModalOpen(true);
  };

  const handleBikeChange = (bikeId) => {
    setSelectedBikeId(bikeId);
    const target = bikesList.find(b => b.id === bikeId);
    if (target) {
      setFormData(prev => ({
        ...prev,
        repairKm: target.currentKm || 0
      }));
    }
  };

  // Dynamic Parts rows
  const handleAddPartRow = () => {
    setFormData(prev => ({
      ...prev,
      partsReplaced: [
        ...prev.partsReplaced,
        { partName: '', quantity: 1, unitCost: 0, total: 0 }
      ]
    }));
  };

  const handleRemovePartRow = (index) => {
    setFormData(prev => ({
      ...prev,
      partsReplaced: prev.partsReplaced.filter((_, idx) => idx !== index)
    }));
  };

  const handlePartChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.partsReplaced];
      const current = { ...updated[index], [field]: value };
      
      const qty = parseFloat(field === 'quantity' ? value : current.quantity) || 0;
      const unit = parseFloat(field === 'unitCost' ? value : current.unitCost) || 0;
      current.total = qty * unit;
      
      updated[index] = current;
      return { ...prev, partsReplaced: updated };
    });
  };

  const calculatePartsTotal = () => {
    return formData.partsReplaced.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
  };

  const calculateTotalCost = () => {
    return calculatePartsTotal() + (parseFloat(formData.laborCost) || 0);
  };

  const handleSaveRepair = (e) => {
    e.preventDefault();
    const targetBike = bikesList.find(b => b.id === selectedBikeId) || bikesList[0];
    if (!targetBike || !formData.repairDetails.trim()) {
      alert('Please enter repair details');
      return;
    }

    const validParts = formData.partsReplaced.filter(p => p.partName.trim() !== '');

    addRepairRecord({
      bikeId: targetBike.id,
      regNo: targetBike.regNo,
      ownerName: targetBike.ownerName || targetBike.customer,
      ownerPhone: targetBike.ownerPhone || targetBike.phone,
      repairDate: formData.repairDate,
      repairKm: parseInt(formData.repairKm, 10),
      repairDetails: formData.repairDetails,
      partsReplaced: validParts,
      laborCost: parseFloat(formData.laborCost) || 0,
      totalCost: calculateTotalCost(),
      technician: formData.technician,
      status: formData.status
    });

    setIsAddModalOpen(false);
    setToastMessage(`Repair record logged for ${targetBike.regNo}! Total Cost: ₹${calculateTotalCost().toLocaleString()}`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleDeleteRepair = (rep) => {
    if (window.confirm(`Delete repair record ${rep.id} for ${rep.regNo}?`)) {
      deleteRepairRecord(rep.id);
      setToastMessage(`Repair record ${rep.id} deleted.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const filteredRepairs = repairRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (r.regNo || '').toLowerCase().includes(q) ||
      (r.ownerName || '').toLowerCase().includes(q) ||
      (r.repairDetails || '').toLowerCase().includes(q) ||
      (r.technician || '').toLowerCase().includes(q);

    const matchesBike = bikeFilter === 'All' || r.regNo === bikeFilter;

    return matchesSearch && matchesBike;
  });

  const totalRepairRevenue = repairRecords.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);
  const totalPartsUsed = repairRecords.reduce((sum, r) => sum + (r.partsReplaced?.length || 0), 0);

  return (
    <div className="repair-history-page">
      {/* Toast */}
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
          fontSize: '13.5px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Repairs Logged</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {repairRecords.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Complete bike-wise repair history
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Repair Billing</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            ₹{totalRepairRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Parts replacement + labor charges
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Spare Parts Replaced</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {totalPartsUsed} Parts
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Brake pads, clutch plates, batteries
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #356DF3' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Avg Repair Cost</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#356DF3', marginTop: '4px' }}>
            ₹{repairRecords.length > 0 ? Math.round(totalRepairRevenue / repairRecords.length).toLocaleString() : 0}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Per completed workshop job
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <ClipboardList size={20} color="#356DF3" />
            <span>Bike-Wise Repair History & Parts Replacement (Requirement 4)</span>
          </div>
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={16} /> Log New Repair
          </button>
        </div>

        {/* Filter Controls */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <select
              className="filter-select"
              value={bikeFilter}
              onChange={(e) => setBikeFilter(e.target.value)}
            >
              <option value="All">All Bikes</option>
              {bikesList.map(b => (
                <option key={b.id} value={b.regNo}>{b.regNo} ({b.model})</option>
              ))}
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search Reg No, Owner, Parts, Tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Repair Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Repair Date</th>
                <th>Bike Reg No</th>
                <th>Owner Details</th>
                <th>KM Reading</th>
                <th>Repair Details</th>
                <th>Parts Replaced</th>
                <th>Total Cost</th>
                <th>Technician</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.map((rep, idx) => (
                <tr key={rep.id || idx}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{rep.repairDate}</div>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>ID: {rep.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{rep.regNo}</div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>{rep.status || 'Completed'}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rep.ownerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{rep.ownerPhone}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                      {(rep.repairKm || 0).toLocaleString()} km
                    </span>
                  </td>
                  <td style={{ maxWidth: '260px' }}>
                    <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600, lineHeight: 1.4 }}>
                      {rep.repairDetails}
                    </div>
                  </td>
                  <td>
                    {rep.partsReplaced && rep.partsReplaced.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                        {rep.partsReplaced.map((p, pIdx) => (
                          <span key={pIdx} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {p.partName} {p.quantity > 1 ? `(x${p.quantity})` : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>Labor Only</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '14px' }}>
                      ₹{(rep.totalCost || 0).toLocaleString()}
                    </div>
                    {rep.laborCost > 0 && (
                      <div style={{ fontSize: '10px', color: '#64748b' }}>
                        Labor: ₹{rep.laborCost}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                      {rep.technician || 'Mani'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-outline-blue btn-sm"
                        onClick={() => setViewRepairModal(rep)}
                        title="View Detailed Repair Receipt"
                      >
                        <Eye size={13} /> Invoice
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        style={{ padding: '4px 7px' }}
                        onClick={() => handleDeleteRepair(rep)}
                        title="Delete repair record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRepairs.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No repair records match your filter criteria. Click "Log New Repair" to record parts replacement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredRepairs.length} of {repairRecords.length} repair records</span>
        </div>
      </div>

      {/* MODAL: Log New Repair (Requirement 4) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Bike Repair & Parts Replacement"
        size="md"
      >
        <form onSubmit={handleSaveRepair}>
          <div className="form-group">
            <label className="form-label">Select Registered Bike *</label>
            <select
              className="form-input no-left-icon"
              value={selectedBikeId}
              onChange={(e) => handleBikeChange(e.target.value)}
              required
            >
              {bikesList.map(b => (
                <option key={b.id} value={b.id}>
                  {b.regNo} - {b.model} ({b.ownerName || b.customer}) • Current: {(b.currentKm || 0).toLocaleString()} km
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Repair Date *</label>
              <input
                type="date"
                className="form-input no-left-icon"
                required
                value={formData.repairDate}
                onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Odometer Reading (KM) *</label>
              <input
                type="number"
                className="form-input no-left-icon"
                required
                value={formData.repairKm}
                onChange={(e) => setFormData({ ...formData, repairKm: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Repair Details & Problem Description *</label>
            <textarea
              className="form-input no-left-icon"
              rows={2}
              required
              placeholder="e.g. Rear brake pad worn out, heavy clutch slipping, battery replacement..."
              value={formData.repairDetails}
              onChange={(e) => setFormData({ ...formData, repairDetails: e.target.value })}
            />
          </div>

          {/* Dynamic Parts Replaced Section (Requirement 4) */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={14} color="#356DF3" />
                <span>Spare Parts Replaced:</span>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleAddPartRow}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                + Add Part
              </button>
            </div>

            {formData.partsReplaced.map((part, pIdx) => (
              <div key={pIdx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  style={{ fontSize: '12px', padding: '6px 10px' }}
                  placeholder="Part name (e.g. Brake Pads)"
                  value={part.partName}
                  onChange={(e) => handlePartChange(pIdx, 'partName', e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  className="form-input no-left-icon"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                  placeholder="Qty"
                  value={part.quantity}
                  onChange={(e) => handlePartChange(pIdx, 'quantity', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  className="form-input no-left-icon"
                  style={{ fontSize: '12px', padding: '6px 8px' }}
                  placeholder="Unit ₹"
                  value={part.unitCost}
                  onChange={(e) => handlePartChange(pIdx, 'unitCost', e.target.value)}
                />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                  ₹{(part.total || 0).toLocaleString()}
                </div>
                {formData.partsReplaced.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePartRow(pIdx)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Remove Part"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
              <span>Total Parts Cost: <strong style={{ color: '#0f172a' }}>₹{calculatePartsTotal().toLocaleString()}</strong></span>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Labor Charges (₹)</label>
              <input
                type="number"
                min="0"
                className="form-input no-left-icon"
                value={formData.laborCost}
                onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Technician Assigned</label>
              <select
                className="form-input no-left-icon"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              >
                <option value="Mani">Mani</option>
                <option value="Anitha">Anitha</option>
                <option value="Karthik">Karthik</option>
              </select>
            </div>
          </div>

          {/* Grand Total Preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#fff', padding: '12px 16px', borderRadius: '8px', marginTop: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Total Repair Cost (Parts + Labor):</span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8' }}>₹{calculateTotalCost().toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Log Repair Record
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: View Repair Invoice & Parts Breakdown */}
      {viewRepairModal && (
        <Modal
          isOpen={Boolean(viewRepairModal)}
          onClose={() => setViewRepairModal(null)}
          title={`Repair Receipt - ${viewRepairModal.id}`}
          size="md"
        >
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{branding.companyName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Repair & Overhaul Department • Salem</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#dc2626' }}>REPAIR INVOICE #{viewRepairModal.id}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {viewRepairModal.repairDate}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px', marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ color: '#64748b' }}>Customer:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{viewRepairModal.ownerName}</strong>
                <span>Phone: {viewRepairModal.ownerPhone}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Bike Reg:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{viewRepairModal.regNo}</strong>
                <span>Odometer: {(viewRepairModal.repairKm || 0).toLocaleString()} km</span>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Problem & Repair Description:
              </div>
              <div style={{ fontSize: '13px', color: '#1e293b', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {viewRepairModal.repairDetails}
              </div>
            </div>

            {/* Parts Table */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Replaced Spare Parts:
              </div>
              <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '6px 8px' }}>Part Name</th>
                    <th style={{ padding: '6px 8px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewRepairModal.partsReplaced || []).map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 8px' }}>{p.partName}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center' }}>{p.quantity || 1}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹{(p.unitCost || 0).toLocaleString()}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>₹{(p.total || (p.quantity || 1) * (p.unitCost || 0)).toLocaleString()}</td>
                    </tr>
                  ))}
                  {viewRepairModal.laborCost > 0 && (
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td colSpan={3} style={{ padding: '6px 8px', color: '#64748b' }}>Labor & Fitting Charges</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>₹{viewRepairModal.laborCost.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#ffffff', padding: '12px 16px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Grand Total Paid:</span>
              <span style={{ fontWeight: 900, fontSize: '18px', color: '#38bdf8' }}>₹{(viewRepairModal.totalCost || 0).toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.print()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} /> Print Invoice
            </button>

            <button type="button" className="btn-primary" onClick={() => setViewRepairModal(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

