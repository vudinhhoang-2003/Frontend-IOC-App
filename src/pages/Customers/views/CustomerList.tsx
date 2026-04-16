import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

const mockCustomers = [
  { id: 'KH-05211', name: 'Lê Văn Tám', address: 'P. Hồng Gai, TP. HQ', type: 'household', status: 'active', consumption: 14.2, debt: 0 },
  { id: 'KH-12450', name: 'Cty TNHH TM ABC', address: 'P. Bãi Cháy, TP. HQ', type: 'enterprise', status: 'active', consumption: 320, debt: 1540000 },
  { id: 'KH-08812', name: 'Trần Thị Hoài', address: 'TP. Cẩm Phả', type: 'household', status: 'active', consumption: 0.3, debt: 0 },
  { id: 'KH-19923', name: 'Khách sạn Xanh', address: 'Bãi Cháy, TP. Hạ Long', type: 'enterprise', status: 'suspended', consumption: 0, debt: 4500000 },
  { id: 'KH-02341', name: 'Nguyễn Văn A', address: 'P. Trần Hưng Đạo', type: 'household', status: 'active', consumption: 22.5, debt: 0 },
];

const CustomerList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const total = 302450;
  const pageSize = 10;
  
  return (
    <div className="card flex flex-col min-h-[500px]">
      <div className="p-4 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-between items-center">
         <span className="font-bold text-[14px] text-[color:var(--text)]">Danh sách khách hàng ({total.toLocaleString()})</span>
         <button className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]"><Download size={14} /> Export</button>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left min-w-[900px]">
          <thead>
             <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                <th className="p-4">Mã KH</th>
                <th className="p-4">Tên khách hàng</th>
                <th className="p-4">Địa chỉ</th>
                <th className="p-4">Loại</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Sản lượng</th>
                <th className="p-4">Công nợ</th>
                <th className="p-4 text-right">Thao tác</th>
             </tr>
          </thead>
          <tbody>
             {mockCustomers.map((c, i) => (
                <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors cursor-pointer group">
                   <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{c.id}</td>
                   <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{c.name}</td>
                   <td className="p-4 text-[12px] text-[color:var(--muted)]">{c.address}</td>
                   <td className="p-4">
                      {c.type === 'household' ? (
                         <span className="badge badge-blue text-[10px]">Hộ dân</span>
                      ) : (
                         <span className="badge badge-gray text-[10px]">Doanh nghiệp</span>
                      )}
                   </td>
                   <td className="p-4">
                      {c.status === 'active' ? (
                         <span className="badge badge-green text-[10px]">Đang sử dụng</span>
                      ) : (
                         <span className="badge badge-red text-[10px]">Tạm ngưng</span>
                      )}
                   </td>
                   <td className="p-4 font-mono text-[12px] text-[color:var(--text)]">{c.consumption > 0 ? `${c.consumption} m³` : '—'}</td>
                   <td className={`p-4 font-mono text-[12px] font-bold ${c.debt > 0 ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>
                      {c.debt > 0 ? `${c.debt.toLocaleString()} đ` : 'Không nợ'}
                   </td>
                   <td className="p-4 text-right">
                      <button className="btn btn-ghost btn-sm px-3 text-[12px] text-[color:var(--cyan)] opacity-0 group-hover:opacity-100 transition-opacity">
                         Chi tiết
                      </button>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[color:var(--border)] bg-[color:var(--bg-surface)] flex justify-between items-center text-[13px]">
         <div className="text-[color:var(--muted)] font-medium">
            Hiển thị <strong>1 - 10</strong> trong tổng số <strong>{total.toLocaleString()}</strong>
         </div>
         <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-all"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--cyan)] bg-[color:var(--cyan)]/10 text-[color:var(--cyan)] font-bold shadow-[0_4px_12px_rgba(0,200,255,0.1)]">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-all">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-all">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] opacity-50" disabled>...</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] text-[color:var(--muted)] hover:text-[color:var(--text)] transition-all"><ChevronRight size={16} /></button>
         </div>
      </div>
    </div>
  );
};

export default CustomerList;
