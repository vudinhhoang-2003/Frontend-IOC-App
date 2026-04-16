import React from 'react';
import { Edit2, LayoutList } from 'lucide-react';
import type { PumpProfile, PumpStation, ScheduleInterval } from '../types';

interface Props {
  profile: PumpProfile;
  stations: PumpStation[];
  onEditStation: (stationId: string) => void;
}

const StationTable: React.FC<Props> = ({ profile, stations, onEditStation }) => {
  const getIntervalLabel = (iv: ScheduleInterval) => {
    const startH = Math.floor(iv[0]);
    const startM = Math.round((iv[0] % 1) * 60);
    const endVal = iv[0] + iv[1];
    const endH = Math.floor(endVal);
    const endM = Math.round((endVal % 1) * 60);
    const fmt = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return `${fmt(startH, startM)}–${fmt(endH, endM)}`;
  };

  const getPriceTag = (iv: ScheduleInterval) => {
    // Basic classification based on EVN ranges
    const start = iv[0];
    const isPeak = (start >= 9.5 && start < 11.5) || (start >= 17 && start < 20);
    const isLow = (start >= 22) || (start + iv[1] <= 4);

    if (isPeak) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">CAO ĐIỂM</span>;
    if (isLow) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">THẤP ĐIỂM</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">BÌNH THƯỜNG</span>;
  };

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center rounded-md bg-[var(--cyan)]/10 text-[var(--cyan)]">
          <LayoutList size={14} strokeWidth={2.5} />
        </div>
        <span className="text-[14px] font-bold text-[var(--text)] uppercase tracking-tight">Chi tiết khung giờ vận hành</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <th className="py-3 px-5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Trạm bơm</th>
              <th className="py-3 px-5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Khung giờ</th>
              <th className="py-3 px-5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-center">Tổng giờ</th>
              <th className="py-3 px-5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Phân loại</th>
              <th className="py-3 px-5 text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(s => {
              const sched = profile.schedules[s.id] || [];
              const totalH = sched.reduce((a, b) => a + b[1], 0);

              return (
                <tr key={s.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="py-4 px-5">
                    <div className="text-[13.5px] font-bold text-[var(--text)]">{s.name}</div>
                    <div className="text-[11px] font-medium text-[var(--muted)]">{s.factory}</div>
                  </td>
                  <td className="py-4 px-5">
                    {sched.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {sched.map((iv, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[12px] font-mono font-bold text-[var(--text-2)]">{getIntervalLabel(iv)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[12px] text-[var(--muted)] italic">Chưa thiết lập</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="text-[15px] font-mono font-black" style={{ color: profile.color }}>
                      {totalH.toFixed(1)}h
                    </span>
                  </td>
                  <td className="py-4 px-5">
                     <div className="flex flex-col gap-1.5">
                        {sched.map((iv, idx) => (
                          <div key={idx} className="flex items-center h-[18px]">
                            {getPriceTag(iv)}
                          </div>
                        ))}
                      </div>
                  </td>
                  <td className="py-4 px-5 text-right text-[12px]">
                    <button 
                      onClick={() => onEditStation(s.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all font-bold"
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
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

export default StationTable;
