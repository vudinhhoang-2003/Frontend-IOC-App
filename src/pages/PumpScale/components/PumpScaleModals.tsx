import React, { useState, useEffect } from 'react';
import { X, Calendar, Coffee, Star, Sparkles, Sliders, AlertTriangle, Plus } from 'lucide-react';
import type { PumpProfile, PumpStation, ScheduleInterval } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <span className="text-[16px] font-bold text-[var(--text)]">{title}</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--muted)] transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-card)]/50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Profile Modal ---
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PumpProfile>) => void;
  initialData?: PumpProfile;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<PumpProfile>>({
    name: '',
    description: '',
    icon: 'custom',
    color: '#00c8ff',
    appliesTo: 'custom'
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', description: '', icon: 'custom', color: '#00c8ff', appliesTo: 'custom' });
  }, [initialData, isOpen]);

  // icons logic handled via getIcon helpers or inline

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? `Chỉnh sửa kịch bản: ${initialData.name}` : 'Tạo kịch bản mới'}
      footer={
        <>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy</button>
          <button 
            onClick={() => onSave(formData)} 
            disabled={!formData.name}
            className="px-6 py-2 rounded-xl bg-[var(--cyan)] text-white text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {initialData ? 'Lưu thay đổi' : 'Tạo kịch bản'}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">Tên kịch bản <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all"
            placeholder="VD: Mùa hè cao điểm..."
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">Mô tả</label>
          <textarea 
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all resize-none"
            placeholder="Mô tả mục đích áp dụng kịch bản..."
            rows={2}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">Loại áp dụng</label>
            <select 
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all appearance-none cursor-pointer"
              value={formData.appliesTo}
              onChange={e => setFormData({ ...formData, appliesTo: e.target.value as any, icon: e.target.value as any })}
            >
              <option value="weekday">Ngày thường</option>
              <option value="weekend">Cuối tuần</option>
              <option value="holiday">Ngày lễ</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">Màu sắc</label>
            <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-2 h-[42px]">
              <input 
                type="color" 
                className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
              />
              <span className="text-[13px] font-mono font-bold text-[var(--muted)]">{formData.color?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// --- Station Interval Modal ---
interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: PumpStation | null;
  profileName: string;
  onSave: (intervals: ScheduleInterval[]) => void;
  initialIntervals: ScheduleInterval[];
}

export const StationModal: React.FC<StationModalProps> = ({ isOpen, onClose, station, profileName, onSave, initialIntervals }) => {
  const [intervals, setIntervals] = useState<ScheduleInterval[]>([]);

  useEffect(() => {
    setIntervals(initialIntervals || []);
  }, [initialIntervals, isOpen]);

  const addInterval = () => setIntervals([...intervals, [22, 2]]);
  const removeInterval = (idx: number) => setIntervals(intervals.filter((_, i) => i !== idx));
  const updateInterval = (idx: number, start: number, dur: number) => {
    const next = [...intervals];
    next[idx] = [start, dur];
    setIntervals(next);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Lịch bơm: ${station?.name} — ${profileName}`}
      footer={
        <>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy</button>
          <button onClick={() => onSave(intervals)} className="px-6 py-2 rounded-xl bg-[var(--cyan)] text-white text-[13px] font-bold hover:opacity-90 transition-all">Lưu lịch</button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="bg-[var(--cyan)]/5 border border-[var(--cyan)]/15 rounded-xl p-3 flex items-start gap-3">
          <Sparkles size={18} className="text-[var(--cyan)] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[var(--muted)] leading-relaxed">
            AI gợi ý: ưu tiên giờ <strong className="text-[var(--green)]">Thấp điểm (22h–04h)</strong>, hạn chế tối đa vận hành vào giờ <strong className="text-[var(--red)]">Cao điểm (09:30–11:30, 17h–20h)</strong>.
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-[100px]">
          {intervals.map((iv, idx) => (
            <div key={idx} className="flex items-end gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] relative group animate-in slide-in-from-right-2">
              <div className="flex-1 flex flex-col gap-1.5 text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Bắt đầu (h)
                <input 
                  type="number" step="0.5" min="0" max="23.5"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[14px] font-mono text-[var(--text)] outline-none focus:border-[var(--cyan)]"
                  value={iv[0]} 
                  onChange={e => updateInterval(idx, parseFloat(e.target.value), iv[1])}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5 text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider">
                Thời lượng (h)
                <input 
                  type="number" step="0.5" min="0.5" max="24"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[14px] font-mono text-[var(--text)] outline-none focus:border-[var(--cyan)]"
                  value={iv[1]} 
                  onChange={e => updateInterval(idx, iv[0], parseFloat(e.target.value))}
                />
              </div>
              <button 
                onClick={() => removeInterval(idx)}
                className="p-2 mb-0.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={addInterval}
          className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)]/40 hover:bg-[var(--cyan)]/5 transition-all text-[13px] font-bold mt-2"
        >
          <Plus size={16} /> Thêm khung giờ
        </button>
      </div>
    </Modal>
  );
};

// --- Delete Confirmation Modal ---
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
      title="Xác nhận xóa"
      footer={
        <>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy</button>
          <button onClick={onConfirm} className="px-6 py-2 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-all">Xóa vĩnh viễn</button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle size={32} />
        </div>
        <p className="text-[15px] font-bold text-[var(--text)] mb-2">Xóa kịch bản "<span className="text-red-500">{name}</span>"?</p>
        <p className="text-[13px] text-[var(--muted)]">Thao tác này không thể hoàn tác. Tất cả lịch trình trong kịch bản này sẽ bị xóa khỏi hệ thống.</p>
      </div>
    </Modal>
  );
};
