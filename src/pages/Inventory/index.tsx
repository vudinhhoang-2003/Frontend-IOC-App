import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FilterBar from '../../components/common/FilterBar';
import {
  MATERIALS, CHEMICALS, EQUIPMENT_LIST, PROD_HISTORY, AI_PREDICTIONS,
  type HistoryEntry, type AiPrediction
} from './mockInventoryData';

type ProdTab = 'material' | 'chemical' | 'equipment' | 'aipredict';
type ToastType = 'success' | 'info' | 'warning' | 'error';

// ── Status badge ──
function statusBadge(s: string) {
  const m: Record<string, string> = { running: 'badge-green', active: 'badge-green', standby: 'badge-yellow', fault: 'badge-red' };
  const l: Record<string, string> = { running: 'Đang chạy', standby: 'Chờ', fault: 'Sự cố', active: 'Hoạt động' };
  return <span className={`badge ${m[s] || 'badge-gray'}`}>{l[s] || s}</span>;
}
function formatNum(n: number) { return n.toLocaleString('vi-VN'); }

// ── Toast Component ──
interface ToastMsg { id: number; msg: string; type: ToastType; }
const Toast: React.FC<{ toasts: ToastMsg[]; remove: (id: number) => void }> = ({ toasts, remove }) => {
  const colors: Record<ToastType, string> = {
    success: 'var(--green)', info: 'var(--cyan)', warning: 'var(--yellow)', error: 'var(--red)'
  };
  const icons: Record<ToastType, React.ReactElement> = {
    success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></svg>,
    error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  };
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', borderRadius: 10,
          background: 'var(--bg-elevated)', border: `1px solid ${colors[t.type]}`,
          boxShadow: `var(--shadow-md), 0 0 0 1px ${colors[t.type]}22`,
          color: 'var(--text)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', minWidth: 260,
          animation: 'mdin .25s ease',
          borderLeft: `4px solid ${colors[t.type]}`,
        }}>
          <span style={{ color: colors[t.type], flexShrink: 0 }}>{icons[t.type]}</span>
          {t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
};

// ── History Modal ──
const HistoryModal: React.FC<{ id: string; name: string; isEquip: boolean; history: HistoryEntry[]; onClose: () => void; }> = ({ id, name, isEquip, history, onClose }) => {
  const typeColor: Record<string, string> = {
    'Nhập kho': 'badge-green', 'Xuất kho': 'badge-red',
    'Bảo dưỡng định kỳ': 'badge-blue', 'Sửa chữa': 'badge-yellow',
    'Kiểm tra': 'badge-gray', 'Sửa chữa khẩn cấp': 'badge-red'
  };
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              Lịch sử: {name}
            </span>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>ID: {id} &nbsp;|&nbsp; {history.length} bản ghi</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="modal-body" style={{ padding: 0, maxHeight: '70vh', overflowY: 'auto' }}>
          {history.length === 0
            ? <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>Chưa có lịch sử</div>
            : <table><thead style={{ position: 'sticky', top: 0, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', zIndex: 2 }}><tr>
              <th>Ngày</th><th>Loại</th>
              {!isEquip && <th>Số lượng</th>}
              <th>Ghi chú</th>
              {isEquip && <th>Kết quả</th>}
              <th>Thực hiện</th>
            </tr></thead><tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-hover)' }}>
                    <td className="mono" style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h.date}</td>
                    <td><span className={`badge ${typeColor[h.type] || 'badge-gray'}`}>{h.type}</span></td>
                    {!isEquip && <td className="mono" style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h.qty} {h.unit}</td>}
                    <td style={{ fontSize: 12 }}>{h.note}</td>
                    {isEquip && <td style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h.result}</td>}
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h.user}</td>
                  </tr>
                ))}
              </tbody></table>
          }
        </div>
        <div className="modal-footer"><button className="btn btn-ghost" onClick={onClose}>Đóng</button></div>
      </div>
    </div>,
    document.body
  );
};

