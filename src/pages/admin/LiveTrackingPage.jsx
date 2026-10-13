import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  RotateCw,
  Crosshair,
  X,
  Phone,
  Radio
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { mockBikes } from '../../data/mockData';

export default function LiveTrackingPage() {
  const [bikes, setBikes] = useState(mockBikes);
  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Just now');

  // Stats summary counts
  const movingCount = bikes.filter((b) => b.status === 'Moving').length;
  const parkedCount = bikes.filter((b) => b.status === 'Parked').length;
  const stoppedCount = bikes.filter((b) => b.status === 'Stopped').length;
  const offlineCount = bikes.filter((b) => b.status === 'Offline').length;

  // Real-time GPS movement simulation for moving bikes
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setBikes((prevBikes) =>
        prevBikes.map((b) => {
          if (b.status === 'Moving') {
            const deltaLat = (Math.random() - 0.48) * 0.0003;
            const deltaLng = (Math.random() - 0.48) * 0.0003;
            const updatedBike = {
              ...b,
              lat: Number((b.lat + deltaLat).toFixed(5)),
              lng: Number((b.lng + deltaLng).toFixed(5)),
              lastUpdated: 'Just now'
            };
            if (selectedBike && selectedBike.id === b.id) {
              setSelectedBike(updatedBike);
            }
            return updatedBike;
          }
          return b;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveActive, selectedBike]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    const now = new Date();
    setLastRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setBikes((prevBikes) =>
      prevBikes.map((b) => ({
        ...b,
        lastUpdated: b.status === 'Offline' ? b.lastUpdated : 'Just now'
      }))
    );
  };

  const filteredBikes = bikes.filter((b) => {
    const matchesSearch = b.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || b.status.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="live-tracking-page">
      {/* Top summary & GPS controls bar */}
      <div className="tracking-header-bar">
        <div className="tracking-summary-pills">
          <div className="tracking-summary-pill">
            <span>Total: <strong>{bikes.length}</strong></span>
          </div>
          <div className="tracking-summary-pill">
            <span className="dot moving" />
            <span>Moving: <strong>{movingCount}</strong></span>
          </div>
          <div className="tracking-summary-pill">
            <span className="dot parked" />
            <span>Parked: <strong>{parkedCount}</strong></span>
          </div>
          <div className="tracking-summary-pill">
            <span className="dot stopped" />
            <span>Stopped: <strong>{stoppedCount}</strong></span>
          </div>
          <div className="tracking-summary-pill">
            <span className="dot offline" />
            <span>Offline: <strong>{offlineCount}</strong></span>
          </div>
        </div>

        <div className="tracking-actions-bar">
          <button
            type="button"
            className={`tracking-live-btn ${isLiveActive ? 'active' : ''}`}
            onClick={() => setIsLiveActive(!isLiveActive)}
            title="Toggle live GPS simulation"
          >
            {isLiveActive ? (
              <>
                <span className="pulse-dot" />
                <span>Live GPS Active</span>
              </>
            ) : (
              <>
                <Radio size={14} color="#94a3b8" />
                <span style={{ color: '#64748b' }}>GPS Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="tracking-live-btn"
            onClick={handleManualRefresh}
            title="Refresh GPS positions"
          >
            <RotateCw size={13} />
            <span>Refresh ({lastRefreshedTime})</span>
          </button>
        </div>
      </div>

      <div className="tracking-container">
        
        {/* Left Side: Bike List and Filters */}
        <div className="tracking-sidebar-card">
          <div className="tracking-search-bar">
            <div className="search-input-group" style={{ width: '100%', marginBottom: '10px' }}>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="Search Reg No, Customer, Brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <Search size={15} />
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { label: 'ALL', count: bikes.length },
                { label: 'MOVING', count: movingCount },
                { label: 'PARKED', count: parkedCount },
                { label: 'STOPPED', count: stoppedCount },
                { label: 'OFFLINE', count: offlineCount }
              ].map(({ label, count }) => (
                <button
                  key={label}
                  type="button"
                  className={`tab-pill ${filterStatus === label ? 'active' : ''}`}
                  style={{ fontSize: '11px', padding: '4px 7px', whiteSpace: 'nowrap' }}
                  onClick={() => setFilterStatus(label)}
                >
                  {label} ({count})
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
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={11} style={{ flexShrink: 0 }} /> {bike.lastLocation}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <StatusBadge status={bike.status} />
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {bike.status === 'Offline' ? 'Offline' : 'Live'}
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

        {/* Right Side: Map & Simple Tracking Inspector */}
        <div className="tracking-map-card">
          <LeafletMap
            bikes={filteredBikes}
            selectedBike={selectedBike}
            onSelectBike={setSelectedBike}
            showGeofence={false}
            height="100%"
          />

          {/* Floating Selected Bike Tracking Card (Basic Tracking Only - No Fuel, No Battery) */}
          {selectedBike && (
            <div className="tracking-floating-card">
              <div className="floating-card-header">
                <div>
                  <div className="floating-card-reg">{selectedBike.regNo}</div>
                  <div className="floating-card-model">{selectedBike.model} • {selectedBike.customer}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StatusBadge status={selectedBike.status} />
                  <button 
                    type="button" 
                    className="floating-card-close"
                    onClick={() => setSelectedBike(null)}
                    title="Close preview"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Basic Tracking Specs */}
              <div className="tracking-stats-simple">
                <div className="simple-stat-box">
                  <span className="simple-stat-label">Movement Status</span>
                  <span 
                    className="simple-stat-value"
                    style={{ 
                      color: selectedBike.status === 'Moving' ? '#10b981' : 
                             selectedBike.status === 'Parked' ? '#2563eb' : 
                             selectedBike.status === 'Stopped' ? '#f59e0b' : '#64748b' 
                    }}
                  >
                    {selectedBike.status}
                  </span>
                </div>
                <div className="simple-stat-box">
                  <span className="simple-stat-label">Current Speed</span>
                  <span className="simple-stat-value" style={{ color: selectedBike.status === 'Moving' ? '#10b981' : '#0f172a' }}>
                    {selectedBike.status === 'Moving' ? selectedBike.speed : '0 km/h'}
                  </span>
                </div>
              </div>

              {/* Location & GPS Info only */}
              <div className="floating-card-details">
                <div className="detail-line">
                  <MapPin size={13} className="detail-icon" />
                  <span>{selectedBike.lastLocation}</span>
                </div>
                <div className="detail-line">
                  <Clock size={13} className="detail-icon" />
                  <span>Last Signal: {selectedBike.lastUpdated}</span>
                </div>
                {selectedBike.phone && (
                  <div className="detail-line">
                    <Phone size={13} className="detail-icon" />
                    <span>Rider Contact: {selectedBike.phone}</span>
                  </div>
                )}
              </div>

              <div className="floating-card-actions">
                <button
                  type="button"
                  className="card-action-btn primary"
                  onClick={() => {
                    setSelectedBike({ ...selectedBike });
                  }}
                >
                  <Crosshair size={13} /> Center on Map
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
