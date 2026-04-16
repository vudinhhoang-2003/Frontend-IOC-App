import React from 'react';
import { TrendingDown, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import type { AlertRule } from '../types';

interface Props {
  rules: AlertRule[];
}

const AlertKPIs: React.FC<Props> = ({ rules }) => {
  const activeCount = rules.filter(r => r.active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* KPI 1: Total Rules */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--cyan)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <AlertCircle size={80} />
        </div>
        <div className="kpi-label">Tổng số cảnh báo</div>
        <div className="kpi-value">{rules.length}</div>
        <div className="kpi-sub font-bold text-[12.5px]" style={{ color: 'var(--green)' }}>
           {activeCount} cảnh báo đang kích hoạt
        </div>
      </div>

      {/* KPI 2: Daily Alerts */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--red)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <TrendingDown size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">Cảnh báo trong ngày</div>
        <div className="kpi-value">{rules.length > 5 ? '12' : '4'}</div>
        <div className="kpi-sub font-bold text-[12.5px]" style={{ color: 'var(--red)' }}>
          <TrendingDown size={14} className="mr-1 inline" /> -15% so với hôm qua
        </div>
      </div>

      {/* KPI 3: Avg Response Time */}
      <div className="kpi-card group" style={{ '--accent-color': 'var(--yellow)' } as React.CSSProperties}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Clock size={80} />
        </div>
        <div className="kpi-label uppercase tracking-tight font-black opacity-60">Thời gian phản hồi TB</div>
        <div className="kpi-value">
          8.5 <span className="text-[14px] font-normal text-[var(--muted)]">phút</span>
        </div>
        <div className="kpi-sub font-bold text-[12.5px] text-[var(--muted)]">
          Target: <span className="text-[var(--text)] ml-1 tracking-widest">&lt; 10 PHÚT</span>
        </div>
      </div>
    </div>
  );
};

export default AlertKPIs;
