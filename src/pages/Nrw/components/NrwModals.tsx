import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, MapPin, Zap, Clock, CheckCircle2, AlertTriangle, Shield, HardHat, Camera, Gauge, Activity, Thermometer, Search, ClipboardList } from 'lucide-react';
import type { DMAZone, LeakAlert, InspectionOrder } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-[560px]' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-all" 
        onClick={onClose} 
      />
      <div className={`relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px] w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-surface)]/20">
          <span className="text-[17px] font-black text-[var(--text)] tracking-tight flex items-center gap-2.5 uppercase">
            {title.includes('Lệnh') ? <FileText size={18} className="text-[var(--cyan)]" /> : <ClipboardList size={18} className="text-[var(--cyan)]" />}
            {title}
          </span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)] transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)]/20 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// --- Inspection Order Modal ---
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  source: DMAZone | LeakAlert | null;
}

export const InspectionOrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, source }) => {
  const [team, setTeam] = React.useState('Đội kỹ thuật 1 – Hồng Gai');
  const [actionDesc, setActionDesc] = React.useState('');

  React.useEffect(() => {
    if (isOpen && source) {
      setTeam('Đội kỹ thuật 1 – Hồng Gai');
      const isAlert = 'risk' in source;
      const zoneName = 'name' in source ? source.name : (source as LeakAlert).zone;
      setActionDesc(`Nghi ngờ rò rỉ tại ${isAlert ? (source as LeakAlert).suspect : zoneName}.`);
    }
  }, [isOpen, source]);

  if (!source) return null;

  const isAlert = 'risk' in source;
  const zoneName = 'name' in source ? source.name : (source as LeakAlert).zone;
  const dmaId = 'id' in source ? (source as any).id : (source as LeakAlert).dmaId;
  const risk = isAlert ? (source as LeakAlert).risk : (source as DMAZone).loss > 20 ? 'Rất cao' : 'Cao';
  const riskColor = risk === 'Rất cao' ? 'var(--red)' : risk === 'Cao' ? 'var(--yellow)' : 'var(--green)';

  const handleSaveClick = () => {
    onSave({
      dma_id: dmaId,
      suspect: isAlert ? (source as LeakAlert).suspect : zoneName,
      team: team,
      action: actionDesc
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Tạo lệnh kiểm tra NRW — ${zoneName}`}
    >
      <div className="flex flex-col gap-6">
        {/* Risk Info Banner */}
        <div 
          className="flex items-center gap-4 p-4 rounded-[12px] border"
          style={{ backgroundColor: `${riskColor}08`, borderColor: `${riskColor}20` }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${riskColor}10`, color: riskColor }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-[13px] font-black uppercase tracking-tight" style={{ color: riskColor }}>
              {zoneName} ({dmaId}) — Rủi ro {risk}
            </div>
            <div className="text-[12px] font-medium text-[var(--muted)] opacity-80 mt-0.5">
              Ước tính rò rỉ: {isAlert ? (source as LeakAlert).excess : 'Cần kiểm tra'} m³/h
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Loại lệnh</label>
            <select className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[var(--text)] outline-none hover:border-[var(--cyan)] transition-colors cursor-pointer">
              <option>Kiểm tra rò rỉ / NRW</option>
              <option>Kiểm tra đường ống</option>
              <option>Đo lưu lượng MNF</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Mức độ ưu tiên</label>
            <select className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[var(--text)] outline-none hover:border-[var(--cyan)] transition-colors cursor-pointer">
              <option>Khẩn cấp</option>
              <option>Ưu tiên cao</option>
              <option>Trung bình</option>
              <option>Bình thường</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Đội kỹ thuật thực hiện</label>
          <select 
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[var(--text)] outline-none hover:border-[var(--cyan)] transition-colors cursor-pointer w-full"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            <option>Đội kỹ thuật 1 – Hồng Gai</option>
            <option>Đội kỹ thuật 2 – Bãi Cháy</option>
            <option>Đội kỹ thuật 3</option>
            <option>Đội kỹ thuật 4</option>
            <option>Đội NRW chuyên biệt</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Mô tả & Chỉ dẫn</label>
          <textarea 
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-3 text-[13.5px] text-[var(--text)] outline-none hover:border-[var(--cyan)] transition-all min-h-[100px] resize-none leading-relaxed"
            placeholder="Nêu chi tiết yêu cầu kiểm tra..."
            value={actionDesc}
            onChange={(e) => setActionDesc(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full text-[13.5px] font-bold text-[var(--muted)] hover:bg-white/5 transition-all">Bỏ qua</button>
          <button 
            onClick={handleSaveClick} 
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[13.5px] font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-500/20"
          >
            Tạo lệnh kiểm tra
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- History Detail Modal ---
interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InspectionOrder | null;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const steps = [
    { title: 'Phát hiện rò rỉ', time: `${order.date} 04:30`, desc: `Cảnh báo MNF: ${order.dmaName}`, icon: <Search size={14} />, color: 'var(--red)' },
    { title: 'Tiếp nhận lệnh', time: `${order.date} 14:00`, desc: order.action, icon: <HardHat size={14} />, color: 'var(--yellow)' },
    { title: 'Xử lý hoàn tất', time: `${order.date} 16:30`, desc: `Thu hồi: +${order.recovered} m³/h`, icon: <CheckCircle2 size={14} />, color: 'var(--green)' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Hồ sơ Xử lý: ${order.id}`}
      maxWidth="max-w-[480px]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start border-b border-dashed border-white/10 pb-6">
          <div>
            <h4 className="text-[17px] font-black text-[var(--cyan)] tracking-tight uppercase">{order.suspect}</h4>
            <p className="text-[12px] text-[var(--muted)] font-bold mt-1 uppercase opacity-60 tracking-wider font-mono">{order.dmaName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider mb-1">Thu hồi thực tế</p>
            <div className="text-[24px] font-black text-[var(--green)] font-mono leading-none">+{order.recovered} <span className="text-[12px] font-bold opacity-40">m³/h</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-0 relative ml-4 mb-2">
          <div className="absolute top-2.5 bottom-2.5 left-[11px] w-[1px] bg-[var(--cyan)] opacity-20" />
          
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-6 relative z-10 pb-8 last:pb-0">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg" 
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h5 className="text-[14px] font-black text-[var(--text)] tracking-tight leading-tight">{s.title}</h5>
                <p className="text-[11px] font-bold text-[var(--cyan)] font-mono opacity-80 uppercase">{s.time}</p>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed font-medium italic">"{s.desc}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-surface)]/20 border border-[var(--border)] rounded-[12px] p-5">
          <p className="text-[11px] font-black text-[var(--muted)] uppercase tracking-widest mb-3 opacity-60">Kết quả nghiệm thu</p>
          <div className="text-[13px] text-[var(--text)] leading-relaxed space-y-2 opacity-90 italic">
            <div>- Hoàn trả hiện trạng mặt bằng.</div>
            <div>- Áp lực mạng lưới đo được: 1.8 bar (ổn định).</div>
            <div>- Chịu trách nhiệm: <span className="text-[var(--cyan)] font-bold">{order.responsibleName}</span>.</div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[13.5px] font-bold"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Create DMA Modal ---
