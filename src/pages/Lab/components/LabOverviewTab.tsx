import React from 'react';
import type { LimsData } from '../types';
import type { GlobalFilters } from '../index';
import { FlaskConical, AlertTriangle, CheckCircle, MapPin, TrendingUp } from 'lucide-react';
import { getStatusColor } from '../utils';

interface Props {
  data: LimsData;
  filters: GlobalFilters;
}

const Sparkline = ({ data, colorClass }: { data: number[], colorClass: string }) => {
  const max = Math.max(...data, 0.001);
  return (
    <div className="flex h-[60px] gap-1 items-end mb-2">
      {data.map((v, i) => {
        const heightPct = Math.max(10, Math.round((v / max) * 100));
        const op = (0.35 + (i / data.length) * 0.65).toFixed(2);
        return (
          <div key={i} className="flex-1 flex items-end h-full">
            <div 
              className={`w-full rounded-t-sm ${colorClass}`} 
              style={{ height: `${heightPct}%`, opacity: op }}
            />
          </div>
        );
      })}
    </div>
  );
};

const LabOverviewTab: React.FC<Props> = ({ data, filters }) => {
  const filteredSamples = data.samples.filter(s => {
    const matchesPlant = filters.filterPlant === 'all' || s.siteId.includes(filters.filterPlant);
    const matchesStatus = filters.filterStatus === 'all' || s.status === filters.filterStatus;
    return matchesPlant && matchesStatus;
  });

  const total = filteredSamples.length;
  const okCount = filteredSamples.filter(s => s.status === 'ok').length;
  const alertCnt = filteredSamples.filter(s => s.status === 'alert').length;
  const pendCnt = filteredSamples.filter(s => s.status === 'pending').length;

  const filteredCalib = data.calibrations.filter(c => {
    const matchesStatus = filters.filterStatus === 'all' ||
      (filters.filterStatus === 'ok' && c.status === 'ok') ||
      (filters.filterStatus === 'alert' && c.status === 'overdue');
    return matchesStatus;
  });
  const calibOk = filteredCalib.filter(c => c.status === 'ok').length;
  const calibBad = filteredCalib.filter(c => c.status !== 'ok').length;

  const latestAlert = data.samples.find(s => s.status === 'alert');

  const kpis = [
    { label: 'Tổng mẫu hôm nay', value: total, sub: `${okCount} đạt / ${pendCnt} chờ kết quả`, colorVar: 'var(--cyan)', icon: <FlaskConical size={20} />, colorClass: 'bg-[var(--cyan)]', textClass: 'text-[var(--cyan)]' },
    { label: 'Cảnh báo chất lượng', value: alertCnt, sub: alertCnt > 0 ? 'Yêu cầu xử lý ngay' : 'Không có cảnh báo', colorVar: alertCnt > 0 ? 'var(--red)' : 'var(--green)', icon: <AlertTriangle size={20} />, colorClass: alertCnt > 0 ? 'bg-[var(--red)]' : 'bg-[var(--green)]', textClass: alertCnt > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]' },
    { label: 'Thiết bị kiểm định', value: `${calibOk}/${data.calibrations.length}`, sub: calibBad > 0 ? `${calibBad} cần gia hạn` : 'Tất cả còn hiệu lực', colorVar: calibBad > 0 ? 'var(--yellow)' : 'var(--green)', icon: <CheckCircle size={20} />, colorClass: calibBad > 0 ? 'bg-[var(--yellow)]' : 'bg-[var(--green)]', textClass: calibBad > 0 ? 'text-[var(--yellow)]' : 'text-[var(--green)]' },
    { label: 'Điểm lấy mẫu aktif', value: data.sites.length, sub: 'Tuần hoàn 24h', colorVar: 'var(--cyan)', icon: <MapPin size={20} />, colorClass: 'bg-[var(--cyan)]', textClass: 'text-[var(--cyan)]' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:translate-y-[-2px] transition-all relative overflow-hidden group">
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-60 transition-opacity group-hover:opacity-100 ${kpi.colorClass}`}></div>
            
            <div className="flex justify-between items-start mb-3">
              <div className="text-[11.5px] text-[var(--muted)] font-semibold uppercase tracking-wider">{kpi.label}</div>
              <div className={`p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner ${kpi.textClass}`}>{kpi.icon}</div>
            </div>
            <div className={`text-[30px] font-bold font-mono mb-1 leading-none ${kpi.textClass}`}>{kpi.value}</div>
            <div className="text-[12px] text-[var(--muted)] font-medium">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Alert */}
      {latestAlert && (
        <div className="bg-[var(--red)]/10 border border-[var(--red)]/20 rounded-2xl p-4 flex items-center gap-4 w-full shadow-sm relative overflow-hidden">
          <div className="p-2.5 bg-[var(--red)]/10 rounded-xl border border-[var(--red)]/20">
            <AlertTriangle className="text-[var(--red)]" size={18} />
          </div>

          <div className="flex-1">
            <div className="font-bold text-[var(--red)] text-[15px] mb-1 tracking-tight">
              CẢNH BÁO: Clo dư thấp tại {latestAlert.siteName}
            </div>
            <div className="text-[12.5px] text-[var(--text)] opacity-90 font-medium leading-relaxed">
              Mẫu <strong>{latestAlert.id}</strong> &nbsp;|&nbsp; 
              Clo dư: <span className="text-[var(--red)] font-bold">0.1 mg/l</span> (Yêu cầu 0.2 – 1.0 mg/l) &nbsp;|&nbsp; 
              Nguy cơ tái nhiễm vi khuẩn cuối nguồn nước.
            </div>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-[var(--cyan)] to-[var(--blue)] text-white rounded-full text-[13px] font-bold hover:shadow-[0_4px_12px_rgba(0,180,255,0.3)] hover:brightness-110 active:scale-95 transition-all shrink-0">
            Xử lý ngay
          </button>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Turbidity Trend */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-bold mb-0.5">Xu hướng Độ đục (NTU)</div>
              <div className="text-[11px] text-[var(--muted)]">7 ngày gần nhất – đầu vào NM</div>
            </div>
            <TrendingUp size={16} className="text-[var(--muted)]" />
          </div>
          <Sparkline data={data.trends.turbidity} colorClass="bg-[var(--cyan)]" />
          <div className="flex justify-between border-b border-[var(--border)] pb-3 mb-3">
            {data.trends.dates.map((d, i) => <div key={i} className="text-[10px] text-[var(--muted)] flex-1 text-center">{d}</div>)}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[var(--muted)]">
              Mới nhất: <strong style={{ color: getStatusColor(data.trends.turbidity[data.trends.turbidity.length-1], 'turbidity') }}>{data.trends.turbidity[data.trends.turbidity.length-1]} NTU</strong>
            </span>
            <span className="text-[12px] text-[var(--muted)]">Ngưỡng: &le; 2 NTU</span>
          </div>
        </div>

        {/* Chlorine Trend */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-bold mb-0.5">Xu hướng Clo dư (mg/l)</div>
              <div className="text-[11px] text-[var(--muted)]">7 ngày – điểm cuối nguồn DMA-08</div>
            </div>
            <TrendingUp size={16} className="text-[var(--muted)]" />
          </div>
          <Sparkline data={data.trends.chlorine} colorClass="bg-[var(--green)]" />
          <div className="flex justify-between border-b border-[var(--border)] pb-3 mb-3">
            {data.trends.dates.map((d, i) => <div key={i} className="text-[10px] text-[var(--muted)] flex-1 text-center">{d}</div>)}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[var(--muted)]">
              Mới nhất: <strong style={{ color: getStatusColor(data.trends.chlorine[data.trends.chlorine.length-1], 'chlorine') }}>{data.trends.chlorine[data.trends.chlorine.length-1]} mg/l</strong>
            </span>
            <span className="text-[12px] text-[var(--muted)]">Ngưỡng: 0.2 – 1.0 mg/l</span>
          </div>
        </div>
      </div>

      {/* Sites map list */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold">Bản đồ chất lượng nước – điểm lấy mẫu</div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[var(--text)] bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] transition-colors">
            <MapPin size={14} /> Xem trên GIS
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.sites.map(site => {
            const s = data.samples.find(sm => sm.siteId === site.id);
            const dotColor = !s ? 'var(--muted)' : s.status === 'alert' ? 'var(--red)' : s.status === 'pending' ? 'var(--yellow)' : 'var(--green)';
            const label = !s ? 'Chưa lấy mẫu' : s.status === 'alert' ? 'Cảnh báo' : s.status === 'pending' ? 'Đang phân tích' : 'Đạt chuẩn';
            return (
              <div key={site.id} className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border-l-[3px]" style={{ borderColor: dotColor }}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s?.status === 'alert' ? 'animate-pulse' : ''}`} style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }} />
                <div>
                  <div className="text-[13px] font-semibold truncate leading-tight mb-1">{site.name}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">{site.id} · <span style={{ color: dotColor }}>{label}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LabOverviewTab;
