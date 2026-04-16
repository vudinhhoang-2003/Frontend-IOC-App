import React, { useState } from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { Download, CalendarDays } from 'lucide-react';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const LabInspectionTab: React.FC<Props> = ({ data, filters }) => {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const { history, upcoming } = data.waterInspections;

  const filteredHistory = history.filter(h => {
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = h.plant.toLowerCase().includes(q) ||
      h.agency.toLowerCase().includes(q) ||
      h.note.toLowerCase().includes(q);
    const matchesPlant = filters.filterPlant === 'all' ||
      (filters.filterPlant === 'NM-01' && h.plant.includes('Hạ Long 1')) ||
      (filters.filterPlant === 'NM-02' && h.plant.includes('Hạ Long 2')) ||
      (filters.filterPlant === 'NM-03' && h.plant.includes('Uông Bí'));
    const matchesStatus = filters.filterStatus === 'all' ||
      (filters.filterStatus === 'ok' && h.result === 'pass') ||
      (filters.filterStatus === 'alert' && h.result === 'fail');
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const totalPages = Math.ceil(filteredHistory.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageHistory = filteredHistory.slice(start, start + pageSize);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start animate-in fade-in">
      {/* History */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-lg min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[16px] font-bold text-[var(--text)]">Lịch sử kết quả kiểm định ({filteredHistory.length})</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#b0b0b0] bg-[#1a1b1e] border border-white/5 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
            <Download size={15} /> Tải báo cáo
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-2 text-[11px] font-bold text-[#636e72] uppercase tracking-wider">NGÀY / NM / CƠ QUAN</th>
                <th className="py-2 text-[11px] font-bold text-[#636e72] uppercase tracking-wider text-center">MẪU</th>
                <th className="py-2 text-[11px] font-bold text-[#636e72] uppercase tracking-wider text-right pr-4">KẾT QUẢ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageHistory.map(h => (
                <tr key={h.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-[14.5px] text-[var(--text)] mb-0.5">{h.plant}</div>
                    <div className="text-[12px] text-[#808b96] mb-1">{h.date} &nbsp;·&nbsp; {h.agency}</div>
                    {h.note && (
                      <div className="text-[12px] text-[#f1c40f] font-medium italic opacity-85">
                        Note: {h.note}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    <div className="font-bold text-[14px] text-[var(--text)]">{h.numSamples} mẫu</div>
                    <div className={`text-[11px] mt-0.5 ${h.numFail > 0 ? 'text-[#ff4757] font-bold' : 'text-[#808b96]'}`}>
                      {h.numFail > 0 ? `${h.numFail} lỗi` : '0 lỗi'}
                    </div>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border tracking-wider transition-all whitespace-nowrap ${
                        h.result === 'pass' 
                          ? 'bg-[#2ecc71]/10 text-[#2ecc71] border-[#2ecc71]/20' 
                          : 'bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/20'
                      }`}
                    >
                      <div className={`w-1 h-1 rounded-full ${h.result === 'pass' ? 'bg-[#2ecc71]' : 'bg-[#ff4757]'}`}></div>
                      {h.result === 'pass' ? 'ĐẠT' : 'CHƯA ĐẠT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-[#1a1b1e] text-[#808b96] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="text-[12px] text-[#808b96]">
              Trang <strong className="text-white">{page}</strong> / {totalPages}
            </span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-[#1a1b1e] text-[#808b96] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--text)] mb-1">Lịch kiểm định nước liên ngành sắp tới</h3>
            <p className="text-[11px] text-[#808b96]">Dựa trên kế hoạch của Sở Y tế & CDC Quảng Ninh</p>
          </div>
          <CalendarDays className="text-[var(--cyan)]" size={22} />
        </div>
        
        <div className="space-y-4">
          {upcoming.map(u => (
            <div key={u.id} className="p-5 bg-black/20 border border-white/5 rounded-xl flex flex-col gap-1.5 hover:border-white/10 transition-all">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3498db]/20 text-[#3498db] border border-[#3498db]/30 uppercase tracking-tight">
                  {u.period}
                </span>
                <span className="font-bold text-[13px] text-[#f1c40f]">
                  {u.plannedDate}
                </span>
              </div>
              <div className="font-bold text-[15px] text-[var(--text)]">{u.plant}</div>
              <div className="text-[12px] text-[#808b96] mb-3">{u.agency}</div>
              
              <div className="relative bg-[#000000]/30 p-3.5 pl-5 rounded-lg border-l-4 border-[#f1c40f] text-[13px] leading-[1.6] text-[var(--text)]">
                <span className="text-[#f1c40f] font-bold">Ghi chú:</span> {u.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabInspectionTab;
