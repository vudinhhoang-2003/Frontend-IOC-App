import React from 'react';
import type { WaterQualityRecord, QualityLimits } from '../types';
import { checkLimit } from '../utils';

interface Props {
  data: WaterQualityRecord[];
  limits: QualityLimits;
}

export const QualityTable: React.FC<Props> = ({ data, limits }) => {
  const renderCell = (val: number, min: number | undefined, max: number | undefined, decs = 2) => {
    const s = checkLimit(val, min, max);
    const c = s === 'ok' ? 'text-[var(--green)]' : 'text-[#ff4757]';
    return (
      <td className={`font-mono px-4 py-3 ${c}`}>
        {val.toFixed(decs)} {s !== 'ok' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline-block align-middle ml-1">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )}
      </td>
    );
  };

  return (
    <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)] bg-white/[0.02]">
        <span className="font-semibold text-[15px] text-[var(--text)]">Kết quả kiểm nghiệm mới nhất</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 bg-black/20">
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Nhà máy</th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">pH</th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Clo dư <span className="lowercase font-normal opacity-70">(mg/L)</span></th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Độ đục <span className="font-normal opacity-70">(NTU)</span></th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">TDS <span className="lowercase font-normal opacity-70">(mg/L)</span></th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Arsenic <span className="lowercase font-normal opacity-70">(mg/L)</span></th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Coliform</th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Thời gian</th>
              <th className="px-4 py-3.5 text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {data.map((q, idx) => {
              const pHok = checkLimit(q.pH, limits.pH.min, limits.pH.max) === 'ok';
              const Clok = checkLimit(q.chlorine, limits.chlorine.min, limits.chlorine.max) === 'ok';
              const Tok = checkLimit(q.turbidity, undefined, limits.turbidity.max) === 'ok';
              const TDSok = checkLimit(q.TDS, undefined, limits.TDS.max) === 'ok';
              const Aok = checkLimit(q.arsenic, undefined, limits.arsenic.max) === 'ok';
              const overall = pHok && Clok && Tok && TDSok && Aok;

              return (
                <tr key={q.id || idx} className={`border-b border-white/5 transition-colors ${!overall ? 'bg-[#ff4757]/5 hover:bg-[#ff4757]/10' : 'hover:bg-white/5'}`}>
                  <td className="px-4 py-3 font-semibold text-[13px] text-[var(--text)]">{q.factory}</td>
                  {renderCell(q.pH, limits.pH.min, limits.pH.max, 1)}
                  {renderCell(q.chlorine, limits.chlorine.min, limits.chlorine.max, 2)}
                  {renderCell(q.turbidity, undefined, limits.turbidity.max, 1)}
                  {renderCell(q.TDS, undefined, limits.TDS.max, 0)}
                  {renderCell(q.arsenic, undefined, limits.arsenic.max, 3)}
                  <td className={`px-4 py-3 font-mono ${q.coliform === 0 ? 'text-[var(--green)]' : 'text-[#ff4757]'}`}>
                    {q.coliform === 0 ? (
                      <span className="flex items-center">
                        0 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1 opacity-70"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Phát hiện <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 opacity-70">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--muted)] font-medium">{q.time}</td>
                  <td className="px-4 py-3">
                    {overall ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider">ĐẠT CHUẨN</span>
                    ) : (
                      <span className="bg-red-500/10 text-[#ff4757] border border-[#ff4757]/20 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider">VƯỢT NGƯỠNG</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
