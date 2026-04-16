import React from 'react';
import { Smartphone, Image as ImageIcon, Download, Search } from 'lucide-react';

const mockReadings = [
  { id: 'RD-2026-9021', name: 'Lê Văn Tám', meter: 'M-00124', prev: 1040.5, curr: 1054.7, cons: 14.2, date: '28/02/2026 09:12', reader: 'Nguyễn Văn B', photo: true, status: 'confirmed' },
  { id: 'RD-2026-9022', name: 'Cty TNHH TM ABC', meter: 'M-09923', prev: 5040.0, curr: 5360.0, cons: 320.0, date: '28/02/2026 10:45', reader: 'Trần Bình', photo: true, status: 'suspect' },
  { id: 'RD-2026-9023', name: 'Khách sạn Xanh', meter: 'M-11200', prev: 10200.0, curr: 10200.0, cons: 0, date: '28/02/2026 11:30', reader: 'Trần Bình', photo: true, status: 'suspect' },
];

const Metering: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="flex-1 bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/20 p-3 rounded-xl flex items-start gap-3">
            <Smartphone className="text-[color:var(--cyan)] shrink-0 mt-0.5" size={18} />
            <div className="text-[13px] leading-relaxed">
               <strong>Ghi chỉ số Mobile App</strong> — Nhân viên ghi chỉ số bằng điện thoại, ảnh chụp đồng hồ đính kèm tự động. Hệ thống AI phân tích ảnh và phát hiện bất thường.
            </div>
         </div>
         <div className="flex gap-2 shrink-0">
            <button className="btn btn-ghost btn-sm flex items-center gap-1.5"><ImageIcon size={14} /> Xem ảnh</button>
            <button className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,102,255,0.3)] border-none"><Download size={14} /> Xuất Excel</button>
         </div>
      </div>

      <div className="card bg-[color:var(--bg-card)] overflow-x-auto custom-scrollbar flex-1 min-h-[400px] border-[color:var(--border)] shadow-sm">
         <div className="p-3 border-b border-[color:var(--border)] bg-[color:var(--bg-surface)] flex gap-2">
            <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={14} />
               <input 
                 type="text" 
                 placeholder="Tìm theo Mã đo, Tên KH..." 
                 className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-[12px] text-[color:var(--text)] outline-none focus:border-[color:var(--cyan)] transition-all" 
               />
            </div>
         </div>
         <table className="w-full text-left min-w-[1000px]">
            <thead>
             <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-bold border-b border-[color:var(--border)]">
                <th className="p-4">Mã đọc</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Mã đồng hồ</th>
                <th className="p-4 text-right">CS Cũ</th>
                <th className="p-4 text-right">CS Mới</th>
                <th className="p-4 text-right">Tiêu thụ (m³)</th>
                <th className="p-4">Ngày đọc</th>
                <th className="p-4">Người đọc</th>
                <th className="p-4 text-center">Ảnh</th>
                <th className="p-4">Tình trạng</th>
             </tr>
          </thead>
            <tbody>
                {mockReadings.map((r, i) => (
                   <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors group">
                      <td className="p-4 font-mono text-[12px] font-bold text-[color:var(--cyan)]">{r.id}</td>
                      <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{r.name}</td>
                      <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{r.meter}</td>
                      <td className="p-4 font-mono text-[12px] text-right text-[color:var(--text-2)]">{r.prev.toFixed(1)}</td>
                      <td className="p-4 font-mono text-[12px] text-right font-bold text-[color:var(--text)]">{r.curr.toFixed(1)}</td>
                      <td className={`p-4 font-mono text-[13px] text-right font-black ${r.status === 'suspect' ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>
                         {r.cons.toFixed(1)}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{r.date}</td>
                      <td className="p-4 text-[12px] text-[color:var(--muted)]">{r.reader}</td>
                      <td className="p-4 text-center">
                         {r.photo ? (
                            <div className="inline-flex items-center justify-center p-1.5 rounded-md bg-[color:var(--green)]/10 text-[color:var(--green)] border border-[color:var(--green)]/20 cursor-pointer group-hover:bg-[color:var(--green)]/20 transition-all">
                               <ImageIcon size={14} />
                            </div>
                         ) : (
                            <span className="text-[color:var(--red)]">—</span>
                         )}
                      </td>
                      <td className="p-4">
                         {r.status === 'confirmed' ? (
                            <span className="badge badge-green text-[10px]">Xác nhận</span>
                         ) : (
                            <span className="badge badge-red text-[10px]">Nghi vấn</span>
                         )}
                      </td>
                   </tr>
                ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Metering;
