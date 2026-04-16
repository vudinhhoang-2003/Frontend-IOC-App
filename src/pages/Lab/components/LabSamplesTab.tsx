import React, { useState } from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { Download, Plus } from 'lucide-react';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const LabSamplesTab: React.FC<Props> = ({ data, filters }) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const allSamples = data.samples.filter(s => {
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = s.id.toLowerCase().includes(q) ||
      s.siteName.toLowerCase().includes(q) ||
      s.collector.toLowerCase().includes(q);
    const matchesPlant = filters.filterPlant === 'all' || s.siteId.includes(filters.filterPlant);
    const matchesStatus = filters.filterStatus === 'all' || s.status === filters.filterStatus;
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const totalPages = Math.ceil(allSamples.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageSamples = allSamples.slice(start, start + pageSize);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
        <div className="text-[13px] text-[var(--muted)]">
          {allSamples.length} phiếu lấy mẫu &nbsp;|&nbsp; Ngày 01/03/2026
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[var(--border)] hover:bg-white/5 rounded-[10px] text-[13px] font-medium text-[var(--muted)] hover:text-[var(--text)] transition-all">
            <Download size={14} /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] hover:shadow-[0_4px_12px_rgba(0,102,255,0.3)] rounded-[10px] text-[13px] font-bold text-white transition-all shadow-md">
            <Plus size={14} /> Tạo phiếu mới
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Mã mẫu</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Điểm lấy mẫu</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Thời gian</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Nhân viên</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider text-center">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {pageSamples.map((s, i) => {
                const st = s.status === 'alert' 
                  ? { cls: 'bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/20', dot: 'bg-[var(--red)]', label: 'Cảnh báo' } 
                  : s.status === 'pending' 
                  ? { cls: 'bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20', dot: 'bg-[var(--yellow)]', label: 'Chờ kết quả' }
                  : { cls: 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20', dot: 'bg-[var(--green)]', label: 'Đạt chuẩn' };
                
                return (
                  <tr key={s.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="py-3 px-4 text-[12.5px] font-mono font-bold text-[var(--cyan)]">{s.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[13px]">{s.siteName}</div>
                      <div className="font-mono text-[11.5px] font-bold text-[var(--cyan)]">{s.id}</div>
                    </td>
                    <td className="py-3 px-4 text-[12px] font-mono text-[var(--muted)]">{s.time}</td>
                    <td className="py-3 px-4 text-[13px]">{s.collector}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap ${st.cls}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></div>
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.results ? (
                        <button className="px-4 py-1.5 rounded-full text-[12px] font-medium border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-active)] transition-all whitespace-nowrap">
                          Xem chi tiết
                        </button>
                      ) : (
                        <span className="text-[var(--muted)] text-[12px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {pageSamples.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--muted)] text-[13px]">
                    Không tìm thấy dữ liệu phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
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
    </div>
  );
};

export default LabSamplesTab;
