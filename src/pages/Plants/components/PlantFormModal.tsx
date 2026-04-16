import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Plant, PlantStatus } from '../types';

interface PlantFormModalProps {
  plant?: Plant | null;
  onClose: () => void;
  onSave: (data: Partial<Plant>) => void;
}

export const PlantFormModal: React.FC<PlantFormModalProps> = ({ plant, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Plant>>(plant || {
    name: '',
    capacity: 0,
    output: 0,
    address: '',
    location: '',
    manager: '',
    status: 'active',
    lat: 20.9595,
    lng: 107.0700,
    established: '2005',
    powerUsage: 0,
    chemicalCost: 0,
    compliance: 0,
    loss: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <style>{`
        .modal-box {
          background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px;
          width: 580px; max-width: 95vw; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 25px 80px rgba(0,0,0,0.6); position: relative;
        }
        .modal-header {
          padding: 20px 24px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .modal-title { font-size: 16px; font-weight: 700; color: var(--text); }
        .modal-body { padding: 24px; }
        .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 12px; }
        
        .form-group { margin-bottom: 18px; display: flex; flex-direction: column; gap: 8px; }
        .form-label { 
          display: block; font-size: 11px; color: var(--muted); 
          text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;
        }
        .form-control {
          width: 100%; height: 38px; background: var(--bg-surface);
          border: 1px solid var(--border); border-radius: 8px; padding: 0 12px;
          color: var(--text); outline: none; transition: all 0.2s; font-size: 13px;
        }
        .form-control:focus {
          border-color: var(--cyan); background: var(--bg-card);
          box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.1);
        }
        .form-control::placeholder { color: var(--muted); opacity: 0.4; }
        select.form-control { cursor: pointer; }
        select.form-control option { background: var(--bg-elevated); color: var(--text); }

        .btn-primary {
          background: linear-gradient(135deg, #0050cc, #00c8ff);
          color: white; border: none; border-radius: 30px;
          padding: 8px 30px; font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 80, 204, 0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn-ghost {
          background: transparent; color: var(--muted); border: 1px solid var(--border);
          border-radius: 30px; padding: 8px 24px; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-ghost:hover { background: var(--border); color: var(--text); }
      `}</style>

      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{plant ? `CHỈNH SỬA NHÀ MÁY` : 'THÊM NHÀ MÁY MỚI'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tên nhà máy / Trạm bơm</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Nhập tên nhà máy..."
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Công suất thiết kế (m³/ngày)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="Vd: 25000"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sản lượng thực tế (m³/ngày)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="Vd: 22000"
                  value={formData.output}
                  onChange={e => setFormData({...formData, output: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Địa bàn quản lý</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Vd: TP. Hạ Long"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Năm thành lập</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Vd: 2005"
                  value={formData.established}
                  onChange={e => setFormData({...formData, established: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ chi tiết</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Số nhà, đường, phường/xã..."
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Vĩ độ (Latitude)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  className="form-control"
                  placeholder="Vd: 20.9595"
                  value={formData.lat}
                  onChange={e => setFormData({...formData, lat: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kinh độ (Longitude)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  className="form-control"
                  placeholder="Vd: 107.0700"
                  value={formData.lng}
                  onChange={e => setFormData({...formData, lng: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Người quản lý</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Nhập tên..."
                  value={formData.manager}
                  onChange={e => setFormData({...formData, manager: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select 
                  className="form-control"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as PlantStatus})}
                >
                  <option value="active">Hoạt động bình thường</option>
                  <option value="warning">Cảnh báo vận hành</option>
                  <option value="fault">Sự cố / Bảo trì</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary">{plant ? 'Lưu thay đổi' : 'Tạo mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
