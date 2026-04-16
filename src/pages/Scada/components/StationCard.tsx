import React from 'react';
import type { ScadaStation } from '../types';
import { StatusBadge } from './StatusBadge';

interface StationCardProps {
  station: ScadaStation;
  onClick: () => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onClick }) => {
  const pressColor = station.status === 'offline' ? '#546e7a' : station.pressure < 2 ? 'var(--red)' : station.pressure < 2.5 ? 'var(--yellow)' : 'var(--green)';
  const levelColor = station.status === 'offline' ? '#546e7a' : station.level > 60 ? 'var(--green)' : station.level > 30 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div
      className={`card kpi-card ${station.status}`}
      onClick={onClick}
      style={{ cursor: 'pointer', padding: '16px' } as React.CSSProperties}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{station.name}</div>
        <StatusBadge status={station.status} />
      </div>

      <div className="station-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="metric">
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500 }}>Áp lực</div>
          <div style={{ fontSize: '18px', fontBold: 700, color: pressColor, fontFamily: "'Roboto Mono', monospace" } as any}>
            {station.status !== 'offline' ? station.pressure : '—'} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--label)', fontFamily: "Inter, sans-serif" }}>bar</span>
          </div>
        </div>
        <div className="metric">
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 500 }}>Lưu lượng</div>
          <div style={{ fontSize: '18px', fontBold: 700, color: 'var(--cyan)', fontFamily: "'Roboto Mono', monospace" } as any}>
            {station.status !== 'offline' ? station.flow : '—'} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--label)', fontFamily: "Inter, sans-serif" }}>m³/h</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 500 }}>
          <span>Mực nước bể</span>
          <span>{station.status !== 'offline' ? station.level + '%' : '—'}</span>
        </div>
        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div
            style={{
              height: '100%',
              width: `${station.status !== 'offline' ? station.level : 0}%`,
              background: levelColor,
              borderRadius: '3px',
              transition: 'width 0.5s ease-in-out',
              boxShadow: `0 0 6px ${levelColor}40`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
