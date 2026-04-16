import React from 'react';
import type { Plant } from '../types';

interface PlantTableProps {
  plants: Plant[];
  onOpenDetail: (plant: Plant) => void;
  onEdit?: (plant: Plant) => void;
  onOpenCamera?: (plant: Plant) => void;
  canEdit?: boolean;
}

export const PlantTable: React.FC<PlantTableProps> = ({ plants, onOpenDetail, onEdit, onOpenCamera, canEdit }) => {
  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Đang HĐ',
      warning: 'Cảnh báo',
      fault: 'Sự cố'
    };
    const classes: Record<string, string> = {
      active: 'badge-green',
      warning: 'badge-yellow',
      fault: 'badge-red'
    };

    return <span className={`badge ${classes[status] || 'badge-gray'}`}>{labels[status] || status}</span>;
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <style>{`
        .table-wrap { overflow-x: auto; width: 100%; }
        table { width: 100%; border-collapse: collapse; }
        th { 
          text-align: left; padding: 12px 16px; 
          background: var(--bg-surface); 
          color: var(--muted); font-size: 11px; font-weight: 600; 
          text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border);
        }
        td { 
          padding: 12px 16px; border-bottom: 1px solid var(--border); 
          font-size: 13.5px; vertical-align: middle;
        }
        .hover-row { cursor: pointer; transition: background 0.2s; }
        .hover-row:hover { background: var(--bg-surface); }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .mono { font-family: 'Roboto Mono', monospace; font-size: 12.5px; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .badge::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }
        .badge-green { background: rgba(0, 240, 128, 0.1); color: var(--green); border: 1px solid rgba(0, 240, 128, 0.2); }
        .badge-yellow { background: rgba(255, 219, 77, 0.1); color: var(--yellow); border: 1px solid rgba(255, 219, 77, 0.2); }
        .badge-red { background: rgba(255, 61, 87, 0.1); color: var(--red); border: 1px solid rgba(255, 61, 87, 0.2); }
        .badge-gray { background: rgba(100, 141, 161, 0.1); color: var(--muted); border: 1px solid rgba(100, 141, 161, 0.2); }

        .btn-action-sm {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--muted);
          background: transparent;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-action-sm:hover {
          background: var(--bg-surface);
          color: var(--cyan);
          border-color: var(--cyan);
        }
      `}</style>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nhà máy / Trạm bơm</th>
              <th>Địa chỉ / GIS</th>
              <th className="text-right">Công suất TK</th>
              <th className="text-right">Sản lượng TT</th>
              <th>Hiệu suất</th>
              <th>Chỉ số vận hành</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((f) => {
              const efficiency = Math.round((f.output / f.capacity) * 100);
              return (
                <tr key={f.id} className="hover-row" onClick={() => onOpenDetail(f)}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{f.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      ID: NM-{f.id.toString().padStart(2, '0')} | QL: {f.manager}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '12px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                      {f.address}
                    </div>
                  </td>
                  <td className="text-right mono" style={{ fontWeight: 600 }}>{f.capacity.toLocaleString('vi-VN')}</td>
                  <td className="text-right mono" style={{ fontWeight: 600, color: 'var(--green)' }}>{f.output.toLocaleString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '5px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${efficiency}%`, height: '100%', background: 'var(--cyan)' }}></div>
                      </div>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--text)' }}>{efficiency}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '16px', rowGap: '4px', fontSize: '11px' }}>
                      <div>⚡ {f.powerUsage} <span style={{ color: 'var(--muted)' }}>kWh</span></div>
                      <div>💧 {f.loss}% <span style={{ color: 'var(--muted)' }}>loss</span></div>
                      <div>🧪 {f.chemicalCost.toLocaleString('vi-VN')} <span style={{ color: 'var(--muted)' }}>đ</span></div>
                      <div>✅ {f.compliance}% <span style={{ color: 'var(--muted)' }}>std</span></div>
                    </div>
                  </td>
                  <td>{getStatusBadge(f.status)}</td>
                  <td className="text-center">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="btn-action-sm"
                        onClick={(e) => { e.stopPropagation(); onOpenDetail(f); }}
                        title="Chi tiết"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      {canEdit && (
                        <button
                          className="btn-action-sm"
                          onClick={(e) => { e.stopPropagation(); onEdit?.(f); }}
                          title="Chỉnh sửa"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
