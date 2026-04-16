import React from 'react';
import type { ReportPeriodKey } from '../data';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface Props {
  periodData: any;
  periodKey: ReportPeriodKey;
}

const PIE_COLORS = ['#ff1744', '#ffca28', '#ff6d00', '#7c4dff', '#0066ff', '#00c8ff'];

const Incidents: React.FC<Props> = ({ periodData }) => {
  const d = periodData.incidents;

  // Calculate the same proportions as the prototype
  const counts = [
    Math.ceil(d.total * 0.17),
    Math.ceil(d.total * 0.17),
    Math.ceil(d.total * 0.17),
    Math.ceil(d.total * 0.17),
    Math.ceil(d.total * 0.17),
    Math.ceil(d.total * 0.15)
  ];
  
  const labels = ['Vỡ ống', 'Tụt áp', 'Máy bơm', 'Rò rỉ van', 'Mất điện', 'Chất lượng'];
  
  const chartData = labels.map((lbl, i) => ({
    name: lbl,
    value: counts[i],
    color: ['bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-500'][i]
  }));

  return (
    <div className="flex flex-col gap-5">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 border-t-2 border-[color:var(--muted)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Tổng sự cố – {periodData.label}</div>
             <div className="text-[22px] font-black text-[color:var(--text)] mb-0.5">{d.total}</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--green)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Đã xử lý</div>
             <div className="text-[22px] font-black text-[color:var(--green)] mb-0.5">{d.done}</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--yellow)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Đang xử lý</div>
             <div className="text-[22px] font-black text-[color:var(--yellow)] mb-0.5">{d.processing}</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--blue)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">TG xử lý TB</div>
             <div className="text-[22px] font-black text-[color:var(--blue)] mb-0.5">{d.avgTime}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">h</span></div>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pie Chart */}
          <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm overflow-hidden">
             <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
                Phân bổ loại sự cố – {periodData.label}
             </div>
             <div className="p-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                      <Pie
                         data={chartData}
                         innerRadius={0}
                         outerRadius={90}
                         paddingAngle={1}
                         dataKey="value"
                         stroke="none"
                      >
                         {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="var(--bg-card)" strokeWidth={2} />
                         ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                   </RechartsPieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Progress bars list */}
          <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm">
             <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
                Sự cố theo mức độ
             </div>
             <div className="p-5 flex flex-col gap-4">
                {chartData.map((item, i) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-[color:var(--border)] border-dashed last:border-0 last:pb-0">
                      <span className="text-[13px] font-bold text-[color:var(--muted)]">{item.name}</span>
                      <div className="flex items-center gap-3">
                         <div className="w-[120px] h-2 bg-[color:var(--bg-surface)] rounded-full overflow-hidden border border-[color:var(--border)]">
                            <div className={`h-full opacity-80 rounded-full transition-all duration-500`} style={{ width: `${Math.min(item.value * 35, 100)}%`, backgroundColor: PIE_COLORS[i] }} />
                         </div>
                         <span className="font-mono text-[13px] min-w-[25px] text-right font-black text-[color:var(--text)]">{item.value}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default Incidents;
