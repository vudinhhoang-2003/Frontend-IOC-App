import React from 'react';
import { Map, FileText, Search, MapPin } from 'lucide-react';
import type { DMAZone } from '../types';

interface Props {
  dmaZones: DMAZone[];
  onViewGis: (dma: DMAZone) => void;
  onCreateOrder: (dma: DMAZone) => void;
  onAnalyzeMnf: (dma: DMAZone) => void;
}

const NrwOverviewTab: React.FC<Props> = ({ dmaZones, onViewGis, onCreateOrder, onAnalyzeMnf }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {dmaZones.map((z) => {
        const lossM3 = z.supplyFlow - z.consumptionFlow;
        const color = z.loss > 20 ? 'var(--red)' : z.loss > 15 ? 'var(--yellow)' : 'var(--green)';
        
        return (
          <div key={z.id} className="card bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[15px] text-[var(--text)] tracking-tight leading-tight uppercase font-black truncate">{z.name}</h3>
                  <p className="text-[12px] text-[var(--muted)] font-medium mt-1 truncate">{z.district}</p>
                </div>
                {z.status === 'critical' ? (
                  <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--red)]/10 text-[var(--red)] text-[10px] font-black uppercase border border-[var(--red)]/20 shadow-sm">nghiêm trọng</span>
                ) : z.status === 'warning' ? (
                  <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--yellow)]/10 text-[var(--yellow)] text-[10px] font-black uppercase border border-[var(--yellow)]/20 shadow-sm">cảnh báo</span>
                ) : (
                  <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-[var(--green)]/10 text-[var(--green)] text-[10px] font-black uppercase border border-[var(--green)]/20 shadow-sm">bình thường</span>
                )}
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-[34px] font-black tracking-tighter leading-none font-mono" style={{ color }}>{z.loss}</span>
                <span className="text-[16px] font-bold text-[var(--muted)]">%</span>
              </div>

              <div className="h-2 w-full bg-[var(--bg-card)] rounded-full overflow-hidden mb-5 border border-[var(--border)]/30">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(z.loss, 100)}%`, backgroundColor: color }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--bg-card)] p-3 rounded-[10px] border border-[var(--border)]">
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight mb-1">Cấp vào</div>
                  <div className="font-mono text-[14px] font-bold text-[var(--text)]">{z.supplyFlow.toLocaleString()}</div>
                </div>
                <div className="bg-[var(--bg-card)] p-3 rounded-[10px] border border-[var(--border)]">
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight mb-1">Thất thoát</div>
                  <div className="font-mono text-[14px] font-bold" style={{ color }}>{lossM3.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {z.status !== 'ok' && (
                  <button 
                    onClick={() => onAnalyzeMnf(z)}
                    className="flex justify-center items-center gap-2 w-full py-2.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--bg-hover)] transition-all"
                  >
                    <Search size={14} /> Phân tích MNF
                  </button>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewGis(z)}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--cyan)] hover:bg-[var(--bg-hover)] transition-all"
                  >
                    <MapPin size={14} /> GIS
                  </button>
                  {z.status !== 'ok' && (
                    <button 
                      onClick={() => onCreateOrder(z)}
                      className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[13px] font-black hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 border border-blue-400/20"
                    >
                      <FileText size={14} /> Tạo lệnh
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NrwOverviewTab;