// ── Nhập Kho Modal ──
const NhapKhoModal: React.FC<{ type: 'material' | 'chemical'; onClose: () => void; onSuccess: (msg: string) => void }> = ({ type, onClose, onSuccess }) => {
  const isMat = type === 'material';
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Tạo phiếu nhập {isMat ? 'vật tư' : 'hóa chất'}</span>
          <button className="modal-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{isMat ? 'Vật tư' : 'Hóa chất'}</label>
              <select className="form-control">
                {(isMat ? MATERIALS : CHEMICALS).map(item => <option key={item.id}>[{item.id}] {item.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Số lượng</label>
              <input className="form-control" type="number" placeholder="Nhập số lượng..." defaultValue={100} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nhà cung cấp</label>
              <input className="form-control" placeholder="Tên nhà cung cấp..." />
            </div>
            <div className="form-group">
              <label className="form-label">Ngày nhập</label>
              <input type="date" className="form-control" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea className="form-control" rows={2} placeholder="Ghi chú thêm..."></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={() => { onSuccess(`Đã tạo phiếu nhập ${isMat ? 'vật tư' : 'hóa chất'} thành công!`); onClose(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Xác nhận nhập kho
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Xuất Kho Modal ──
const XuatKhoModal: React.FC<{ type: 'material' | 'chemical'; onClose: () => void; onSuccess: (msg: string) => void }> = ({ type, onClose, onSuccess }) => {
  const isMat = type === 'material';
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Tạo phiếu xuất {isMat ? 'vật tư' : 'hóa chất'}</span>
          <button className="modal-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{isMat ? 'Vật tư' : 'Hóa chất'}</label>
              <select className="form-control">
                {(isMat ? MATERIALS : CHEMICALS).map(item => <option key={item.id}>[{item.id}] {item.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Số lượng xuất</label>
              <input className="form-control" type="number" placeholder="Nhập số lượng..." defaultValue={50} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Đơn vị nhận</label>
              <select className="form-control">
                <option>Đội 1 – TP. Hạ Long</option><option>Đội 2 – TP. Hạ Long</option>
                <option>Đội 3 – TP. Cẩm Phả</option><option>Bộ phận xử lý nước</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ngày xuất</label>
              <input type="date" className="form-control" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mục đích sử dụng</label>
            <textarea className="form-control" rows={2} placeholder="Mô tả mục đích xuất kho..."></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={() => { onSuccess(`Đã tạo phiếu xuất ${isMat ? 'vật tư' : 'hóa chất'} thành công!`); onClose(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Xác nhận xuất kho
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Thêm thiết bị Modal ──
const ThemThietBiModal: React.FC<{ onClose: () => void; onSuccess: (msg: string) => void }> = ({ onClose, onSuccess }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Thêm thiết bị mới</span>
          <button className="modal-close" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên thiết bị</label>
              <input className="form-control" placeholder="Tên thiết bị..." />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input className="form-control" placeholder="Mã model..." />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nhà máy</label>
              <select className="form-control">
                <option>Hồng Gai</option><option>Bãi Cháy</option>
                <option>Cẩm Phả</option><option>Uông Bí</option><option>Móng Cái</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control">
                <option value="running">Đang chạy</option>
                <option value="standby">Chờ</option>
                <option value="fault">Sự cố</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bảo dưỡng lần cuối</label>
              <input type="date" className="form-control" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="form-group">
              <label className="form-label">Lịch bảo dưỡng tiếp</label>
              <input type="date" className="form-control" defaultValue={new Date(Date.now() + 86400000 * 90).toISOString().slice(0, 10)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={() => { onSuccess('Đã thêm thiết bị mới thành công!'); onClose(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Thêm thiết bị
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── SVG Icons ──
const IconHistory = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /><polyline points="12 7 12 12 15 15" /></svg>;
const IconDownload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IconUpload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconWarning = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconDanger16 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const IconAlert16 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const IconShield16 = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
const IconCpu = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>;
const IconTrending = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
const IconBulb = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" /></svg>;
const IconCalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconBell = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
const IconClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;

// ── AI Predict Card ──
const AiPredictCard: React.FC<{ p: AiPrediction; onHistory: (id: string, name: string) => void; onToast: (msg: string, type?: ToastType) => void }> = ({ p, onHistory, onToast }) => {
  const rc = p.risk === 'high' ? 'var(--red)' : p.risk === 'medium' ? 'var(--yellow)' : 'var(--green)';
  const rBg = p.risk === 'high' ? 'rgba(255,61,87,0.1)' : p.risk === 'medium' ? 'rgba(255,219,77,0.1)' : 'rgba(0,240,128,0.1)';
  const rBorder = p.risk === 'high' ? 'rgba(255,61,87,0.2)' : p.risk === 'medium' ? 'rgba(255,219,77,0.2)' : 'rgba(0,240,128,0.2)';

  const sc = p.score >= 75 ? 'var(--red)' : p.score >= 50 ? 'var(--yellow)' : 'var(--green)';
  const RiskIcon = p.risk === 'high' ? IconDanger16 : p.risk === 'medium' ? IconAlert16 : IconShield16;
  const rLabel = p.risk === 'high' ? 'Rủi ro cao' : p.risk === 'medium' ? 'Cần theo dõi' : 'Bình thường';
  const gaugeLen = 157;
  const gaugeOffset = (gaugeLen * (1 - p.score / 100)).toFixed(1);
  const maxT = Math.max(...p.trend);
  return (
    <div className="card" style={{ borderLeft: `4px solid ${rc}`, overflow: 'hidden', padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconClock /> ID: {p.id}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconHistory /> Bảo dưỡng cuối: {p.lastFix}</span>
            <span style={{ fontFamily: "'Roboto Mono',monospace" }}>{formatNum(p.totalHours)} h tích lũy</span>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: rBg, border: `1px solid ${rBorder}`, color: rc }}>
          <RiskIcon /><span style={{ fontSize: 13, fontWeight: 700 }}>{rLabel}</span>
        </div>
      </div>
      {/* Body: 3-column grid */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'var(--label)', textTransform: 'uppercase' }}>Chỉ số rủi ro</div>
          <div style={{ position: 'relative', width: 120, height: 72 }}>
            <svg width="120" height="72" viewBox="0 0 120 72" fill="none">
              <path d="M10 66 A50 50 0 0 1 110 66" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
              <path d="M10 66 A50 50 0 0 1 110 66" stroke={sc} strokeWidth="14" strokeLinecap="round" strokeDasharray={String(gaugeLen)} strokeDashoffset={gaugeOffset} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Roboto Mono',monospace", color: sc }}>{p.score}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>/100</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>Dự kiến hỏng</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: rc }}>{p.nextFail}</div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><IconTrending /> Xu hướng</div>
            <div style={{ display: 'flex', height: 40, gap: 3, alignItems: 'flex-end', background: 'var(--bg-base)', borderRadius: 6, padding: '4px 6px', border: '1px solid var(--border)' }}>
              {p.trend.map((v, i) => { const h = Math.max(3, Math.round((v / maxT) * 40)); const op = (0.35 + (i / p.trend.length) * 0.65).toFixed(2); return <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%', height: h, background: sc, borderRadius: '2px 2px 0 0', opacity: Number(op) }}></div></div>; })}
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
              <span>Còn lại</span><span style={{ fontFamily: "'Roboto Mono',monospace", color: sc }}>{formatNum(p.hoursLeft)} h</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: 'var(--border)' }}>
              <div style={{ width: `${Math.round(p.hoursLeft / p.totalHours * 100)}%`, height: '100%', background: sc, borderRadius: 3 }}></div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-base)', borderRadius: 10, padding: 14, border: '1px solid var(--border)', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 10 }}><IconCpu /> Phân tích AI</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>{p.reason}</p>
        </div>
        <div style={{ background: rBg, borderRadius: 10, padding: 14, border: `1px solid ${rBorder}`, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: rc, textTransform: 'uppercase', marginBottom: 10 }}><IconBulb /> Khuyến nghị</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)', margin: 0, flex: 1 }}>{p.recommendation}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={() => onHistory(p.id, p.name)}><IconHistory /> Lịch sử bảo trì</button>
            <button className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }} onClick={() => onToast('Đã tạo lịch bảo dưỡng!', 'success')}><IconCalendar /> Lên lịch BT</button>
            {p.risk === 'high' && <button className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, background: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => onToast('Đã gửi yêu cầu bảo dưỡng khẩn!', 'warning')}><IconBell /> BT Khẩn cấp</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──
const InventoryPage: React.FC = () => {
  const [prodTab, setProdTab] = useState<ProdTab>('material');
  const [historyModal, setHistoryModal] = useState<{ id: string; name: string; isEquip: boolean } | null>(null);
  const [showNhap, setShowNhap] = useState<'material' | 'chemical' | null>(null);
  const [showXuat, setShowXuat] = useState<'material' | 'chemical' | null>(null);
  const [showThemTB, setShowThemTB] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // ── New Filter States ──
  const [searchQuery, setSearchQuery] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('all');
  const [stepFilter, setStepFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const showToast = (msg: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFactoryFilter('all');
    setStepFilter('all');
    setTypeFilter('all');
    setStockFilter('all');
    showToast('Đã đặt lại bộ lọc', 'info');
  };

  const openHistory = (id: string, name: string, type: string) => setHistoryModal({ id, name, isEquip: type === 'equipment' });

  // ── Filtered data logic ──
  const filteredMaterials = useMemo(() => MATERIALS.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' ? m.stock <= m.minStock : m.stock > m.minStock);
    return matchQ && matchStock;
  }), [searchQuery, stockFilter]);

  const filteredChemicals = useMemo(() => CHEMICALS.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || c.category === typeFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' ? c.stock <= c.minStock : c.stock > c.minStock);
    return matchQ && matchType && matchStock;
  }), [searchQuery, typeFilter, stockFilter]);

  const filteredEquipment = useMemo(() => EQUIPMENT_LIST.filter(e => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.factory.toLowerCase().includes(q);
    const matchFactory = factoryFilter === 'all' || e.factory === factoryFilter;
    const matchStatus = typeFilter === 'all' || e.status === typeFilter;
    return matchQ && matchFactory && matchStatus;
  }), [searchQuery, factoryFilter, typeFilter]);

  const lowStockCount = MATERIALS.filter(m => m.stock <= m.minStock).length;
  const chemCategories = Array.from(new Set(CHEMICALS.map(c => c.category)));
  const factories = Array.from(new Set(EQUIPMENT_LIST.map(e => e.factory)));

  // ── Config filters theo từng tab (thay đổi nội dung dropdown tuỳ tab) ──
  const filterConfigs = useMemo(() => [
    {
      key: 'factory',
      label: 'NHÀ MÁY',
      value: factoryFilter,
      onChange: setFactoryFilter,
      options: [
        { value: 'all', label: 'Tất cả nhà máy' },
        ...factories.map(f => ({ value: f, label: f })),
      ],
    },
    {
      key: 'step',
      label: 'KHÂU SẢN XUẤT',
      value: stepFilter,
      onChange: setStepFilter,
      options: [
        { value: 'all', label: 'Tất cả khâu' },
        { value: 'xl', label: 'Xử lý nước' },
        { value: 'pp', label: 'Phân phối' },
      ],
    },
    {
      key: 'type',
      label: 'LOẠI',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: 'all', label: 'Tất cả loại' },
        ...(prodTab === 'chemical'
          ? chemCategories.map(c => ({ value: c, label: c }))
          : []),
        ...(prodTab === 'equipment'
          ? [
            { value: 'running', label: 'Đang chạy' },
            { value: 'standby', label: 'Chờ' },
            { value: 'fault', label: 'Sự cố' },
          ]
          : []),
      ],
    },
    {
      key: 'stock',
      label: 'TỒN KHO',
      value: stockFilter,
      onChange: setStockFilter,
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'ok', label: 'Đủ tồn kho' },
        { value: 'low', label: 'Sắp hết hàng' },
      ],
    },
  ], [factoryFilter, stepFilter, typeFilter, stockFilter, factories, chemCategories, prodTab]);


  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="page-title"><h1>Sản xuất &amp; Vật tư</h1><p>Quản lý vật tư, hóa chất và thiết bị kỹ thuật</p></div>
      </div>

      {/* ── TABS ── */}
      <div className="tabs">
        <button className={`tab-btn ${prodTab === 'material' ? 'active' : ''}`} onClick={() => setProdTab('material')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> Vật tư
        </button>
        <button className={`tab-btn ${prodTab === 'chemical' ? 'active' : ''}`} onClick={() => setProdTab('chemical')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0a2 2 0 002 2h4a2 2 0 002-2V3M9 14l-3 7h12l-3-7" /></svg> Hóa chất
        </button>
        <button className={`tab-btn ${prodTab === 'equipment' ? 'active' : ''}`} onClick={() => setProdTab('equipment')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg> Thiết bị &amp; Bảo trì
        </button>
        <button className={`tab-btn ${prodTab === 'aipredict' ? 'active' : ''}`} onClick={() => setProdTab('aipredict')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg> AI Dự báo bảo trì
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ marginTop: 20 }}>

        {/* ── Filter Bar (component tái sử dụng) ── */}
        {prodTab !== 'aipredict' && (
          <FilterBar
            searchPlaceholder="Tìm vật tư, hóa chất, thiết bị..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filterConfigs}
            onReset={resetFilters}
          />
        )}

        {/* ── MATERIALS TAB ── */}
        {prodTab === 'material' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
            <div>
              {lowStockCount > 0 && <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconWarning /> {lowStockCount} vật tư dưới mức tối thiểu</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => setShowXuat('material')}><IconDownload /> Phiếu xuất</button>
              <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => setShowNhap('material')}><IconUpload /> Nhập kho</button>
            </div>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Mã</th><th>Tên vật tư</th><th>Đơn vị</th><th>Tồn kho</th><th>Tối thiểu</th><th>Tiêu hao/ngày</th><th>Tình trạng</th><th style={{ textAlign: 'center' }}>Lịch sử</th></tr></thead>
            <tbody>
              {filteredMaterials.map(m => (
                <tr key={m.id}>
                  <td className="mono text-cyan">{m.id}</td>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{m.unit}</td>
                  <td className="mono" style={{ color: m.stock <= m.minStock ? 'var(--red)' : 'var(--green)' }}>{formatNum(m.stock)}</td>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{formatNum(m.minStock)}</td>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{formatNum(m.used)}</td>
                  <td>{m.stock <= m.minStock ? <span className="badge badge-red">Dưới mức tối thiểu</span> : <span className="badge badge-green">Đủ</span>}</td>
                  <td style={{ textAlign: 'center' }}><button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }} onClick={() => openHistory(m.id, m.name, 'material')}><IconHistory /> Lịch sử</button></td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Không tìm thấy kết quả phù hợp</td></tr>}
            </tbody>
          </table></div></div>
        </>)}

        {/* ── CHEMICALS TAB ── */}
        {prodTab === 'chemical' && (<>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => setShowXuat('chemical')}><IconDownload /> Xuất kho</button>
            <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => setShowNhap('chemical')}><IconUpload /> Nhập kho</button>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Mã</th><th>Tên hóa chất</th><th>Nhóm</th><th>Đơn vị</th><th>Tồn kho</th><th>Tiêu hao/ngày</th><th>Dự trữ</th><th>Tình trạng</th><th style={{ textAlign: 'center' }}>Lịch sử</th></tr></thead>
            <tbody>
              {filteredChemicals.map(c => {
                const days = Math.floor(c.stock / c.dailyUsage);
                const ok = c.stock > c.minStock;
                return <tr key={c.id}>
                  <td className="mono text-cyan">{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td><span className="badge badge-blue">{c.category}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{c.unit}</td>
                  <td className="mono" style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{formatNum(c.stock)}</td>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{c.dailyUsage} {c.unit}/ng</td>
                  <td className="mono" style={{ color: days > 7 ? 'var(--green)' : days > 3 ? 'var(--yellow)' : 'var(--red)' }}>{days} ngày</td>
                  <td>{ok ? <span className="badge badge-green">Đủ</span> : <span className="badge badge-red">Thiếu</span>}</td>
                  <td style={{ textAlign: 'center' }}><button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }} onClick={() => openHistory(c.id, c.name, 'chemical')}><IconHistory /> Lịch sử</button></td>
                </tr>;
              })}
              {filteredChemicals.length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Không tìm thấy kết quả phù hợp</td></tr>}
            </tbody>
          </table></div></div>
        </>)}

        {/* ── EQUIPMENT TAB ── */}
        {prodTab === 'equipment' && (<>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => setShowThemTB(true)}><IconPlus /> Thêm thiết bị</button>
          </div>
          <div className="card"><div className="table-wrap"><table>
            <thead><tr><th>Mã</th><th>Thiết bị</th><th>Nhà máy</th><th>Model</th><th>Trạng thái</th><th>Bảo dưỡng cuối</th><th>Bảo dưỡng tiếp theo</th><th>Giờ chạy</th><th style={{ textAlign: 'center' }}>Lịch sử</th></tr></thead>
            <tbody>
              {filteredEquipment.map(e => (
                <tr key={e.id}>
                  <td className="mono text-cyan">{e.id}</td>
                  <td style={{ fontWeight: 500 }}>{e.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{e.factory}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{e.model}</td>
                  <td>{statusBadge(e.status)}</td>
                  <td className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{e.lastMaint}</td>
                  <td className="mono" style={{ fontSize: 12, color: e.status === 'fault' ? 'var(--red)' : 'var(--yellow)' }}>{e.nextMaint}</td>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{formatNum(e.hoursRun)} h</td>
                  <td style={{ textAlign: 'center' }}><button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }} onClick={() => openHistory(e.id, e.name, 'equipment')}><IconHistory /> Lịch sử</button></td>
                </tr>
              ))}
              {filteredEquipment.length === 0 && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>Không tìm thấy kết quả phù hợp</td></tr>}
            </tbody>
          </table></div></div>
        </>)}

        {/* ── AI PREDICT TAB ── */}
        {prodTab === 'aipredict' && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px' }}>Dự báo bảo trì thiết bị</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Phân tích rủi ro bằng AI &amp; dữ liệu cảm biến thời gian thực</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(255,71,87,.12)', border: '1px solid rgba(255,71,87,.3)', color: 'var(--red)' }}><IconDanger16 /><span style={{ fontSize: 12, fontWeight: 600 }}>{AI_PREDICTIONS.filter(p => p.risk === 'high').length} Rủi ro cao</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(255,190,0,.1)', border: '1px solid rgba(255,190,0,.3)', color: 'var(--yellow)' }}><IconAlert16 /><span style={{ fontSize: 12, fontWeight: 600 }}>{AI_PREDICTIONS.filter(p => p.risk === 'medium').length} Theo dõi</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(0,200,100,.08)', border: '1px solid rgba(0,200,100,.25)', color: 'var(--green)' }}><IconShield16 /><span style={{ fontSize: 12, fontWeight: 600 }}>{AI_PREDICTIONS.filter(p => p.risk === 'low').length} Bình thường</span></div>
              <button className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => showToast('Đang phân tích lại dữ liệu cảm biến...', 'info')}><IconRefresh /> Phân tích lại</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {AI_PREDICTIONS.map(p => <AiPredictCard key={p.id} p={p} onHistory={(id, name) => openHistory(id, name, 'equipment')} onToast={showToast} />)}
          </div>
        </>)}
      </div>

      {/* ── MODALS ── */}
      {historyModal && <HistoryModal id={historyModal.id} name={historyModal.name} isEquip={historyModal.isEquip} history={PROD_HISTORY[historyModal.id] || []} onClose={() => setHistoryModal(null)} />}
      {showNhap && <NhapKhoModal type={showNhap} onClose={() => setShowNhap(null)} onSuccess={msg => showToast(msg, 'success')} />}
      {showXuat && <XuatKhoModal type={showXuat} onClose={() => setShowXuat(null)} onSuccess={msg => showToast(msg, 'success')} />}
      {showThemTB && <ThemThietBiModal onClose={() => setShowThemTB(false)} onSuccess={msg => showToast(msg, 'success')} />}

      {/* ── TOAST ── */}
      <Toast toasts={toasts} remove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
};

export default InventoryPage;
