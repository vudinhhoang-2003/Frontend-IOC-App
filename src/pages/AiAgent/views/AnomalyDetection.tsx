import React from 'react';
import { AlertCircle, Download } from 'lucide-react';

const AnomalyDetection: React.FC = () => {
  const anomalies = [
    { id: 'AN-001', customer: 'KH-05211 – Lê Văn Tám', address: 'P. Hồng Gai, HQ', prevMonth: '14.2', thisMonth: '0', change: '-100%', risk: 'Đồng hồ hỏng / Rò rỉ', action: 'Lên lịch kiểm tra', time: '27/02/2026 22:00' },
    { id: 'AN-002', customer: 'KH-12450 – Cty TNHH TM ABC', address: 'P. Bãi Cháy, HQ', prevMonth: '320', thisMonth: '890', change: '+178%', risk: 'Tiêu thụ tăng đột biến', action: 'Xác minh mục đích SD', time: '27/02/2026 20:00' },
    { id: 'AN-003', customer: 'KH-08812 – Trần Thị Hoài', address: 'TP. Cẩm Phả', prevMonth: '18.5', thisMonth: '0.3', change: '-98%', risk: 'Nghi vấn bỏ đồng hồ', action: 'Xuống kiểm tra hiện trường', time: '27/02/2026 18:00' },
  ];

  return (
    <div className="flex flex-col gap-4">
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-3 px-4 py-3.5 bg-[color:var(--yellow)]/10 border border-[color:var(--yellow)]/30 rounded-xl flex-1 shadow-sm">
            <AlertCircle size={20} className="text-[color:var(--yellow)] shrink-0" />
            <div className="text-[13px] text-[color:var(--text)]">
              AI đã phát hiện <strong className="text-[color:var(--yellow)] font-black uppercase tracking-tight">{anomalies.length} bất thường</strong> trong dữ liệu ghi chỉ số tháng 2/2026. Cần kiểm tra thực địa.
            </div>
         </div>
         <button className="btn btn-outline btn-sm shrink-0 flex items-center gap-1.5 border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text)] hover:bg-[color:var(--bg-hover)] font-bold">
            <Download size={14} /> Xuất danh sách
         </button>
       </div>

       <div className="card overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[color:var(--border)] whitespace-nowrap bg-[color:var(--bg-surface)] text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">
                <th className="p-4">Mã PHệT</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Địa chỉ</th>
                <th className="p-4 text-center">T.tiêu tháng trước</th>
                <th className="p-4 text-center">T.tiêu tháng này</th>
                <th className="p-4 text-center">Biến động</th>
                <th className="p-4">Nghi vấn</th>
                <th className="p-4">Hành động đề xuất</th>
                <th className="p-4">Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a, i) => {
                 const isZero = a.thisMonth === '0';
                 const isDown = a.change.startsWith('-');
                 return (
                   <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                    <td className="p-4 font-mono text-[12px] text-[color:var(--cyan)] font-black">{a.id}</td>
                    <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{a.customer}</td>
                    <td className="p-4 text-[11px] text-[color:var(--muted)] font-bold">{a.address}</td>
                    <td className="p-4 text-center font-mono text-[11px] text-[color:var(--muted)]">{a.prevMonth} m³</td>
                    <td className={`p-4 text-center font-mono font-black ${isZero ? 'text-[color:var(--red)]' : 'text-[color:var(--yellow)]'}`}>{a.thisMonth} m³</td>
                    <td className={`p-4 text-center font-mono font-black ${isDown ? 'text-[color:var(--red)]' : 'text-[color:var(--yellow)]'}`}>{a.change}</td>
                    <td className="p-4 text-[12px] text-[color:var(--yellow)] font-bold">{a.risk}</td>
                    <td className="p-4 text-[12px] text-[color:var(--cyan)] font-black">{a.action}</td>
                    <td className="p-4 text-[11px] text-[color:var(--muted)] font-mono font-bold">{a.time}</td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export default AnomalyDetection;
