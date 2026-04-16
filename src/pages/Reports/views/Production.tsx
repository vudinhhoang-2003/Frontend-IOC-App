import React from 'react';
import type { ReportPeriodKey } from '../data';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { FACTORIES_MOCK } from '../data';

interface Props {
  periodData: any;
  periodKey: ReportPeriodKey;
}

const PIE_COLORS = ['#00c8ff', '#00e676', '#ffca28', '#7c4dff', '#ff6d00', '#0066ff'];

const Production: React.FC<Props> = ({ periodData, periodKey }) => {
  const d = periodData.production;
  const isHourly = periodKey === 'Hôm nay';
  const totalCap = FACTORIES_MOCK.reduce((s, f) => s + f.capacity, 0);
  const totalOut = FACTORIES_MOCK.reduce((s, f) => s + f.output, 0);
  const useRatio = Math.round((totalOut / totalCap) * 100);

  // Map chart data correctly for recharts
  const chartData = d.chartLabels.map((lbl: string, i: number) => ({ name: lbl, value: d.chartData[i] }));
  const donutData = d.doughnut.map((val: number, i: number) => ({ name: FACTORIES_MOCK[i]?.name.replace('Nhà máy ',''), value: val }));

  return (
    <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="card p-4 border-t-2 border-[color:var(--cyan)] bg-[color:var(--bg-card)] shadow-sm">
              <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Sản lượng – {periodData.label}</div>
              <div className="text-[22px] font-black text-[color:var(--cyan)] mb-0.5">{d.total.toLocaleString()}</div>
              <div className="text-[10px] text-[color:var(--muted)] font-bold">m³ ({periodData.days} ngày)</div>
           </div>
           <div className="card p-4 border-t-2 border-[color:var(--green)] bg-[color:var(--bg-card)] shadow-sm">
              <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Trung bình / ngày</div>
              <div className="text-[22px] font-black text-[color:var(--green)] mb-0.5">{d.avgDay.toLocaleString()}</div>
              <div className="text-[10px] text-[color:var(--muted)] font-bold">m³/ngày</div>
           </div>
           <div className="card p-4 border-t-2 border-[color:var(--yellow)] bg-[color:var(--bg-card)] shadow-sm">
              <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">So kế hoạch</div>
              <div className={`text-[22px] font-black mb-0.5 ${d.vsKH >= 0 ? 'text-[color:var(--green)]' : 'text-[color:var(--red)]'}`}>
                 {d.vsKH >= 0 ? '+' : ''}{d.vsKH}%
              </div>
              <div className="text-[10px] text-[color:var(--muted)] font-bold">{d.vsKH >= 0 ? 'Vượt KH' : 'Thiếu KH'}</div>
           </div>
           <div className="card p-4 border-t-2 border-[color:var(--blue)] bg-[color:var(--bg-card)] shadow-sm">
              <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Công suất sử dụng</div>
              <div className="text-[22px] font-black text-[color:var(--blue)] mb-0.5">{useRatio}%</div>
              <div className="text-[10px] text-[color:var(--muted)] font-bold">trung bình toàn hệ thống</div>
           </div>
        </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
           <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm">
              <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] flex items-center gap-2">
                 <span className="text-[color:var(--text)]">{isHourly ? 'Sản lượng theo giờ (m³/h)' : periodKey === '7 ngày' ? 'Sản lượng 7 ngày (m³)' : 'Sản lượng theo tháng (triệu m³)'}</span>
              </div>
              <div className="p-4 h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    {isHourly ? (
                       <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                          <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                          <YAxis stroke="var(--muted)" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} />
                          <Area type="monotone" dataKey="value" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.1} strokeWidth={2.5} />
                       </AreaChart>
                    ) : (
                       <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                          <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                          <YAxis stroke="var(--muted)" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} cursor={{fill: 'var(--bg-hover)', opacity: 0.3}} />
                          <Bar dataKey="value" fill="var(--cyan)" opacity={0.7} radius={[4,4,0,0]} barSize={24} />
                       </BarChart>
                    )}
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="card bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-sm">
              <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] flex items-center gap-2">
                 <span className="text-[color:var(--text)]">Phân bổ theo nhà máy – {periodData.label}</span>
              </div>
              <div className="p-4 h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                       <Pie
                          data={donutData}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                       >
                          {donutData.map((_: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip formatter={(value: any) => Number(value).toLocaleString()} contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }} />
                       <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </RechartsPieChart>
                 </ResponsiveContainer>
              </div>
           </div>
       </div>

        <div className="card border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
          <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
             Chi tiết sản lượng theo nhà máy – {periodData.label}
          </div>
          <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[700px]">
                <thead>
                   <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-black border-b border-[color:var(--border)] tracking-wider">
                      <th className="p-4">Nhà máy</th>
                      <th className="p-4 text-right">Công suất TK (m³/ng)</th>
                      <th className="p-4 text-right">Thực tế (m³/ng)</th>
                      <th className="p-4">% Sử dụng</th>
                      <th className="p-4 text-right">Kỳ báo cáo (m³)</th>
                      <th className="p-4 text-center">So KH</th>
                   </tr>
                </thead>
               <tbody>
                  {FACTORIES_MOCK.map((f, i) => {
                     const pct = Math.round((f.output / f.capacity) * 100);
                     const pOut = Math.round((d.doughnut[i] || f.output * periodData.days));
                     const vsKhStr = ['+1.8%', '+2.1%', '+2.5%', '+1.2%', '-0.5%', '+3.1%'][i] || '+1.5%';
                     const isDown = vsKhStr.startsWith('-');
                     return (
                         <tr key={f.name} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                            <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{f.name}</td>
                            <td className="p-4 font-mono text-[12px] text-right text-[color:var(--muted)]">{f.capacity.toLocaleString()}</td>
                            <td className="p-4 font-mono text-[13px] text-[color:var(--cyan)] font-black text-right">{f.output.toLocaleString()}</td>
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <div className="h-1.5 flex-1 bg-[color:var(--bg-surface)] rounded-full overflow-hidden w-24 border border-[color:var(--border)]">
                                     <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct > 90 ? 'var(--green)' : pct > 70 ? 'var(--cyan)' : 'var(--yellow)' }} />
                                  </div>
                                  <span className="font-mono text-[12px] font-bold text-[color:var(--text)]">{pct}%</span>
                               </div>
                            </td>
                            <td className="p-4 font-mono text-[12px] text-right text-[color:var(--text)]">{pOut.toLocaleString()}</td>
                            <td className={`p-4 font-mono text-[12px] text-center font-black ${isDown ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>
                               {vsKhStr}
                            </td>
                         </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
       </div>

    </div>
  );
};

export default Production;
