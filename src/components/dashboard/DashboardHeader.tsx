import React, { useState } from 'react';

const DashboardHeader: React.FC = () => {
  const [range, setRange] = useState('today');

  return (
    <div className="page-header">
      <div className="page-title">
        <h1>Dashboard Tổng quan</h1>
        <p>
            Cập nhật: {new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>
      
      <div className="page-actions">
        {/* Time range filter */}
        <div className="flex items-center gap-[4px] bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] rounded-[8px] p-1">
          <button 
            onClick={() => setRange('today')}
            className={`text-[12px] px-3 py-1.5 rounded-[6px] border-none cursor-pointer transition-all ${range === 'today' ? 'bg-[var(--cyan)] text-[#071629] font-bold shadow-[0_0_10px_rgba(0,200,255,0.3)]' : 'bg-transparent text-[var(--muted)] font-medium hover:text-white'}`}
          >
            Hôm nay
          </button>
          <button 
            onClick={() => setRange('week')}
            className={`text-[12px] px-3 py-1.5 rounded-[6px] border-none cursor-pointer transition-all ${range === 'week' ? 'bg-[var(--cyan)] text-[#071629] font-bold shadow-[0_0_10px_rgba(0,200,255,0.3)]' : 'bg-transparent text-[var(--muted)] font-medium hover:text-white'}`}
          >
            7 ngày
          </button>
          <button 
            onClick={() => setRange('month')}
            className={`text-[12px] px-3 py-1.5 rounded-[6px] border-none cursor-pointer transition-all ${range === 'month' ? 'bg-[var(--cyan)] text-[#071629] font-bold shadow-[0_0_10px_rgba(0,200,255,0.3)]' : 'bg-transparent text-[var(--muted)] font-medium hover:text-white'}`}
          >
            Tháng
          </button>
        </div>
        
        {/* Auto-refresh countdown */}
        <div className="flex items-center gap-[8px] px-3 py-1.5 bg-[rgba(0,210,255,0.05)] border border-[rgba(0,210,255,0.15)] rounded-[8px]">
          <div className="pulse-dot green w-[6px] h-[6px]" />
          <span className="text-[12px] text-[var(--muted)] font-medium lowercase">Làm mới sau</span>
          <span className="text-[14px] font-bold font-mono text-[var(--cyan)]">21s</span>
        </div>
        
        <button className="flex items-center gap-[6px] px-3 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-[8px] text-[13px] text-[var(--text)] font-semibold transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.1)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
