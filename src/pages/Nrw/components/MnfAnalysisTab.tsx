import React from 'react';
import { Moon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import type { MNFData } from '../types';

interface Props {
  mnfData: MNFData[];
}

const MnfAnalysisTab: React.FC<Props> = ({ mnfData }) => {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Explanation Banner - Exact Prototype Style */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[rgba(255,202,40,0.08)] border border-[rgba(255,202,40,0.25)] text-[13px] text-[var(--text)]">
        <div className="text-[var(--yellow)] shrink-0 mt-0.5">
          <Moon size={18} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="leading-relaxed">
            <strong className="text-[var(--yellow)]">Minimum Night Flow (MNF)</strong> — Lưu lượng tại thời điểm thấp nhất trong đêm (01h–04h) phản ánh lượng rò rỉ thực tế trong mạng lưới. Nếu MNF cao bất thường → có rò rỉ ngầm đáng kể.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {mnfData.map((dma) => (
          <div key={dma.dmaId} className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-[var(--border)] bg-white/5">
              <span className="text-[14px] font-bold text-[var(--text-2)] flex items-center gap-2 uppercase tracking-tight">
                DMA {dma.dmaId.split('-')[1]} – Phân tích đêm 26-27/02/2026
              </span>
            </div>
            
            <div className="p-5">
              {/* Stats Grid - Metric Boxes */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                  <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-tight mb-1">MNF (lúc {dma.mnfHour})</div>
                  <div className="font-mono text-[24px] font-bold text-[var(--yellow)] leading-none">{dma.mnfFlow.toLocaleString()}</div>
                  <div className="text-[11px] text-[var(--muted)] opacity-60 mt-1 uppercase tracking-tight">m³/h</div>
                </div>
                <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
                  <div className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-tight mb-1">Ước tính rò rỉ</div>
                  <div className="font-mono text-[24px] font-bold text-[var(--red)] leading-none">{dma.leakEstimate.toLocaleString()}</div>
                  <div className="text-[11px] text-[var(--muted)] opacity-60 mt-1 uppercase tracking-tight">m³/h (~{dma.leakPct}% MNF)</div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dma.samples} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad_supply_${dma.dmaId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00c8ff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#00c8ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id={`grad_consume_${dma.dmaId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e676" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="hour" 
                      stroke="var(--muted)" 
                      fontSize={11} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted)" 
                      fontSize={11} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-dropdown)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                      labelStyle={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="supply" 
                      stroke="var(--cyan)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill={`url(#grad_supply_${dma.dmaId})`} 
                      name="Lưu lượng cấp"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="consume" 
                      stroke="var(--green)" 
                      strokeWidth={2}
                      strokeDasharray="5 3"
                      fillOpacity={1} 
                      fill={`url(#grad_consume_${dma.dmaId})`} 
                      name="Tiêu thụ kỳ vọng"
                    />
                    <ReferenceLine x={dma.mnfHour} stroke="var(--red)" strokeWidth={2} label={{ position: 'insideTopLeft', value: 'MNF ' + dma.mnfHour, fill: 'var(--red)', fontSize: 10, fontWeight: 'bold' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MnfAnalysisTab;
