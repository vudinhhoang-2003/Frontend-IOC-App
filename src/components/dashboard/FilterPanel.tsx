import React, { useState } from 'react';
import FilterBar from '../common/FilterBar';
import type { FilterConfig } from '../common/FilterBar';

const FilterPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [factory, setFactory] = useState('all');
  const [area, setArea] = useState('all');
  const [time, setTime] = useState('today');

  const filterConfig: FilterConfig[] = [
    {
      key: 'factory',
      label: 'NHÀ MÁY',
      value: factory,
      onChange: setFactory,
      options: [
        { value: 'all', label: 'Tất cả nhà máy' },
        { value: 'hg', label: 'Hồng Gai' },
        { value: 'bc', label: 'Bãi Cháy' },
        { value: 'cp', label: 'Cẩm Phả' },
      ],
    },
    {
      key: 'area',
      label: 'KHU VỰC',
      value: area,
      onChange: setArea,
      options: [
        { value: 'all', label: 'Tất cả khu vực' },
        { value: 'halong', label: 'TP. Hạ Long' },
        { value: 'campha', label: 'TP. Cẩm Phả' },
      ],
    },
    {
      key: 'time',
      label: 'THỜI GIAN',
      value: time,
      onChange: setTime,
      options: [
        { value: 'today', label: 'Hôm nay' },
        { value: '7d', label: '7 ngày qua' },
        { value: '30d', label: 'Tháng này' },
      ],
    },
  ];

  const handleReset = () => {
    setSearch('');
    setFactory('all');
    setArea('all');
    setTime('today');
  };

  return (
    <FilterBar
      searchPlaceholder="Tìm trạm, nhà máy, sự cố..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfig}
      onReset={handleReset}
    />
  );
};

export default FilterPanel;
