import React from 'react';
import { Edit2 } from 'lucide-react';
import type { PumpProfile, PumpStation } from '../types';

interface Props {
  profile: PumpProfile;
  stations: PumpStation[];
  onEditStation: (stationId: string) => void;
}

const GanttChart: React.FC<Props> = ({ profile, stations, onEditStation }) => {
  const hours = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];

  const fmt = (h: number) => String(Math.floor(h)).padStart(2, '0');
  const fmtM = (h: number) => String(Math.round((h % 1) * 60)).padStart(2, '0');

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 pt-5 pb-2 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded-md bg-[var(--cyan)]/10 text-[var(--cyan)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 3 12 8 16"/><polyline points="16 8 21 12 16 16"/></svg>
          </div>
          <span className="text-[14px] font-bold text-[var(--text)] uppercase tracking-tight">Biểu đồ Lịch trình 24h</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
             <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] opacity-60 border border-[var(--green)]/20" />
             <span className="text-[10px] font-bold text-[var(--muted)]">Thấp điểm</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
             <div className="w-2.5 h-2.5 rounded-full bg-[var(--red)] opacity-60 border border-[var(--red)]/20" />
             <span className="text-[10px] font-bold text-[var(--muted)]">Cao điểm</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex border-b border-[var(--border)] pb-2 mb-4">
          <div className="w-[160px] flex-shrink-0"></div>
          <div className="flex-1 flex justify-between px-1">
            {hours.map((h, i) => (
              <span key={i} className="text-[10px] font-mono font-bold text-[var(--muted)]">{h}</span>
            ))}
          </div>
          <div className="w-[60px] flex-shrink-0 ml-4"></div>
        </div>

        {stations.map(s => {
          const sched = profile.schedules[s.id] || [];
          const totalH = sched.reduce((a, b) => a + b[1], 0);

          return (
            <div key={s.id} className="group flex items-center mb-4 last:mb-0 gap-4">
              <div className="w-[160px] text-[12.5px] font-bold text-[var(--text)] truncate">{s.name}</div>
              
              <div className="flex-1 h-8 bg-black/10 border border-[var(--border)] rounded-md relative overflow-hidden flex items-center">
                {/* Background Grid Zones - Matching Prototype precisely */}
                <div className="absolute left-0 w-[16.6%] h-full bg-[rgba(0,240,128,0.08)] border-l-2 border-[var(--green)]" />
                <div className="absolute left-[39.6%] w-[8.3%] h-full bg-[rgba(255,60,80,0.08)]" />
                <div className="absolute left-[70.8%] w-[12.5%] h-full bg-[rgba(255,60,80,0.08)]" />
                <div className="absolute left-[91.6%] w-[8.4%] h-full bg-[rgba(0,240,128,0.08)] border-r-2 border-[var(--green)]" />
                
                {/* Horizontal mesh lines for every 4h */}
                <div className="absolute left-[16.6%] h-full border-l border-white/5" />
                <div className="absolute left-[33.3%] h-full border-l border-white/5" />
                <div className="absolute left-[50%] h-full border-l border-white/5" />
                <div className="absolute left-[66.6%] h-full border-l border-white/5" />
                <div className="absolute left-[83.3%] h-full border-l border-white/5" />

                {sched.map((iv, idx) => {
                  const left = (iv[0] / 24) * 100;
                  const width = (iv[1] / 24) * 100;
                  const startH = iv[0];
                  const endH = iv[0] + iv[1];
                  
                  return (
                    <div 
                      key={idx}
                      className="absolute h-[22px] rounded-[3px] transition-opacity cursor-pointer z-10"
                      style={{ 
                        left: `${left}%`, 
                        width: `${width}%`, 
                        backgroundColor: profile.color,
                        boxShadow: `0 0 8px ${profile.color}66`,
                        opacity: 0.85
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                      title={`${fmt(startH)}:${fmtM(startH)} – ${fmt(endH)}:${fmtM(endH)} (${iv[1]}h)`}
                    />
                  );
                })}
              </div>

              <div className="w-[60px] text-right text-[12px] font-mono font-bold text-[var(--cyan)] flex-shrink-0">
                {totalH.toFixed(1)}h
              </div>

              <button 
                onClick={() => onEditStation(s.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--muted)] hover:text-[var(--cyan)] border border-transparent hover:border-[var(--border)]"
              >
                <Edit2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;
