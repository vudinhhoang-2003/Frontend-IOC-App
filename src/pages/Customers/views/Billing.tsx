import React, { useState, useEffect } from 'react';
import { Download, Loader2, X, CreditCard, Ban } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface Invoice {
  uuid: string;
  id: string;
  name: string;
  address: string;
  period: string;
  consumption: number;
  amount: number;
  paidAmount: number;
  status: string;
  issued: string;
  paidDate: string;
  method: string;
}

interface Summary { collected: number; outstanding: number; }

const formatCurrency = (v: number): string => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỉ đ`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} Tr đ`;
  return `${v.toLocaleString()} đ`;
};
const formatDate = (d: string | null): string => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('vi-VN'); } catch { return d; }
};
const formatPeriod = (d: string | null): string => {
  if (!d) return '—';
  try { const dt = new Date(d); return `Tháng ${dt.getMonth() + 1}/${dt.getFullYear()}`; } catch { return d; }
};
const methodMap: Record<string, string> = { bank_transfer: 'Chuyển khoản', cash: 'Tiền mặt', e_wallet: 'Ví điện tử' };

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PaymentModal: React.FC<{
  invoice: Invoice | null; onClose: () => void; onDone: () => void;
}> = ({ invoice, onClose, onDone }) => {
  const [amount, setAmount] = useState('');
  const [payMethod, setPayMethod] = useState('bank_transfer');
  const [payRef, setPayRef] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (invoice) {
      const remaining = invoice.amount - invoice.paidAmount;
      setAmount(remaining > 0 ? remaining.toString() : '');
      setPayMethod('bank_transfer');
      setPayRef('');
      setError('');
    }
  }, [invoice]);

  if (!invoice) return null;

  const remaining = invoice.amount - invoice.paidAmount;

  const handlePay = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError('Số tiền phải > 0'); return; }
    setSaving(true); setError('');
    try {
      await apiClient.post(`/invoices/${invoice.uuid}/payment`, {
        amount: val, payment_method: payMethod, payment_ref: payRef || null,
      });
      onDone(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi thanh toán');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeInScale">
      <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[color:var(--border)]">
          <h3 className="text-[15px] font-bold text-[color:var(--text)]">Thanh toán {invoice.id}</h3>
          <button onClick={onClose} className="text-[color:var(--muted)] hover:text-[color:var(--text)]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          {error && <div className="text-[12px] text-[color:var(--red)] bg-[color:var(--red)]/10 p-2 rounded-lg">{error}</div>}
          <div className="flex justify-between text-[12px]">
            <span className="text-[color:var(--muted)]">Tổng tiền:</span>
            <span className="font-bold text-[color:var(--text)]">{invoice.amount.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[color:var(--muted)]">Còn lại:</span>
            <span className="font-bold text-[color:var(--red)]">{remaining.toLocaleString()} đ</span>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Số tiền thanh toán *</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Phương thức</label>
            <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]">
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="cash">Tiền mặt</option>
              <option value="e_wallet">Ví điện tử</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[color:var(--muted)] uppercase mb-1 block">Mã GD (tùy chọn)</label>
            <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Số GD ngân hàng..."
              className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)]" />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-[color:var(--border)]">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Hủy</button>
          <button onClick={handlePay} disabled={saving}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)] disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />} Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Billing ─────────────────────────────────────────────────────────────
