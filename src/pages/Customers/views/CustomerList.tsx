import React, { useState, useEffect, useCallback } from 'react';
import { Download, ChevronLeft, ChevronRight, Loader2, Search, UserPlus, X, Eye, Edit3, Filter } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface Customer {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  consumption: number;
  debt: number;
  phone?: string;
  email?: string;
}

// ─── Modal: Thêm / Sửa Khách hàng ────────────────────────────────────────────
const CustomerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editData?: Customer | null;
}> = ({ isOpen, onClose, onSaved, editData }) => {
  const [form, setForm] = useState({
    id: '', full_name: '', customer_type: 'household', phone: '', email: '', status: 'active',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        full_name: editData.name,
        customer_type: editData.type,
        phone: editData.phone || '',
        email: editData.email || '',
        status: editData.status,
      });
    } else {
      setForm({ id: '', full_name: '', customer_type: 'household', phone: '', email: '', status: 'active' });
    }
    setError('');
  }, [editData, isOpen]);

  const handleSave = async () => {
    if (!form.full_name.trim()) { setError('Tên khách hàng không được để trống'); return; }
    setSaving(true);
    setError('');
    try {
      if (editData) {
        await apiClient.patch(`/customers/${editData.id}`, {
          full_name: form.full_name,
          customer_type: form.customer_type,
          phone: form.phone || null,
          email: form.email || null,
          status: form.status,
        });
      } else {
        if (!form.id.trim()) { setError('Mã KH không được để trống'); setSaving(false); return; }
        await apiClient.post('/customers', {
          id: form.id,
          full_name: form.full_name,
          customer_type: form.customer_type,
          phone: form.phone || null,
          email: form.email || null,
        });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu khách hàng');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
      <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
          <h3 className="text-[16px] font-bold text-[color:var(--text)]">{editData ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}</h3>
          <button onClick={onClose} className="text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {error && <div className="text-[12px] text-[color:var(--red)] bg-[color:var(--red)]/10 border border-[color:var(--red)]/20 p-2.5 rounded-lg">{error}</div>}
          {!editData && (
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Mã KH</label>
              <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="VD: KH-99001"
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all" />
            </div>
          )}
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Tên khách hàng *</label>
            <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Tên đầy đủ"
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Loại KH</label>
              <select value={form.customer_type} onChange={e => setForm({ ...form, customer_type: e.target.value })}
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]">
                <option value="household">Hộ dân</option>
                <option value="enterprise">Doanh nghiệp</option>
                <option value="government">Cơ quan</option>
              </select>
            </div>
            {editData && (
              <div>
                <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Trạng thái</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]">
                  <option value="active">Đang sử dụng</option>
                  <option value="suspended">Tạm ngưng</option>
                  <option value="terminated">Ngưng HĐ</option>
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Điện thoại</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0912..."
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@..."
                className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-[color:var(--border)]">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Hủy</button>
          <button onClick={handleSave} disabled={saving}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)] disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <UserPlus size={14} />} {editData ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal: Chi tiết khách hàng ───────────────────────────────────────────────
const DetailModal: React.FC<{ customer: Customer | null; onClose: () => void }> = ({ customer, onClose }) => {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
      <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
          <h3 className="text-[16px] font-bold text-[color:var(--text)]">Chi tiết: {customer.id}</h3>
          <button onClick={onClose} className="text-[color:var(--muted)] hover:text-[color:var(--text)]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            ['Tên KH', customer.name],
            ['Loại', customer.type === 'household' ? 'Hộ dân' : customer.type === 'enterprise' ? 'Doanh nghiệp' : 'Cơ quan'],
            ['Trạng thái', customer.status === 'active' ? 'Đang sử dụng' : customer.status === 'suspended' ? 'Tạm ngưng' : 'Ngưng HĐ'],
            ['Địa chỉ', customer.address],
            ['Sản lượng', customer.consumption > 0 ? `${customer.consumption} m³` : '—'],
            ['Công nợ', customer.debt > 0 ? `${customer.debt.toLocaleString()} đ` : 'Không nợ'],
          ].map(([label, val]) => (
            <div key={label as string} className="flex justify-between items-center py-1.5 border-b border-[color:var(--border)]/50">
              <span className="text-[12px] text-[color:var(--muted)] font-bold uppercase">{label}</span>
              <span className="text-[13px] text-[color:var(--text)] font-medium">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end p-5 border-t border-[color:var(--border)]">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Đóng</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const pageSize = 10;

  // Listen for "Thêm KH" button from parent page
  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener('open-create-customer', handler);
    return () => window.removeEventListener('open-create-customer', handler);
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const params: any = { skip, limit: pageSize };
      if (searchQuery.trim()) params.search_query = searchQuery.trim();
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/customers', { params });
      const { data, meta } = res.data;
      setTotal(meta?.total || 0);
      setCustomers(
        (data || []).map((c: any) => ({
          id: c.customer_id,
          name: c.customer_name,
          address: c.address || '—',
          type: c.customer_type,
          status: c.status,
          consumption: parseFloat(c.last_consumption_m3) || 0,
          debt: parseFloat(c.outstanding_debt_vnd) || 0,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearchQuery(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const totalPages = Math.ceil(total / pageSize);
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <div className="card flex flex-col min-h-[500px]">
        {/* Header with search + filters */}
        <div className="p-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] flex flex-wrap justify-between items-center gap-3">
          <span className="font-bold text-[14px] text-[color:var(--text)]">Danh sách khách hàng ({total.toLocaleString()})</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={13} />
              <input
                type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm tên, mã KH, SĐT..."
                className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all w-52" />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={12} />
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg pl-7 pr-2 py-1.5 text-[12px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] appearance-none cursor-pointer">
                <option value="">Tất cả TT</option>
                <option value="active">Đang sử dụng</option>
                <option value="suspended">Tạm ngưng</option>
                <option value="terminated">Ngưng HĐ</option>
              </select>
            </div>
            <button className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]"><Download size={14} /> Export</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-2 text-[color:var(--muted)]"><Loader2 className="animate-spin" size={18} /> Đang tải...</div>
          ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                <th className="p-4">Mã KH</th><th className="p-4">Tên khách hàng</th><th className="p-4">Địa chỉ</th>
                <th className="p-4">Loại</th><th className="p-4">Trạng thái</th><th className="p-4">Sản lượng</th>
                <th className="p-4">Công nợ</th><th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors cursor-pointer group">
                  <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{c.id}</td>
                  <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{c.name}</td>
                  <td className="p-4 text-[12px] text-[color:var(--muted)] max-w-[200px] truncate">{c.address}</td>
                  <td className="p-4">
                    {c.type === 'household' ? <span className="badge badge-blue text-[10px]">Hộ dân</span>
                     : c.type === 'government' ? <span className="badge badge-yellow text-[10px]">Cơ quan</span>
                     : <span className="badge badge-gray text-[10px]">Doanh nghiệp</span>}
                  </td>
                  <td className="p-4">
                    {c.status === 'active' ? <span className="badge badge-green text-[10px]">Đang sử dụng</span>
                     : c.status === 'suspended' ? <span className="badge badge-red text-[10px]">Tạm ngưng</span>
                     : <span className="badge badge-gray text-[10px]">Ngưng HĐ</span>}
                  </td>
                  <td className="p-4 font-mono text-[12px] text-[color:var(--text)]">{c.consumption > 0 ? `${c.consumption} m³` : '—'}</td>
                  <td className={`p-4 font-mono text-[12px] font-bold ${c.debt > 0 ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>
                    {c.debt > 0 ? `${c.debt.toLocaleString()} đ` : 'Không nợ'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setDetailCustomer(c)} className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--cyan)]" title="Chi tiết"><Eye size={14} /></button>
                      <button onClick={() => setEditCustomer(c)} className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)]" title="Sửa"><Edit3 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-[color:var(--muted)]">Không có dữ liệu</td></tr>}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-between items-center text-[13px]">
          <div className="text-[color:var(--muted)] font-medium">Hiển thị <strong>{startItem} - {endItem}</strong> / <strong>{total.toLocaleString()}</strong></div>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] transition-all disabled:opacity-30" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16} /></button>
            {getPages().map((p, idx) => p === '...'
              ? <button key={`d${idx}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] opacity-50" disabled>...</button>
              : <button key={p} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all font-bold ${currentPage === p ? 'border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 text-[color:var(--cyan)]' : 'border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)]'}`} onClick={() => setCurrentPage(p as number)}>{p}</button>
            )}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] transition-all disabled:opacity-30" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerModal isOpen={showCreateModal || !!editCustomer} onClose={() => { setShowCreateModal(false); setEditCustomer(null); }} onSaved={fetchCustomers} editData={editCustomer} />
      <DetailModal customer={detailCustomer} onClose={() => setDetailCustomer(null)} />
    </>
  );
};

export default CustomerList;
