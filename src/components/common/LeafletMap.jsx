import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function LeafletMap({ 
  center = [11.6643, 78.1460], 
  zoom = 14, 
  bikes = [], 
  selectedBike = null,
  showGeofence = true,
  height = '400px',
  onSelectBike = null,
  showControls = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'
  const tileLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false // custom controls
      });

      const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = streetTiles;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Type change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();

    if (mapType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
        {
          attribution: '&copy; Esri World Imagery',
          maxZoom: 18
        }
      ).addTo(mapInstanceRef.current);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }
      ).addTo(mapInstanceRef.current);
    }
  }, [mapType]);

  // Update Markers & Geofence
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    // Geofence circle around center
    if (showGeofence) {
      circleRef.current = L.circle(center, {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 6',
        radius: 800
      }).addTo(map);
    }

    // Add Bike Markers
    const bikesToRender = bikes.length > 0 ? bikes : (selectedBike ? [selectedBike] : []);

    bikesToRender.forEach((bike) => {
      const isSelected = selectedBike && selectedBike.id === bike.id;
      const statusColor = bike.status === 'Moving' ? '#10b981' : 
                          bike.status === 'Parked' ? '#3b82f6' : 
                          bike.status === 'Stopped' ? '#f59e0b' : '#ef4444';

      const customIcon = L.divIcon({
        className: 'custom-bike-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '46px' : '38px'};
            height: ${isSelected ? '46px' : '38px'};
            background: #ffffff;
            border-radius: 50%;
            border: 3px solid ${statusColor};
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            <div style="
              width: ${isSelected ? '28px' : '22px'};
              height: ${isSelected ? '28px' : '22px'};
              background: #d92228;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: bold;
              font-size: 11px;
            ">
              🏍️
            </div>
            ${bike.speed && bike.status === 'Moving' ? `
              <span style="
                position: absolute;
                bottom: -16px;
                background: #0f172a;
                color: #ffffff;
                font-size: 9px;
                font-weight: 600;
                padding: 1px 4px;
                border-radius: 4px;
                white-space: nowrap;
              ">${bike.speed}</span>
            ` : ''}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([bike.lat || center[0], bike.lng || center[1]], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.4; min-width: 170px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px; color: #1e293b;">${bike.regNo}</span>
              <span style="background: ${statusColor}20; color: ${statusColor}; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px;">
                ${bike.status}
              </span>
            </div>
            <div style="color: #64748b; font-size: 11px;">Model: <strong>${bike.model}</strong></div>
            <div style="color: #64748b; font-size: 11px;">Speed: <strong>${bike.speed || '0 km/h'}</strong></div>
            <div style="color: #64748b; font-size: 11px;">Location: ${bike.lastLocation || 'Salem'}</div>
            ${bike.battery ? `<div style="color: #64748b; font-size: 11px;">Battery: <strong>${bike.battery}</strong></div>` : ''}
          </div>
        `);

      marker.on('click', () => {
        if (onSelectBike) onSelectBike(bike);
      });

      markersRef.current.push(marker);
    });

    // If selected bike changed, fly to it
    if (selectedBike && selectedBike.lat && selectedBike.lng) {
      map.flyTo([selectedBike.lat, selectedBike.lng], 15, { animate: true, duration: 0.8 });
    }
  }, [bikes, selectedBike, showGeofence]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  };

  return (
    <div className="leaflet-map-wrapper" style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {showControls && (
        <>
          {/* Layer switcher */}
          <div className="map-layer-switch" style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            background: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            fontWeight: 500
          }}>
            <button
              type="button"
              onClick={() => setMapType('street')}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: mapType === 'street' ? '#2563eb' : '#ffffff',
                color: mapType === 'street' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: mapType === 'satellite' ? '#2563eb' : '#ffffff',
                color: mapType === 'satellite' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Satellite
            </button>
          </div>

          {/* Map Controls */}
          <div className="map-zoom-controls" style={{
            position: 'absolute',
            bottom: 16,
            right: 12,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <button
              type="button"
              onClick={handleResetCenter}
              title="Center Map"
              style={{
                width: 32,
                height: 32,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}
            >
              🎯
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              style={{
                width: 32,
                height: 32,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px 6px 0 0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              style={{
                width: 32,
                height: 32,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                marginTop: '-6px',
                borderRadius: '0 0 6px 6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              −
            </button>
          </div>
        </>
      )}
    </div>
  );
}
