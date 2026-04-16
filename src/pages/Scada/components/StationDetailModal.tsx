import React from 'react';
import type { ScadaStation, Device } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface StationDetailModalProps {
  station: ScadaStation;
  onClose: () => void;
  isControlTab: boolean;
  setIsControlTab: (val: boolean) => void;
  onControl: (station: ScadaStation, device: Device, action: string) => void;
  refreshTime: string;
}

const MapMarker: React.FC<{ station: ScadaStation }> = ({ station }) => {
  const isError = station.status === 'offline' || station.pressure < 2 || station.level < 30;
  const color = isError ? '#ff4757' : '#00e676';
  const pulseClass = isError ? 'pulse-red' : 'pulse-green';

  const iconHtml = `
    <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center">
      <div class="${pulseClass}" style="position:absolute; width:100%; height:100%; border-radius:50%; opacity:0.6; z-index:1"></div>
      <div style="width:16px; height:16px; background:${color}; border:2px solid white; border-radius:50%; box-shadow:0 0 10px ${color}; z-index:2"></div>
    </div>
  `;

  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: iconHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return <Marker position={[station.lat, station.lng]} icon={customIcon} />;
};

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station, onClose, isControlTab, setIsControlTab, onControl, refreshTime
}) => {
  if (false) console.log(refreshTime);

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    } as any}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '20px',
        width: '640px', maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto',
        boxShadow: 'var(--shadow)',
        margin: 'auto'
      }}>
        {/* Header */}
        <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{station.name}</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <StatusBadge status={station.status} />
              <span className="mono" style={{ color: 'var(--muted)', fontSize: '11px' }}>ID: {station.id}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs" style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <div className={`modal-tab ${!isControlTab ? 'active' : ''}`} onClick={() => setIsControlTab(false)}
            style={{ padding: '14px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: !isControlTab ? 'var(--cyan)' : 'var(--muted)', borderBottom: `3px solid ${!isControlTab ? 'var(--cyan)' : 'transparent'}`, transition: '0.2s' }}>
            Thông tin trạm
          </div>
          <div className={`modal-tab ${isControlTab ? 'active' : ''}`} onClick={() => setIsControlTab(true)}
            style={{ padding: '14px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: isControlTab ? 'var(--cyan)' : 'var(--muted)', borderBottom: `3px solid ${isControlTab ? 'var(--cyan)' : 'transparent'}`, transition: '0.2s' }}>
            Điều khiển SCADA
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '20px 24px' }}>
          {!isControlTab ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['Áp lực', station.pressure, 'bar', '#00bfff'],
                  ['Lưu lượng', station.flow, 'm³/h', '#00f080'],
                  ['Mực nước', station.level, '%', '#ffdb4d'],
                  ['Công suất', station.power, 'kW', '#a855f7'],
                ].map(([label, val, unit, color], idx) => (
                  <div key={idx} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>{label as string}</div>
                    <div className="mono" style={{ fontSize: '22px', fontWeight: 700, color: color as string }}>
                      {station.status !== 'offline' ? val : '—'}
                      <span style={{ fontSize: '12px', marginLeft: '4px', fontWeight: 400, color: 'var(--label)' }}>{unit as string}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Vị trí trạm</span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>{station.lat}, {station.lng}</span>
                </div>
                <div style={{ height: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                  <MapContainer center={[station.lat, station.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <MapMarker station={station} />
                  </MapContainer>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px 16px', background: 'rgba(255,190,0,0.03)', border: '1px solid rgba(255,190,0,0.1)', borderRadius: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffbe00" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>Cảnh báo: Lệnh điều khiển trực tiếp sẽ tác động ngay lập tức đến vận hành mạng lưới.</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(station.devices || []).map(dev => {
                  const isRunning = dev.status === 'running' || dev.status === 'open';
                  return (
                    <div key={dev.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dev.type === 'pump' ? 'var(--cyan)' : 'var(--green)' }}>
                          {dev.type === 'pump' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v9" /><path d="M12 12l6 6" /></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{dev.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <div className={`pulse-dot ${isRunning ? 'green' : 'yellow'}`} style={{ width: '5px', height: '5px' }}></div>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{dev.status === 'running' ? 'Đang chạy' : dev.status === 'open' ? 'Đang mở' : 'Đang dừng'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button className="btn btn-detail" style={{ padding: '4px 14px', fontSize: '11px' }}>Lịch sử</button>
                        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '30px' }}>
                          <button className={`btn btn-sm ${isRunning ? 'btn-ghost-dark' : 'btn-cyan-glow'}`} disabled={isRunning} onClick={() => onControl(station, dev, dev.type === 'pump' ? 'Bật' : 'Mở')} style={{ padding: '4px 14px', borderRadius: '30px', fontSize: '11px' }}>{dev.type === 'pump' ? 'Bật' : 'Mở'}</button>
                          <button className={`btn btn-sm ${isRunning ? 'btn-white' : 'btn-ghost-dark'}`} disabled={!isRunning} onClick={() => onControl(station, dev, dev.type === 'pump' ? 'Dừng' : 'Đóng')} style={{ padding: '4px 14px', borderRadius: '30px', fontSize: '11px' }}>{dev.type === 'pump' ? 'Dừng' : 'Đóng'}</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <button className="btn btn-ghost-dark" onClick={onClose} style={{ padding: '8px 24px' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
