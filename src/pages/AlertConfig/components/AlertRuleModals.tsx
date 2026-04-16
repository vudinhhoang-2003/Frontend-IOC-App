import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Bell, Info, ShieldAlert, Zap } from 'lucide-react';
import type { AlertRule, Severity } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-all" 
        onClick={onClose} 
      />
      <div className="relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-[0_32px_128px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200 overflow-hidden transform-gpu">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)]/20">
          <span className="text-[17px] font-black text-[var(--text)] tracking-tight">{title}</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--muted)] hover:text-[var(--text)] transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)]/40 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// --- Alert Rule Modal ---
interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AlertRule>) => void;
  initialData?: AlertRule;
}

export const AlertRuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<AlertRule>>({
    name: '',
    station: 'Tất cả',
    param: 'Áp lực',
    threshold: '',
    severity: 'info',
    active: true
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', station: 'Tất cả', param: 'Áp lực', threshold: '', severity: 'info', active: true });
  }, [initialData, isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? `Chỉnh sửa luật cảnh báo: ${initialData.name}` : 'Tạo cảnh báo mới'}
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-[14px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy bỏ</button>
          <button 
            onClick={() => onSave(formData)} 
            disabled={!formData.name || !formData.threshold}
            className="px-8 py-2.5 rounded-xl bg-[var(--blue)] text-white text-[14px] font-bold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {initialData ? 'Cập nhật luật' : 'Lưu cảnh báo'}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Tên luật <span className="text-red-500 ml-0.5">*</span></label>
          <input 
            type="text" 
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14.5px] text-[var(--text)] outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]/20 transition-all"
            placeholder="VD: Áp lực thấp Hồng Gai"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Trạm áp dụng</label>
            <select 
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14.5px] text-[var(--text)] outline-none focus:border-[var(--blue)] transition-all cursor-pointer appearance-none"
              value={formData.station}
              onChange={e => setFormData({ ...formData, station: e.target.value })}
            >
              <option value="Tất cả">Tất cả các trạm</option>
              <option value="ST01">Trạm Hồng Gai</option>
              <option value="ST02">Trạm Bãi Cháy</option>
              <option value="ST03">Trạm Cẩm Phả</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Thông số đo</label>
            <select 
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14.5px] text-[var(--text)] outline-none focus:border-[var(--blue)] transition-all cursor-pointer appearance-none"
              value={formData.param}
              onChange={e => setFormData({ ...formData, param: e.target.value as any })}
            >
              <option value="Áp lực">Áp lực (bar)</option>
              <option value="Lưu lượng">Lưu lượng (m3/h)</option>
              <option value="Mực nước">Mực nước (%)</option>
              <option value="Công suất">Công suất (kW)</option>
              <option value="Kết nối">Kết nối (phút)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Điều kiện</label>
            <select className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14.5px] text-[var(--text)] outline-none focus:border-[var(--blue)] transition-all">
              <option>Nhỏ hơn (&lt;)</option>
              <option>Lớn hơn (&gt;)</option>
              <option>Bằng (=)</option>
              <option>Khác (!=)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Giá trị ngưỡng <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[14.5px] text-[var(--text)] outline-none focus:border-[var(--blue)] transition-all"
              placeholder="VD: 2.0"
              value={formData.threshold.replace(/[^\d.]/g, '')}
              onChange={e => setFormData({ ...formData, threshold: `< ${e.target.value} bar` })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[12px] font-bold text-[var(--muted)] opacity-80 uppercase tracking-tight">Mức độ cảnh báo</label>
          <div className="flex gap-4">
            {(['info', 'warning', 'critical'] as Severity[]).map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="severity" 
                  checked={formData.severity === s}
                  onChange={() => setFormData({ ...formData, severity: s })}
                  className="w-4 h-4 border-[var(--border)] bg-[var(--bg-card)] text-[var(--blue)] focus:ring-[var(--blue)]"
                />
                <div className={`w-2 h-2 rounded-full ${s === 'critical' ? 'bg-[var(--red)] shadow-[0_0_8px_var(--red)]' : s === 'warning' ? 'bg-[var(--yellow)] shadow-[0_0_8px_var(--yellow)]' : 'bg-[var(--blue)] shadow-[0_0_8px_var(--blue)]'}`} />
                <span className="text-[13.5px] font-bold text-[var(--text)] group-hover:text-[var(--blue)] transition-all capitalize">
                  {s === 'info' ? 'Thông tin' : s === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// --- Confirm Delete Modal ---
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, name }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Xác nhận xóa luật"
      footer={
        <>
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-[14px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy bỏ</button>
          <button onClick={onConfirm} className="px-8 py-2.5 rounded-xl bg-[var(--red)] text-white text-[14px] font-bold hover:brightness-110 transition-all shadow-lg shadow-red-500/20">Xóa vĩnh viễn</button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-500/5 flex items-center justify-center text-red-500 mb-6 border border-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <AlertTriangle size={32} strokeWidth={1.5} />
        </div>
        <p className="text-[17px] font-black text-[var(--text)] mb-3 tracking-tight">Xóa luật cảnh báo "<span className="text-[var(--red)]">{name}</span>"?</p>
        <p className="text-[14.5px] text-[var(--muted)] leading-relaxed px-6 opacity-90">
          Thao tác này sẽ gỡ bỏ quy tắc khỏi hệ thống giám sát SCADA. Bạn sẽ không nhận được thông báo cho sự kiện này nữa.
        </p>
      </div>
    </Modal>
  );
};
