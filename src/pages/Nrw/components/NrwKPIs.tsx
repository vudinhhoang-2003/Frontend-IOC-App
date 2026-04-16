import React from 'react';
import { Droplets, Activity, AlertTriangle, TrendingDown } from 'lucide-react';
import type { DMAZone } from '../types';

interface Props {
  dmaZones: DMAZone[];
}

const NrwKPIs: React.FC<Props> = ({ dmaZones }) => {
  const avgLoss = (dmaZones.reduce((s, z) => s + z.loss, 0) / dmaZones.length).toFixed(1);
  const highRiskCount = dmaZones.filter(z => z.loss > 15).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* KPI 1: Avg NRW */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--yellow)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Droplets size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">NRW Trung bình</div>
        <div className="kpi-value text-[var(--yellow)]">
          {avgLoss}<span className="text-[16px] font-normal text-[var(--muted)] ml-1">%</span>
        </div>
        <div className="kpi-sub font-bold text-[12.5px] text-[var(--muted)]">
          Mục tiêu: <span className="text-[var(--text)] ml-1 tracking-widest">&lt; 15%</span>
        </div>
      </div>

      {/* KPI 2: High Risk DMAs */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--red)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <AlertTriangle size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">DMA Nguy cơ cao</div>
        <div className="kpi-value text-[var(--red)]">
          {highRiskCount}
        </div>
        <div className="kpi-sub font-bold text-[12.5px] text-[var(--red)]">
          Khu vực có NRW &gt; 15%
        </div>
      </div>

      {/* KPI 3: MNF Highlight */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--cyan)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Activity size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">MNF Hồng Gai (03:00)</div>
        <div className="kpi-value">
          4,520<span className="text-[14px] font-normal text-[var(--muted)] ml-1">m³/h</span>
        </div>
        <div className="kpi-sub font-bold text-[12.5px] text-[var(--cyan)]">
           Cần kiểm tra rò rỉ ngầm
        </div>
      </div>

      {/* KPI 4: Estimated Loss */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--purple)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <TrendingDown size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">Ước tính rò rỉ</div>
        <div className="kpi-value text-[var(--purple)]">
          2,450<span className="text-[14px] font-normal text-[var(--muted)] ml-1">m³/ng</span>
        </div>
        <div className="kpi-sub font-bold text-[12.5px] text-[var(--muted)]">
          Toàn bộ mạng lưới
        </div>
      </div>
    </div>
  );
};

export default NrwKPIs;