const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [summary, setSummary] = useState<Summary>({ collected: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const [invRes, sumRes] = await Promise.all([
        apiClient.get('/invoices', { params: { skip, limit: pageSize } }),
        apiClient.get('/invoices/summary'),
      ]);
      setTotal(invRes.data.meta?.total || 0);
      setInvoices(
        (invRes.data.data || []).map((i: any) => ({
          uuid: i.id,
          id: i.invoice_no || i.id,
          name: i.customer_name,
          address: i.address || '—',
          period: formatPeriod(i.period_month),
          consumption: parseFloat(i.consumption_m3) || 0,
          amount: parseFloat(i.total_amount_vnd) || 0,
          paidAmount: parseFloat(i.paid_amount_vnd) || 0,
          status: i.display_status || i.status,
          issued: formatDate(i.issued_at),
          paidDate: i.paid_at ? formatDate(i.paid_at) : '—',
          method: i.payment_method ? (methodMap[i.payment_method] || i.payment_method) : '—',
        }))
      );
      const s = sumRes.data.data;
      setSummary({ collected: parseFloat(s?.collected_amount_vnd) || 0, outstanding: parseFloat(s?.outstanding_amount_vnd) || 0 });
    } catch (err) { console.error('Failed to fetch invoices:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [currentPage]);

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

  const handleCancel = async (inv: Invoice) => {
    if (!confirm(`Hủy hóa đơn ${inv.id}?`)) return;
    setCancelling(inv.uuid);
    try {
      await apiClient.post(`/invoices/${inv.uuid}/cancel`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy hóa đơn');
    } finally { setCancelling(null); }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="card p-4 flex flex-wrap items-center gap-6 justify-between border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
        <div className="text-[12px] text-[color:var(--muted)] font-bold uppercase shrink-0 tracking-wider">Tổng quan</div>
        <div className="flex gap-16 justify-center flex-1">
          <div className="text-center">
            <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1">Đã thu</div>
            <div className="text-[22px] font-black text-[color:var(--green)]">{formatCurrency(summary.collected)}</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1">Còn nợ</div>
            <div className="text-[22px] font-black text-[color:var(--red)]">{formatCurrency(summary.outstanding)}</div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm shrink-0 border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] flex items-center gap-1.5"><Download size={14} /> Xuất Excel</button>
      </div>

      {/* Table */}
      <div className="card bg-[color:var(--bg-card)] overflow-x-auto custom-scrollbar border-[color:var(--border)] shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-48 gap-2 text-[color:var(--muted)]"><Loader2 className="animate-spin" size={18} /> Đang tải...</div>
        ) : (
        <table className="w-full text-left min-w-[1050px]">
          <thead>
            <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
              <th className="p-4">Số HĐ</th><th className="p-4">Khách hàng</th><th className="p-4">Kỳ</th>
              <th className="p-4 text-center">T.Thụ (m³)</th><th className="p-4 text-right">Số tiền</th>
              <th className="p-4 text-center">Trạng thái</th><th className="p-4">Ngày PH</th>
              <th className="p-4">Ngày TT</th><th className="p-4">P.Thức</th><th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.uuid} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors group">
                <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{i.id}</td>
                <td className="p-4">
                  <div className="font-bold text-[13px] text-[color:var(--text)]">{i.name}</div>
                  <div className="text-[11px] text-[color:var(--muted)]">{i.address}</div>
                </td>
                <td className="p-4 text-[12px] text-[color:var(--text-2)]">{i.period}</td>
                <td className="p-4 text-center font-mono text-[12px]">{i.consumption > 0 ? i.consumption : '-'}</td>
                <td className={`p-4 text-right font-mono font-bold text-[13px] ${i.amount > 0 ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)]'}`}>
                  {i.amount > 0 ? `${i.amount.toLocaleString()} đ` : '—'}
                </td>
                <td className="p-4 text-center">
                  {i.status === 'paid' && <span className="badge badge-green text-[10px]">Đã thu</span>}
                  {i.status === 'partial' && <span className="badge badge-yellow text-[10px]">Một phần</span>}
                  {i.status === 'unpaid' && <span className="badge badge-red text-[10px]">Chưa thu</span>}
                </td>
                <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{i.issued}</td>
                <td className={`p-4 font-mono text-[11px] ${i.paidDate !== '—' ? 'text-[color:var(--green)]' : 'text-[color:var(--muted)]'}`}>{i.paidDate}</td>
                <td className="p-4 text-[11px] text-[color:var(--muted)]">{i.method}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i.status !== 'paid' && (
                      <button onClick={() => setPayInvoice(i)} className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--green)]" title="Thanh toán"><CreditCard size={14} /></button>
                    )}
                    {(i.status === 'unpaid') && (
                      <button onClick={() => handleCancel(i)} disabled={cancelling === i.uuid}
                        className="p-1.5 rounded-md hover:bg-[color:var(--bg-hover)] text-[color:var(--red)] disabled:opacity-50" title="Hủy HĐ">
                        {cancelling === i.uuid ? <Loader2 className="animate-spin" size={14} /> : <Ban size={14} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan={10} className="p-8 text-center text-[color:var(--muted)]">Không có dữ liệu</td></tr>}
          </tbody>
        </table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-between items-center text-[13px] rounded-b-xl">
        <div className="text-[color:var(--muted)] font-medium">Hiển thị <strong>{startItem} - {endItem}</strong> / <strong>{total.toLocaleString()}</strong></div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] transition-all disabled:opacity-30" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            &lt;
          </button>
          {getPages().map((p, idx) => p === '...'
            ? <button key={`d${idx}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] opacity-50" disabled>...</button>
            : <button key={p} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all font-bold ${currentPage === p ? 'border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 text-[color:var(--cyan)]' : 'border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)]'}`} onClick={() => setCurrentPage(p as number)}>{p}</button>
          )}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] transition-all disabled:opacity-30" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            &gt;
          </button>
        </div>
      </div>

      <PaymentModal invoice={payInvoice} onClose={() => setPayInvoice(null)} onDone={fetchData} />
    </div>
  );
};

export default Billing;
