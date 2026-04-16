import React from 'react';
import { createPortal } from 'react-dom';
import type { Plant } from '../types';

interface PlantDetailModalProps {
  plant: Plant;
  onClose: () => void;
  onOpenGIS: () => void;
  onOpenCamera: () => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, onClose, onOpenGIS, onOpenCamera }) => {
  const efficiency = Math.round((plant.output / plant.capacity) * 100);
  const estimatedRevenue = plant.output * 8500; // Giả lập doanh thu

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Hoạt động',
      warning: 'Cảnh báo',
      fault: 'Sự cố'
    };
    const classes: Record<string, string> = {
      active: 'badge-active',
      warning: 'badge-warning',
      fault: 'badge-fault'
    };
    
    return (
      <span className={`badge ${classes[status] || 'badge-active'}`}>
        <span className="badge-dot" />
        {labels[status] || status}
      </span>
    );
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <style>{`
        .modal-box {
          background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px;
          width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 25px 80px rgba(0,0,0,0.5); position: relative;
          display: flex; flex-direction: column;
        }
        .modal-header {
          padding: 20px 24px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-title { font-size: 16px; font-weight: 700; color: var(--text); }
        .modal-close { background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px; transition: 0.2s; }
        .modal-close:hover { color: var(--text); }
        .modal-body { padding: 24px; }
        .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
        
        .info-card {
          padding: 16px 20px; border-radius: 12px; background: var(--bg-surface);
          border: 1px solid var(--border);
        }
        .info-section-title {
          margin: 0 0 16px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;
        }
        .info-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 12px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { color: var(--muted); }
        .info-value { color: var(--text); text-align: right; font-weight: 500; }
        
        .metric-box {
          padding: 16px; border-radius: 10px; border: none;
          background: var(--bg-surface);
        }
        .metric-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; }
        .metric-value { font-size: 24px; font-weight: 700; font-family: 'Roboto Mono', monospace; }
        
        .badge {
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        .badge-active { background: rgba(0, 163, 108, 0.1); color: #00ffaa; border: 1px solid rgba(0, 255, 170, 0.2); }
        .badge-active .badge-dot { background: #00ffaa; box-shadow: 0 0 6px #00ffaa; }
        .badge-warning { background: rgba(255, 174, 0, 0.1); color: #ffbb00; border: 1px solid rgba(255, 187, 0, 0.2); }
        .badge-warning .badge-dot { background: #ffbb00; box-shadow: 0 0 6px #ffbb00; }
        .badge-fault { background: rgba(255, 59, 59, 0.1); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.2); }
        .badge-fault .badge-dot { background: #ff4d4d; box-shadow: 0 0 6px #ff4d4d; }

        .btn-modal-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-modal-ghost:hover {
          color: var(--text);
          background: var(--border);
        }
        .btn-modal-primary {
          background: linear-gradient(135deg, #0050cc, #00c8ff);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 28px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 80, 204, 0.3);
        }
        .btn-modal-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 80, 204, 0.4);
        }
      `}</style>

      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Chi tiết Nhà máy: {plant.name}</span>
          <button className="modal-close" onClick={onClose} title="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* THÔNG TIN CƠ BẢN */}
            <div className="info-card">
              <h4 className="info-section-title" style={{ color: 'var(--cyan)' }}>THÔNG TIN CƠ BẢN</h4>
              <div className="info-row"><span className="info-label">Địa bàn:</span> <span className="info-value">{plant.location}</span></div>
              <div className="info-row"><span className="info-label">Địa chỉ:</span> <span className="info-value">{plant.address}</span></div>
              <div className="info-row"><span className="info-label">Năm thành lập:</span> <span className="info-value">{plant.established}</span></div>
              <div className="info-row"><span className="info-label">Quản lý:</span> <span className="info-value">{plant.manager}</span></div>
              <div className="info-row"><span className="info-label">Trạng thái:</span> {getStatusBadge(plant.status)}</div>
            </div>

            {/* HIỆU SUẤT & SẢN LƯỢNG */}
            <div className="info-card">
              <h4 className="info-section-title" style={{ color: '#00ffaa' }}>HIỆU SUẤT & SẢN LƯỢNG</h4>
              <div className="info-row"><span className="info-label">Công suất TK:</span> <span className="info-value mono">{plant.capacity.toLocaleString('vi-VN')} m³/n</span></div>
              <div className="info-row"><span className="info-label">Sản lượng TT:</span> <span className="info-value mono">{plant.output.toLocaleString('vi-VN')} m³/n</span></div>
              <div className="info-row"><span className="info-label">Hiệu suất NM:</span> <span className="info-value mono">{efficiency}%</span></div>
              <div className="info-row"><span className="info-label">Tỷ lệ thất thoát:</span> <span className="info-value mono" style={{ color: plant.loss > 10 ? 'var(--red)' : '#ff4d4d' }}>{plant.loss}%</span></div>
            </div>
          </div>

          {/* CHỈ SỐ VẬN HÀNH & KINH DOANH */}
          <div className="info-card" style={{ marginBottom: '24px' }}>
            <h4 className="info-section-title" style={{ color: '#ffbb00' }}>CHỈ SỐ VẬN HÀNH & KINH DOANH</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="metric-box">
                  <div className="metric-label">Điện năng tiêu thụ</div>
                  <div className="metric-value" style={{ color: 'var(--cyan)' }}>{plant.powerUsage} <span style={{ fontSize: '11px', fontWeight: 500 }}>kWh/m³</span></div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Tuân thủ chất lượng</div>
                  <div className="metric-value" style={{ color: '#00ffaa' }}>{plant.compliance}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="metric-box">
                  <div className="metric-label">Chi phí hóa chất</div>
                  <div className="metric-value" style={{ color: '#ffbb00' }}>{plant.chemicalCost.toLocaleString('vi-VN')} <span style={{ fontSize: '11px', fontWeight: 500 }}>đ/m³</span></div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Doanh thu dự kiến (24h)</div>
                  <div className="metric-value" style={{ color: '#d946ef' }}>{estimatedRevenue.toLocaleString('vi-VN')} <span style={{ fontSize: '11px', fontWeight: 500 }}>VNĐ</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-modal-ghost" onClick={onOpenGIS}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>
              Xem trên bản đồ GIS
            </button>
            <button className="btn-modal-ghost" onClick={onOpenCamera}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              Xem Camera Nhà máy
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-primary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );

  // Dùng Portal để đưa modal ra khỏi thẻ main content, đè lên tất cả layout
  return createPortal(modalContent, document.body);
};
