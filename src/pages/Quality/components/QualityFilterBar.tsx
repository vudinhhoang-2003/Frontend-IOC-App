import React, { useState, useEffect } from 'react';
import type { FactoryBasic } from '../types';

export interface FilterState {
  search: string;
  factory: string;
  indicator: string;
  result: string;
  time: string;
}

interface Props {
  factories: FactoryBasic[];
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const QualityFilterBar: React.FC<Props> = ({ factories, onFilterChange, onReset }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    factory: '',
    indicator: '',
    result: '',
    time: 'today'
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 200);
    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    const defaultState = { search: '', factory: '', indicator: '', result: '', time: 'today' };
    setFilters(defaultState);
    onReset();
  };

  const selectBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238898aa' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

  return (
    <div className="flex flex-wrap xl:flex-nowrap items-center bg-[var(--bg-elevated,#0f172a)] border border-[var(--border)] rounded-2xl p-2.5 mb-6 gap-3 w-full shadow-sm">
      
      {/* Search Input */}
      <div className="flex items-center h-[38px] bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl px-3 w-full xl:w-[220px] transition-colors focus-within:border-[var(--cyan)] shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Tìm nhà máy..." 
          className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[var(--muted)] font-medium"
        />
      </div>
      
      <div className="hidden xl:block w-[1px] h-[28px] bg-[var(--border)] opacity-60 shrink-0"></div>
      
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 flex-1 w-full xl:w-auto">
        {/* Nhà máy dropdown */}
        <div className="flex items-center gap-2 flex-1 min-w-[130px]">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider whitespace-nowrap hidden sm:block">Nhà máy</span>
          <select 
            name="factory"
            value={filters.factory}
            onChange={handleChange}
            className="h-[38px] w-full bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer px-3 pr-8 appearance-none bg-no-repeat hover:border-[var(--cyan)] transition-colors text-ellipsis" 
            style={{ backgroundImage: selectBg, backgroundPosition: 'right 10px center', backgroundSize: '14px' }}
          >
            <option value="">Tất cả nhà máy</option>
            {factories.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Chỉ tiêu dropdown */}
        <div className="flex items-center gap-2 flex-1 min-w-[130px]">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider whitespace-nowrap hidden sm:block">Chỉ tiêu</span>
          <select 
            name="indicator"
            value={filters.indicator}
            onChange={handleChange}
            className="h-[38px] w-full bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer px-3 pr-8 appearance-none bg-no-repeat hover:border-[var(--cyan)] transition-colors text-ellipsis" 
            style={{ backgroundImage: selectBg, backgroundPosition: 'right 10px center', backgroundSize: '14px' }}
          >
            <option value="">Tất cả chỉ tiêu</option>
            <option value="pH">pH</option>
            <option value="chlorine">Clo dư</option>
            <option value="turbidity">Độ đục</option>
            <option value="TDS">TDS</option>
            <option value="arsenic">Arsenic</option>
            <option value="coliform">Coliform</option>
          </select>
        </div>

        {/* Kết quả dropdown */}
        <div className="flex items-center gap-2 flex-[0.8] min-w-[100px]">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider whitespace-nowrap hidden sm:block">Kết quả</span>
          <select 
            name="result"
            value={filters.result}
            onChange={handleChange}
            className="h-[38px] w-full bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer px-3 pr-8 appearance-none bg-no-repeat hover:border-[var(--cyan)] transition-colors text-ellipsis" 
            style={{ backgroundImage: selectBg, backgroundPosition: 'right 10px center', backgroundSize: '14px' }}
          >
            <option value="">Tất cả KQ</option>
            <option value="ok">Đạt chuẩn</option>
            <option value="warning">Cảnh báo</option>
          </select>
        </div>

        {/* Thời gian dropdown */}
        <div className="flex items-center gap-2 flex-[0.8] min-w-[100px]">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider whitespace-nowrap hidden sm:block">Thời gian</span>
          <select 
            name="time"
            value={filters.time}
            onChange={handleChange}
            className="h-[38px] w-full bg-[var(--bg-card,#0b1521)] border border-[var(--border)] rounded-xl text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer px-3 pr-8 appearance-none bg-no-repeat hover:border-[var(--cyan)] transition-colors text-ellipsis" 
            style={{ backgroundImage: selectBg, backgroundPosition: 'right 10px center', backgroundSize: '14px' }}
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
      </div>

      <div className="hidden xl:block w-[1px] h-[28px] bg-[var(--border)] opacity-60 shrink-0 mx-1"></div>

      {/* Reset button */}
      <button 
        onClick={handleReset}
        className="flex items-center justify-center gap-2 h-[38px] px-4 rounded-xl border border-[var(--border)] bg-[#0b1521] text-[var(--muted)] hover:text-white hover:bg-white/5 hover:border-white/30 transition-all cursor-pointer text-[13px] font-medium whitespace-nowrap shrink-0 w-full md:w-auto"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/>
        </svg>
        Đặt lại
      </button>
    </div>
  );
};
