import React from 'react';
import type { ReportPeriodKey } from '../data';
import { DMA_MOCK } from '../data';

interface Props {
  periodData: any;
  periodKey: ReportPeriodKey;
}

const NRW: React.FC<Props> = ({ periodData }) => {
  const d = periodData.nrw;

  return (
    <div className="flex flex-col gap-5">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 border-t-2 border-[color:var(--yellow)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">NRW trung bình – {periodData.label}</div>
             <div className={`text-[22px] font-black mb-1 ${d.avg > 18 ? 'text-[color:var(--red)]' : d.avg > 15 ? 'text-[color:var(--yellow)]' : 'text-[color:var(--green)]'}`}>
                {d.avg}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">%</span>
             </div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--red)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Tổng thất thoát ước tính</div>
             <div className="text-[22px] font-black text-[color:var(--text)] mb-1">{d.lost.toLocaleString()}</div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold uppercase tracking-tighter">m³/ngày</div>
          </div>
          <div className={`card p-4 border-t-2 bg-[color:var(--bg-card)] shadow-sm ${d.vsPrev < 0 ? 'border-[color:var(--green)]' : 'border-[color:var(--red)]'}`}>
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">So kỳ trước</div>
             <div className={`text-[22px] font-black mb-1 ${d.vsPrev < 0 ? 'text-[color:var(--green)]' : 'text-[color:var(--red)]'}`}>
                {d.vsPrev > 0 ? '▲' : '▼'} {Math.abs(d.vsPrev)}%
             </div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">{d.vsPrev < 0 ? 'Cải thiện tích cực' : 'Cần cải thiện'}</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--cyan)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Mục tiêu 2026</div>
             <div className="text-[22px] font-black text-[color:var(--cyan)] mb-1">{d.target}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">%</span></div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">Còn cách {(d.avg - d.target).toFixed(1)}%</div>
          </div>
       </div>

       <div className="card border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
          <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
             NRW theo khu vực DMA – {periodData.label}
          </div>
          <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[700px]">
                <thead>
                   <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-black border-b border-[color:var(--border)] tracking-wider">
                      <th className="p-4">Khu vực DMA</th>
                      <th className="p-4 text-right">Cấp vào (m³/h)</th>
                      <th className="p-4 text-right">Tiêu thụ (m³/h)</th>
                      <th className="p-4 text-right">Thất thoát (m³/h)</th>
                      <th className="p-4 text-center">NRW %</th>
                      <th className="p-4 text-center">Đánh giá</th>
                   </tr>
                </thead>
               <tbody>
                  {DMA_MOCK.map((z, i) => {
                     const adjLoss = +(z.loss + (d.avg - 14.4) * 0.8).toFixed(1);
                     return (
                         <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                            <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{z.name}</td>
                            <td className="p-4 font-mono text-[12px] text-right text-[color:var(--muted)]">{z.supplyFlow.toLocaleString()}</td>
                            <td className="p-4 font-mono text-[12px] text-right text-[color:var(--text)]">{z.consumptionFlow.toLocaleString()}</td>
                            <td className="p-4 font-mono text-[13px] text-[color:var(--red)] font-black text-right">{(z.supplyFlow - z.consumptionFlow).toLocaleString()}</td>
                            <td className={`p-4 font-mono text-[14px] text-center font-black ${adjLoss > 20 ? 'text-[color:var(--red)]' : adjLoss > 15 ? 'text-[color:var(--yellow)]' : 'text-[color:var(--green)]'}`}>
                               {adjLoss}%
                            </td>
                            <td className="p-4 text-center">
                               {adjLoss > 20 ? (
                                  <span className="badge badge-red text-[10px]">Nghiêm trọng</span>
                               ) : adjLoss > 15 ? (
                                  <span className="badge badge-yellow text-[10px]">Cảnh báo</span>
                               ) : (
                                  <span className="badge badge-green text-[10px]">Đạt</span>
                               )}
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

export default NRW;
