import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Helper to generate crisp, dedicated SVG vehicle icon based on bike model and status color
function getVehicleSvg(model = '', color = '#10b981', isSelected = false) {
  const m = (model || '').toLowerCase();
  const w = isSelected ? 30 : 26;
  const h = isSelected ? 30 : 26;

  // 1. Scooter variant (Honda Activa, Suzuki Access, TVS Jupiter, Fascino, Dio)
  if (m.includes('activa') || m.includes('access') || m.includes('jupiter') || m.includes('scooter') || m.includes('dio')) {
    return `
      <svg viewBox="0 0 32 32" width="${w}" height="${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7.5" cy="23.5" r="4.5" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
        <circle cx="7.5" cy="23.5" r="1.8" fill="#ffffff"/>
        <circle cx="24.5" cy="23.5" r="4.5" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
        <circle cx="24.5" cy="23.5" r="1.8" fill="#ffffff"/>
        <path d="M7 18h8l2 5.5h6l2-13.5h-4" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.5 16.5c2.5-1.5 7-1.5 10 .5l-1 3.5h-9z" fill="${color}"/>
        <path d="M23 10.5l-2-4h-3.5" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="21.5" cy="6.5" r="1.5" fill="#facc15"/>
      </svg>
    `;
  }

  // 2. Cruiser variant (Royal Enfield, Bullet, Classic, Meteor)
  if (m.includes('royal enfield') || m.includes('classic') || m.includes('bullet') || m.includes('cruiser') || m.includes('meteor')) {
    return `
      <svg viewBox="0 0 32 32" width="${w}" height="${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="23" r="4.8" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
        <circle cx="7" cy="23" r="1.8" fill="#ffffff"/>
        <circle cx="25" cy="23" r="4.8" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
        <circle cx="25" cy="23" r="1.8" fill="#ffffff"/>
        <path d="M12 13.5c3-2.5 7-2.5 10.5-.5l-1.5 4.5h-9z" fill="${color}"/>
        <path d="M5.5 15.5c2-1.8 4.5-1.8 6.5 0l1 2h-7.5z" fill="#78350f"/>
        <rect x="12.5" y="18" width="6" height="5" rx="1.5" fill="#334155"/>
        <path d="M14 23h9l2.5-2" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M25 23l-3.5-11.5h-3.5" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="22.5" cy="11.5" r="1.8" fill="#facc15" stroke="${color}" stroke-width="1.2"/>
      </svg>
    `;
  }

  // 3. Sport & Street Motorcycle (Yamaha FZ-S, KTM Duke, Bajaj Pulsar, TVS Apache, Hero Splendor)
  return `
    <svg viewBox="0 0 32 32" width="${w}" height="${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="23" r="4.8" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
      <circle cx="7" cy="23" r="1.8" fill="#ffffff"/>
      <circle cx="25" cy="23" r="4.8" stroke="${color}" stroke-width="2.4" fill="#0f172a"/>
      <circle cx="25" cy="23" r="1.8" fill="#ffffff"/>
      <path d="M7 23l6.5-7.5h7.5l5 7.5" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 16l2.5 7h4.5l-1.5-7" fill="#1e293b"/>
      <path d="M10 14c2-2 5.5-2.8 8.5-1.8l1.5 3.5h-6.5l-3.5-1.7z" fill="${color}"/>
      <path d="M5.5 15h4.5l1 1.8H5z" fill="#475569"/>
      <path d="M25 23l-5-12h-3" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="21" cy="11" r="1.5" fill="#38bdf8"/>
      <path d="M12 23h7.5l2.5-1.8" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

export default function LeafletMap({ 
  center = [11.6643, 78.1460], 
  zoom = 14, 
  bikes = [], 
  selectedBike = null,
  showGeofence = false,
  geofences = [],
  stores = [],
  playbackRoute = null, // array of { lat, lng, speed, time, label }
  playbackIndex = 0,
  height = '400px',
  onSelectBike = null,
  showControls = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const circlesRef = useRef([]);
  const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'
  const tileLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false
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

  // Update Layers (Markers, Route Playback, Geofences, Stores)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous elements
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    polylinesRef.current.forEach(p => p.remove());
    polylinesRef.current = [];

    circlesRef.current.forEach(c => c.remove());
    circlesRef.current = [];

    // 1. Render Geofence circles if provided
    if (geofences && geofences.length > 0) {
      geofences.forEach(gf => {
        const circle = L.circle([gf.lat, gf.lng], {
          color: gf.color || '#3b82f6',
          fillColor: gf.color || '#60a5fa',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5',
          radius: gf.radiusMeters || 300
        }).addTo(map).bindPopup(`
          <div style="font-size: 12px; font-weight: bold; color: #0f172a;">${gf.name}</div>
          <div style="font-size: 11px; color: #64748b;">Radius: ${gf.radiusMeters}m • Status: ${gf.status || 'Active'}</div>
        `);
        circlesRef.current.push(circle);
      });
    } else if (showGeofence) {
      const circle = L.circle(center, {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 6',
        radius: 800
      }).addTo(map);
      circlesRef.current.push(circle);
    }

    // 2. Render Store Location Markers
    if (stores && stores.length > 0) {
      stores.forEach(st => {
        const storeIcon = L.divIcon({
          className: 'custom-store-marker',
          html: `
            <div style="
              width: 34px;
              height: 34px;
              background: #0f172a;
              color: #ffffff;
              border: 2px solid #38bdf8;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 15px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">
              🏪
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const storeMarker = L.marker([st.lat, st.lng], { icon: storeIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <strong style="color: #0f172a; font-size: 13px;">${st.name}</strong>
              <div style="color: #64748b; margin-top: 2px;">${st.address}</div>
              <div style="color: #356DF3; margin-top: 4px; font-weight: 600;">📞 ${st.phone}</div>
              <div style="color: #059669; font-size: 11px;">Bays: ${st.serviceBays} | Techs: ${st.availableTechnicians}</div>
            </div>
          `);
        markersRef.current.push(storeMarker);
      });
    }

    // 3. Render Route Playback if active
    if (playbackRoute && playbackRoute.length > 1) {
      const allCoords = playbackRoute.map(p => [p.lat, p.lng]);
      const validIndex = Math.min(Math.max(playbackIndex, 0), playbackRoute.length - 1);
      const passedCoords = allCoords.slice(0, validIndex + 1);

      // Traveled path (Solid Blue)
      if (passedCoords.length > 1) {
        const passedLine = L.polyline(passedCoords, {
          color: '#356DF3',
          weight: 5,
          opacity: 0.9,
          lineJoin: 'round'
        }).addTo(map);
        polylinesRef.current.push(passedLine);
      }

      // Remaining path (Dashed Grey)
      const remainingCoords = allCoords.slice(validIndex);
      if (remainingCoords.length > 1) {
        const remainingLine = L.polyline(remainingCoords, {
          color: '#94a3b8',
          weight: 4,
          opacity: 0.6,
          dashArray: '6, 8',
          lineJoin: 'round'
        }).addTo(map);
        polylinesRef.current.push(remainingLine);
      }

      // Start Marker (Green Flag)
      const startIcon = L.divIcon({
        className: 'route-start-marker',
        html: `<div style="background: #10b981; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">🟢</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const startMarker = L.marker(allCoords[0], { icon: startIcon }).addTo(map).bindPopup('Trip Start');
      markersRef.current.push(startMarker);

      // End Marker (Checkered Flag)
      const endIcon = L.divIcon({
        className: 'route-end-marker',
        html: `<div style="background: #ef4444; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">🏁</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const endMarker = L.marker(allCoords[allCoords.length - 1], { icon: endIcon }).addTo(map).bindPopup('Trip Destination');
      markersRef.current.push(endMarker);

      // Moving Playback Bike Marker at validIndex
      const activePoint = playbackRoute[validIndex];
      const bikePlaybackIcon = L.divIcon({
        className: 'playback-active-bike',
        html: `
          <div class="vehicle-map-marker-wrap moving" style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
          ">
            <!-- Radar Ripple -->
            <div class="vehicle-radar-ripple" style="
              position: absolute;
              width: 58px;
              height: 58px;
              border-radius: 50%;
              border: 2px solid #356DF3;
              background: rgba(37, 99, 235, 0.15);
              pointer-events: none;
              animation: vehicleRadarPulse 1.8s infinite ease-out;
            "></div>

            <!-- Vehicle Icon Container -->
            <div style="
              position: relative;
              z-index: 2;
              width: 42px;
              height: 42px;
              background: #ffffff;
              border: 3px solid #356DF3;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 6px 16px rgba(37,99,235,0.35);
            ">
              ${getVehicleSvg('Yamaha FZ-S', '#356DF3', false)}
            </div>

            <!-- Pointer Needle -->
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #356DF3;
              z-index: 3;
            "></div>

            <!-- Speed Badge -->
            <div style="
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translateX(-50%);
              background: #0f172a;
              color: #ffffff;
              border: 1px solid #38bdf8;
              font-size: 9px;
              font-weight: 800;
              padding: 1px 6px;
              border-radius: 5px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              z-index: 10;
            ">
              ${activePoint.speed || 'Moving'}
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      const currentPointMarker = L.marker([activePoint.lat, activePoint.lng], { icon: bikePlaybackIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size: 12px;">
            <strong>${activePoint.label || 'Playback Point'}</strong>
            <div>Speed: <strong>${activePoint.speed}</strong></div>
            <div>Time: ${activePoint.time}</div>
          </div>
        `);
      markersRef.current.push(currentPointMarker);

      // Auto pan smoothly to keep bike centered
      map.panTo([activePoint.lat, activePoint.lng], { animate: true, duration: 0.3 });
      return;
    }

    // 4. Render Bike Markers (Standard live tracking)
    const bikesToRender = bikes.length > 0 ? bikes : (selectedBike ? [selectedBike] : []);

    bikesToRender.forEach((bike) => {
      const isSelected = selectedBike && selectedBike.id === bike.id;
      const statusColor = bike.status === 'Moving' ? '#10b981' : 
                          bike.status === 'Parked' ? '#3b82f6' : 
                          bike.status === 'Stopped' ? '#f59e0b' : '#ef4444';

      const customIcon = L.divIcon({
        className: 'custom-bike-marker',
        html: `
          <div class="vehicle-map-marker-wrap ${bike.status.toLowerCase()} ${isSelected ? 'selected' : ''}" style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '52px' : '44px'};
            height: ${isSelected ? '52px' : '44px'};
            cursor: pointer;
          ">
            <!-- 1. Floating Vehicle Reg Plate Badge on Selected -->
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -24px;
                left: 50%;
                transform: translateX(-50%);
                background: #0f172a;
                color: #ffffff;
                border: 1.5px solid ${statusColor};
                font-weight: 800;
                font-size: 10px;
                padding: 2px 7px;
                border-radius: 6px;
                white-space: nowrap;
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                z-index: 20;
                letter-spacing: 0.3px;
              ">
                ${bike.regNo}
              </div>
            ` : ''}

            <!-- 2. Moving Radar Ripple Animation for live moving bikes -->
            ${bike.status === 'Moving' ? `
              <div class="vehicle-radar-ripple" style="
                position: absolute;
                width: ${isSelected ? '64px' : '54px'};
                height: ${isSelected ? '64px' : '54px'};
                border-radius: 50%;
                border: 2px solid ${statusColor};
                background: ${statusColor}18;
                pointer-events: none;
                animation: vehicleRadarPulse 1.8s infinite ease-out;
                z-index: 1;
              "></div>
            ` : ''}

            <!-- 3. Vehicle Icon Container (Automotive Pin Badge) -->
            <div style="
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${isSelected ? '46px' : '38px'};
              height: ${isSelected ? '46px' : '38px'};
              background: #ffffff;
              border-radius: 50%;
              border: 3px solid ${statusColor};
              box-shadow: 0 4px 14px rgba(0,0,0,0.22), 0 0 0 ${isSelected ? '3px rgba(37,99,235,0.3)' : '0px transparent'};
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              ${getVehicleSvg(bike.model, statusColor, isSelected)}
            </div>

            <!-- 4. Marker Pointer Needle / Directional Arrow -->
            <div style="
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid ${statusColor};
              z-index: 3;
            "></div>

            <!-- 5. Speed Badge when Moving -->
            ${bike.speed && bike.status === 'Moving' ? `
              <div style="
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                background: #0f172a;
                color: #34d399;
                border: 1px solid rgba(16, 185, 129, 0.6);
                font-size: 9.5px;
                font-weight: 800;
                padding: 1px 6px;
                border-radius: 5px;
                white-space: nowrap;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                z-index: 10;
                letter-spacing: 0.2px;
              ">
                ${bike.speed}
              </div>
            ` : ''}
          </div>
        `,
        iconSize: isSelected ? [52, 52] : [44, 44],
        iconAnchor: isSelected ? [26, 26] : [22, 22]
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
            <div style="color: #64748b; font-size: 11px;">Rider: <strong>${bike.customer}</strong></div>
            <div style="color: #64748b; font-size: 11px;">Model: <strong>${bike.model}</strong></div>
            <div style="color: #64748b; font-size: 11px;">Location: ${bike.lastLocation || 'Salem'}</div>
            ${bike.speed && bike.status === 'Moving' ? `<div style="color: #10b981; font-weight: 600; font-size: 11px; margin-top: 2px;">Speed: ${bike.speed}</div>` : ''}
            <div style="color: #94a3b8; font-size: 10px; margin-top: 4px;">Last Signal: ${bike.lastUpdated || 'Live'}</div>
          </div>
        `);

      marker.on('click', () => {
        if (onSelectBike) onSelectBike(bike);
      });

      markersRef.current.push(marker);
    });

    if (selectedBike && selectedBike.lat && selectedBike.lng) {
      map.flyTo([selectedBike.lat, selectedBike.lng], 15, { animate: true, duration: 0.8 });
    }
  }, [bikes, selectedBike, showGeofence, geofences, stores, playbackRoute, playbackIndex, onSelectBike]);

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
                background: mapType === 'street' ? '#356DF3' : '#ffffff',
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
                background: mapType === 'satellite' ? '#356DF3' : '#ffffff',
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

