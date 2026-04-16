import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Plant } from '../types';
import { MOCK_STATIONS } from '../../Scada/mockScadaData';

interface PlantGISModalProps {
  plant: Plant;
  onClose: () => void;
}

// Component to handle map bounds and resizing
const MapController: React.FC<{ points: [number, number][] }> = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
    // Fix for Leaflet initialization in modals
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map, points]);

  return null;
};

export const PlantGISModal: React.FC<PlantGISModalProps> = ({ plant, onClose }) => {
  // Find related stations by factory name
  const relatedStations = useMemo(() => {
    const shortName = plant.name.replace('Nhà máy ', '').replace('Trạm ', '');
    return MOCK_STATIONS.filter(s => s.factory.includes(shortName) || plant.name.includes(s.factory));
  }, [plant]);

  const allPoints: [number, number][] = useMemo(() => {
    return [[plant.lat, plant.lng], ...relatedStations.map(s => [s.lat, s.lng] as [number, number])];
  }, [plant, relatedStations]);

  // Factory Marker Icon (Cyan Pulse)
  const factoryIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="width:32px; height:32px; border-radius:50%; background:rgba(0,191,255,0.2); display:flex; align-items:center; justify-content:center; position:relative">
        <div class="pulse-cyan" style="position:absolute; inset:0; border-radius:50%; background:#00bfff; opacity:0.4; animation: pulse 2s infinite"></div>
        <div style="width:16px; height:16px; border-radius:50%; background:#00bfff; border:2px solid white; box-shadow:0 0 10px #00bfff; z-index:2"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const modalContent = (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .leaflet-container { background: var(--bg-elevated) !important; border-radius: 0 0 20px 20px; }
      `}</style>
      
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '24px',
        width: '800px', maxWidth: '95vw', overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0,0,0,0.9)', padding: 0
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>Bản đồ GIS — {plant.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Map Area */}
        <div style={{ height: '420px', width: '100%', position: 'relative' }}>
          <MapContainer center={[plant.lat, plant.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* Factory Marker */}
            <Marker position={[plant.lat, plant.lng]} icon={factoryIcon}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <div style={{ fontWeight: 700, color: '#00bfff' }}>{plant.name}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px' }}>{plant.address}</div>
                  <div style={{ fontSize: '11px', marginTop: '2px' }}>Công suất: {plant.capacity.toLocaleString('vi-VN')} m³/n</div>
                </div>
              </Popup>
            </Marker>

            {/* related stations markers */}
            {relatedStations.map(s => {
              const color = s.status === 'online' ? '#00e676' : s.status === 'warning' ? '#ffdb4d' : '#ff4757';
              const stIcon = L.divIcon({
                className: 'st-icon',
                html: `<div style="width:14px; height:14px; border-radius:50%; background:${color}; border:2px solid white; box-shadow:0 0 8px ${color}"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
              });
              return (
                <Marker key={s.id} position={[s.lat, s.lng]} icon={stIcon}>
                  <Popup>
                    <div style={{ padding: '2px' }}>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: '11px' }}>Áp suất: {s.pressure} bar</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            <MapController points={allPoints} />
          </MapContainer>
        </div>

        {/* Legend & Footer */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00bfff' }}></div> Nhà máy
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e676' }}></div> Trạm Online
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff4757' }}></div> Sự cố
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 16px' }} onClick={() => window.open(`https://maps.google.com/?q=${plant.lat},${plant.lng}`, '_blank')}>
              Mở Google Maps
            </button>
            <button className="btn btn-detail" style={{ fontSize: '12px', padding: '6px 20px' }} onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
