import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  UserPlus, 
  Phone, 
  Mail, 
  Shield, 
  Edit2, 
  Trash2, 
  Building2, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Crown,
  Palette,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

export default function AdminManagementPage() {
  const navigate = useNavigate();
  const { currentRole, switchRole, adminsList, addAdmin, updateAdmin, deleteAdmin, storesList } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    assignedBranch: 'Salem Central Mega Hub',
    status: 'Active',
    permissions: ['User Creation', 'Job Cards']
  });

  const availablePermissions = [
    'User Creation',
    'Job Cards',
    'Service Dispatch',
    'Customer Accounts',
    'Live Tracking',
    'Financials & Invoicing'
  ];

  const handleTogglePermission = (perm) => {
    if (formData.permissions.includes(perm)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== perm)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, perm]
      });
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Admin',
      assignedBranch: storesList[0]?.name || 'Salem Central Mega Hub',
      status: 'Active',
      permissions: ['User Creation', 'Job Cards']
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      assignedBranch: admin.assignedBranch,
      status: admin.status,
      permissions: admin.permissions || ['User Creation', 'Job Cards']
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addAdmin(formData);
    setIsAddModalOpen(false);
    setSuccessToast(`Admin account "${formData.name}" created successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateAdmin(selectedAdmin.id, formData);
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setSuccessToast(`Admin "${formData.name}" updated successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = (admin) => {
    if (admin.role === 'Super Admin') {
      alert('Root Super Admin account cannot be deleted!');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${admin.name}?`)) {
      deleteAdmin(admin.id);
      setSuccessToast(`Admin account for ${admin.name} removed.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const filteredAdmins = adminsList.filter((admin) => {
    const matchesBranch = branchFilter === 'All' || admin.assignedBranch === branchFilter;
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          admin.phone.includes(searchQuery) ||
                          admin.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="admin-management-page">
      {/* Super Admin Executive Command Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #EAECF0',
        borderRadius: '14px',
        padding: '18px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.08), 0px 1px 2px rgba(16, 24, 40, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B45309',
            border: '1px solid #FCD34D'
          }}>
            <Crown size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '17px', fontWeight: 700, color: '#101828', letterSpacing: '-0.3px' }}>
                Super Admin Console • Alexander Vance
              </span>
              <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                ROOT MASTER
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#667085', marginTop: '3px' }}>
              Managing Administrator Accounts, Salem Mega Workshop Hubs, and Dynamic Corporate Branding
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/stores')}
          >
            <Building2 size={13} color="#0284C7" /> Store Locations
          </button>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => navigate('/admin/branding')}
          >
            <Palette size={13} color="#F79009" /> Change Logo & Branding
          </button>
        </div>
      </div>
      {/* Super Admin Notice Banner if viewing as standard admin */}
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
              <strong>Super Admin Restricted Area:</strong> You are currently viewing as regular Admin. Switch to Super Admin to create or modify Admin credentials.
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

      {/* Top Super Admin Metric Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="sa-stat-card">
          <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#eff6ff', color: '#356DF3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Crown size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600 }}>Total Administrators</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>{adminsList.length}</div>
          </div>
        </div>

        <div className="sa-stat-card">
          <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600 }}>Active Super Admins</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>
              {adminsList.filter(a => a.role === 'Super Admin').length}
            </div>
          </div>
        </div>

        <div className="sa-stat-card">
          <div style={{ width: 46, height: 46, borderRadius: '12px', background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600 }}>Branches Managed</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>{storesList.length} Hubs</div>
          </div>
        </div>
      </div>

      <div className="table-card">
        {/* Controls Bar */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <select
              className="filter-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="All">All Assigned Branches</option>
              <option value="All Branches">All Branches (Global)</option>
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
                placeholder="Search admins by name, email, phone..."
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
              onClick={handleOpenAdd}
              disabled={currentRole !== 'super_admin'}
              title={currentRole !== 'super_admin' ? "Super Admin permission required" : "Add new administrator"}
            >
              <UserPlus size={16} /> Create Admin
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Administrator</th>
                <th>Contact</th>
                <th>Role & Access</th>
                <th>Assigned Branch</th>
                <th>Permissions</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, idx) => (
                <tr key={admin.id}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <div className="table-user-cell">
                      <div className="user-initial-avatar" style={{
                        background: admin.role === 'Super Admin' ? 'linear-gradient(135deg, #1e293b, #0f172a)' : '#356DF3',
                        color: admin.role === 'Super Admin' ? '#f59e0b' : '#ffffff'
                      }}>
                        {admin.role === 'Super Admin' ? '👑' : admin.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{admin.name}</span>
                          {admin.role === 'Super Admin' && (
                            <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              ROOT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Last login: {admin.lastLogin}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>{admin.phone}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{admin.email}</div>
                  </td>
                  <td>
                    <StatusBadge status={admin.role} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155' }}>
                      <Building2 size={14} color="#64748b" />
                      <span>{admin.assignedBranch}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                      {admin.permissions.map((p, i) => (
                        <span key={i} style={{
                          fontSize: '10px',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={admin.status} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        className="btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(admin)}
                        disabled={currentRole !== 'super_admin'}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      {admin.role !== 'Super Admin' && (
                        <button 
                          type="button" 
                          className="btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleDelete(admin)}
                          disabled={currentRole !== 'super_admin'}
                          title="Delete Admin"
                        >
                          <Trash2 size={13} />
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

      {/* Modal: Create Admin */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Administrator"
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
              placeholder="e.g. Vikram Raman"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Email Address (Login ID) *</label>
              <input
                type="email"
                className="form-input no-left-icon"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vikram.admin@bikeservice.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input no-left-icon"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9845112233"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Admin Role Level *</label>
              <select
                className="form-input no-left-icon"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Admin">Admin (Branch Operator)</option>
                <option value="Regional Manager">Regional Manager</option>
                <option value="Super Admin">Super Admin (Co-owner)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Branch *</label>
              <select
                className="form-input no-left-icon"
                value={formData.assignedBranch}
                onChange={(e) => setFormData({ ...formData, assignedBranch: e.target.value })}
              >
                <option value="All Branches">All Branches (Global)</option>
                {storesList.map(st => (
                  <option key={st.id} value={st.name}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Module Permissions</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {availablePermissions.map((perm) => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm)}
                    onChange={() => handleTogglePermission(perm)}
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Admin Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Admin */}
      {selectedAdmin && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Administrator - ${selectedAdmin.name}`}
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
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input no-left-icon"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-input no-left-icon"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Assigned Branch</label>
                <select
                  className="form-input no-left-icon"
                  value={formData.assignedBranch}
                  onChange={(e) => setFormData({ ...formData, assignedBranch: e.target.value })}
                >
                  <option value="All Branches">All Branches (Global)</option>
                  {storesList.map(st => (
                    <option key={st.id} value={st.name}>{st.name}</option>
                  ))}
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

            <div className="form-group">
              <label className="form-label">Module Permissions</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {availablePermissions.map((perm) => (
                  <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm)}
                      onChange={() => handleTogglePermission(perm)}
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Admin Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}


