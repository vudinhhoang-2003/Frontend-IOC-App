import React, { useState } from 'react';
import { FileText, ClipboardList, CheckCircle2, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { InspectionOrder } from '../types';

interface Props {
  history: InspectionOrder[];
  onViewDetail: (order: InspectionOrder) => void;
}

const NrwHistoryTab: React.FC<Props> = ({ history, onViewDetail }) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(history.length / pageSize);
  const currentItems = history.slice((page - 1) * pageSize, page * pageSize);
  
  const totalRecovered = history
    .filter(h => h.status === 'done')
    .reduce((acc, h) => acc + h.recovered, 0);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Table Card */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
        <div className="card-header flex justify-between items-center flex-wrap gap-4 px-5 py-4 bg-[var(--bg-surface)]/20 border-b border-[var(--border)]">
          <span className="card-title text-[14px] font-bold text-[var(--text-2)] flex items-center gap-2">
            Lịch sử xử lý rò rỉ / Thất thoát — {history.length} lệnh
          </span>
          <div className="text-[12px] font-bold text-[var(--green)] bg-[var(--green)]/10 px-3 py-1.5 rounded-full border border-[var(--green)]/20 shadow-sm">
            Tổng lưu lượng thu hồi: <b className="font-mono ml-1">{totalRecovered.toLocaleString()} m³/h</b>
          </div>
        </div>

        <div className="table-wrap">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-black/10">
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Mã lệnh</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Ngày & Giờ xử lý</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Khu vực (DMA)</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Vị trí / Nghi vấn</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Người chịu trách nhiệm</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider text-center">Thu hồi (m³/h)</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-3.5 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((h) => (
                <tr key={h.id} className="hover:bg-white/5 transition-all group">
                  <td className="py-3 px-3.5 font-mono text-[12px] font-bold text-[var(--cyan)] selection:bg-[var(--cyan)]/20 uppercase">{h.id}</td>
                  <td className="py-3 px-3.5 text-[12px] text-[var(--text)] font-medium text-left">{h.date || (h as any).created_at?.slice(0,10)}</td>
                  <td className="py-3 px-3.5 text-[13px] font-bold text-[var(--text)] text-left">{h.dmaName || (h as any).dma_name || h.id}</td>
                  <td className="py-3 px-3.5">
                    <div className="text-[12px] font-medium text-[var(--muted)] line-clamp-1 max-w-[180px]" title={h.suspect}>{h.suspect}</div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="text-[12px] font-bold text-[var(--cyan)] hover:border-b hover:border-dashed hover:border-[var(--cyan)] transition-all cursor-pointer inline-block whitespace-nowrap">
                      {h.responsibleName || (h as any).responsible_name || 'Nhân viên Điều hành'}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className={`font-mono font-bold text-[13px] ${h.recovered > 0 ? 'text-[var(--green)]' : 'text-[var(--muted)]/40'}`}>
                      {h.recovered > 0 ? `+${h.recovered.toLocaleString()}` : '--'}
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    {h.status === 'done' ? (
                      <span className="badge badge-green flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--green)]/10 text-[var(--green)] text-[11px] font-bold border border-[var(--green)]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> Hoàn thành
                      </span>
                    ) : (
                      <span className="badge badge-yellow flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--yellow)]/10 text-[var(--yellow)] text-[11px] font-bold border border-[var(--yellow)]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> Đang xử lý
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button 
                      onClick={() => onViewDetail(h)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/20 hover:bg-[var(--cyan)] hover:text-white transition-all rounded-full text-[12px] font-bold uppercase tracking-tight shadow-sm"
                    >
                      <Eye size={14} /> Hồ sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar - Exact Prototype Style */}
        <div className="pagination-bar px-5 py-4 border-t border-[var(--border)] bg-white/20 flex flex-wrap items-center justify-between gap-4">
          <div className="page-info text-[13px] text-[var(--muted)]">
            Hiển thị <strong className="text-[var(--text)]">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, history.length)}</strong> / {history.length} lệnh
          </div>
          <div className="page-nav flex items-center gap-1.5">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="page-link px-4 py-1 min-w-[32px] h-8 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/20 text-[13px] text-[var(--muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/10 disabled:opacity-20 transition-all font-medium"
            >
              Trước
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`page-link min-w-[32px] h-8 px-2 rounded-full text-[13px] font-bold transition-all ${
                    p === page 
                      ? 'bg-[var(--cyan)] text-white shadow-lg shadow-cyan-500/30 border-[var(--cyan)]' 
                      : 'border border-[var(--border)] text-[var(--muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="page-link px-4 py-1 min-w-[32px] h-8 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/20 text-[13px] text-[var(--muted)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/10 disabled:opacity-20 transition-all font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NrwHistoryTab;
