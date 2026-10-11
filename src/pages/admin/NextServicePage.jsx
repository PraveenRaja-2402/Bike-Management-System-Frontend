import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Filter,
  MessageSquare,
  Mail,
  Smartphone
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { mockBikes } from '../../data/mockData';

export default function NextServicePage() {
  const [bikes, setBikes] = useState(mockBikes);
  const [brandFilter, setBrandFilter] = useState('All');
  const [daysFilter, setDaysFilter] = useState('30');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [activeBikeForNotify, setActiveBikeForNotify] = useState(null);
  const [notificationChannel, setNotificationChannel] = useState('all');
  const [customMsg, setCustomMsg] = useState('');
  const [alertSentSuccess, setAlertSentSuccess] = useState('');

  const filteredBikes = bikes.filter((b) => {
    const matchesBrand = brandFilter === 'All' || b.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesDays = parseInt(b.daysLeft, 10) <= parseInt(daysFilter, 10);
    const matchesSearch = b.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesDays && matchesSearch;
  });

  const handleOpenNotify = (bike) => {
    setActiveBikeForNotify(bike);
    setCustomMsg(`Dear ${bike.customer}, your ${bike.model} (${bike.regNo}) is due for regular maintenance on ${bike.nextService} (${bike.daysLeft} days remaining). Please book your slot at Bike Service Center Salem.`);
    setNotifyModalOpen(true);
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    setNotifyModalOpen(false);
    setAlertSentSuccess(`Service reminder dispatched to ${activeBikeForNotify.customer} via ${notificationChannel.toUpperCase()}! (Mock action)`);
    setTimeout(() => setAlertSentSuccess(''), 5000);
  };

  return (
    <div className="next-service-page">
      {alertSentSuccess && (
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
          <span>{alertSentSuccess}</span>
        </div>
      )}

      <div className="table-card">
        {/* Controls Bar matching Design 2 */}
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
              <option value="TVS">TVS</option>
              <option value="Bajaj">Bajaj</option>
              <option value="Hero">Hero</option>
              <option value="Royal Enfield">Royal Enfield</option>
              <option value="KTM">KTM</option>
            </select>

            <select 
              className="filter-select"
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
            >
              <option value="7">Due in 7 Days</option>
              <option value="15">Due in 15 Days</option>
              <option value="30">Due in 30 Days</option>
              <option value="60">Due in 60 Days</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Reg No or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Next Service Notifications Table matching Design 2 */}
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Reg No</th>
                <th>Brand / Model</th>
                <th>Customer</th>
                <th>Last Service</th>
                <th>Next Service</th>
                <th>Days Left</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBikes.map((bike, index) => (
                <tr key={bike.id}>
                  <td style={{ color: '#64748b' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{bike.regNo}</td>
                  <td style={{ color: '#475569' }}>{bike.model}</td>
                  <td>{bike.customer} ({bike.phone})</td>
                  <td style={{ color: '#64748b' }}>{bike.lastService}</td>
                  <td style={{ fontWeight: 600 }}>{bike.nextService}</td>
                  <td>
                    <span style={{ 
                      fontWeight: 700,
                      color: bike.daysLeft <= 7 ? '#ef4444' : bike.daysLeft <= 15 ? '#d97706' : '#1e293b'
                    }}>
                      {bike.daysLeft} days
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={bike.serviceStatus} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      type="button" 
                      className="btn-primary btn-sm"
                      onClick={() => handleOpenNotify(bike)}
                    >
                      <Bell size={12} style={{ marginRight: 4 }} />
                      Notify
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBikes.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No bikes match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span>Showing {filteredBikes.length} of {bikes.length} bikes</span>
          <div className="pagination-controls">
            <button type="button" className="page-btn" disabled>&lt;</button>
            <button type="button" className="page-btn active">1</button>
            <button type="button" className="page-btn" disabled>&gt;</button>
          </div>
        </div>
      </div>

      {/* Notification Dispatch Modal */}
      {activeBikeForNotify && (
        <Modal
          isOpen={notifyModalOpen}
          onClose={() => setNotifyModalOpen(false)}
          title={`Send Service Reminder - ${activeBikeForNotify.regNo}`}
        >
          <form onSubmit={handleSendNotification}>
            <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <div>Customer: <strong>{activeBikeForNotify.customer}</strong></div>
              <div>Phone: <strong>{activeBikeForNotify.phone}</strong></div>
              <div>Model: <strong>{activeBikeForNotify.model}</strong></div>
              <div>Due Date: <strong>{activeBikeForNotify.nextService}</strong> ({activeBikeForNotify.daysLeft} days left)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Dispatch Channels</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`tab-pill ${notificationChannel === 'all' ? 'active' : ''}`}
                  onClick={() => setNotificationChannel('all')}
                >
                  SMS + WhatsApp + Email
                </button>
                <button
                  type="button"
                  className={`tab-pill ${notificationChannel === 'sms' ? 'active' : ''}`}
                  onClick={() => setNotificationChannel('sms')}
                >
                  SMS Only
                </button>
                <button
                  type="button"
                  className={`tab-pill ${notificationChannel === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => setNotificationChannel('whatsapp')}
                >
                  WhatsApp Only
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder Message</label>
              <textarea
                className="form-input no-left-icon"
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setNotifyModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Send size={14} /> Send Reminder Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