interface CreateDMAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
}

export const CreateDMAModal: React.FC<CreateDMAModalProps> = ({ isOpen, onClose, onDone }) => {
  const [form, setForm] = React.useState({ id: '', name: '', district: '' });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) { setForm({ id: '', name: '', district: '' }); setError(''); }
  }, [isOpen]);

  const handleSave = async () => {
    if (!form.id.trim() || !form.name.trim()) { setError('Mã vùng và tên vùng không được để trống'); return; }
    
    setSaving(true); setError('');
    try {
      const { apiClient } = await import('../../../services/apiClient');
      await apiClient.post('/web/master/dma-zones', {
        id: form.id, name: form.name, district: form.district || null
      });
      onDone(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo DMA');
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phân vùng DMA mới" maxWidth="max-w-[400px]">
      <div className="flex flex-col gap-4">
        {error && <div className="text-[12px] text-[var(--red)] bg-[var(--red)]/10 p-2.5 rounded-lg border border-[var(--red)]/20">{error}</div>}
        
        <div>
          <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider mb-1 block">Mã phân vùng *</label>
          <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="VD: DMA-01"
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all uppercase" />
        </div>
        
        <div>
          <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider mb-1 block">Tên hiển thị *</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Khu vực Hoàn Kiếm"
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all" />
        </div>
        
        <div>
          <label className="text-[11px] font-black text-[var(--muted)] uppercase tracking-wider mb-1 block">Ghi chú (Quận/Huyện)</label>
          <input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="Tùy chọn..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] px-3 py-2 text-[13px] text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all" />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-[13px] font-bold text-[var(--muted)] hover:bg-[var(--bg-hover)] transition-all">Hủy</button>
          <button 
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[13px] font-bold disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null} Xác nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};
