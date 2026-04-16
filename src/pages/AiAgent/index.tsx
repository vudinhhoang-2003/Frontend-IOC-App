import React, { useState } from 'react';
import { 
  Bot, 
  Activity, 
  CheckCircle, 
  BellRing, 
  TrendingUp, 
  Zap,
  Plus,
  Clock,
  AlertTriangle,
  Bell
} from 'lucide-react';

import ScheduledJobs from './views/ScheduledJobs';
import AnomalyDetection from './views/AnomalyDetection';
import SmartAlerts from './views/SmartAlerts';

type TabType = 'scheduled' | 'anomaly' | 'alerts';

const AiAgent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scheduled');

  const tabs = [
    { id: 'scheduled', label: 'Tác vụ lập lịch', icon: Clock },
    { id: 'anomaly', label: 'Giám sát bất thường', icon: AlertTriangle },
    { id: 'alerts', label: 'Cảnh báo thông minh', icon: Bell },
  ];

  const handleCreateTask = () => {
    alert('Đang mở form tạo Nhân viên số mới...');
  };

  const kpis = [
    { label: 'Tác vụ đang chạy', value: '4', sub: '/ 5 tổng', color: 'border-[color:var(--cyan)]', text: 'text-[color:var(--cyan)]' },
    { label: 'Bất thường phát hiện', value: '3', sub: 'tháng này cần kiểm tra', color: 'border-[color:var(--yellow)]', text: 'text-[color:var(--yellow)]' },
    { label: 'Báo cáo đã gửi', value: '247', sub: 'trong tháng 2/2026', color: 'border-[color:var(--green)]', text: 'text-[color:var(--green)]' },
    { label: 'Cảnh báo thông minh', value: '12', sub: 'đã gửi SMS/Zalo', color: 'border-[color:var(--blue)]', text: 'text-[color:var(--blue)]' },
    { label: 'Chi phí tiết kiệm', value: '145', unit: 'Triệu', sub: 'Ước tính hàng tháng', color: 'border-[color:var(--indigo)]', text: 'text-[color:var(--indigo)]' },
    { label: 'Hiệu suất vận hành', value: '+32', unit: '%', sub: 'Cải thiện quy trình', color: 'border-[color:var(--cyan)]', text: 'text-[color:var(--green)]' },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Page Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold flex items-center gap-2 text-[color:var(--text)]">
            AI Agent – Nhân viên số
          </h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Tự động hóa báo cáo, giám sát bất thường và cảnh báo thông minh
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button 
            onClick={handleCreateTask}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,102,255,0.3)] border-none font-bold"
          >
            <Plus size={14} /> Tạo tác vụ mới
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={i} className={`card p-4 border-t-2 bg-[color:var(--bg-card)] shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md ${k.color} border-l border-r border-b border-l-[color:var(--border)] border-r-[color:var(--border)] border-b-[color:var(--border)]`}>
            <div className="text-[11px] text-[color:var(--muted)] font-black uppercase mb-1 line-clamp-1 tracking-wider">{k.label}</div>
            <div className={`text-2xl font-black mb-0.5 ${k.text}`}>
              {k.value}
              {k.unit && <span className="text-[14px] text-[color:var(--muted)] ml-1 font-bold">{k.unit}</span>}
            </div>
            <div className="text-[10px] text-[color:var(--muted)] font-bold truncate">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5 border-b border-[color:var(--border)] relative pb-1">
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
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'scheduled' && <div className="animate-fadeInScale"><ScheduledJobs /></div>}
        {activeTab === 'anomaly' && <div className="animate-fadeInScale"><AnomalyDetection /></div>}
        {activeTab === 'alerts' && <div className="animate-fadeInScale"><SmartAlerts /></div>}
      </div>
    </div>
  );
};

export default AiAgent;
