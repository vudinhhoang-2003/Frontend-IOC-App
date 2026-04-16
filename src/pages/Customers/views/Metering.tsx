import React, { useState, useEffect } from 'react';
import { Smartphone, Image as ImageIcon, Download, Search, Loader2, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface Reading {
  dbId: number;
  id: string;
  name: string;
  meter: string;
  prev: number;
  curr: number;
  cons: number;
  date: string;
  reader: string;
  photo: boolean;
  status: string;
}

const formatDate = (d: string | null): string => {
  if (!d) return '—';
  try { const dt = new Date(d); return dt.toLocaleDateString('vi-VN') + ' ' + dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return d; }
};

// ─── Create Reading Modal ─────────────────────────────────────────────────────
const CreateReadingModal: React.FC<{ isOpen: boolean; onClose: () => void; onDone: () => void }> = ({ isOpen, onClose, onDone }) => {
  const [form, setForm] = useState({ meter_id: '', prev_reading: '', curr_reading: '', note: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (isOpen) { setForm({ meter_id: '', prev_reading: '', curr_reading: '', note: '' }); setError(''); } }, [isOpen]);

  const handleSave = async () => {
    if (!form.meter_id.trim()) { setError('Mã đồng hồ không được để trống'); return; }
    const prev = parseFloat(form.prev_reading);
    const curr = parseFloat(form.curr_reading);
    if (isNaN(prev) || isNaN(curr)) { setError('Chỉ số phải là số hợp lệ'); return; }
    if (curr < prev) { setError('Chỉ số mới không thể nhỏ hơn chỉ số cũ'); return; }

    setSaving(true); setError('');
    try {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      await apiClient.post('/meter-readings', {
        meter_id: form.meter_id,
        read_date: now.toISOString().slice(0, 10),
        period_month: period,
        prev_reading: prev,
        curr_reading: curr,
        read_method: 'manual',
        note: form.note || null,
      });
      onDone(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo chỉ số');
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
      <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
          <h3 className="text-[15px] font-bold text-[color:var(--text)]">Nhập chỉ số mới</h3>
          <button onClick={onClose} className="text-[color:var(--muted)] hover:text-[color:var(--text)]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {error && <div className="text-[12px] text-[color:var(--red)] bg-[color:var(--red)]/10 p-2 rounded-lg">{error}</div>}
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Mã đồng hồ *</label>
            <input value={form.meter_id} onChange={e => setForm({ ...form, meter_id: e.target.value })} placeholder="VD: MTR-000001"
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">CS Cũ *</label>
              <input type="number" value={form.prev_reading} onChange={e => setForm({ ...form, prev_reading: e.target.value })} placeholder="0.000"
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">CS Mới *</label>
              <input type="number" value={form.curr_reading} onChange={e => setForm({ ...form, curr_reading: e.target.value })} placeholder="0.000"
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Ghi chú</label>
            <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Ghi chú..."
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-[color:var(--border)]">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Hủy</button>
          <button onClick={handleSave} disabled={saving}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)] disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Ghi nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Metering ────────────────────────────────────────────────────────────
const Metering: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [allReadings, setAllReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/meter-readings', { params: { limit: 100 } });
      const mapped = (res.data.data || []).map((r: any) => ({
        dbId: r.id,
        id: r.reading_code || `RD-${r.id}`,
        name: r.customer_name || '—',
        meter: r.meter_id || '—',
        prev: parseFloat(r.prev_reading) || 0,
        curr: parseFloat(r.curr_reading) || 0,
        cons: parseFloat(r.consumption_m3) || 0,
        date: formatDate(r.read_at),
        reader: r.reader_name || '—',
        photo: r.has_photo || false,
        status: r.status || 'pending',
      }));
      setAllReadings(mapped);
      setReadings(mapped);
    } catch (err) { console.error('Failed to fetch:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReadings(); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setReadings(allReadings); }
    else {
      const q = searchQuery.toLowerCase();
      setReadings(allReadings.filter(r => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.meter.toLowerCase().includes(q)));
    }
  }, [searchQuery, allReadings]);

  const updateStatus = async (dbId: number, newStatus: string) => {
    setUpdatingId(dbId);
    try {
      await apiClient.patch(`/meter-readings/${dbId}/status?status=${newStatus}`);
      fetchReadings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    } finally { setUpdatingId(null); }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/20 p-3 rounded-xl flex items-start gap-3">
          <Smartphone className="text-[color:var(--cyan)] shrink-0 mt-0.5" size={18} />
          <div className="text-[13px] leading-relaxed">
            <strong>Ghi chỉ số Mobile App</strong> — Nhân viên ghi chỉ số bằng điện thoại, ảnh chụp đồng hồ đính kèm tự động. Hệ thống AI phân tích ảnh và phát hiện bất thường.
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,102,255,0.3)] border-none"><Plus size={14} /> Nhập chỉ số</button>
          <button className="btn btn-ghost btn-sm flex items-center gap-1.5"><Download size={14} /> Xuất Excel</button>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-[color:var(--bg-card)] overflow-x-auto custom-scrollbar flex-1 min-h-[400px] border-[color:var(--border)] shadow-sm">
        <div className="p-3 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={14} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm theo Mã đo, Tên KH..."
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-[12px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-[color:var(--muted)]"><Loader2 className="animate-spin" size={18} /> Đang tải...</div>
        ) : (
        <table className="w-full text-left min-w-[1100px]">
          <thead>
            <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
              <th className="p-4">Mã đọc</th><th className="p-4">Khách hàng</th><th className="p-4">Mã đồng hồ</th>
              <th className="p-4 text-right">CS Cũ</th><th className="p-4 text-right">CS Mới</th>
              <th className="p-4 text-right">Tiêu thụ (m³)</th><th className="p-4">Ngày đọc</th>
              <th className="p-4">Người đọc</th><th className="p-4 text-center">Ảnh</th>
              <th className="p-4">Tình trạng</th><th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.dbId} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors group">
                <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{r.id}</td>
                <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{r.name}</td>
                <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{r.meter}</td>
                <td className="p-4 font-mono text-[12px] text-right text-[color:var(--text-2)]">{r.prev.toFixed(1)}</td>
                <td className="p-4 font-mono text-[12px] text-right font-bold text-[color:var(--text)]">{r.curr.toFixed(1)}</td>
                <td className={`p-4 font-mono text-[13px] text-right font-black ${r.status === 'suspect' ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>{r.cons.toFixed(1)}</td>
                <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{r.date}</td>
                <td className="p-4 text-[12px] text-[color:var(--muted)]">{r.reader}</td>
                <td className="p-4 text-center">
                  {r.photo ? (
                    <div className="inline-flex items-center justify-center p-1.5 rounded-md bg-[color:var(--green)]/10 text-[color:var(--green)] border border-[color:var(--green)]/20 cursor-pointer group-hover:bg-[color:var(--green)]/20 transition-all"><ImageIcon size={14} /></div>
                  ) : <span className="text-[color:var(--red)]">—</span>}
                </td>
                <td className="p-4">
                  {r.status === 'confirmed' ? <span className="badge badge-green text-[10px]">Xác nhận</span>
                   : r.status === 'suspect' ? <span className="badge badge-red text-[10px]">Nghi vấn</span>
                   : <span className="badge badge-yellow text-[10px]">Chờ xử lý</span>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.status !== 'confirmed' && (
                      <button onClick={() => updateStatus(r.dbId, 'confirmed')} disabled={updatingId === r.dbId}
                        className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--green)] disabled:opacity-50" title="Xác nhận">
                        {updatingId === r.dbId ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                      </button>
                    )}
                    {r.status !== 'suspect' && (
                      <button onClick={() => updateStatus(r.dbId, 'suspect')} disabled={updatingId === r.dbId}
                        className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--red)] disabled:opacity-50" title="Đánh dấu nghi vấn">
                        <AlertTriangle size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {readings.length === 0 && <tr><td colSpan={11} className="p-8 text-center text-[color:var(--muted)]">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
        )}
      </div>

      <CreateReadingModal isOpen={showCreate} onClose={() => setShowCreate(false)} onDone={fetchReadings} />
    </div>
  );
};

export default Metering;
