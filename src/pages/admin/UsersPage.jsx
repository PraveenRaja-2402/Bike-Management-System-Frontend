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
  Eye, 
  CheckCircle,
  X
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { mockUsers } from '../../data/mockData';

export default function UsersPage() {
  const [usersList, setUsersList] = useState(mockUsers);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalUser, setViewModalUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Customer',
    status: 'Active'
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery) ||
                          u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'Customer',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      registeredDate: '18 Sep 2026'
    };
    setUsersList([...usersList, newUser]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsersList(usersList.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="users-page">
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

            <button type="button" className="btn-primary" onClick={handleOpenAdd}>
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <div className="table-user-cell">
                      <div className="user-initial-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{user.phone}</td>
                  <td style={{ color: '#64748b' }}>{user.email}</td>
                  <td>
                    <StatusBadge status={user.role} />
                  </td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        className="btn-outline-blue"
                        onClick={() => setViewModalUser(user)}
                      >
                        View
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(user)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
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

      {/* Modal: Add User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
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
                <option value="Customer">Customer</option>
                <option value="Technician">Technician</option>
                <option value="Service Manager">Service Manager</option>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
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
          title="User Profile Details"
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
          </div>

          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button type="button" className="btn-primary" onClick={() => setViewModalUser(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
