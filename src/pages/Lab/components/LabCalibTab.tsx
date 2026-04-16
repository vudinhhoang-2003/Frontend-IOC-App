import React, { useState } from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { Download, Plus, CalendarDays } from 'lucide-react';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const LabCalibTab: React.FC<Props> = ({ data, filters }) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const allCalibs = data.calibrations.filter(c => {
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = c.id.toLowerCase().includes(q) ||
      c.equipment.toLowerCase().includes(q) ||
      c.agency.toLowerCase().includes(q);
    const matchesStatus = filters.filterStatus === 'all' ||
      (filters.filterStatus === 'ok' && c.status === 'ok') ||
      (filters.filterStatus === 'alert' && c.status === 'overdue');
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(allCalibs.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageCalibs = allCalibs.slice(start, start + pageSize);

  const statusMap: Record<string, { cls: string, label: string, dot: string }> = {
    ok: { cls: 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20', dot: 'bg-[var(--green)]', label: 'Còn hiệu lực' },
    warning: { cls: 'bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20', dot: 'bg-[var(--yellow)]', label: 'Sắp hết hạn' },
    overdue: { cls: 'bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/20', dot: 'bg-[var(--red)]', label: 'Hết hạn' }
  };

  const overdueCount = allCalibs.filter(c => c.status === 'overdue').length;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      {/* Summary Bar */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="text-[13px] text-[#808b96] font-medium">{allCalibs.length} thiết bị PTN</div>
          {overdueCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#ff4757]/15 text-[#ff4757] border border-[#ff4757]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4757] mr-1.5" />
              {overdueCount} thiết bị hết hạn
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-[12px] font-bold text-[var(--muted)] bg-transparent border border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] transition-all">
            <Download size={14} /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-[10px] text-[12px] font-bold text-white bg-[var(--blue)] hover:brightness-110 shadow-lg shadow-blue-500/10 transition-all">
            <Plus size={16} /> Thêm thiết bị
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
               <tr className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">MÃ</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">TÊN THIẾT BỊ / MÁY PHÂN TÍCH</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">KIỂM ĐỊNH CUỐI</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">HIỆU LỰC ĐẾN</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">CƠ QUAN KIỂM ĐỊNH</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">SỐ CHỨNG NHẬN</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">TRẠNG THÁI</th>
                <th className="py-3 px-5 text-[10.5px] font-bold text-[var(--muted)] uppercase tracking-wider">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageCalibs.map((c) => {
                const st = statusMap[c.status];
                const dateColor = c.status === 'overdue' ? '#ff4757' : c.status === 'warning' ? '#f1c40f' : '#2ecc71';
                return (
                  <tr key={c.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="py-4 px-5 text-[12.5px] font-mono font-bold text-[var(--cyan)]">{c.id}</td>
                    <td className="py-4 px-5 text-[14px] font-bold text-[var(--text)]">{c.equipment}</td>
                    <td className="py-4 px-5 text-[12.5px] font-medium text-[#808b96]">{c.lastDate}</td>
                    <td className="py-4 px-5 text-[12.5px] font-bold" style={{ color: dateColor }}>{c.nextDate}</td>
                    <td className="py-4 px-5 text-[13.5px] font-medium text-[var(--text)]">{c.agency}</td>
                    <td className="py-4 px-5 text-[11.5px] font-medium text-[#808b96]">{c.cert}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-extrabold border tracking-wider transition-all whitespace-nowrap ${st.cls}`}>
                        <div className={`w-1 h-1 rounded-full ${st.dot}`} />
                        {st.label.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-[10px] text-[11px] font-bold text-[var(--muted)] bg-transparent border border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] transition-all whitespace-nowrap">Gia hạn</button>
                        <button className="p-1.5 rounded-[10px] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] transition-all">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageCalibs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[var(--muted)] text-[13px]">
                    Không tìm thấy dữ liệu phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2 mb-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-hover)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="text-[13px] text-[var(--muted)]">
            Trang <strong className="text-[var(--text)]">{page}</strong> / {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-hover)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 mt-2 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <CalendarDays size={120} />
        </div>
        <div className="flex items-center gap-2 font-bold mb-4 relative z-10">
          <CalendarDays size={18} className="text-[var(--cyan)]" /> Lịch kiểm định tiếp theo (Dự kiến)
        </div>
        <div className="flex flex-col gap-2 relative z-10">
          {[...data.calibrations].sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 5).map(c => {
            const st = statusMap[c.status];
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl" style={{ borderLeft: `3px solid var(--${c.status === 'overdue' ? 'red' : c.status === 'warning' ? 'yellow' : 'green'})` }}>
                <div className="font-mono text-[12px] text-[var(--muted)] min-w-[80px]">{c.nextDate}</div>
                <div className="flex-1 text-[13px] font-semibold">{c.equipment}</div>
                <div className="text-[12px] text-[var(--muted)] hidden sm:block w-[150px] truncate">{c.agency}</div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 ${st.cls}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></div>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LabCalibTab;
