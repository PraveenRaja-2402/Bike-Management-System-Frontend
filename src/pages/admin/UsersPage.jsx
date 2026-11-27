import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  Phone, 
  Mail, 
  Shield, 
  Edit2, 
  Trash2,
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Bike,
  Sparkles,
  Smartphone,
  Copy,
  ExternalLink,
  Check,
  UploadCloud,
  FileCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { mockCustomerVerifications } from '../../data/mockData';

export default function UsersPage() {
  const { currentRole, usersList, addUser, updateUser, deleteUser, bikesList } = useApp();

  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalUser, setViewModalUser] = useState(null);
  const [shareModalUser, setShareModalUser] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');
  // In-memory only KYC preview state (never stored in localStorage)
  const [kycState, setKycState] = useState(mockCustomerVerifications);

  const getCustomerKyc = (userId) => {
    return kycState[userId] || {
      aadhaar: { status: 'Not Submitted', maskedRef: '—', verifiedDate: '—', fileName: '' },
      pan: { status: 'Not Submitted', maskedRef: '—', verifiedDate: '—', fileName: '' },
      voterId: { status: 'Not Submitted', maskedRef: '—', verifiedDate: '—', fileName: '' }
    };
  };

  const handleMockDocUpload = (userId, docKey, file) => {
    if (!file) return;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const maskedMap = {
      aadhaar: 'XXXX-XXXX-0000 (Sample)',
      pan: 'XXXXX****X (Sample)',
      voterId: 'XX/00/****/000 (Sample)'
    };
    const current = getCustomerKyc(userId);
    setKycState({
      ...kycState,
      [userId]: {
        ...current,
        [docKey]: {
          status: 'Pending',
          maskedRef: maskedMap[docKey],
          verifiedDate: `Uploaded ${todayStr} (Pending Review)`,
          fileName: file.name
        }
      }
    });
    setSuccessToast(`Sample document "${file.name}" queued for ${docKey.toUpperCase()} review (not stored in LocalStorage).`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleKycStatusChange = (userId, docKey, newStatus) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const current = getCustomerKyc(userId);
    setKycState({
      ...kycState,
      [userId]: {
        ...current,
        [docKey]: {
          ...current[docKey],
          status: newStatus,
          verifiedDate: newStatus === 'Verified' ? todayStr : newStatus === 'Rejected' ? `${todayStr} (Rejected)` : newStatus === 'Pending' ? 'Pending Review' : '—'
        }
      }
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Customer',
    status: 'Active',
    assignedBike: bikesList[0]?.regNo || 'TN 30 AB 1234',
    pin: '1234',
    initialPoints: 250,
    newBikeReg: '',
    newBikeModel: '',
    newBikeBrand: 'Yamaha',
    newBikeKm: 1500
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.phone || '').includes(searchQuery) ||
                          (u.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleOpenAdd = (defaultRole = 'Customer') => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: defaultRole,
      status: 'Active',
      assignedBike: bikesList[0]?.regNo || 'TN 30 AB 1234',
      pin: '1234',
      initialPoints: defaultRole === 'Customer' ? 250 : 0,
      newBikeReg: '',
      newBikeModel: '',
      newBikeBrand: 'Yamaha',
      newBikeKm: 1500
    });
    setErrorToast('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      assignedBike: user.assignedBike || 'TN 30 AB 1234',
      pin: user.pin || '1234',
      initialPoints: user.membershipPoints || 250,
      newBikeReg: '',
      newBikeModel: '',
      newBikeBrand: 'Yamaha',
      newBikeKm: 1500
    });
    setErrorToast('');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    setErrorToast('');

    const cleanName = (formData.name || '').trim();
    const cleanPhone = (formData.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const cleanEmail = (formData.email || '').trim().toLowerCase();

    if (!cleanName) {
      setErrorToast('Please enter the customer full name.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorToast('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check duplicate phone
    const existingPhone = usersList.find(u => (u.phone || '').trim().replace(/[\s\-\+]/g, '').replace(/^91/, '') === cleanPhone);
    if (existingPhone) {
      setErrorToast(`Mobile number "${cleanPhone}" is already registered with "${existingPhone.name}" (${existingPhone.role}).`);
      return;
    }

    // Check duplicate email
    if (cleanEmail) {
      const existingEmail = usersList.find(u => (u.email || '').trim().toLowerCase() === cleanEmail);
      if (existingEmail) {
        setErrorToast(`Email "${cleanEmail}" is already registered with "${existingEmail.name}".`);
        return;
      }
    }

    // Handle new bike creation if selected
    let finalAssignedBike = formData.assignedBike;
    let isNewBike = false;
    if (formData.role === 'Customer' && formData.assignedBike === '__NEW_BIKE__') {
      const reg = (formData.newBikeReg || '').trim().toUpperCase();
      if (!reg) {
        setErrorToast('Please enter the registration number for the new bike.');
        return;
      }
      finalAssignedBike = reg;
      isNewBike = true;
    }

    addUser({
      ...formData,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      assignedBike: finalAssignedBike,
      isNewBike,
      bikeModel: formData.newBikeModel || 'Motorcycle',
      bikeBrand: formData.newBikeBrand || 'Other',
      bikeKm: formData.newBikeKm || 1000
    });

    setIsAddModalOpen(false);
    setSuccessToast(`New ${formData.role} account created successfully for "${cleanName}"!`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateUser(selectedUser.id, formData);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setSuccessToast(`User profile for "${formData.name}" updated!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      deleteUser(user.id);
      setSuccessToast(`User ${user.name} removed from system.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  return (
    <div className="users-page">
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

      {errorToast && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          color: '#dc2626',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px',
          fontWeight: 600
        }}>
          <AlertCircle size={18} color="#dc2626" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Admin Action Highlight: User Creation Quick Launcher */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#eff6ff', color: '#356DF3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Admin User Creation Center</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Provision customer portal accounts, workshop technicians, and service advisors</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-outline-blue"
            onClick={() => handleOpenAdd('Technician')}
          >
            + Add Technician
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleOpenAdd('Customer')}
          >
            <UserPlus size={16} /> Create Customer Account
          </button>
        </div>
      </div>

      <div className="table-card">
        {/* Controls Bar matching Design 2 */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Technician">Technician</option>
              <option value="Service Manager">Service Manager</option>
              <option value="Administrator">Administrator</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, phone, email or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>

            <button type="button" className="btn-primary" onClick={() => handleOpenAdd('Customer')}>
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Name & User</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Membership Points</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => {
                const isCustomer = user.role === 'Customer';
                const points = isCustomer ? (user.membershipPoints ?? 250) : null;
                const tier = points >= 1000 ? 'Platinum' : points >= 500 ? 'Gold' : 'Silver';

                return (
                  <tr key={user.id}>
                    <td style={{ color: '#64748b' }}>{idx + 1}</td>
                    <td>
                      <div className="table-user-cell">
                        <div className="user-initial-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, display: 'block', color: '#0f172a' }}>{user.name}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: USR-0{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{user.phone}</td>
                    <td style={{ color: '#64748b' }}>{user.email}</td>
                    <td>
                      <StatusBadge status={user.role} />
                    </td>
                    <td>
                      {isCustomer ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: points >= 1000 ? '#e0e7ff' : points >= 500 ? '#fef3c7' : '#f1f5f9', color: points >= 1000 ? '#3730a3' : points >= 500 ? '#b45309' : '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                          <Award size={13} />
                          <span>{points.toLocaleString()} Pts ({tier})</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Staff Account</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={user.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end', display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                        {isCustomer && (
                          <button 
                            type="button" 
                            className="btn-outline-green btn-sm"
                            onClick={() => {
                              setShareModalUser(user);
                              setCopiedInvite(false);
                            }}
                            title="Share Customer Mobile App link and login credentials"
                          >
                            <Smartphone size={13} />
                            <span>Mobile Access</span>
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="btn-outline-blue btn-sm"
                          onClick={() => setViewModalUser(user)}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        <button 
                          type="button" 
                          className="btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(user)}
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user)}
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredUsers.length} of {usersList.length} users</span>
          <div className="pagination-controls">
            <button type="button" className="page-btn" disabled>&lt;</button>
            <button type="button" className="page-btn active">1</button>
            <button type="button" className="page-btn" disabled>&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal: Add User (Admin User Creation) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Admin User Creation • Provision Account"
        size="md"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input no-left-icon"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9843212345"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input no-left-icon"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@gmail.com"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">System Role *</label>
              <select
                className="form-input no-left-icon"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Customer">Customer (Vehicle Owner)</option>
                <option value="Technician">Technician (Workshop Engineer)</option>
                <option value="Service Manager">Service Manager (Bay Supervisor)</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Account Status</label>
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

          {formData.role === 'Customer' && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>Customer Loyalty & Mobile App Credentials</span>
              </div>
              <div className="form-grid-2">
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Welcome Membership Bonus</label>
                  <input
                    type="number"
                    className="form-input no-left-icon"
                    value={formData.initialPoints}
                    onChange={(e) => setFormData({ ...formData, initialPoints: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Assigned Bike Reg</label>
                  <select
                    className="form-input no-left-icon"
                    value={formData.assignedBike}
                    onChange={(e) => setFormData({ ...formData, assignedBike: e.target.value })}
                  >
                    <optgroup label="Select Existing Registered Bike">
                      {bikesList.map(b => (
                        <option key={b.id} value={b.regNo}>{b.regNo} — {b.model} (Owner: {b.ownerName || b.customer || 'Unassigned'})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Or Register Brand New Vehicle">
                      <option value="__NEW_BIKE__">+ Register a Brand New Bike for this Customer...</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {formData.assignedBike === '__NEW_BIKE__' && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px', marginTop: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bike size={14} color="#356DF3" />
                    <span>New Vehicle Registration (Will automatically reflect in Bike Registry)</span>
                  </div>
                  <div className="form-grid-2">
                    <div>
                      <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>Bike Reg Number *</label>
                      <input
                        type="text"
                        className="form-input no-left-icon"
                        placeholder="e.g. TN 30 CD 9988"
                        value={formData.newBikeReg || ''}
                        onChange={(e) => setFormData({ ...formData, newBikeReg: e.target.value.toUpperCase() })}
                        required={formData.assignedBike === '__NEW_BIKE__'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>Model Name</label>
                      <input
                        type="text"
                        className="form-input no-left-icon"
                        placeholder="e.g. Yamaha MT-15 / Activa 6G"
                        value={formData.newBikeModel || ''}
                        onChange={(e) => setFormData({ ...formData, newBikeModel: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-grid-2" style={{ marginTop: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>Manufacturer Brand</label>
                      <select
                        className="form-input no-left-icon"
                        value={formData.newBikeBrand || 'Yamaha'}
                        onChange={(e) => setFormData({ ...formData, newBikeBrand: e.target.value })}
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
                    <div>
                      <label style={{ fontSize: '11px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>Current Odometer (KM)</label>
                      <input
                        type="number"
                        className="form-input no-left-icon"
                        placeholder="e.g. 1500"
                        value={formData.newBikeKm || 1500}
                        onChange={(e) => setFormData({ ...formData, newBikeKm: parseInt(e.target.value, 10) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '10px' }}>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Mobile App Security PIN (4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="form-input no-left-icon"
                  value={formData.pin || '1234'}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="1234"
                />
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '8px 10px', marginTop: '10px', fontSize: '11.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={14} style={{ flexShrink: 0 }} />
                <span>
                  The customer will use this Phone Number and PIN to log in to their separate mobile web app at <strong>/customer</strong>.
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create User Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit User */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit User - ${selectedUser.name}`}
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input no-left-icon"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input no-left-icon"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input no-left-icon"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input no-left-icon"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Customer">Customer</option>
                  <option value="Technician">Technician</option>
                  <option value="Service Manager">Service Manager</option>
                  <option value="Administrator">Administrator</option>
                </select>
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

            {formData.role === 'Customer' && (
              <div className="form-group">
                <label className="form-label">Assigned Bike Reg</label>
                <select
                  className="form-input no-left-icon"
                  value={formData.assignedBike}
                  onChange={(e) => setFormData({ ...formData, assignedBike: e.target.value })}
                >
                  {bikesList.map(b => (
                    <option key={b.id} value={b.regNo}>{b.regNo} — {b.model} (Owner: {b.ownerName || b.customer || 'Unassigned'})</option>
                  ))}
                </select>
              </div>
            )}

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

      {/* Modal: View User */}
      {viewModalUser && (
        <Modal
          isOpen={Boolean(viewModalUser)}
          onClose={() => setViewModalUser(null)}
          title="User Profile & Identity Verification"
          size={viewModalUser.role === 'Customer' ? 'lg' : 'md'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div className="user-initial-avatar" style={{ width: 48, height: 48, fontSize: '20px' }}>
              {viewModalUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{viewModalUser.name}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Registered: {viewModalUser.registeredDate || '2026'}</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div>Phone: <strong>{viewModalUser.phone}</strong></div>
            <div>Email: <strong>{viewModalUser.email}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Role: <StatusBadge status={viewModalUser.role} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Status: <StatusBadge status={viewModalUser.status} />
            </div>
            {viewModalUser.role === 'Customer' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Linked Bike: <strong style={{ color: '#0f172a' }}>{viewModalUser.assignedBike || 'None Assigned'}</strong>
                  {(() => {
                    const linked = bikesList.find(b => (b.regNo || '').toUpperCase() === (viewModalUser.assignedBike || '').toUpperCase());
                    return linked ? <span style={{ color: '#64748b' }}>({linked.brand} {linked.model} • {(linked.currentKm || 0).toLocaleString()} km)</span> : null;
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Membership Points: 
                  <strong style={{ color: '#d97706' }}>
                    {(viewModalUser.membershipPoints ?? 250).toLocaleString()} Points ({
                      (viewModalUser.membershipPoints ?? 250) >= 1000 ? 'Platinum Tier' : (viewModalUser.membershipPoints ?? 250) >= 500 ? 'Gold Tier' : 'Silver Tier'
                    })
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* Customer Identity Verification Section (Sample UI - No Real IDs Stored) */}
          {viewModalUser.role === 'Customer' && (
            <div style={{ marginTop: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={17} color="#356DF3" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>Customer Identity Verification (KYC Preview)</strong>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '9999px' }}>
                  Sample Placeholder UI
                </span>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#1e40af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} style={{ flexShrink: 0 }} />
                <span>Frontend UI preview only. Real identity numbers and document images are not stored in LocalStorage and will connect to secure backend storage.</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { key: 'aadhaar', label: 'Aadhaar Card' },
                  { key: 'pan', label: 'PAN Card' },
                  { key: 'voterId', label: 'Voter ID' }
                ].map(({ key, label }) => {
                  const doc = getCustomerKyc(viewModalUser.id)[key];
                  const statusColor =
                    doc.status === 'Verified' ? { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' } :
                    doc.status === 'Pending' ? { bg: '#fffbeb', text: '#d97706', border: '#fde68a' } :
                    doc.status === 'Rejected' ? { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' } :
                    { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };

                  return (
                    <div key={key} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{label}</strong>
                        <span style={{
                          fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px',
                          background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`
                        }}>
                          {doc.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '11.5px', color: '#475569' }}>
                        <div>Masked Ref: <code style={{ fontWeight: 700, color: '#0f172a' }}>{doc.maskedRef}</code></div>
                        <div>Date: <strong>{doc.verifiedDate}</strong></div>
                        {doc.fileName && <div style={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>File: {doc.fileName}</div>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                        <label style={{
                          flex: 1, fontSize: '11px', fontWeight: 700, color: '#356DF3', background: '#eff6ff',
                          padding: '5px 8px', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}>
                          <UploadCloud size={12} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            style={{ display: 'none' }}
                            onChange={(e) => handleMockDocUpload(viewModalUser.id, key, e.target.files?.[0])}
                          />
                        </label>
                        <select
                          value={doc.status}
                          onChange={(e) => handleKycStatusChange(viewModalUser.id, key, e.target.value)}
                          style={{ fontSize: '11px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155' }}
                          title="Preview verification status"
                        >
                          <option value="Not Submitted">Not Submitted</option>
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button type="button" className="btn-primary" onClick={() => setViewModalUser(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Share Customer Mobile App Credentials */}
      {shareModalUser && (
        <Modal
          isOpen={Boolean(shareModalUser)}
          onClose={() => setShareModalUser(null)}
          title={`Customer Mobile App Access: ${shareModalUser.name}`}
        >
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Smartphone size={18} color="#356DF3" />
              <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>Separate Rider Mobile Application</strong>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              The customer can open this dedicated, responsive mobile web app on their personal smartphone to track their bike, check service records, and view trip playback.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                SEPARATE CUSTOMER URL:
              </span>
              <code style={{ fontSize: '13px', color: '#2957CC', fontWeight: 800, wordBreak: 'break-all' }}>
                {window.location.origin}/customer
              </code>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Login Mobile Number</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{shareModalUser.phone}</strong>
              </div>
              <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Security PIN</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{shareModalUser.pin || '1234'}</strong>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Linked Vehicle</span>
              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{shareModalUser.assignedBike || 'TN 30 AB 1234'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
            <a
              href="/customer"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', textDecoration: 'none' }}
            >
              <ExternalLink size={13} /> Open Mobile URL
            </a>

            <button
              type="button"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                const msg = `Hi ${shareModalUser.name}, you can now track your bike and service history on our mobile app! URL: ${window.location.origin}/customer | Phone: ${shareModalUser.phone} | PIN: ${shareModalUser.pin || '1234'}`;
                navigator.clipboard.writeText(msg);
                setCopiedInvite(true);
                setTimeout(() => setCopiedInvite(false), 3000);
              }}
            >
              {copiedInvite ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedInvite ? 'Copied Invitation!' : 'Copy Mobile Invite'}</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

