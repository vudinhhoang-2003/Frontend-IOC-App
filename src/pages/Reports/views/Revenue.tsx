import React from 'react';
import type { ReportPeriodKey } from '../data';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  periodData: any;
  periodKey: ReportPeriodKey;
}

const Revenue: React.FC<Props> = ({ periodData }) => {
  const d = periodData.revenue;

  // Map to recharts data structure
  const chartData = d.chartLabels.map((lbl: string, i: number) => ({
     name: lbl,
     revenue: d.chartData[i],
     target: d.chartKH[i]
  }));

  return (
    <div className="flex flex-col gap-5">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 border-t-2 border-[color:var(--cyan)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Doanh thu – {periodData.label}</div>
             <div className="text-[26px] font-black text-[color:var(--cyan)] mb-1 leading-none mt-1">
                {d.total}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">tỷ</span>
             </div>
             <div className="text-[11px] font-bold text-[color:var(--green)] mt-1 tracking-tight">▲ vs kỳ trước {d.vsPrev}%</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--green)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Tỷ lệ thu nợ</div>
             <div className="text-[26px] font-black text-[color:var(--green)] mb-1 leading-none mt-1">
                {d.debtRate || '—'}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">{d.debtRate ? '%' : ''}</span>
             </div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">Hoàn thành tốt</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--yellow)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Tổng công nợ</div>
             <div className="text-[26px] font-black text-[color:var(--yellow)] mb-1 leading-none mt-1">
                {d.debt}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">tỷ</span>
             </div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold italic tracking-tight italic">Nợ quá hạn: 1.2 tỷ</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--blue)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Khách hàng mới</div>
             <div className="text-[26px] font-black text-[color:var(--blue)] mb-1 leading-none mt-1">
                {d.newCustomers}
             </div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold mt-1 tracking-tight">tăng trưởng mạnh</div>
          </div>
       </div>

       <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm">
          <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
             Doanh thu theo thời gian – {periodData.label}
          </div>
          <div className="p-4 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                   <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                   <YAxis stroke="var(--muted)" fontSize={11} tickFormatter={(v) => `${v}Tỷ`} />
                   <Tooltip 
                      cursor={{ fill: 'var(--bg-hover)', opacity: 0.3 }} 
                      contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} 
                   />
                   <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                   <Bar dataKey="revenue" name="Doanh thu (tỷ đ)" fill="var(--cyan)" opacity={0.7} radius={[4, 4, 0, 0]} maxBarSize={50} />
                   <Bar dataKey="target" name="Kế hoạch (tỷ đ)" fill="var(--green)" opacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
};

export default Revenue;
