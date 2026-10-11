import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Battery, 
  Fuel, 
  Clock, 
  RotateCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { mockBikes } from '../../data/mockData';

export default function LiveTrackingPage() {
  const [bikes, setBikes] = useState(mockBikes);
  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredBikes = bikes.filter((b) => {
    const matchesSearch = b.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || b.status.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="live-tracking-page">
      <div className="tracking-container">
        
        {/* Left Side: Bike List and Filters */}
        <div className="tracking-sidebar-card">
          <div className="tracking-search-bar">
            <div className="search-input-group" style={{ width: '100%', marginBottom: '10px' }}>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Search by Reg No, Customer or Brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              {['ALL', 'MOVING', 'PARKED', 'STOPPED', 'OFFLINE'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`tab-pill ${filterStatus === status ? 'active' : ''}`}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* List of Bikes */}
          <div className="tracking-list">
            {filteredBikes.map((bike) => {
              const isSelected = selectedBike && selectedBike.id === bike.id;
              return (
                <div
                  key={bike.id}
                  className={`tracking-bike-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedBike(bike)}
                >
                  <div className="tracking-bike-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="tracking-reg-no">{bike.regNo}</span>
                      {bike.status === 'Moving' && (
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                          {bike.speed}
                        </span>
                      )}
                    </div>
                    <span className="tracking-model">{bike.model} • {bike.customer}</span>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                      {bike.lastLocation}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <StatusBadge status={bike.status} />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {bike.status === 'Offline' ? '2 days ago' : 'Live'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredBikes.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No bikes match your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map & Live Telemetry Inspector */}
        <div className="tracking-map-card">
          <LeafletMap
            bikes={filteredBikes}
            selectedBike={selectedBike}
            onSelectBike={setSelectedBike}
            height="100%"
          />

          {/* Floating Selected Bike Detail Overlay */}
          {selectedBike && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '14px 18px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              maxWidth: '320px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{selectedBike.regNo}</span>
                <StatusBadge status={selectedBike.status} />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                {selectedBike.model} ({selectedBike.brand})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px', marginBottom: '10px' }}>
                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Speed</span>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{selectedBike.speed}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Battery</span>
                  <strong style={{ fontSize: '13px', color: '#10b981' }}>{selectedBike.battery || '94%'}</strong>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <span style={{ display: 'block' }}>📍 {selectedBike.lastLocation}</span>
                <span style={{ display: 'block', marginTop: '2px', color: '#94a3b8' }}>🕒 {selectedBike.lastUpdated}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
