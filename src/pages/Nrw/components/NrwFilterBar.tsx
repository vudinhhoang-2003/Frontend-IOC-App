import React from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

interface NrwFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  zoneFilter: string;
  setZoneFilter: (zone: string) => void;
  lossFilter: string;
  setLossFilter: (loss: string) => void;
  timeFilter: string;
  setTimeFilter: (time: string) => void;
  onReset: () => void;
  dmaZones: string[]; // List of unique zone names/districts for the dropdown
}

const NrwFilterBar: React.FC<NrwFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  zoneFilter,
  setZoneFilter,
  lossFilter,
  setLossFilter,
  timeFilter,
  setTimeFilter,
  onReset,
  dmaZones
}) => {
  return (
    <div className="filter-panel flex-nowrap items-center animate-in fade-in slide-in-from-top-4 duration-500 gap-3 py-2 px-4 whitespace-nowrap overflow-hidden">
      
      {/* Search Section */}
      <div className="fb-search-wrap border-[var(--border)] hover:border-[var(--cyan)]/40 transition-all focus-within:border-[var(--cyan)] flex-shrink-0 !w-[180px] h-9">
        <Search size={14} className="text-[var(--muted)] shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="fb-search-input text-[12.5px] font-medium text-[var(--text)] placeholder:text-[var(--muted)]/50 bg-transparent outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="fb-divider shrink-0 opacity-20 h-6" />

      {/* Filters Group - ULTRA COMPACT INLINE */}
      <div className="flex flex-nowrap items-center gap-4 shrink-0">
        
        {/* Zone Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[11px] uppercase font-bold text-[var(--muted)]">Khu vực</label>
          <div className="relative h-8 px-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-md hover:border-[var(--cyan)]/40 transition-all flex items-center">
            <select
              className="appearance-none bg-transparent pr-6 text-[12.5px] font-bold text-[var(--text)] outline-none cursor-pointer"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {dmaZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Loss Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[11px] uppercase font-bold text-[var(--muted)]">Thất thoát</label>
          <div className="relative h-8 px-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-md hover:border-[var(--yellow)]/30 transition-all flex items-center">
            <select
              className="appearance-none bg-transparent pr-6 text-[12.5px] font-bold text-[var(--text)] outline-none cursor-pointer"
              value={lossFilter}
              onChange={(e) => setLossFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="critical">Nghiêm trọng</option>
              <option value="warning">Cảnh báo</option>
              <option value="ok">Bình thường</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[11px] uppercase font-bold text-[var(--muted)]">Thời gian</label>
          <div className="relative h-8 px-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-md hover:border-[var(--green)]/30 transition-all flex items-center">
            <select
              className="appearance-none bg-transparent pr-6 text-[12.5px] font-bold text-[var(--text)] outline-none cursor-pointer"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="week">Tuần này</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>

      </div>

      <div className="fb-divider shrink-0 opacity-20 h-6" />

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="shrink-0 flex items-center gap-1.5 px-3 h-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-md hover:bg-[var(--bg-hover)] hover:border-[var(--cyan)]/40 transition-all active:scale-95 text-[12px] font-bold text-[var(--muted)] hover:text-[var(--text)]"
      >
        <RotateCcw size={12} />
        <span>Đặt lại</span>
      </button>

    </div>
  );
};

export default NrwFilterBar;
