import React from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/** Một lựa chọn trong dropdown */
export type FilterOption = {
  value: string;
  label: string;
};

/** Config cho từng bộ lọc dropdown */
export type FilterConfig = {
  /** Key dùng để bind state từ bên ngoài */
  key: string;
  /** Nhãn hiển thị (in hoa) phía trước dropdown */
  label: string;
  /** Danh sách các lựa chọn */
  options: FilterOption[];
  /** Giá trị hiện tại */
  value: string;
  /** Callback khi thay đổi */
  onChange: (value: string) => void;
};

/** Props của FilterBar */
export interface FilterBarProps {
  /** Placeholder cho ô tìm kiếm */
  searchPlaceholder?: string;
  /** Giá trị hiện tại của ô tìm kiếm */
  searchValue: string;
  /** Callback khi nội dung tìm kiếm thay đổi */
  onSearchChange: (value: string) => void;
  /** Danh sách các bộ lọc dropdown */
  filters?: FilterConfig[];
  /** Callback khi nhấn "Đặt lại" */
  onReset: () => void;
  /** Ẩn nút "Đặt lại" nếu không cần (mặc định: hiển thị) */
  showReset?: boolean;
  /** Nội dung tùy chỉnh render bên phải nút Đặt lại (slot) */
  rightSlot?: React.ReactNode;
  /** Class CSS bổ sung cho container */
  className?: string;
}

// ─────────────────────────────────────────────
// Icons (inline để tránh import thêm)
// ─────────────────────────────────────────────

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * FilterBar - Thanh tìm kiếm và bộ lọc tái sử dụng.
 *
 * Cách dùng:
 * ```tsx
 * <FilterBar
 *   searchPlaceholder="Tìm vật tư..."
 *   searchValue={query}
 *   onSearchChange={setQuery}
 *   filters={[
 *     {
 *       key: 'factory',
 *       label: 'NHÀ MÁY',
 *       value: factoryFilter,
 *       onChange: setFactoryFilter,
 *       options: [
 *         { value: 'all', label: 'Tất cả nhà máy' },
 *         { value: 'HG', label: 'Hồng Gai' },
 *       ],
 *     },
 *   ]}
 *   onReset={handleReset}
 * />
 * ```
 */
const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Tìm kiếm...',
  searchValue,
  onSearchChange,
  filters = [],
  onReset,
  showReset = true,
  rightSlot,
  className = '',
}) => {
  return (
    <div className={`filter-bar-container ${className}`}>
      {/* ── Ô tìm kiếm ── */}
      <div className="filter-search-wrap">
        <IconSearch />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Tìm kiếm"
        />
      </div>

      {/* ── Hiển thị từng bộ lọc dropdown (nếu có) ── */}
      {filters.map((filter, idx) => (
        <React.Fragment key={filter.key}>
          {/* Vách ngăn trước mỗi filter */}
          {idx === 0 && <div className="filter-separator" />}

          <div className="filter-group">
            <label className="filter-label">{filter.label}</label>
            <select
              className="filter-select"
              value={filter.value}
              onChange={e => filter.onChange(e.target.value)}
              aria-label={filter.label}
            >
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </React.Fragment>
      ))}

      {/* ── Vách ngăn + Nút Đặt lại ── */}
      {showReset && (
        <>
          <div className="filter-separator" />
          <button className="btn-reset" onClick={onReset} aria-label="Đặt lại bộ lọc">
            <IconRefresh />
            Đặt lại
          </button>
        </>
      )}

      {/* ── Slot phải: render nội dung tùy chỉnh ── */}
      {rightSlot && (
        <>
          <div className="filter-separator" />
          {rightSlot}
        </>
      )}
    </div>
  );
};

export default FilterBar;
