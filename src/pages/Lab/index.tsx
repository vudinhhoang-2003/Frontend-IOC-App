import React, { useState, useEffect } from 'react';
import { 
  Droplets, QrCode, FlaskConical, CalendarDays, Stamp, 
  Cpu, AlertTriangle, Search, Download, Plus, RotateCcw
} from 'lucide-react';
import { LIMS_DATA } from './mockLabData';
import type { LimsData } from './types';
import limsService from '../../services/limsService';
import LabOverviewTab from './components/LabOverviewTab';
import LabSamplesTab from './components/LabSamplesTab';
import LabResultsTab from './components/LabResultsTab';
import LabCalibTab from './components/LabCalibTab';
import LabInspectionTab from './components/LabInspectionTab';
import LabAITab from './components/LabAITab';

export type LimsTab = 'overview' | 'samples' | 'results' | 'calib' | 'inspection' | 'aipredict';

export interface GlobalFilters {
  searchQuery: string;
  filterPlant: string;
  filterStatus: string;
}

const LabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LimsTab>('overview');
  const [filters, setFilters] = useState<GlobalFilters>({
    searchQuery: '',
    filterPlant: 'all',
    filterStatus: 'all'
  });

  // Dùng mock data làm fallback, cập nhật từ API khi có
  const [limsData, setLimsData] = useState<LimsData>(LIMS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sites, samples, calibrations, inspections] = await Promise.allSettled([
          limsService.getSites(),
          limsService.getSamples({ limit: 50 }),
          limsService.getCalibrations({ limit: 50 }),
          limsService.getInspections({ limit: 100 }),
        ]);

        setLimsData(prev => {
          const updated = { ...prev };

          // Map sites từ API → FE format
          if (sites.status === 'fulfilled' && sites.value.length > 0) {
            updated.sites = sites.value.map(s => ({
              id: s.id,
              name: s.name,
              lat: s.lat ?? 0,
              lng: s.lng ?? 0,
              zone: s.zone,
            }));
          }

          // Map samples từ API → FE format
          if (samples.status === 'fulfilled' && samples.value.length > 0) {
            updated.samples = samples.value.map(s => ({
              id: s.sample_code,
              siteId: s.site_id ?? '',
              siteName: s.site_name ?? s.factory_name ?? '',
              time: s.sampled_at,
              collector: s.collector ?? s.sampled_by ?? '',
              status: s.status,
              results: s.results ? {
                pH: s.results.pH ?? 0,
                turbidity: s.results.turbidity ?? 0,
                chlorine: s.results.chlorine ?? 0,
                coliform: s.results.coliform ?? 0,
                arsenic: s.results.arsenic ?? 0,
                nitrate: s.results.nitrate ?? 0,
                conductivity: s.results.conductivity ?? 0,
                hardness: s.results.hardness ?? 0,
              } : null,
            }));
          }

          // Map calibrations từ API → FE format
          if (calibrations.status === 'fulfilled' && calibrations.value.length > 0) {
            updated.calibrations = calibrations.value.map(c => ({
              id: c.instrument_code,
              equipment: c.instrument_name,
              lastDate: c.last_calibrated ?? '',
              nextDate: c.next_calibrated,
              agency: c.agency ?? '',
              status: c.status,
              cert: c.certificate_no ?? '',
            }));
          }

          // Map inspections từ API → FE format
          if (inspections.status === 'fulfilled' && inspections.value.length > 0) {
            const history = inspections.value
              .filter(i => i.status === 'completed')
              .map(i => ({
                id: i.id,
                plant: i.factory_name ?? '',
                agency: i.agency,
                date: i.actual_date ?? '',
                result: (i.result ?? 'pass') as 'pass' | 'fail',
                numSamples: i.num_samples,
                numFail: i.num_fail,
                report: i.report_code ?? '',
                note: i.note ?? '',
              }));

            const upcoming = inspections.value
              .filter(i => i.status === 'planned')
              .map(i => ({
                id: i.id,
                plant: i.factory_name ?? '',
                agency: i.agency,
                plannedDate: i.planned_date ?? '',
                period: i.period ?? '',
                note: i.note ?? '',
              }));

            if (history.length > 0 || upcoming.length > 0) {
              updated.waterInspections = { history, upcoming };
            }
          }

          return updated;
        });
      } catch {
        // Silent fail — giữ mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const criticalAlerts = limsData.samples.filter(s => s.status === 'alert').length;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
    setFilters({ searchQuery: '', filterPlant: 'all', filterStatus: 'all' });
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header section with Title and Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-4 relative z-10">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-1 flex items-center gap-2 text-[var(--text)]">
            Phòng thí nghiệm – LIMS
          </h1>
          <p className="text-[var(--muted)] text-[13px]">
            Hệ thống Quản lý Thông tin Phòng thí nghiệm &nbsp;|&nbsp; ISO/IEC 17025
          </p>
        </div>
        <div className="flex gap-2">
          {criticalAlerts > 0 && (
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--red)]/20 bg-[var(--red)]/10 text-[13px] font-bold text-[var(--red)] shadow-[0_0_15px_rgba(255,61,87,0.1)]">
              <AlertTriangle size={15} /> {criticalAlerts} cảnh báo chất lượng
            </span>
          )}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] hover:opacity-90 rounded-[10px] text-[13.5px] font-bold text-white transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
            <Plus size={16} /> Tạo kết quả mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-[10px] text-[13px] font-bold text-[var(--muted)] hover:text-[var(--text)] transition-all active:scale-[0.98]">
            <RotateCcw size={14} /> Làm mới
          </button>
          <button className="px-5 py-2 rounded-[10px] bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] hover:shadow-[0_4px_15px_rgba(0,102,255,0.4)] transition-all flex items-center gap-2 text-[13px] font-bold text-white">
            <Download size={15} /> Xuất E-CoA
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-wrap md:flex-nowrap items-center bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded-[16px] p-4 mb-4 gap-4 w-full shadow-sm relative z-10">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
          <input
            type="text"
            name="searchQuery"
            placeholder="Tìm kiếm theo mã mẫu, thiết bị, kết quả..."
            className="w-full h-[38px] bg-[rgba(255,255,255,0.05)] border border-[var(--border)] rounded-[10px] pl-[36px] pr-3 text-[13px] text-[var(--text)] placeholder:text-[#2d4a6a] outline-none focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,210,255,0.1)] transition-all"
            value={filters.searchQuery}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="w-full md:w-[180px]">
          <select 
            name="filterPlant"
            className="w-full h-[38px] bg-[rgba(255,255,255,0.05)] border border-[var(--border)] rounded-[10px] px-3 text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer focus:border-[var(--cyan)] transition-all appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23648da1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            value={filters.filterPlant}
            onChange={handleFilterChange}
          >
            <option value="all" className="bg-[var(--bg-surface)] text-[var(--text)]">Tất cả nhà máy</option>
            <option value="NM-01" className="bg-[var(--bg-surface)] text-[var(--text)]">NM Hạ Long 1</option>
            <option value="NM-02" className="bg-[var(--bg-surface)] text-[var(--text)]">NM Hạ Long 2</option>
            <option value="NM-03" className="bg-[var(--bg-surface)] text-[var(--text)]">NM Uông Bí</option>
          </select>
        </div>
        
        <div className="w-full md:w-[160px]">
          <select 
            name="filterStatus"
            className="w-full h-[38px] bg-[rgba(255,255,255,0.05)] border border-[var(--border)] rounded-[10px] px-3 text-[13px] font-medium text-[var(--text)] outline-none cursor-pointer focus:border-[var(--cyan)] transition-all appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23648da1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            value={filters.filterStatus}
            onChange={handleFilterChange}
          >
            <option value="all" className="bg-[var(--bg-surface)] text-[var(--text)]">Mọi trạng thái</option>
            <option value="ok" className="bg-[var(--bg-surface)] text-[var(--text)]">Đạt chuẩn</option>
            <option value="alert" className="bg-[var(--bg-surface)] text-[var(--text)]">Cảnh báo</option>
            <option value="pending" className="bg-[var(--bg-surface)] text-[var(--text)]">Đang xử lý</option>
          </select>
        </div>
        
        <button 
          className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border border-[var(--border)] bg-transparent hover:bg-white/5 text-[var(--muted)] hover:text-[var(--cyan)] transition-all shrink-0"
          onClick={handleResetFilters}
          title="Làm mới bộ lọc"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-1 p-1 bg-[var(--bg-header)] rounded-[10px] mb-5 overflow-x-auto no-scrollbar w-max max-w-full">
        {[
          { id: 'overview', icon: <Droplets size={15} strokeWidth={2.5} />, label: 'Tổng quan' },
          { id: 'samples', icon: <QrCode size={15} strokeWidth={2.5} />, label: 'Quản lý mẫu' },
          { id: 'results', icon: <FlaskConical size={15} strokeWidth={2.5} />, label: 'Kết quả xét nghiệm' },
          { id: 'calib', icon: <CalendarDays size={15} strokeWidth={2.5} />, label: 'Kiểm định thiết bị' },
          { id: 'inspection', icon: <Stamp size={15} strokeWidth={2.5} />, label: 'Kiểm định nước' },
          { id: 'aipredict', icon: <Cpu size={15} strokeWidth={2.5} />, label: 'AI Khuyến nghị' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as LimsTab)}
            className={`flex items-center gap-1.5 px-[18px] py-2 rounded-[7px] font-medium text-[13px] whitespace-nowrap transition-all border-none outline-none ${
              activeTab === tab.id 
                ? 'bg-[var(--cyan)]/10 text-[var(--cyan)]' 
                : 'bg-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'overview' && <LabOverviewTab data={limsData} filters={filters} />}
        {activeTab === 'samples' && <LabSamplesTab data={limsData} filters={filters} />}
        {activeTab === 'results' && <LabResultsTab data={limsData} filters={filters} />}
        {activeTab === 'calib' && <LabCalibTab data={limsData} filters={filters} />}
        {activeTab === 'inspection' && <LabInspectionTab data={limsData} filters={filters} />}
        {activeTab === 'aipredict' && <LabAITab data={limsData} filters={filters} />}
      </div>
    </div>
  );
};

export default LabPage;
