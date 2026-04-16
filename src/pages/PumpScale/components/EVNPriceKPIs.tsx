import React from 'react';
import { EVN_PRICES } from '../mockPumpData';

interface PriceKPIProps {
  costSaving: number;
}

const EVNPriceKPIs: React.FC<PriceKPIProps> = ({ costSaving }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {EVN_PRICES.map((p, i) => (
        <div 
          key={i} 
          className="bg-[var(--bg-elevated)] border-l-4 rounded-xl p-4 shadow-sm border border-[var(--border)]"
          style={{ borderLeftColor: p.color }}
        >
          <div className="text-[12px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">{p.name}</div>
          <div className="text-[20px] font-black text-[var(--text)] flex items-baseline gap-1">
            {p.price}
            <span className="text-[12px] font-normal text-[var(--muted)] lowercase">/kWh</span>
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-2 font-medium">{p.range}</div>
        </div>
      ))}
      <div className="bg-[var(--bg-elevated)] border-l-4 border-[var(--green)] rounded-xl p-4 shadow-sm border border-[var(--border)]">
        <div className="text-[12px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Tiết kiệm ước tính</div>
        <div className="text-[20px] font-black text-[var(--green)] flex items-baseline gap-1">
          {(costSaving / 1000000).toFixed(1)}
          <span className="text-[12px] font-normal text-[var(--muted)]">tr.đ/tháng</span>
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-2 font-medium">So với vận hành giờ cao điểm</div>
      </div>
    </div>
  );
};

export default EVNPriceKPIs;
