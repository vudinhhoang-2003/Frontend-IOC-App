import React, { useState } from 'react';
import { 
  Download, 
  Calendar,
  Activity,
  Droplet,
  Waves,
  AlertTriangle,
  LineChart
} from 'lucide-react';
import { REPORT_DATA, type ReportPeriodKey, type ReportTab } from './data';
import Production from './views/Production';
import Quality from './views/Quality';
import NRW from './views/NRW';
import Incidents from './views/Incidents';
import Revenue from './views/Revenue';

const PERIOD_OPTIONS: { key: ReportPeriodKey, label: string }[] = [
  { key: 'Hôm nay', label: 'Hôm nay' },
  { key: '7 ngày', label: '7 ngày' },
  { key: 'T2/2026', label: 'Tháng 2/2026' },
  { key: 'Q1/2026', label: 'Quý 1/2026' },
  { key: 'N2026', label: 'Năm 2026' }
];

const Reports: React.FC = () => {
  const [period, setPeriod] = useState<ReportPeriodKey>('T2/2026');
  const [activeTab, setActiveTab] = useState<ReportTab>('production');

  const currentData = REPORT_DATA[period];

  const handleExport = (type: 'PDF' | 'Excel') => {
    alert(`Đang chuẩn bị dữ liệu báo cáo ${type}...`);
  };

  const tabs = [
    { id: 'production', label: 'Sản lượng', icon: Activity },
    { id: 'quality', label: 'Chất lượng nước', icon: Droplet },
    { id: 'nrw', label: 'NRW / Thất thoát', icon: Waves },
    { id: 'incidents', label: 'Sự cố', icon: AlertTriangle },
    { id: 'revenue', label: 'Doanh thu', icon: LineChart },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)] mb-0.5">Báo cáo & Phân tích</h1>
          <p className="text-[13px] text-[color:var(--muted)]">Tổng hợp dữ liệu vận hành theo ngày / tháng / năm</p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button 
            onClick={() => handleExport('PDF')}
            className="btn btn-ghost btn-sm flex items-center gap-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            <Download size={14} /> Xuất PDF
          </button>
          <button 
            onClick={() => handleExport('Excel')}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)] border-none"
          >
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Period Selector Wrapper */}
      <div className="card p-3 px-5 flex flex-wrap items-center gap-4 mb-5 border border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-sm">
        <div className="flex items-center gap-2 text-[13px] font-bold text-[color:var(--muted)] shrink-0 uppercase tracking-wider">
           <Calendar size={14} className="text-[color:var(--cyan)]" /> Kỳ báo cáo:
        </div>
        <div className="flex flex-wrap gap-1.5">
           {PERIOD_OPTIONS.map((opt) => (
             <button
               key={opt.key}
               className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all border ${
                 period === opt.key 
                   ? 'bg-[color:var(--cyan)]/20 text-[color:var(--cyan)] border-[color:var(--cyan)] shadow-[0_4px_12px_rgba(0,200,255,0.1)]' 
                   : 'bg-[color:var(--bg-surface)] text-[color:var(--muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text)] border-[color:var(--border)]'
               }`}
               onClick={() => setPeriod(opt.key)}
             >
               {opt.label}
             </button>
           ))}
        </div>
        
        <div className="ml-auto flex items-center gap-3">
           <span className="font-mono text-[11px] font-bold text-[color:var(--cyan)] bg-[color:var(--cyan)]/10 px-3 py-1.5 rounded-lg border border-[color:var(--cyan)]/10">
              {currentData.dateRange}
           </span>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex flex-wrap gap-2 mb-5 border-b border-[color:var(--border)] relative pb-1 mt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
               key={tab.id}
               className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all font-bold text-[13px] whitespace-nowrap ${
                  isActive 
                  ? 'bg-[color:var(--bg-hover)] text-[color:var(--cyan)] border-b-2 border-[color:var(--cyan)] shadow-[0_-4px_16px_rgba(0,200,255,0.05)]' 
                  : 'text-[color:var(--muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text)]'
               }`}
               onClick={() => setActiveTab(tab.id as ReportTab)}
            >
               <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'production' && <div className="animate-fadeInScale"><Production periodData={currentData} periodKey={period} /></div>}
        {activeTab === 'quality' && <div className="animate-fadeInScale"><Quality periodData={currentData} periodKey={period} /></div>}
        {activeTab === 'nrw' && <div className="animate-fadeInScale"><NRW periodData={currentData} periodKey={period} /></div>}
        {activeTab === 'incidents' && <div className="animate-fadeInScale"><Incidents periodData={currentData} periodKey={period} /></div>}
        {activeTab === 'revenue' && <div className="animate-fadeInScale"><Revenue periodData={currentData} periodKey={period} /></div>}
      </div>

    </div>
  );
};

export default Reports;
