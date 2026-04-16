import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const mockLineData = [
  { time: '00h', hg: 1100, bc: 820, cp: 560, ub: 400 },
  { time: '06h', hg: 1050, bc: 780, cp: 580, ub: 420 },
  { time: '12h', hg: 1450, bc: 1080, cp: 800, ub: 580 },
  { time: '18h', hg: 1280, bc: 950, cp: 690, ub: 460 },
  { time: '22h', hg: 1150, bc: 850, cp: 620, ub: 410 },
];
const mockBarData = [
  { time: '00h', val: 11500 }, { time: '06h', val: 10500 },
  { time: '12h', val: 16800 }, { time: '18h', val: 11000 },
  { time: '22h', val: 10500 },
];

const ProductionOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 px-[20px]">
      {/* Line Chart */}
      <div className="card flex flex-col h-[400px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Sản lượng theo giờ (m³/h)
          </h3>
          <span className="text-[10px] font-bold text-[var(--muted)] bg-[rgba(0,0,0,0.2)] px-2 py-1 rounded border border-[rgba(255,255,255,0.05)]">Hôm nay</span>
        </div>
        
        <div className="flex-1 p-5 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockLineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow)', padding: '12px' }}
                itemStyle={{ padding: '2px 0', fontSize: '13px', fontWeight: '700' }}
                labelStyle={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--muted)' }} />
              <Line name="Hồng Gai" type="monotone" dataKey="hg" stroke="var(--cyan)" strokeWidth={3} dot={{ r: 3, fill: 'var(--bg-elevated)', strokeWidth: 2 }} activeDot={{ r: 6, stroke: 'var(--text)' }} />
              <Line name="Bãi Cháy" type="monotone" dataKey="bc" stroke="var(--green)" strokeWidth={2.5} dot={{ r: 2, fill: 'var(--bg-elevated)', strokeWidth: 2 }} />
              <Line name="Cẩm Phả" type="monotone" dataKey="cp" stroke="var(--yellow)" strokeWidth={2.5} dot={{ r: 2, fill: 'var(--bg-elevated)', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card flex flex-col h-[400px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Tổng sản lượng phân bổ
          </h3>
        </div>
        
        <div className="flex-1 p-5 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockBarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--muted)" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'var(--bg-hover)' }}
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}
                itemStyle={{ fontSize: '13px', fontWeight: '700', color: 'var(--cyan)' }}
                labelStyle={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}
              />
              <Bar name="Lưu lượng tống" dataKey="val" fill="var(--cyan)" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductionOverview;
