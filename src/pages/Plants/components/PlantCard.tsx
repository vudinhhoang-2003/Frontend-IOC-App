import React from 'react';
import type { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
  onEdit?: () => void;
  onOpenCamera?: () => void;
  canEdit?: boolean;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick, onEdit, onOpenCamera, canEdit }) => {
  const efficiency = Math.round((plant.output / plant.capacity) * 100);

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Đang HĐ',
      warning: 'Cảnh báo',
      fault: 'Sự cố'
    };
    const classes: Record<string, string> = {
      active: 'badge-active',
      warning: 'badge-warning',
      fault: 'badge-fault'
    };

    return (
      <span className={`status-badge ${classes[status] || 'badge-gray'}`}>
        <span className="badge-dot"></span>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="plant-grid-card" onClick={onClick}>
      <style>{`
        .plant-grid-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .plant-grid-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--cyan);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .plant-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .plant-loc { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        .badge-active { background: rgba(0, 240, 128, 0.1); color: var(--green); border: 1px solid rgba(0, 240, 128, 0.2); }
        .badge-active .badge-dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
        .badge-warning { background: rgba(255, 219, 77, 0.1); color: var(--yellow); border: 1px solid rgba(255, 219, 77, 0.2); }
        .badge-warning .badge-dot { background: var(--yellow); box-shadow: 0 0 6px var(--yellow); }
        .badge-fault { background: rgba(255, 61, 87, 0.1); color: var(--red); border: 1px solid rgba(255, 61, 87, 0.2); }
        .badge-fault .badge-dot { background: var(--red); box-shadow: 0 0 6px var(--red); }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .stat-box {
          background: var(--bg-hover);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px;
        }
        .stat-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .stat-value { font-size: 16px; font-weight: 700; font-family: 'Roboto Mono', monospace; }

        .perf-container { margin-bottom: 16px; }
        .perf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .perf-title { font-size: 11px; color: var(--muted); }
        .perf-percent { font-size: 11px; color: var(--muted); }
        .progress-track { height: 5px; background: var(--bg-surface); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.8s ease-out; border-radius: 10px; }

        .card-footer { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 20px; }
        .footer-info { display: flex; align-items: center; gap: 6px; }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }
        .btn-action-outline {
          flex: 1;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text);
          font-size: 12px;
          font-weight: 500;
          background: transparent;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-action-outline:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: var(--bg-surface);
        }
        .btn-action-outline.primary-text {
          color: var(--cyan);
        }
        .btn-action-outline.primary-text:hover {
          border-color: var(--cyan);
          background: var(--bg-surface);
        }
        .btn-icon-outline {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 50%;
          color: var(--text);
          background: transparent;
          transition: all 0.2s;
          cursor: pointer;
          flex-shrink: 0;
        }
        .btn-icon-outline:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: var(--bg-surface);
        }
      `}</style>

      {/* Header */}
      <div className="card-head">
        <div>
          <div className="plant-name">{plant.name}</div>
          <div className="plant-loc">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {plant.location}
          </div>
        </div>
        {getStatusBadge(plant.status)}
      </div>

      {/* Box Thông số */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">CÔNG SUẤT TK</div>
          <div className="stat-value" style={{ color: 'var(--cyan)' }}>
            {plant.capacity.toLocaleString('vi-VN')}
            <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--muted)', marginLeft: '4px' }}>m³/n</span>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">THỰC TẾ</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>
            {plant.output.toLocaleString('vi-VN')}
            <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--muted)', marginLeft: '4px' }}>m³/n</span>
          </div>
        </div>
      </div>

      {/* Thanh tiến trình */}
      <div className="perf-container">
        <div className="perf-header">
          <span className="perf-title">Hiệu suất vận hành</span>
          <span className="perf-percent">{efficiency}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${efficiency}%`,
              background: 'linear-gradient(90deg, var(--cyan), var(--green))',
              boxShadow: '0 0 8px rgba(0, 210, 255, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Info Footer */}
      <div className="card-footer">
        <div className="footer-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          {plant.manager}
        </div>
        <div className="footer-info">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          {plant.established}
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button
          className="btn-icon-outline"
          onClick={onOpenCamera}
          title="Xem Camera"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
        </button>
        <button
          className="btn-action-outline"
          onClick={onClick}
        >
          Chi tiết
        </button>
        {canEdit && (
          <button
            className="btn-action-outline primary-text"
            onClick={onEdit}
          >
            Sửa
          </button>
        )}
      </div>
    </div>
  );
};
