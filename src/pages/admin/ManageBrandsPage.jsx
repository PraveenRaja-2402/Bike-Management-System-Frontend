import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import BrandLogo from '../../components/common/BrandLogo';
import Modal from '../../components/common/Modal';
import { mockBikeBrands } from '../../data/mockData';

export default function ManageBrandsPage() {
  const [brands, setBrands] = useState(mockBikeBrands);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    totalModels: 5,
    defaultInterval: '5000 km / 6 months',
    status: 'Active'
  });

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.defaultInterval.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = (brand) => {
    setEditBrand(brand);
    setFormData({
      name: brand.name,
      totalModels: brand.totalModels,
      defaultInterval: brand.defaultInterval,
      status: brand.status
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setBrands(brands.map(b => b.id === editBrand.id ? { ...b, ...formData } : b));
    setEditBrand(null);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newBrand = {
      id: brands.length + 1,
      name: formData.name,
      logoKey: formData.name.toLowerCase(),
      totalModels: Number(formData.totalModels),
      defaultInterval: formData.defaultInterval,
      status: formData.status
    };
    setBrands([...brands, newBrand]);
    setIsAddModalOpen(false);
    setFormData({ name: '', totalModels: 5, defaultInterval: '5000 km / 6 months', status: 'Active' });
  };

  return (
    <div className="manage-brands-page">
      <div className="table-card">
        {/* Controls Bar */}
        <div className="table-controls-bar">
          <div className="controls-left">
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              Supported Motorcycle Manufacturers ({brands.length})
            </span>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search brand name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>

            <button type="button" className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> Add Brand
            </button>
          </div>
        </div>

        {/* Brands Table matching Design 2 */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Brand Name</th>
                <th style={{ textAlign: 'center' }}>Logo</th>
                <th style={{ textAlign: 'center' }}>Total Models</th>
                <th>Default Service Interval</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand, idx) => (
                <tr key={brand.id}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, fontSize: '14px' }}>{brand.name}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    <BrandLogo brand={brand.name} size={30} />
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{brand.totalModels}</td>
                  <td style={{ color: '#475569' }}>{brand.defaultInterval}</td>
                  <td>
                    <StatusBadge status={brand.status} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-outline-blue"
                      onClick={() => handleOpenEdit(brand)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBrands.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No brands found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredBrands.length} of {brands.length} brands</span>
        </div>
      </div>

      {/* Modal: Add Brand */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Motorcycle Brand"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Brand Name *</label>
            <input
              type="text"
              className="form-input no-left-icon"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. KTM, Suzuki, Harley-Davidson"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Total Models</label>
              <input
                type="number"
                className="form-input no-left-icon"
                value={formData.totalModels}
                onChange={(e) => setFormData({ ...formData, totalModels: e.target.value })}
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

          <div className="form-group">
            <label className="form-label">Default Service Interval</label>
            <input
              type="text"
              className="form-input no-left-icon"
              value={formData.defaultInterval}
              onChange={(e) => setFormData({ ...formData, defaultInterval: e.target.value })}
              placeholder="e.g. 5000 km / 6 months"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Brand
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Brand */}
      {editBrand && (
        <Modal
          isOpen={Boolean(editBrand)}
          onClose={() => setEditBrand(null)}
          title={`Edit Brand - ${editBrand.name}`}
        >
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Total Models</label>
                <input
                  type="number"
                  className="form-input no-left-icon"
                  value={formData.totalModels}
                  onChange={(e) => setFormData({ ...formData, totalModels: e.target.value })}
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

            <div className="form-group">
              <label className="form-label">Default Service Interval</label>
              <input
                type="text"
                className="form-input no-left-icon"
                value={formData.defaultInterval}
                onChange={(e) => setFormData({ ...formData, defaultInterval: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setEditBrand(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update Brand
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
