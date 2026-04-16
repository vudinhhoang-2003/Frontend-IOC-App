import React from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { Download, Cpu, Printer } from 'lucide-react';
import { getParamBadge } from '../utils';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const paramLabels: Record<string, string> = { 
  pH: 'PH', turbidity: 'ĐỘ ĐỤC', chlorine: 'CLO DƯ', 
  coliform: 'COLIFORM', arsenic: 'ASEN', nitrate: 'NITRAT', 
  conductivity: 'ĐỘ DẪN ĐIỆN', hardness: 'ĐỘ CỨNG' 
};

const LabResultsTab: React.FC<Props> = ({ data, filters }) => {
  const completedSamples = data.samples.filter(s => {
    if (!s.results) return false;
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = s.id.toLowerCase().includes(q) || s.siteName.toLowerCase().includes(q);
    const matchesPlant = filters.filterPlant === 'all' || s.siteId.includes(filters.filterPlant);

    let matchesStatus = true;
    if (filters.filterStatus === 'ok') {
      matchesStatus = !Object.entries(s.results).some(([k, v]) => {
        const lim = data.limits[k];
        return lim && (k === 'coliform' ? v > 0 : (v < lim.min || v > lim.max));
      });
    } else if (filters.filterStatus === 'alert') {
      matchesStatus = Object.entries(s.results).some(([k, v]) => {
        const lim = data.limits[k];
        return lim && (k === 'coliform' ? v > 0 : (v < lim.min || v > lim.max));
      });
    }

    return matchesSearch && matchesPlant && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
        <div className="text-[13px] text-[var(--muted)]">
          Hiển thị {completedSamples.length} kết quả xét nghiệm
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-transparent border border-transparent hover:bg-[var(--bg-hover)] rounded-[10px] text-[13px] font-medium text-[var(--text)] transition-all whitespace-nowrap">
            <Cpu size={14} /> Import AI (OCR)
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-transparent border border-transparent hover:bg-[var(--bg-hover)] rounded-[10px] text-[13px] font-medium text-[var(--text)] transition-all whitespace-nowrap">
            <Download size={14} /> Import Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[var(--border)] hover:border-[var(--cyan)] hover:bg-[var(--cyan)]/5 rounded-[10px] text-[13px] font-medium text-[var(--cyan)] transition-all whitespace-nowrap">
            <Download size={14} /> Báo cáo QCVN
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] hover:shadow-[0_4px_12px_rgba(0,102,255,0.3)] rounded-[10px] text-[13px] font-bold text-white transition-all shadow-md whitespace-nowrap">
            <Printer size={14} /> Xuất E-CoA
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-[var(--border)]/50 bg-[var(--bg-surface)]">
                <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text)]">Mã mẫu / Điểm</th>
                {Object.keys(paramLabels).map(k => (
                  <th key={k} className="py-2.5 px-2 text-[12px] font-semibold text-[var(--text)] text-center">{paramLabels[k]}</th>
                ))}
                <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text)] text-center">Kết luận</th>
              </tr>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
                <td className="py-1 px-4 text-[10px] text-[var(--muted)] italic">QCVN 01-1:2018/BYT</td>
                {Object.keys(data.limits).map(k => {
                  const lim = data.limits[k];
                  return (
                    <td key={k} className="py-1 px-2 text-[10px] text-[var(--muted)] text-center break-words max-w-[80px]">
                      {lim.min > 0 ? `${lim.min}–` : '≤ '}{lim.max} <br/><span className="text-[9px]">{lim.unit}</span>
                    </td>
                  );
                })}
                <td></td>
              </tr>
            </thead>
            <tbody>
              {completedSamples.map(s => {
                const hasAlert = Object.entries(s.results!).some(([k, v]) => {
                  const lim = data.limits[k];
                  if (!lim) return false;
                  return k === 'coliform' ? v > 0 : (v < lim.min || v > lim.max);
                });

                return (
                  <tr key={s.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-medium text-[var(--cyan)]">{s.id}</div>
                      <div className="font-semibold text-[12px] mt-0.5">{s.siteName}</div>
                      <div className="text-[10px] text-[var(--muted)] mt-0.5">{s.time}</div>
                    </td>
                    {Object.keys(paramLabels).map(k => {
                      const val = s.results?.[k];
                      const lim = data.limits[k];
                      if (val === undefined || val === null || !lim) {
                        return (
                          <td key={k} className="py-3 px-2 text-center">
                            <span className="text-[var(--muted)] text-[11px]">—</span>
                          </td>
                        );
                      }

                      const isAlert = k === 'coliform' ? val > 0 : (val < lim.min || val > lim.max);
                      const isWarning = !isAlert && (() => {
                        const rangePct = (val - lim.min) / (lim.max - lim.min);
                        return rangePct < 0.2 || rangePct > 0.8;
                      })();

                      const st = isAlert 
                        ? { cls: 'bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/20', dot: 'bg-[var(--red)]' }
                        : isWarning
                        ? { cls: 'bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20', dot: 'bg-[var(--yellow)]' }
                        : { cls: 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20', dot: 'bg-[var(--green)]' };

                      return (
                        <td key={k} className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12.5px] font-mono font-bold border whitespace-nowrap ${st.cls}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></div>
                            {val} {lim.unit}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap ${hasAlert ? 'bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/20' : 'bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${hasAlert ? 'bg-[var(--red)]' : 'bg-[var(--green)]'}`}></div>
                        {hasAlert ? 'Không đạt' : 'Đạt chuẩn'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {completedSamples.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[var(--muted)] text-[13px]">
                    Không tìm thấy dữ liệu phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabResultsTab;
