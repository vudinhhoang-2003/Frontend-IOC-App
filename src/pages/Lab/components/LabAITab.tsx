import React from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { AlertTriangle, Lightbulb, RefreshCw, CheckCircle, Cpu } from 'lucide-react';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const LabAITab: React.FC<Props> = ({ data, filters }) => {
  const filteredRecs = data.aiRecommendations.filter(r => {
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q);
    const matchesPlant = filters.filterPlant === 'all' || r.site.includes(filters.filterPlant);
    const matchesStatus = filters.filterStatus === 'all' ||
      (filters.filterStatus === 'alert' && r.level === 'critical') ||
      (filters.filterStatus === 'ok' && r.level === 'info');
    return matchesSearch && matchesPlant && matchesStatus;
  });

  const levelCfg: Record<string, { color: string, label: string, icon: React.ReactNode }> = {
    critical: { color: 'var(--red)', label: 'Khẩn cấp', icon: <AlertTriangle size={15} /> },
    warning: { color: 'var(--yellow)', label: 'Cảnh báo', icon: <AlertTriangle size={15} /> },
    info: { color: 'var(--cyan)', label: 'Thông tin', icon: <Lightbulb size={15} /> },
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      {/* Header filter bar */}
      <div className="flex justify-between items-center pb-3 border-b border-[var(--border)] flex-wrap gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="text-[16px] font-bold text-[var(--text)]">Khuyến nghị AI – Chất lượng nước</div>
          <div className="text-[11px] text-[var(--muted)]">Phân tích từ dữ liệu LIMS & SCADA Online – cập nhật mỗi 1 giờ</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['critical', 'warning', 'info'].map(l => {
            const cnt = filteredRecs.filter(r => r.level === l).length;
            const cfg = levelCfg[l];
            return (
              <div key={l} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ backgroundColor: `${cfg.color}15`, borderColor: `${cfg.color}35`, color: cfg.color }}>
                <span className="text-[10px] font-extrabold uppercase tracking-wide">{cnt} {cfg.label}</span>
              </div>
            );
          })}
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold text-white bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] hover:shadow-[0_4px_10px_rgba(0,102,255,0.25)] transition-all ml-1">
            <RefreshCw size={12} /> Phân tích lại
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-5">
        {filteredRecs.map((r, i) => {
          const cfg = levelCfg[r.level];
          const isCritical = r.level === 'critical';
          
          return (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px] overflow-hidden shadow-lg flex flex-col relative transition-all hover:border-[var(--border-active)]" style={{ borderLeft: `5px solid ${cfg.color}` }}>
              {/* Header card row */}
              <div className="px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0" style={{ color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[var(--text)] leading-tight">{r.title}</h3>
                    <div className="text-[11px] text-[var(--muted)] mt-1 font-medium">
                      Địa điểm: {r.site} &nbsp;·&nbsp; {r.date}
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0" 
                     style={{ backgroundColor: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  {cfg.label}
                </div>
              </div>

              {/* Internal boxes with matched height */}
              <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {/* Current & Forecast */}
                <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border)] flex flex-col gap-3.5 h-full shadow-inner">
                  <div className="text-[10px] font-extrabold tracking-[0.14em] text-[var(--cyan)] uppercase flex items-center gap-1.5 opacity-90">
                    <Cpu size={14} /> Hiện trạng & Dự báo
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[11px] text-[var(--muted)] font-medium mb-1">Đầu vào:</div>
                      <div className="text-[13px] font-bold text-[var(--text)] font-mono leading-none">{r.input || '—'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--muted)] font-medium mb-1">Dự đoán đầu ra:</div>
                      <div className="text-[13px] font-bold text-[var(--green)] font-mono leading-none">{r.predictedOutput || '—'}</div>
                    </div>
                  </div>
                  <div className="text-[13px] leading-[1.65] text-[var(--text)] opacity-80 font-medium border-t border-[var(--border)] pt-3 mt-auto">
                    {r.detail}
                  </div>
                </div>

                {/* Chemical Recommendation */}
                <div className="rounded-xl p-4 border flex flex-col gap-3.5 h-full" 
                     style={{ backgroundColor: `${cfg.color}08`, borderColor: `${cfg.color}15` }}>
                  <div className="text-[10px] font-extrabold tracking-[0.14em] uppercase flex items-center gap-1.5 opacity-90" style={{ color: cfg.color }}>
                    <Lightbulb size={14} /> Liều lượng hóa chất tối ưu
                  </div>
                  <div className="py-3 px-3 rounded-lg border border-dashed text-center bg-[var(--bg-surface)]" 
                       style={{ borderColor: `${cfg.color}40` }}>
                    <span className="text-[15px] font-bold font-mono tracking-tight" style={{ color: cfg.color }}>
                      {r.dosing || '—'}
                    </span>
                  </div>
                  <div className="text-[13px] leading-[1.65] text-[var(--text)] opacity-80 font-medium">
                    {r.action}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--green)] font-bold mt-auto pt-1">
                    <CheckCircle size={14} /> {r.savings || 'Tiết kiệm chi phí'}
                  </div>
                </div>
              </div>

              {/* Action Buttons with same baseline height */}
                <div className="px-5 pb-5 flex justify-end items-center gap-2.5">
                  {isCritical && (
                    <button className="px-5 py-2 rounded-[10px] text-[12px] font-bold text-white transition-all bg-[var(--red)] hover:brightness-110 shadow-[0_4px_12px_rgba(255,71,87,0.3)] h-[34px] flex items-center whitespace-nowrap">
                      Xử lý khẩn cấp
                    </button>
                  )}
                  <button className="px-4 py-2 rounded-[10px] text-[12px] font-bold text-[var(--cyan)] border border-[var(--cyan)]/30 bg-transparent hover:bg-[var(--cyan)]/5 transition-all h-[34px] flex items-center whitespace-nowrap">
                    Giao việc
                  </button>
                  <button className="px-4 py-2 rounded-[10px] text-[12px] font-bold text-[var(--muted)] border border-[var(--border)] bg-transparent hover:bg-[var(--bg-hover)] transition-all h-[34px] flex items-center whitespace-nowrap">
                    Đánh dấu xử lý
                  </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] mt-2 p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Cpu size={100} />
        </div>
        <div className="flex flex-col gap-0.5 mb-4 relative z-10">
          <h4 className="text-[15px] font-bold text-[var(--text)]">Dự báo xu hướng Độ đục mùa mưa 2026</h4>
          <p className="text-[11px] text-[var(--muted)]">Mô hình ARIMA + dữ liệu lịch sử 3 năm – Độ tin cậy 84%</p>
        </div>
        <div className="bg-[var(--cyan)]/[0.04] border border-[var(--cyan)]/15 rounded-xl p-4.5 relative z-10">
          <p className="text-[13px] leading-[1.75] text-[var(--text)] opacity-90">
            Dự báo trong <strong className="text-[var(--cyan)]">tháng 5–9/2026</strong>, độ đục tại đầu vào nhà máy có thể vượt ngưỡng <strong className="text-[var(--yellow)]">5 NTU</strong> vào các đợt mưa lớn, tần suất ước tính <strong>3–5 lần/tháng</strong>. <br/>
            Khuyến nghị: <strong>Tăng cường hóa chất keo tụ PAC thêm 15%</strong>, kiểm tra van thu nước lắng và chuẩn bị bùn thải.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabAITab;
