import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Wrench, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';

export default function StoreLocationsPage() {
  const { currentRole, switchRole, storesList, addStore, updateStore, deleteStore } = useApp();

  const [selectedStore, setSelectedStore] = useState(storesList[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    manager: '',
    lat: 11.6643,
    lng: 78.1460,
    serviceBays: 6,
    operatingHours: '08:30 AM - 08:00 PM (Mon-Sat)',
    status: 'Active',
    geofenceRadiusMeters: 400,
    availableTechnicians: 4
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      manager: '',
      lat: 11.6643,
      lng: 78.1460,
      serviceBays: 6,
      operatingHours: '08:30 AM - 08:00 PM (Mon-Sat)',
      status: 'Active',
      geofenceRadiusMeters: 400,
      availableTechnicians: 4
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      manager: store.manager,
      lat: store.lat,
      lng: store.lng,
      serviceBays: store.serviceBays,
      operatingHours: store.operatingHours,
      status: store.status,
      geofenceRadiusMeters: store.geofenceRadiusMeters,
      availableTechnicians: store.availableTechnicians
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newStore = addStore(formData);
    setSelectedStore(newStore);
    setIsAddModalOpen(false);
    setSuccessToast(`Store location "${formData.name}" added successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateStore(editingStore.id, formData);
    setIsEditModalOpen(false);
    setEditingStore(null);
    setSuccessToast(`Store details for "${formData.name}" updated!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = (store) => {
    if (storesList.length <= 1) {
      alert('You must have at least one active store location in the system.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${store.name}?`)) {
      deleteStore(store.id);
      setSelectedStore(storesList.find(s => s.id !== store.id));
      setSuccessToast(`Store "${store.name}" deleted.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  return (
    <div className="store-locations-page">
      {currentRole !== 'super_admin' && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          color: '#92400e',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <div>
              <strong>Super Admin Feature:</strong> Store / Service Hub locations management requires Super Admin access.
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => switchRole('super_admin')}
          >
            Switch to Super Admin
          </button>
        </div>
      )}

      {successToast && (
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
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
            Workshop & Store Locations ({storesList.length} Active Hubs)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Configure regional service workshops, service bays, GPS geofences and workshop leads
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleOpenAdd}
          disabled={currentRole !== 'super_admin'}
        >
          <Plus size={16} /> Add Store Location
        </button>
      </div>

      {/* Layout Grid: Store Cards + Interactive Map Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
        
        {/* Left: Store Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {storesList.map((store) => {
            const isSelected = selectedStore && selectedStore.id === store.id;

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="card"
                style={{
                  padding: '18px 20px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #356DF3' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 6px 18px rgba(37,99,235,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      background: isSelected ? '#356DF3' : '#eff6ff',
                      color: isSelected ? '#ffffff' : '#356DF3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Store size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{store.name}</div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Branch Code: <strong>{store.code}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={store.status} />
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      style={{ padding: '4px 8px' }}
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(store); }}
                      disabled={currentRole !== 'super_admin'}
                      title="Edit Store"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      style={{ padding: '4px 8px' }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(store); }}
                      disabled={currentRole !== 'super_admin'}
                      title="Delete Store"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>{store.address}</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  color: '#334155'
                }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Service Bays</span>
                    <strong>{store.serviceBays} Bays</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Branch Manager</span>
                    <strong>{store.manager}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Active Jobs</span>
                    <strong style={{ color: '#356DF3' }}>{store.activeJobsCount} in queue</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Store Telemetry & Geofence Viewer */}
        {selectedStore && (
          <div className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#356DF3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Branch Details & Geofence
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0', color: '#0f172a' }}>
                  {selectedStore.name}
                </h3>
              </div>
              <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                {selectedStore.status}
              </span>
            </div>

            {/* Quick stats chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>GPS Coordinates</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedStore.lat.toFixed(4)}° N, {selectedStore.lng.toFixed(4)}° E
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Geofence Radius</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#356DF3' }}>
                  {selectedStore.geofenceRadiusMeters} meters
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Phone & Dispatch</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {selectedStore.phone}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Available Techs</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>
                  {selectedStore.availableTechnicians} Technicians Online
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Operating Hours</div>
              <div style={{ fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="#356DF3" />
                <span>{selectedStore.operatingHours}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Street Address</div>
              <div style={{ fontSize: '13px', color: '#0f172a', background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px' }}>
                {selectedStore.address}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => handleOpenEdit(selectedStore)}
                disabled={currentRole !== 'super_admin'}
              >
                <Edit2 size={14} /> Edit Store Information
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Store */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Store / Service Center Branch"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Store / Workshop Name *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Salem Steel Plant Express Hub"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Address *</label>
            <textarea
              className="form-input no-left-icon"
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Door No, Street, Landmark, Salem - 636030"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0427-2667788"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Workshop Manager *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                required
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="Manager Name"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Latitude (GPS) *</label>
              <input
                type="number"
                step="0.0001"
                className="form-input no-left-icon"
                required
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude (GPS) *</label>
              <input
                type="number"
                step="0.0001"
                className="form-input no-left-icon"
                required
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Service Bays Capacity</label>
              <input
                type="number"
                min="1"
                max="20"
                className="form-input no-left-icon"
                value={formData.serviceBays}
                onChange={(e) => setFormData({ ...formData, serviceBays: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Geofence Radius (Meters)</label>
              <input
                type="number"
                min="100"
                max="2000"
                step="50"
                className="form-input no-left-icon"
                value={formData.geofenceRadiusMeters}
                onChange={(e) => setFormData({ ...formData, geofenceRadiusMeters: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Operating Hours</label>
            <input
              type="text"
              className="form-input no-left-icon"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Store Location
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Store */}
      {editingStore && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Store - ${editingStore.name}`}
          size="md"
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label className="form-label">Store / Workshop Name *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <textarea
                className="form-input no-left-icon"
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Contact Phone *</label>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Workshop Manager *</label>
                <input
                  type="text"
                  className="form-input no-left-icon"
                  required
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Service Bays Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="form-input no-left-icon"
                  value={formData.serviceBays}
                  onChange={(e) => setFormData({ ...formData, serviceBays: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input no-left-icon"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
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
    </div>
  );
}


