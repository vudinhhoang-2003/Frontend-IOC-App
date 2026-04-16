import React from 'react';
import type { WaterQualityRecord, QualityLimits } from '../types';
import { checkLimit } from '../utils';

interface Props {
  data: WaterQualityRecord[];
  limits: QualityLimits;
}

export const QualityGrid: React.FC<Props> = ({ data, limits }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
      <style>{`
        @keyframes alertPulse {
            0% { border-color: rgba(255,71,87,0.4); box-shadow: 0 0 0 0 rgba(255,71,87,0.2); }
            50% { border-color: rgba(255,71,87,0.8); box-shadow: 0 0 10px 2px rgba(255,71,87,0.3); }
            100% { border-color: rgba(255,71,87,0.4); box-shadow: 0 0 0 0 rgba(255,71,87,0.2); }
        }
      `}</style>
      {data.map((q, idx) => {
        const pHok = checkLimit(q.pH, limits.pH.min, limits.pH.max) === 'ok';
        const Clok = checkLimit(q.chlorine, limits.chlorine.min, limits.chlorine.max) === 'ok';
        const Tok = checkLimit(q.turbidity, undefined, limits.turbidity.max) === 'ok';
        const TDSok = checkLimit(q.TDS, undefined, limits.TDS.max) === 'ok';
        const Colok = q.coliform === 0;
        const overall = pHok && Clok && Tok && TDSok && Colok;

        const cardStyle = !overall ? { animation: 'alertPulse 2s infinite' } : {};
        const bgCls = !overall ? 'bg-[#ff4757]/5 border-[#ff4757]/40' : 'bg-[var(--bg-card,#0b1521)] border-[var(--border)] hover:-translate-y-1 hover:shadow-lg hover:border-[var(--cyan)]';
        const badgeCls = overall ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-[#ff4757] border border-[#ff4757]/20';
        const statusLabel = overall ? 'ĐẠT CHUẨN' : 'CẢNH BÁO';

        return (
          <div key={q.id || idx} className={`p-4 relative overflow-hidden rounded-2xl border transition-all duration-200 cursor-default ${bgCls}`} style={cardStyle}>
            <div className="flex justify-between items-start mb-4">
              <div>
                 <div className="text-[15px] font-bold text-[var(--text)] tracking-wide">{q.factory}</div>
                 <div className="text-[11px] text-[var(--muted)] mt-0.5">{q.time}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider ${badgeCls}`}>{statusLabel}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 relative group hover:border-[var(--cyan)] transition-colors">
                <div className="text-[10px] text-[var(--muted)] mb-1 uppercase tracking-wider">pH</div>
                <div className={`text-[16px] font-bold font-mono ${pHok ? 'text-[var(--green)]' : 'text-[#ff4757]'}`}>{q.pH.toFixed(1)}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 relative group hover:border-[var(--cyan)] transition-colors">
                <div className="text-[10px] text-[var(--muted)] mb-1 uppercase tracking-wider">Clo dư</div>
                <div className={`text-[16px] font-bold font-mono ${Clok ? 'text-[var(--green)]' : 'text-[#ff4757]'}`}>{q.chlorine.toFixed(2)} <span className="text-[10px] font-normal text-[var(--muted)]">mg/L</span></div>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 relative group hover:border-[var(--cyan)] transition-colors">
                <div className="text-[10px] text-[var(--muted)] mb-1 uppercase tracking-wider">Độ đục</div>
                <div className={`text-[16px] font-bold font-mono ${Tok ? 'text-[var(--green)]' : 'text-[#ff4757]'}`}>{q.turbidity.toFixed(1)} <span className="text-[10px] font-normal text-[var(--muted)]">NTU</span></div>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 relative group hover:border-[var(--cyan)] transition-colors">
                <div className="text-[10px] text-[var(--muted)] mb-1 uppercase tracking-wider">TDS</div>
                <div className={`text-[16px] font-bold font-mono ${TDSok ? 'text-[var(--green)]' : 'text-[#ff4757]'}`}>{q.TDS} <span className="text-[10px] font-normal text-[var(--muted)]">mg/L</span></div>
              </div>
            </div>
            
            {!overall && (
              <div className="absolute -bottom-3 -right-3 opacity-[0.08] text-[#ff4757]">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
