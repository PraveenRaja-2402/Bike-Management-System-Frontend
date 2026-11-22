import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  RotateCw,
  Crosshair,
  X,
  Phone,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Activity,
  Calendar,
  Gauge,
  Info,
  ShieldCheck
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap';
import StatusBadge from '../../components/common/StatusBadge';
import { mockBikes, mockRoutePlaybackTrip } from '../../data/mockData';

export default function LiveTrackingPage() {
  const [bikes, setBikes] = useState(mockBikes);
  const [selectedBike, setSelectedBike] = useState(mockBikes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('Just now');

  // Route playback state
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaybackPlaying, setIsPlaybackPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playbackTimerRef = useRef(null);

  // Stats summary counts
  const movingCount = bikes.filter((b) => b.status === 'Moving').length;
  const parkedCount = bikes.filter((b) => b.status === 'Parked').length;
  const stoppedCount = bikes.filter((b) => b.status === 'Stopped').length;
  const offlineCount = bikes.filter((b) => b.status === 'Offline').length;

  // Real-time GPS movement simulation for moving bikes (when not in playback mode)
  useEffect(() => {
    if (!isLiveActive || isPlaybackMode) return;

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
  }, [isLiveActive, isPlaybackMode, selectedBike]);

  // Route playback loop
  useEffect(() => {
    if (isPlaybackPlaying && isPlaybackMode) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= mockRoutePlaybackTrip.points.length - 1) {
            setIsPlaybackPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaybackPlaying, isPlaybackMode, playbackSpeed]);

  const handleStartPlayback = (bike) => {
    setSelectedBike(bike);
    setIsPlaybackMode(true);
    setPlaybackIndex(0);
    setIsPlaybackPlaying(true);
  };

  const handleExitPlayback = () => {
    setIsPlaybackMode(false);
    setIsPlaybackPlaying(false);
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
  };

  const handleTogglePlay = () => {
    if (playbackIndex >= mockRoutePlaybackTrip.points.length - 1) {
      setPlaybackIndex(0);
      setIsPlaybackPlaying(true);
    } else {
      setIsPlaybackPlaying(!isPlaybackPlaying);
    }
  };

  const handleResetPlayback = () => {
    setIsPlaybackPlaying(false);
    setPlaybackIndex(0);
  };

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
      {/* Explicit Backend Integration & Simulated Telemetry Notice */}
      <div style={{
        background: '#EFF4FE',
        border: '1px solid #BFDBFE',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.6px',
            background: '#356DF3',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            Sample Data Preview
          </span>
          <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 500 }}>
            Simulated Telemetry Preview • Backend Integration Ready. Showing sample IoT hardware coordinates for UI preview (never presented as real GPS hardware feeds).
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#667085' }}>
          <ShieldCheck size={14} color="#12B76A" />
          <span>MQTT / WebSocket Stub Ready</span>
        </div>
      </div>

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
        <div className="tracking-map-card" style={{ position: 'relative' }}>
          <LeafletMap
            bikes={isPlaybackMode ? [] : filteredBikes}
            selectedBike={selectedBike}
            onSelectBike={setSelectedBike}
            showGeofence={false}
            playbackRoute={isPlaybackMode ? mockRoutePlaybackTrip.points : null}
            playbackIndex={isPlaybackMode ? playbackIndex : 0}
            height="100%"
          />

          {/* Dedicated Admin Route Playback HUD Overlay */}
          {isPlaybackMode && (
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '92%',
              maxWidth: 680,
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 16,
              padding: '16px 20px',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.2)',
              zIndex: 1000
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: '#356DF3',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      Route Playback
                    </span>
                    <strong style={{ fontSize: 14, color: '#f8fafc' }}>
                      {selectedBike?.regNo} • {selectedBike?.model}
                    </strong>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} color="#38bdf8" />
                    <span>{mockRoutePlaybackTrip.points[playbackIndex]?.label || 'Route Trajectory'}</span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ color: '#38bdf8' }}>{mockRoutePlaybackTrip.tripTitle}</span>
                  </div>
                </div>

                {/* Right controls & exit */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Speed gauge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 3,
                    background: 'rgba(30, 41, 59, 0.8)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8' }}>
                      {(mockRoutePlaybackTrip.points[playbackIndex]?.speed || '0').replace(' km/h', '')}
                    </span>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>KM/H</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExitPlayback}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '5px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    title="Exit Playback Mode"
                  >
                    <X size={14} /> Exit
                  </button>
                </div>
              </div>

              {/* Scrubber slider */}
              <input
                type="range"
                min="0"
                max={mockRoutePlaybackTrip.points.length - 1}
                value={playbackIndex}
                onChange={(e) => {
                  setPlaybackIndex(parseInt(e.target.value, 10));
                  setIsPlaybackPlaying(false);
                }}
                style={{
                  width: '100%',
                  accentColor: '#38bdf8',
                  cursor: 'pointer',
                  margin: '4px 0'
                }}
              />

              {/* Time stamps */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                <span>Trip Start: {mockRoutePlaybackTrip.points[0]?.time}</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                  Checkpoint {playbackIndex + 1} of {mockRoutePlaybackTrip.points.length} ({mockRoutePlaybackTrip.points[playbackIndex]?.time})
                </span>
                <span>Destination: {mockRoutePlaybackTrip.points[mockRoutePlaybackTrip.points.length - 1]?.time}</span>
              </div>

              {/* Control dock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    style={{
                      background: '#356DF3',
                      border: 'none',
                      color: '#ffffff',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                    }}
                    title={isPlaybackPlaying ? "Pause" : "Play"}
                  >
                    {isPlaybackPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPlayback}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#e2e8f0',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Reset to start"
                  >
                    <RotateCcw size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {playbackSpeed}x SPEED
                  </button>
                </div>

                <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{mockRoutePlaybackTrip.totalDistance}</span>
                  <span style={{ margin: '0 6px' }}>•</span>
                  <span>Duration: {mockRoutePlaybackTrip.duration}</span>
                  <span style={{ margin: '0 6px' }}>•</span>
                  <span>Top: {mockRoutePlaybackTrip.topSpeed}</span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Selected Bike Tracking Card (Basic Tracking Only - No Fuel, No Battery) */}
          {selectedBike && !isPlaybackMode && (
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
                      color: selectedBike.status === 'Moving' ? '#12B76A' : 
                             selectedBike.status === 'Parked' ? '#356DF3' : 
                             selectedBike.status === 'Stopped' ? '#F79009' : '#667085' 
                    }}
                  >
                    {selectedBike.status}
                  </span>
                </div>
                <div className="simple-stat-box">
                  <span className="simple-stat-label">Current Speed</span>
                  <span className="simple-stat-value" style={{ color: selectedBike.status === 'Moving' ? '#12B76A' : '#101828' }}>
                    {selectedBike.status === 'Moving' ? selectedBike.speed : '0 km/h'}
                  </span>
                </div>
              </div>

              {/* Weekly and Monthly Distance Summaries (Requirement 6) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                margin: '10px 0',
                padding: '8px 12px',
                background: '#F8F9FC',
                borderRadius: '8px',
                border: '1px solid #EAECF0'
              }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#667085', display: 'block' }}>Weekly Distance</span>
                  <strong style={{ fontSize: '13px', color: '#101828' }}>
                    {selectedBike.weeklyKm || '142.4'} km
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#667085', display: 'block' }}>Monthly Distance</span>
                  <strong style={{ fontSize: '13px', color: '#356DF3' }}>
                    {selectedBike.monthlyKm || '586.2'} km
                  </strong>
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

              <div className="floating-card-actions" style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="card-action-btn primary"
                  onClick={() => {
                    setSelectedBike({ ...selectedBike });
                  }}
                >
                  <Crosshair size={13} /> Center on Map
                </button>
                <button
                  type="button"
                  className="card-action-btn"
                  style={{
                    background: '#356DF3',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleStartPlayback(selectedBike)}
                  title="Watch animated historical trip playback"
                >
                  <Play size={13} /> Route Playback
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

