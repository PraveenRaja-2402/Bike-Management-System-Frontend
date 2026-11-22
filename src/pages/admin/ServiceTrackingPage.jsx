import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Bike as BikeIcon, 
  FileText, 
  Printer, 
  Eye, 
  Trash2, 
  Droplet, 
  Disc, 
  Wind, 
  Link as LinkIcon, 
  Battery, 
  CircleDot, 
  Settings2, 
  Sparkles,
  MessageCircle,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export default function ServiceTrackingPage() {
  const { 
    bikesList, 
    serviceRecords, 
    addServiceRecord, 
    deleteServiceRecord, 
    serviceIntervals,
    branding,
    sendCustomerWhatsApp
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [bikeFilter, setBikeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [viewServiceReceipt, setViewServiceReceipt] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // New Service Record Form State (Requirement 2)
  const [selectedBikeId, setSelectedBikeId] = useState(bikesList[0]?.id || '');
  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    serviceKm: bikesList[0]?.currentKm || 15000,
    serviceCost: 1250,
    serviceType: 'General Periodic Service',
    technician: 'Mani',
    notes: 'Engine oil flushed and refilled. Chain cleaned and lubed.',
    nextServiceDate: '',
    nextServiceKm: '',
    items: {
      engineOil: true,
      brakeOil: true,
      airFilter: false,
      chainMaintenance: true,
      battery: true,
      tyres: false,
      clutch: true,
      generalServicing: true
    }
  });

  // Calculate default next service benchmarks whenever bike or serviceKm changes
  const calculateBenchmarks = (currentKmVal, serviceDateVal) => {
    const kmNum = parseInt(currentKmVal, 10) || 0;
    const intervalKm = parseInt(serviceIntervals.generalServiceKm, 10) || 3000;
    const nextKm = kmNum + intervalKm;

    const d = new Date(serviceDateVal || new Date());
    d.setDate(d.getDate() + 90);
    const nextDate = d.toISOString().split('T')[0];

    return { nextKm, nextDate };
  };

  const handleOpenLogModal = () => {
    const targetBike = bikesList[0] || {};
    const km = targetBike.currentKm || 15000;
    const benchmarks = calculateBenchmarks(km, new Date().toISOString().split('T')[0]);

    setSelectedBikeId(targetBike.id || '');
    setFormData({
      serviceDate: new Date().toISOString().split('T')[0],
      serviceKm: km,
      serviceCost: 1250,
      serviceType: 'General Periodic Service',
      technician: 'Mani',
      notes: 'Scheduled periodic inspection and oil service.',
      nextServiceDate: benchmarks.nextDate,
      nextServiceKm: benchmarks.nextKm,
      items: {
        engineOil: true,
        brakeOil: true,
        airFilter: false,
        chainMaintenance: true,
        battery: true,
        tyres: false,
        clutch: true,
        generalServicing: true
      }
    });
    setIsLogModalOpen(true);
  };

  const handleBikeChange = (bikeId) => {
    setSelectedBikeId(bikeId);
    const targetBike = bikesList.find(b => b.id === bikeId);
    if (targetBike) {
      const km = targetBike.currentKm || 0;
      const benchmarks = calculateBenchmarks(km, formData.serviceDate);
      setFormData(prev => ({
        ...prev,
        serviceKm: km,
        nextServiceKm: benchmarks.nextKm,
        nextServiceDate: benchmarks.nextDate
      }));
    }
  };

  const handleItemToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: !prev.items[key]
      }
    }));
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const targetBike = bikesList.find(b => b.id === selectedBikeId) || bikesList[0];
    if (!targetBike) return;

    addServiceRecord({
      bikeId: targetBike.id,
      regNo: targetBike.regNo,
      ownerName: targetBike.ownerName || targetBike.customer,
      ownerPhone: targetBike.ownerPhone || targetBike.phone,
      serviceDate: formData.serviceDate,
      serviceKm: parseInt(formData.serviceKm, 10),
      serviceCost: parseFloat(formData.serviceCost),
      serviceType: formData.serviceType,
      technician: formData.technician,
      items: formData.items,
      notes: formData.notes,
      nextServiceDate: formData.nextServiceDate,
      nextServiceKm: parseInt(formData.nextServiceKm, 10)
    });

    setIsLogModalOpen(false);
    setToastMessage(`Service record logged for ${targetBike.regNo} successfully! Next service benchmark set.`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleDeleteRecord = (srv) => {
    if (window.confirm(`Delete service record ${srv.id} for ${srv.regNo}?`)) {
      deleteServiceRecord(srv.id);
      setToastMessage(`Record ${srv.id} deleted.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const filteredRecords = serviceRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (r.regNo || '').toLowerCase().includes(q) ||
      (r.ownerName || '').toLowerCase().includes(q) ||
      (r.serviceType || '').toLowerCase().includes(q) ||
      (r.technician || '').toLowerCase().includes(q);

    const matchesBike = bikeFilter === 'All' || r.regNo === bikeFilter;
    const matchesType = typeFilter === 'All' || r.serviceType === typeFilter;

    return matchesSearch && matchesBike && matchesType;
  });

  const totalRevenue = serviceRecords.reduce((sum, r) => sum + (parseFloat(r.serviceCost) || 0), 0);

  return (
    <div className="service-tracking-page">
      {/* Toast Alert */}
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

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #356DF3' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Services Logged</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {serviceRecords.length}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
            ✓ Across all registered bikes
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Service Revenue</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Workshop maintenance billing
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Engine Oil Services</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {serviceRecords.filter(r => r.items?.engineOil).length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Lubricant replacements
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Active Technicians</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
            3 Available
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Mani, Anitha, Karthik
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <Wrench size={20} color="#356DF3" />
            <span>Service Tracking & Maintenance Logs (Requirement 2)</span>
          </div>
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleOpenLogModal}
          >
            <Plus size={16} /> Log New Service
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

            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Service Types</option>
              <option value="General Periodic Service">General Periodic Service</option>
              <option value="Routine Scooter Service">Routine Scooter Service</option>
              <option value="Full General Maintenance">Full General Maintenance</option>
              <option value="High-Performance Service">High-Performance Service</option>
              <option value="Brake Service">Brake Service</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search Reg No, Owner, Service, Tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Service Records Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Service Date</th>
                <th>Bike Reg No</th>
                <th>Owner Details</th>
                <th>Service KM</th>
                <th>Checklist Items Serviced</th>
                <th>Service Cost</th>
                <th>Next Service Benchmark</th>
                <th>Technician</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((srv, idx) => (
                <tr key={srv.id || idx}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{srv.serviceDate}</div>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>ID: {srv.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{srv.regNo}</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{srv.serviceType}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{srv.ownerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{srv.ownerPhone}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                      {(srv.serviceKm || 0).toLocaleString()} km
                    </span>
                  </td>
                  <td>
                    {/* Maintenance Items Pill Checklist */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '280px' }}>
                      {srv.items?.engineOil && (
                        <span style={{ background: '#dbeafe', color: '#2957CC', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Oil
                        </span>
                      )}
                      {srv.items?.brakeOil && (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Brakes
                        </span>
                      )}
                      {srv.items?.airFilter && (
                        <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Air Filter
                        </span>
                      )}
                      {srv.items?.chainMaintenance && (
                        <span style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Chain
                        </span>
                      )}
                      {srv.items?.battery && (
                        <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Battery
                        </span>
                      )}
                      {srv.items?.tyres && (
                        <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Tyres
                        </span>
                      )}
                      {srv.items?.clutch && (
                        <span style={{ background: '#ffedd5', color: '#c2410c', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Clutch
                        </span>
                      )}
                      {srv.items?.generalServicing && (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          General
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>
                      ₹{(srv.serviceCost || 0).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
                      {srv.nextServiceDate || 'Pending'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      @ {(srv.nextServiceKm || 0).toLocaleString()} km
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                      {srv.technician || 'Mani'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-outline-blue btn-sm"
                        onClick={() => setViewServiceReceipt(srv)}
                        title="View & Print Service Receipt"
                      >
                        <Eye size={13} /> Invoice
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        style={{ padding: '4px 7px' }}
                        onClick={() => handleDeleteRecord(srv)}
                        title="Delete service record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No service records match your filter criteria. Click "Log New Service" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredRecords.length} of {serviceRecords.length} service records</span>
        </div>
      </div>

      {/* MODAL: Log New Bike Service (Requirement 2) */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Bike Maintenance & Service"
        size="md"
      >
        <form onSubmit={handleSaveService}>
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
              <label className="form-label">Service Date *</label>
              <input
                type="date"
                className="form-input no-left-icon"
                required
                value={formData.serviceDate}
                onChange={(e) => {
                  const d = e.target.value;
                  const benchmarks = calculateBenchmarks(formData.serviceKm, d);
                  setFormData({
                    ...formData,
                    serviceDate: d,
                    nextServiceDate: benchmarks.nextDate
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Service Kilometre Reading *</label>
              <input
                type="number"
                className="form-input no-left-icon"
                required
                value={formData.serviceKm}
                onChange={(e) => {
                  const km = e.target.value;
                  const benchmarks = calculateBenchmarks(km, formData.serviceDate);
                  setFormData({
                    ...formData,
                    serviceKm: km,
                    nextServiceKm: benchmarks.nextKm
                  });
                }}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Service Cost (₹) *</label>
              <input
                type="number"
                className="form-input no-left-icon"
                required
                min="0"
                value={formData.serviceCost}
                onChange={(e) => setFormData({ ...formData, serviceCost: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Technician Assigned</label>
              <select
                className="form-input no-left-icon"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              >
                <option value="Mani">Mani (Master Technician)</option>
                <option value="Anitha">Anitha (Diagnostics & Electrical)</option>
                <option value="Karthik">Karthik (Engine Specialist)</option>
              </select>
            </div>
          </div>

          {/* Individual Maintenance Items Checklist (Requirement 2) */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={14} color="#356DF3" />
              <span>Specific Maintenance Items Checked & Serviced:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              {[
                { key: 'engineOil', label: 'Engine Oil Replacement' },
                { key: 'brakeOil', label: 'Brake Oil & Pad Inspection' },
                { key: 'airFilter', label: 'Air Filter Cleaning / Replace' },
                { key: 'chainMaintenance', label: 'Chain Cleaning & Lube' },
                { key: 'battery', label: 'Battery Health & Terminal Check' },
                { key: 'tyres', label: 'Tyre Pressure & Tread Check' },
                { key: 'clutch', label: 'Clutch Adjustment / Cable Lube' },
                { key: 'generalServicing', label: 'General Wash & Nut-Bolt Tightening' }
              ].map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={formData.items[item.key] || false}
                    onChange={() => handleItemToggle(item.key)}
                    style={{ accentColor: '#356DF3', width: '16px', height: '16px' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Benchmark Targets */}
          <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bfdbfe', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
              Automated Next Service Forecast
            </div>
            <div className="form-grid-2">
              <div>
                <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '3px' }}>Next Service Date *</label>
                <input
                  type="date"
                  className="form-input no-left-icon"
                  required
                  value={formData.nextServiceDate}
                  onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '3px' }}>Next Service KM *</label>
                <input
                  type="number"
                  className="form-input no-left-icon"
                  required
                  value={formData.nextServiceKm}
                  onChange={(e) => setFormData({ ...formData, nextServiceKm: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Notes & Findings</label>
            <textarea
              className="form-input no-left-icon"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Clean spark plug, chain slack 25mm, engine purring smoothly"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Service Record
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: View Service Receipt & Printable Invoice */}
      {viewServiceReceipt && (
        <Modal
          isOpen={Boolean(viewServiceReceipt)}
          onClose={() => setViewServiceReceipt(null)}
          title={`Service Receipt - ${viewServiceReceipt.id}`}
          size="md"
        >
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {/* Invoice Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{branding.companyName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Salem Central Workshop • 📞 {branding.supportPhone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#356DF3' }}>INVOICE #{viewServiceReceipt.id}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {viewServiceReceipt.serviceDate}</div>
              </div>
            </div>

            {/* Customer & Bike Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px', marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ color: '#64748b' }}>Customer:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{viewServiceReceipt.ownerName}</strong>
                <span>Phone: {viewServiceReceipt.ownerPhone}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Bike Reg:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{viewServiceReceipt.regNo}</strong>
                <span>Odometer: {(viewServiceReceipt.serviceKm || 0).toLocaleString()} km</span>
              </div>
            </div>

            {/* Items Done */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Completed Maintenance Items:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.entries(viewServiceReceipt.items || {}).filter(([_, v]) => v).map(([k]) => (
                  <span key={k} style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    ✓ {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#ffffff', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Total Amount Paid:</span>
              <span style={{ fontWeight: 900, fontSize: '18px', color: '#38bdf8' }}>₹{(viewServiceReceipt.serviceCost || 0).toLocaleString()}</span>
            </div>

            {/* Next Service Box */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#1e40af' }}>
              Next Scheduled Maintenance: <strong>{viewServiceReceipt.nextServiceDate}</strong> or at <strong>{(viewServiceReceipt.nextServiceKm || 0).toLocaleString()} KM</strong>.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.print()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} /> Print Receipt
            </button>

            <button type="button" className="btn-primary" onClick={() => setViewServiceReceipt(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

