import React from 'react';
import { Download, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';

const KpiHistory: React.FC = () => {
  const history = [
    { id: 'IMP-2026-0023', period: 'Tháng 2/2026', time: '04/03/2026 15:01', user: 'Nguyễn Thành Tâm (Kế toán trưởng)', file: 'BaoCaoTaiChinh_T2_2026.xlsx', kpis: 7, status: 'approved', notes: 'Số liệu BCTC nội bộ. GĐ Trần Phúc Hà duyệt.' },
    { id: 'IMP-2026-0022', period: 'Tháng 1/2026', time: '03/02/2026 10:44', user: 'Nguyễn Thành Tâm (Kế toán trưởng)', file: 'KPI_T1_2026_Final.xlsx', kpis: 8, status: 'approved', notes: 'Số liệu kiểm toán độc lập.' },
    { id: 'IMP-2026-0021', period: 'Tháng 12/2025', time: '05/01/2026 14:22', user: 'Lê Hoàng Nam (Phòng Kế toán)', file: 'TongKetNam2025_KPI.xlsx', kpis: 10, status: 'approved', notes: 'Tổng kết 2025. HĐQT xác nhận.' },
    { id: 'IMP-2026-0020', period: 'Tháng 11/2025', time: '04/12/2025 09:15', user: 'Nguyễn Thành Tâm (Kế toán trưởng)', file: 'KPI_T11_2025_Draft.xlsx', kpis: 6, status: 'rejected', notes: 'Từ chối: doanh thu chưa khớp sổ sách.' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Tổng lần import', v: '23', c: 'border-[color:var(--cyan)] text-[color:var(--cyan)]' },
          { l: 'Đã phê duyệt', v: '21', c: 'border-[color:var(--green)] text-[color:var(--green)]' },
          { l: 'Bị từ chối', v: '2', c: 'border-[color:var(--red)] text-[color:var(--red)]' },
          { l: 'Tháng gần nhất', v: 'Tháng 2', c: 'border-[color:var(--yellow)] text-[color:var(--yellow)]' },
        ].map((s, i) => (
          <div key={i} className={`card p-4 border-t-2 bg-[color:var(--bg-card)] shadow-sm ${s.c.split(' ')[0]}`}>
            <div className={`text-2xl font-black mb-1 ${s.c.split(' ')[1]}`}>{s.v}</div>
            <div className="text-[11px] text-[color:var(--muted)] font-black uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm overflow-hidden">
         <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="font-black text-[14px] text-[color:var(--text)] uppercase tracking-tight">Danh sách Biên bản Import</div>
          <button className="btn btn-ghost btn-sm flex items-center gap-1.5 font-bold text-[color:var(--muted)] hover:text-[color:var(--text)]"><Download size={14} /> Xuất bảng kê</button>
        </div>
        <div className="overflow-x-auto text-left custom-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[color:var(--bg-surface)] border-b border-[color:var(--border)] text-[11px] uppercase text-[color:var(--muted)] font-black tracking-widest">
                <th className="p-4">Kỳ báo cáo</th>
                <th className="p-4">Mã Import</th>
                <th className="p-4">Tệp gốc đính kèm</th>
                <th className="p-4">Thông tin Submit</th>
                <th className="p-4 text-center">Số chỉ số</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <React.Fragment key={i}>
                    <tr className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-all">
                    <td className="p-4">
                      <div className="font-black text-[13px] text-[color:var(--text)]">{h.period}</div>
                      {i === 0 && <div className="badge badge-green mt-1 text-[9px] uppercase font-black tracking-tighter shadow-sm">Mới nhất</div>}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[color:var(--muted)] font-bold">{h.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[9px] bg-[color:var(--green)]/10 text-[color:var(--green)] border border-[color:var(--green)]/30 px-2 py-0.5 rounded font-black uppercase tracking-tighter">XLS</span>
                        <span className="text-[12px] text-[color:var(--cyan)] font-bold group-hover:underline">{(h.file)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[12px] font-semibold">{h.user.split('(')[0].trim()}</div>
                      <div className="text-[10px] text-[color:var(--muted)]">{h.time}</div>
                    </td>
                    <td className="p-4 text-center font-bold text-[14px]">{h.kpis}</td>
                    <td className="p-4">
                       {h.status === 'approved' ? (
                         <div className="flex items-center gap-1.5 text-[color:var(--green)] text-[12px] font-black uppercase tracking-tight">
                           <CheckCircle2 size={14} /> Đã phê duyệt
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-[color:var(--red)] text-[12px] font-black uppercase tracking-tight">
                           <XCircle size={14} /> Bị từ chối
                         </div>
                       )}
                    </td>
                    <td className="p-4 text-right">
                       <button className="btn btn-ghost btn-sm px-3 text-[color:var(--muted)] hover:text-[color:var(--text)] border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-all font-bold text-[11px]">
                          <Eye size={14} className="mr-1.5" /> Xem
                       </button>
                    </td>
                  </tr>
                  {h.notes && (
                    <tr className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]/50">
                       <td colSpan={7} className="px-5 py-2.5 text-[11px] text-[color:var(--muted)] font-bold italic border-l-4 border-[color:var(--cyan)]">
                         📝 Ghi chú: {h.notes}
                       </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KpiHistory;
