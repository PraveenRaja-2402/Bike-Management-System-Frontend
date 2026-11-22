import React, { useState } from 'react';
import { 
  Bike as BikeIcon, 
  Search, 
  Plus, 
  Phone, 
  Calendar, 
  Gauge, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  FileText, 
  MessageCircle, 
  Send,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export default function BikesPage() {
  const { 
    bikesList, 
    addBike, 
    updateBike, 
    deleteBike, 
    updateBikeKm, 
    serviceRecords, 
    repairRecords,
    serviceIntervals,
    sendCustomerWhatsApp,
    sendCustomerSms,
    customerFines,
    payFine
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKmModalOpen, setIsKmModalOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [viewBikeDetail, setViewBikeDetail] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview', 'services', 'repairs'
  const [newKmInput, setNewKmInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Bike Form Data (Matches all Requirement 1 specifications)
  const [formData, setFormData] = useState({
    regNo: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    model: '',
    brand: 'Yamaha',
    purchaseDate: new Date().toISOString().split('T')[0],
    currentKm: '',
    insuranceExpiryDate: '',
    notes: ''
  });

  const filteredBikes = bikesList.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (b.regNo || '').toLowerCase().includes(q) ||
      (b.ownerName || b.customer || '').toLowerCase().includes(q) ||
      (b.ownerPhone || b.phone || '').includes(q) ||
      (b.model || '').toLowerCase().includes(q);

    const matchesBrand = brandFilter === 'All' || (b.brand || '').toLowerCase() === brandFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || (b.status || 'Active').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      regNo: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      model: '',
      brand: 'Yamaha',
      purchaseDate: new Date().toISOString().split('T')[0],
      currentKm: '',
      insuranceExpiryDate: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (bike) => {
    setSelectedBike(bike);
    setFormData({
      regNo: bike.regNo,
      ownerName: bike.ownerName || bike.customer || '',
      ownerPhone: bike.ownerPhone || bike.phone || '',
      ownerEmail: bike.ownerEmail || bike.email || '',
      model: bike.model || '',
      brand: bike.brand || 'Other',
      purchaseDate: bike.purchaseDate || '',
      currentKm: bike.currentKm || '',
      insuranceExpiryDate: bike.insuranceExpiryDate || '',
      notes: bike.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenKmUpdate = (bike) => {
    setSelectedBike(bike);
    setNewKmInput(bike.currentKm || '');
    setIsKmModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.regNo.trim()) return;

    addBike(formData);
    setIsAddModalOpen(false);
    setToastMessage(`Bike "${formData.regNo.toUpperCase()}" registered successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedBike) return;

    updateBike(selectedBike.id, formData);
    setIsEditModalOpen(false);
    setSelectedBike(null);
    setToastMessage(`Details for "${formData.regNo}" updated successfully!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSaveKm = (e) => {
    e.preventDefault();
    if (!selectedBike) return;

    const km = parseInt(newKmInput, 10);
    if (isNaN(km) || km < 0) {
      alert('Please enter a valid kilometre reading');
      return;
    }

    updateBikeKm(selectedBike.id, km);
    setIsKmModalOpen(false);
    setToastMessage(`Odometer reading for ${selectedBike.regNo} updated to ${km.toLocaleString()} km!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDeleteBike = (bike) => {
    if (window.confirm(`Are you sure you want to delete bike "${bike.regNo}" (${bike.ownerName || bike.customer})? All records will be removed.`)) {
      deleteBike(bike.id);
      setToastMessage(`Bike ${bike.regNo} removed.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleWhatsAppAlert = (bike) => {
    const owner = bike.ownerName || bike.customer;
    const phone = bike.ownerPhone || bike.phone;
    const km = bike.currentKm ? `${bike.currentKm.toLocaleString()} km` : 'N/A';
    const nextKm = bike.nextServiceKm ? `${bike.nextServiceKm.toLocaleString()} km` : 'N/A';
    
    const msg = `Hello ${owner}, this is a friendly reminder from Bike Service Center Salem. Your ${bike.model} (${bike.regNo}) is at ${km}. Next scheduled maintenance is due on ${bike.nextServiceDate || 'soon'} (at ${nextKm}). Please visit us or call us to reserve your service bay. Thank you!`;
    sendCustomerWhatsApp(phone, msg);
  };

  return (
    <div className="bikes-page">
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

      {/* Header and Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #356DF3' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Registered Bikes</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {bikesList.length}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
            ✓ Complete offline local storage
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Active Fleet</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {bikesList.filter(b => (b.status || 'Active') === 'Active').length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Customer bikes in active tracking
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Service Tracking Records</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {serviceRecords.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Total scheduled maintenance logged
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Repair Records</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {repairRecords.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Total parts replacement logs
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <BikeIcon size={20} color="#356DF3" />
            <span>Customer Bike Registry (Requirement 1)</span>
          </div>
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} /> Register New Bike
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <select
              className="filter-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="All">All Brands</option>
              <option value="Yamaha">Yamaha</option>
              <option value="Honda">Honda</option>
              <option value="Royal Enfield">Royal Enfield</option>
              <option value="TVS">TVS</option>
              <option value="Hero">Hero</option>
              <option value="KTM">KTM</option>
              <option value="Bajaj">Bajaj</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search Reg No, Owner, Phone, Model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bike Registry Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Bike Reg No</th>
                <th>Owner Details</th>
                <th>Model & Brand</th>
                <th>Current KM</th>
                <th>Purchase Date</th>
                <th>Next Service</th>
                <th>Insurance Expiry</th>
                <th style={{ textAlign: 'center' }}>Notifications</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBikes.map((bike, idx) => {
                const owner = bike.ownerName || bike.customer || 'Customer';
                const phone = bike.ownerPhone || bike.phone || 'N/A';
                const curKm = typeof bike.currentKm === 'number' ? bike.currentKm : parseInt(bike.currentKm, 10) || 0;
                const nextKm = typeof bike.nextServiceKm === 'number' ? bike.nextServiceKm : parseInt(bike.nextServiceKm, 10) || 0;
                const kmDiff = nextKm - curKm;
                const isOverdue = kmDiff <= 0;

                return (
                  <tr key={bike.id || idx}>
                    <td style={{ color: '#64748b' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '0.2px' }}>
                        {bike.regNo}
                      </div>
                      <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                        ID: {bike.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{owner}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{bike.model}</div>
                      <span style={{ fontSize: '11px', color: '#356DF3', fontWeight: 600 }}>{bike.brand}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                          {curKm.toLocaleString()} km
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenKmUpdate(bike)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#2957CC',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title="Update current kilometre reading"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontSize: '12px' }}>
                      {bike.purchaseDate || bike.purchasedDate || '—'}
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 600 }}>
                        {bike.nextServiceDate || bike.nextService || 'Pending'}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: isOverdue ? '#ef4444' : kmDiff < 500 ? '#f59e0b' : '#059669' 
                      }}>
                        {isOverdue ? `Overdue by ${Math.abs(kmDiff).toLocaleString()} km` : `${kmDiff.toLocaleString()} km left`}
                      </div>
                    </td>
                    <td>
                      {bike.insuranceExpiryDate ? (
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          {bike.insuranceExpiryDate}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>Not recorded</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn-sm"
                          style={{
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#047857',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleWhatsAppAlert(bike)}
                          title="Send pre-filled service reminder via WhatsApp"
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </button>
                        <button
                          type="button"
                          className="btn-sm"
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => sendCustomerSms(phone, `Reminder: ${bike.model} (${bike.regNo}) is due for scheduled service at Bike Service Center.`)}
                          title="Send SMS notification"
                        >
                          <Send size={12} /> SMS
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-outline-blue btn-sm"
                          onClick={() => {
                            setViewBikeDetail(bike);
                            setActiveDetailTab('overview');
                          }}
                          title="View complete bike maintenance & repair profile"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(bike)}
                          title="Edit bike details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger btn-sm"
                          style={{ padding: '4px 7px' }}
                          onClick={() => handleDeleteBike(bike)}
                          title="Delete bike"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBikes.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No bikes found matching your search. Click "Register New Bike" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredBikes.length} of {bikesList.length} registered bikes</span>
        </div>
      </div>

      {/* MODAL 1: Register New Bike (Requirement 1) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer Bike"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Bike Registration Number *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                placeholder="e.g. TN 30 AB 1234"
                required
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bike Model *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                placeholder="e.g. Yamaha FZ-S / Activa 6G"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Owner Name *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                placeholder="e.g. Bharath Kumar"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Owner Mobile Number *</label>
              <input
                type="tel"
                className="form-input no-left-icon"
                placeholder="e.g. 9876543210"
                required
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Manufacturer Brand</label>
              <select
                className="form-input no-left-icon"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              >
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="Royal Enfield">Royal Enfield</option>
                <option value="TVS">TVS</option>
                <option value="Hero">Hero</option>
                <option value="Bajaj">Bajaj</option>
                <option value="KTM">KTM</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Kilometre Reading *</label>
              <input
                type="number"
                className="form-input no-left-icon"
                placeholder="e.g. 15000"
                required
                value={formData.currentKm}
                onChange={(e) => setFormData({ ...formData, currentKm: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                className="form-input no-left-icon"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Insurance Expiry Date</label>
              <input
                type="date"
                className="form-input no-left-icon"
                value={formData.insuranceExpiryDate}
                onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Owner Email Address (Optional)</label>
            <input
              type="email"
              className="form-input no-left-icon"
              placeholder="e.g. owner@example.com"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Customer Requests</label>
            <textarea
              className="form-input no-left-icon"
              rows={2}
              placeholder="e.g. Prefers synthetic oil, requests weekend pickup"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Bike
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Edit Bike */}
      {selectedBike && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Bike - ${selectedBike.regNo}`}
          size="md"
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Reg Number</label>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  required
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input no-left-icon"
                  required
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Current KM</label>
                <input
                  type="number"
                  className="form-input no-left-icon"
                  required
                  value={formData.currentKm}
                  onChange={(e) => setFormData({ ...formData, currentKm: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Insurance Expiry Date</label>
                <input
                  type="date"
                  className="form-input no-left-icon"
                  value={formData.insuranceExpiryDate}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input no-left-icon"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Update Odometer KM */}
      {selectedBike && isKmModalOpen && (
        <Modal
          isOpen={isKmModalOpen}
          onClose={() => setIsKmModalOpen(false)}
          title={`Update Kilometre Reading: ${selectedBike.regNo}`}
          size="sm"
        >
          <form onSubmit={handleSaveKm}>
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
              <div>Bike: <strong>{selectedBike.model}</strong> ({selectedBike.regNo})</div>
              <div>Owner: <strong>{selectedBike.ownerName || selectedBike.customer}</strong></div>
              <div>Previous KM: <strong>{(selectedBike.currentKm || 0).toLocaleString()} km</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">New Kilometre Reading (KM) *</label>
              <input
                type="number"
                className="form-input no-left-icon"
                required
                min={selectedBike.currentKm || 0}
                value={newKmInput}
                onChange={(e) => setNewKmInput(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Updating the kilometre reading recalculates upcoming maintenance schedules and alerts.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsKmModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update KM
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 4: Full Bike Profile View (Overview, Service History, Repair History) */}
      {viewBikeDetail && (
        <Modal
          isOpen={Boolean(viewBikeDetail)}
          onClose={() => setViewBikeDetail(null)}
          title={`Bike Profile: ${viewBikeDetail.regNo}`}
          size="lg"
        >
          {/* Header Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', color: '#fff', padding: '16px 20px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#356DF3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BikeIcon size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{viewBikeDetail.regNo}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{viewBikeDetail.brand} • {viewBikeDetail.model}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Odometer</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
                {(viewBikeDetail.currentKm || 0).toLocaleString()} KM
              </div>
            </div>
          </div>

          {/* Subtabs inside Modal */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              className={`tab-pill ${activeDetailTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveDetailTab('overview')}
            >
              Overview & Specs
            </button>
            <button
              type="button"
              className={`tab-pill ${activeDetailTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveDetailTab('services')}
            >
              Service History ({serviceRecords.filter(s => s.regNo === viewBikeDetail.regNo).length})
            </button>
            <button
              type="button"
              className={`tab-pill ${activeDetailTab === 'repairs' ? 'active' : ''}`}
              onClick={() => setActiveDetailTab('repairs')}
            >
              Repair History ({repairRecords.filter(r => r.regNo === viewBikeDetail.regNo).length})
            </button>
            <button
              type="button"
              className={`tab-pill ${activeDetailTab === 'fines' ? 'active' : ''}`}
              onClick={() => setActiveDetailTab('fines')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldAlert size={14} color={customerFines.filter(f => f.vehicleNo === viewBikeDetail.regNo && f.status === 'Unpaid').length > 0 ? '#ef4444' : '#64748b'} />
              Police Fines ({customerFines.filter(f => f.vehicleNo === viewBikeDetail.regNo).length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeDetailTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Owner Name</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{viewBikeDetail.ownerName || viewBikeDetail.customer}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Mobile Number</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{viewBikeDetail.ownerPhone || viewBikeDetail.phone}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Purchase Date</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{viewBikeDetail.purchaseDate || 'Not specified'}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Insurance Expiry Date</span>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{viewBikeDetail.insuranceExpiryDate || 'Not recorded'}</strong>
                </div>
              </div>

              {/* Maintenance Benchmark Card */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                  Upcoming Maintenance Target
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                  <div>Next Service Date: <strong>{viewBikeDetail.nextServiceDate || 'Pending calculation'}</strong></div>
                  <div>Next Service KM: <strong>{(viewBikeDetail.nextServiceKm || 0).toLocaleString()} km</strong></div>
                  <div>Last Serviced On: <strong>{viewBikeDetail.lastServiceDate || 'None'}</strong></div>
                  <div>Last Service KM: <strong>{(viewBikeDetail.lastServiceKm || 0).toLocaleString()} km</strong></div>
                </div>
              </div>

              {viewBikeDetail.notes && (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Workshop Notes:</span>
                  <span>{viewBikeDetail.notes}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICE HISTORY */}
          {activeDetailTab === 'services' && (
            <div>
              {serviceRecords.filter(s => s.regNo === viewBikeDetail.regNo).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                  No service records logged for this bike yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {serviceRecords
                    .filter(s => s.regNo === viewBikeDetail.regNo)
                    .map(srv => (
                      <div key={srv.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{srv.serviceType}</span>
                          <span style={{ fontWeight: 800, color: '#059669' }}>₹{(srv.serviceCost || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '16px', marginBottom: '6px' }}>
                          <span>Date: <strong>{srv.serviceDate}</strong></span>
                          <span>KM: <strong>{(srv.serviceKm || 0).toLocaleString()} km</strong></span>
                          <span>Tech: <strong>{srv.technician}</strong></span>
                        </div>
                        {srv.notes && (
                          <div style={{ fontSize: '12px', color: '#475569', background: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                            {srv.notes}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPAIR HISTORY */}
          {activeDetailTab === 'repairs' && (
            <div>
              {repairRecords.filter(r => r.regNo === viewBikeDetail.regNo).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                  No repair records logged for this bike yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {repairRecords
                    .filter(r => r.regNo === viewBikeDetail.regNo)
                    .map(rep => (
                      <div key={rep.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{rep.repairDetails}</span>
                          <span style={{ fontWeight: 800, color: '#dc2626' }}>₹{(rep.totalCost || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '16px', marginBottom: '8px' }}>
                          <span>Date: <strong>{rep.repairDate}</strong></span>
                          <span>KM: <strong>{(rep.repairKm || 0).toLocaleString()} km</strong></span>
                          <span>Tech: <strong>{rep.technician}</strong></span>
                        </div>

                        {/* Parts Table */}
                        {rep.partsReplaced && rep.partsReplaced.length > 0 && (
                          <div style={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '8px 12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>PARTS REPLACED:</div>
                            {rep.partsReplaced.map((p, pIdx) => (
                              <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', padding: '2px 0' }}>
                                <span>{p.partName} (x{p.quantity || 1})</span>
                                <span>₹{(p.total || p.unitCost * (p.quantity || 1)).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* TAB 4: POLICE FINES & E-CHALLANS */}
          {activeDetailTab === 'fines' && (
            <div>
              {customerFines.filter(f => f.vehicleNo === viewBikeDetail.regNo).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <CheckCircle2 size={28} color="#16a34a" />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#15803d', margin: '0 0 4px 0' }}>
                    Zero Traffic Violations on Record
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#166534', margin: 0 }}>
                    Vehicle {viewBikeDetail.regNo} has a completely clean record with no pending police fines or e-challans.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Summary Bar */}
                  {(() => {
                    const bFines = customerFines.filter(f => f.vehicleNo === viewBikeDetail.regNo);
                    const bUnpaid = bFines.filter(f => f.status === 'Unpaid');
                    const bUnpaidTotal = bUnpaid.reduce((s, f) => s + (Number(f.amount) || 0), 0);
                    return (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: bUnpaid.length > 0 ? '#fff1f2' : '#f0fdf4',
                        border: bUnpaid.length > 0 ? '1px solid #fecdd3' : '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '12px 16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: bUnpaid.length > 0 ? '#9f1239' : '#15803d' }}>
                            {bUnpaid.length > 0 ? `${bUnpaid.length} Unpaid Traffic Violation(s)` : 'All Fines Settled'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: bUnpaid.length > 0 ? '#be123c' : '#166534' }}>
                            {bUnpaid.length > 0 ? `Total penalty due: ₹${bUnpaidTotal.toLocaleString()}` : 'No outstanding liabilities'}
                          </div>
                        </div>
                        <a 
                          href="/admin/fines" 
                          style={{ fontSize: '12px', fontWeight: 700, color: '#356DF3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          View in Fines Hub →
                        </a>
                      </div>
                    );
                  })()}

                  {/* Fines List */}
                  {customerFines
                    .filter(f => f.vehicleNo === viewBikeDetail.regNo)
                    .map(fine => {
                      const isUnpaid = fine.status === 'Unpaid';
                      return (
                        <div 
                          key={fine.id} 
                          style={{
                            background: isUnpaid ? '#fffbfb' : '#f8fafc',
                            border: isUnpaid ? '1px solid #fecdd3' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: isUnpaid ? '#dc2626' : '#16a34a',
                                background: isUnpaid ? '#fee2e2' : '#dcfce7',
                                padding: '2px 8px',
                                borderRadius: '5px',
                                fontFamily: 'monospace'
                              }}>
                                {fine.challanNo}
                              </span>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px', marginTop: '4px' }}>
                                {fine.offense}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '16px', fontWeight: 900, color: isUnpaid ? '#dc2626' : '#16a34a' }}>
                                ₹{(Number(fine.amount) || 0).toLocaleString()}
                              </span>
                              <div style={{ fontSize: '10.5px', color: isUnpaid ? '#e11d48' : '#15803d', fontWeight: 700 }}>
                                {isUnpaid ? 'PENDING' : 'SETTLED'}
                              </div>
                            </div>
                          </div>

                          <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span>📍 {fine.location}</span>
                            <span>🕒 {fine.dateTime}</span>
                            <span>🏛️ {fine.issuingAuthority}</span>
                          </div>

                          {fine.paidOn ? (
                            <div style={{ fontSize: '11.5px', color: '#15803d', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>
                              ✓ Settled on {fine.paidOn} • Ref: {fine.paymentRef}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #fecdd3', paddingTop: '8px', marginTop: '6px' }}>
                              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>Due: {fine.dueDate || 'Immediate'}</span>
                              <button
                                type="button"
                                className="btn-primary"
                                style={{ padding: '5px 12px', fontSize: '11.5px', background: '#dc2626', borderColor: '#dc2626' }}
                                onClick={() => {
                                  payFine(fine.id, `COUNTER-CASH-${Date.now().toString().slice(-6)}`);
                                  setToastMessage(`Fine of ₹${fine.amount} for Challan #${fine.challanNo} marked as settled!`);
                                  setTimeout(() => setToastMessage(''), 4000);
                                }}
                              >
                                Mark as Paid
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn-primary" onClick={() => setViewBikeDetail(null)}>
              Close Profile
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

