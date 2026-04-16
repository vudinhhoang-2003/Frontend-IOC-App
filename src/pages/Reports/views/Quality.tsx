import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { ReportPeriodKey } from '../data';

interface Props {
  periodData: any;
  periodKey: ReportPeriodKey;
}

const mockWaterQuality = [
   { factory: 'Nhà máy nước Diễn Vọng', status: 'ok', pH: 7.21, chlorine: 0.45 },
   { factory: 'Nhà máy nước Đồng Ho', status: 'ok', pH: 7.15, chlorine: 0.38 },
   { factory: 'Nhà máy nước Yên Lập', status: 'warning', pH: 6.95, chlorine: 0.52 },
   { factory: 'Nhà máy nước Hoành Bồ', status: 'ok', pH: 7.30, chlorine: 0.41 },
   { factory: 'Nhà máy nước Cẩm Phả', status: 'critical', pH: 6.80, chlorine: 0.65 }
];

const Quality: React.FC<Props> = ({ periodData }) => {
  const d = periodData.quality;

  return (
    <div className="flex flex-col gap-5">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 border-t-2 border-[color:var(--green)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Mẫu đạt chuẩn – {periodData.label}</div>
             <div className="text-[22px] font-black text-[color:var(--green)] mb-1">{d.passed}<span className="text-[16px] text-[color:var(--muted)] font-bold ml-1">%</span></div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">{Math.round((d.total * d.passed)/100)}/{d.total} mẫu đạt QCVN</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--red)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Mẫu không đạt</div>
             <div className={`text-[22px] font-black mb-1 ${d.failed > 0 ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>{d.failed}</div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">{d.failed > 0 ? 'Cần xử lý ngay' : 'Tất cả đạt chuẩn'}</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--cyan)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">Tổng mẫu kỳ này</div>
             <div className="text-[22px] font-black text-[color:var(--cyan)] mb-1">{d.total}</div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">mẫu kiểm nghiệm</div>
          </div>
          <div className="card p-4 border-t-2 border-[color:var(--yellow)] bg-[color:var(--bg-card)] shadow-sm">
             <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">pH trung bình</div>
             <div className="text-[22px] font-black text-[color:var(--yellow)] mb-1">{d.pH.toFixed(2)}</div>
             <div className="text-[11px] text-[color:var(--muted)] font-bold">Đạt QCVN (6.5 - 8.5)</div>
          </div>
       </div>

       {d.failed > 0 ? (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[color:var(--red)]/10 border border-[color:var(--red)]/30 rounded-xl shadow-sm">
             <AlertCircle size={20} className="text-[color:var(--red)] shrink-0" />
             <div className="text-[13px] text-[color:var(--text)]">
                <span className="font-black text-[color:var(--red)] uppercase tracking-tight">{d.failed} mẫu không đạt QCVN</span> trong kỳ {periodData.label} — Cẩm Phả: Clo dư {d.chlo.toFixed(2)} mg/L (ngưỡng 0.5). Đề nghị kiểm tra công đoạn khử trùng.
             </div>
          </div>
       ) : (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[color:var(--green)]/10 border border-[color:var(--green)]/30 rounded-xl shadow-sm">
             <CheckCircle2 size={20} className="text-[color:var(--green)] shrink-0" />
             <div className="text-[13px] text-[color:var(--text)]">
                Tất cả mẫu kiểm nghiệm trong kỳ <strong className="text-[color:var(--green)]">{periodData.label}</strong> đạt tiêu chuẩn QCVN 01:2009/BYT
             </div>
          </div>
       )}

       <div className="card border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
          <div className="p-4 border-b border-[color:var(--border)] font-bold text-[14px] bg-[color:var(--bg-surface)] text-[color:var(--text)]">
             Kết quả kiểm nghiệm – {periodData.label}
          </div>
          <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[700px]">
                <thead>
                   <tr className="bg-[color:var(--bg-surface)] text-[11px] uppercase text-[color:var(--muted)] font-black border-b border-[color:var(--border)] tracking-wider">
                      <th className="p-4">Nhà máy</th>
                      <th className="p-4 text-center">Tổng mẫu</th>
                      <th className="p-4 text-center">Đạt</th>
                      <th className="p-4 text-center">Không đạt</th>
                      <th className="p-4 text-center">pH TB</th>
                      <th className="p-4 text-center">Clo dư TB</th>
                      <th className="p-4 text-center">Đánh giá</th>
                   </tr>
                </thead>
               <tbody>
                  {mockWaterQuality.map((q, i) => {
                     const samples = Math.round(d.total / mockWaterQuality.length);
                     const failCount = (q.status !== 'ok' && d.failed > 0) ? 1 : 0;
                     const randomPH = (q.pH + (Math.random() * 0.1 - 0.05)).toFixed(2);
                     return (
                         <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
                            <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{q.factory}</td>
                            <td className="p-4 font-mono text-[13px] text-center text-[color:var(--muted)]">{samples}</td>
                            <td className="p-4 font-mono text-[13px] text-[color:var(--green)] font-black text-center">{samples - failCount}</td>
                            <td className={`p-4 font-mono text-[13px] font-black text-center ${failCount > 0 ? 'text-[color:var(--red)]' : 'text-[color:var(--muted)]'}`}>{failCount}</td>
                            <td className="p-4 font-mono text-[12px] text-center text-[color:var(--text)]">{randomPH}</td>
                            <td className={`p-4 font-mono text-[12px] text-center font-black ${q.chlorine > 0.5 ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>{q.chlorine.toFixed(2)}</td>
                            <td className="p-4 text-center">
                               {failCount > 0 ? (
                                  <span className="badge badge-red text-[10px]">Không đạt</span>
                               ) : (
                                  <span className="badge badge-green text-[10px]">Đạt QCVN</span>
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

export default Quality;
