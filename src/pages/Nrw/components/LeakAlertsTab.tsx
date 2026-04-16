import React from 'react';
import { AlertTriangle, Clock, MapPin, Search, Map, Zap, FileText } from 'lucide-react';
import type { LeakAlert } from '../types';

interface Props {
  alerts: LeakAlert[];
  onViewGis: (alert: LeakAlert) => void;
  onCreateOrder: (alert: LeakAlert) => void;
}

const LeakAlertsTab: React.FC<Props> = ({ alerts, onViewGis, onCreateOrder }) => {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Risk Banner - Exact Prototype Style */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[rgba(255,23,68,0.08)] border border-[rgba(255,23,68,0.25)] text-[13px] text-[var(--red)]">
        <div className="text-[var(--red)] shrink-0 mt-0.5 animate-pulse">
          <AlertTriangle size={18} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="leading-relaxed font-medium">
            Hệ thống phát hiện <strong>{alerts.length} khu vực</strong> có dấu hiệu rò rỉ ngầm dựa trên phân tích MNF. Cần triển khai kiểm tra thực địa ngay.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg hover:border-[var(--border-active)] transition-all p-5">
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-bold text-[15px] text-[var(--text)] tracking-tight truncate">{alert.zone}</h3>
                  <span className="shrink-0 badge badge-blue flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--blue)]/10 text-[var(--cyan)] text-[10px] font-bold border border-[var(--blue)]/20 uppercase tracking-tighter whitespace-nowrap">
                    {alert.dmaId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--muted)] text-[12px] mt-1 font-medium truncate">
                  <Clock size={14} className="shrink-0" /> Phát hiện: {alert.detected}
                </div>
              </div>
              
              <span className={`shrink-0 whitespace-nowrap badge ${
                alert.risk === 'Rất cao' ? 'badge-red' : alert.risk === 'Cao' ? 'badge-yellow' : 'badge-gray'
              } flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" /> {alert.risk}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center border border-[var(--border)]">
                <div className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-tight mb-1">MNF thực tế</div>
                <div className="font-mono text-[20px] font-bold text-[var(--red)] leading-none">{alert.mnf.toLocaleString()}<span className="text-[11px] font-normal ml-0.5 opacity-50 uppercase tracking-tighter"> m³/h</span></div>
              </div>
              <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center border border-[var(--border)]">
                <div className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-tight mb-1">Kỳ vọng thực tế</div>
                <div className="font-mono text-[20px] font-bold text-[var(--green)] leading-none">{alert.expected.toLocaleString()}<span className="text-[11px] font-normal ml-0.5 opacity-50 uppercase tracking-tighter"> m³/h</span></div>
              </div>
              <div className="bg-[var(--bg-elevated)] rounded-lg p-3 text-center border border-[var(--border)]">
                <div className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-tight mb-1">Ước tính rò rỉ</div>
                <div className="font-mono text-[20px] font-bold text-[var(--yellow)] leading-none">{alert.excess.toLocaleString()}<span className="text-[11px] font-normal ml-0.5 opacity-50 uppercase tracking-tighter"> m³/h</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-[13px]">
              <div className="flex gap-2">
                <Search size={14} className="text-[var(--muted)] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold text-[var(--muted)] opacity-60 uppercase tracking-tighter">Nghi vấn:</span>
                  <span className="text-[var(--text)] font-semibold leading-tight">{alert.suspect}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={14} className="text-[var(--muted)] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold text-[var(--muted)] opacity-60 uppercase tracking-tight">Hành động:</span>
                  <span className="text-[var(--text)] font-semibold leading-tight">{alert.action}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-[var(--border)] bg-[var(--bg-surface)]/20">
              <button 
                onClick={() => onViewGis(alert)}
                className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)]/40 transition-all shadow-sm"
              >
                <Map size={14} /> Xem trên GIS
              </button>
              <button 
                onClick={() => onCreateOrder(alert)}
                className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white text-[13px] font-black hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 border border-blue-400/20"
              >
                <FileText size={14} /> Tạo lệnh kiểm tra
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeakAlertsTab;
