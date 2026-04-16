import React, { useState, useEffect } from 'react';
import { MOCK_WATER_QUALITY, QUALITY_LIMITS, MOCK_FACTORIES, MOCK_EMPLOYEES } from './mockQualityData';
import type { WaterQualityRecord, FactoryBasic } from './types';
import { QualityGrid } from './components/QualityGrid';
import { QualityTable } from './components/QualityTable';
import { QualityAddModal } from './components/QualityAddModal';
import FilterBar from '../../components/common/FilterBar';
import { checkLimit } from './utils';
import limsService from '../../services/limsService';

const QualityPage: React.FC = () => {
  const [data, setData] = useState<WaterQualityRecord[]>(MOCK_WATER_QUALITY);
  const [filteredData, setFilteredData] = useState<WaterQualityRecord[]>(MOCK_WATER_QUALITY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [factories, setFactories] = useState<FactoryBasic[]>(MOCK_FACTORIES);

  // Fetch samples từ API khi mount
  useEffect(() => {
    limsService.getSamples({ limit: 100 }).then(samples => {
      if (samples.length === 0) return;
      const mapped: WaterQualityRecord[] = samples
        .filter(s => s.results)
        .map(s => ({
          id: s.id,
          factory: s.factory_name ?? s.site_name ?? '',
          pH: s.results?.pH ?? 0,
          chlorine: s.results?.chlorine ?? 0,
          turbidity: s.results?.turbidity ?? 0,
          TDS: s.results?.tds ?? 0,
          arsenic: s.results?.arsenic ?? 0,
          coliform: s.results?.coliform ?? 0,
          time: s.sampled_at,
          status: s.status,
        }));
      if (mapped.length > 0) {
        setData(mapped);
        setFilteredData(mapped);
      }
    }).catch(() => {
      // Silent fail — giữ mock data
    });

    // Fetch factories từ API
    limsService.getSites().then(sites => {
      if (sites.length === 0) return;
      const uniqueFactories = Array.from(
        new Map(sites.map(s => [s.factory_id, { id: s.factory_id ?? 0, name: s.factory_name ?? s.name }])).values()
      ).filter(f => f.name);
      if (uniqueFactories.length > 0) {
        setFactories(uniqueFactories);
      }
    }).catch(() => {});
  }, []);

  // Filter states
  const [search, setSearch] = useState('');
  const [factory, setFactory] = useState('');
  const [indicator, setIndicator] = useState('');
  const [result, setResult] = useState('');
  const [time, setTime] = useState('today');

  // Unified Filter Logic
  React.useEffect(() => {
    let rs = [...data];
    
    if (search) {
      const q = search.toLowerCase();
      rs = rs.filter(item => item.factory.toLowerCase().includes(q));
    }
    
    if (factory) {
      rs = rs.filter(item => item.factory === factory);
    }
    
    if (result) {
      rs = rs.filter(item => {
        const isOk = 
          checkLimit(item.pH, QUALITY_LIMITS.pH.min, QUALITY_LIMITS.pH.max) === 'ok' &&
          checkLimit(item.chlorine, QUALITY_LIMITS.chlorine.min, QUALITY_LIMITS.chlorine.max) === 'ok' &&
          checkLimit(item.turbidity, QUALITY_LIMITS.turbidity.min, QUALITY_LIMITS.turbidity.max) === 'ok' &&
          checkLimit(item.TDS, QUALITY_LIMITS.TDS.min, QUALITY_LIMITS.TDS.max) === 'ok' &&
          checkLimit(item.arsenic, QUALITY_LIMITS.arsenic.min, QUALITY_LIMITS.arsenic.max) === 'ok' &&
          checkLimit(item.coliform, QUALITY_LIMITS.coliform.min, QUALITY_LIMITS.coliform.max) === 'ok';
        
        return result === 'ok' ? isOk : !isOk;
      });
    }

    setFilteredData(rs);
  }, [search, factory, indicator, result, time, data]);

  const handleReset = () => {
    setSearch('');
    setFactory('');
    setIndicator('');
    setResult('');
    setTime('today');
  };

  const handleSave = (formData: any) => {
    const newRecord: WaterQualityRecord = {
      id: Math.max(0, ...data.map(d => d.id || 0)) + 1,
      factory: formData.factory || MOCK_FACTORIES[0].name,
      pH: Number(formData.pH) || 7.0,
      chlorine: Number(formData.chlorine) || 0.3,
      turbidity: Number(formData.turbidity) || 1.0,
      TDS: Number(formData.TDS) || 150,
      arsenic: Number(formData.arsenic) || 0.001,
      coliform: Number(formData.coliform) || 0,
      time: formData.time ? new Date(formData.time).toLocaleString('vi-VN', { timeStyle: 'short', dateStyle: 'short' }) : 'Vừa xong',
      status: 'ok'
    };
    
    setData(prev => [newRecord, ...prev]);
    setFilteredData(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Toast notification thay thế alert() */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-[rgba(0,240,128,0.15)] border border-[rgba(0,240,128,0.3)] rounded-xl text-[var(--green)] text-[13px] font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Đã lưu chỉ số chất lượng nước!
        </div>
      )}
      <div className="page-header">
        <div className="page-title">
          <h1>Chất lượng nước</h1>
          <p>Theo chuẩn QCVN 01-1:2024/BYT</p>
        </div>
        <div className="page-actions">
          <button 
            className="flex items-center justify-center gap-2 px-[18px] py-1.5 h-[36px] rounded-xl font-semibold text-[13px] text-white bg-gradient-to-br from-[#0050cc] to-[#00c8ff] border-none cursor-pointer shadow-[0_4px_15px_rgba(0,80,204,0.3)] hover:brightness-110 hover:-translate-y-0.5 transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nhập chỉ số mới
          </button>
        </div>
      </div>

      <FilterBar
        searchPlaceholder="Tìm nhà máy..."
        searchValue={search}
        onSearchChange={setSearch}
        onReset={handleReset}
        filters={[
          {
            key: 'factory',
            label: 'NHÀ MÁY',
            value: factory,
            onChange: setFactory,
            options: [
              { value: '', label: 'Tất cả nhà máy' },
              ...factories.map(f => ({ value: f.name, label: f.name })),
            ],
          },
          {
            key: 'indicator',
            label: 'CHỈ TIÊU',
            value: indicator,
            onChange: setIndicator,
            options: [
              { value: '', label: 'Tất cả chỉ tiêu' },
              { value: 'pH', label: 'pH' },
              { value: 'chlorine', label: 'Clo dư' },
              { value: 'turbidity', label: 'Độ đục' },
              { value: 'TDS', label: 'TDS' },
              { value: 'arsenic', label: 'Arsenic' },
              { value: 'coliform', label: 'Coliform' },
            ],
          },
          {
            key: 'result',
            label: 'KẾT QUẢ',
            value: result,
            onChange: setResult,
            options: [
              { value: '', label: 'Tất cả KQ' },
              { value: 'ok', label: 'Đạt chuẩn' },
              { value: 'warning', label: 'Cảnh báo' },
            ],
          },
          {
            key: 'time',
            label: 'THỜI GIAN',
            value: time,
            onChange: setTime,
            options: [
              { value: 'today', label: 'Hôm nay' },
              { value: 'week', label: 'Tuần này' },
              { value: 'month', label: 'Tháng này' },
            ],
          },
        ]}
      />

      <QualityGrid data={filteredData} limits={QUALITY_LIMITS} />

      <div className="mb-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <span className="font-semibold text-[15px] text-[var(--text)]">Giới hạn QCVN 01-1:2024/BYT</span>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2.5">
            {[
              ['pH', '6.5 – 8.5'],
              ['Clo dư', '0.1 – 0.5 mg/L'],
              ['Độ đục', '≤ 2.0 NTU'],
              ['TDS', '≤ 500 mg/L'],
              ['Arsenic', '≤ 0.01 mg/L'],
              ['Coliform', '= 0 CFU/100mL']
            ].map(([k, v]) => (
              <div key={k} className="bg-black/20 rounded-lg py-2.5 px-3.5 min-w-[130px] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">{k}</div>
                <div className="text-[13px] font-semibold text-[var(--cyan)] mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QualityTable data={filteredData} limits={QUALITY_LIMITS} />

      {isModalOpen && (
        <QualityAddModal 
          factories={factories} 
          employees={MOCK_EMPLOYEES} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default QualityPage;
