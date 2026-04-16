import React from 'react';
import { Download } from 'lucide-react';

const mockInvoices = [
  { id: 'HD-1029381', name: 'Lê Văn Tám', address: 'P. Hồng Gai', period: 'Tháng 2/2026', consumption: 14, amount: 98000, status: 'paid', issued: '01/03/2026', paidDate: '05/03/2026', method: 'Chuyển khoản' },
  { id: 'HD-1029382', name: 'Cty TNHH TM ABC', address: 'P. Bãi Cháy', period: 'Tháng 2/2026', consumption: 320, amount: 1540000, status: 'unpaid', issued: '01/03/2026', paidDate: '—', method: '—' },
  { id: 'HD-1029383', name: 'Khách sạn Xanh', address: 'Bãi Cháy', period: 'Tháng 1/2026', consumption: 800, amount: 4500000, status: 'partial', issued: '01/02/2026', paidDate: '15/02/2026', method: 'Tiền mặt' },
  { id: 'HD-1029384', name: 'Trần Thị Hoài', address: 'Cẩm Phả', period: 'Tháng 2/2026', consumption: 8, amount: 56000, status: 'paid', issued: '01/03/2026', paidDate: '02/03/2026', method: 'Ví điện tử' },
];

const Billing: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Overview stats */}
      <div className="card p-4 flex flex-wrap items-center gap-6 justify-between border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
        <div className="text-[12px] text-[color:var(--muted)] font-bold uppercase shrink-0 tracking-wider">Tháng 2/2026</div>
        <div className="flex gap-16 justify-center flex-1">
           <div className="text-center">
              <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1 tracking-tight">Đã thu (mẫu)</div>
              <div className="text-[22px] font-black text-[color:var(--green)]">45.2 Tỉ đ</div>
           </div>
           <div className="text-center">
              <div className="text-[11px] text-[color:var(--muted)] uppercase font-bold mb-1 tracking-tight">Còn nợ (mẫu)</div>
              <div className="text-[22px] font-black text-[color:var(--red)]">2.4 Tỉ đ</div>
           </div>
        </div>
        <button className="btn btn-outline btn-sm shrink-0 border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] flex items-center gap-1.5 transition-all">
           <Download size={14} /> Xuất Excel
        </button>
      </div>

        <div className="card bg-[color:var(--bg-card)] overflow-x-auto custom-scrollbar border-[color:var(--border)] shadow-sm">
           <table className="w-full text-left min-w-[900px]">
              <thead>
                 <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                    <th className="p-4">Số HĐ</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Kỳ</th>
                    <th className="p-4 text-center">T.Thụ (m³)</th>
                    <th className="p-4 text-right">Số tiền</th>
                    <th className="p-4 text-center">Trạng thái</th>
                    <th className="p-4">Ngày phát hành</th>
                    <th className="p-4">Ngày TT</th>
                    <th className="p-4">P.Thức</th>
                 </tr>
              </thead>
              <tbody>
                 {mockInvoices.map((i, idx) => (
                    <tr key={idx} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                       <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{i.id}</td>
                       <td className="p-4">
                          <div className="font-bold text-[13px] text-[color:var(--text)]">{i.name}</div>
                          <div className="text-[11px] text-[color:var(--muted)]">{i.address}</div>
                       </td>
                       <td className="p-4 text-[12px] text-[color:var(--text-2)]">{i.period}</td>
                       <td className="p-4 text-center font-mono text-[12px] text-[color:var(--text)]">{i.consumption > 0 ? i.consumption : '-'}</td>
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
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
    </div>
  );
};

export default Billing;
