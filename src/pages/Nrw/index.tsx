import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Moon, Droplets, History, LayoutDashboard, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import NrwKPIs from './components/NrwKPIs';
import NrwOverviewTab from './components/NrwOverviewTab';
import MnfAnalysisTab from './components/MnfAnalysisTab';
import LeakAlertsTab from './components/LeakAlertsTab';
import NrwHistoryTab from './components/NrwHistoryTab';
import FilterBar from '../../components/common/FilterBar';
import { InspectionOrderModal, HistoryDetailModal, CreateDMAModal } from './components/NrwModals';
import { MNF_DATA, LEAK_ALERTS, INSPECTION_HISTORY } from './mockData';
import type { DMAZone, LeakAlert, InspectionOrder, MNFData } from './types';
import { apiClient } from '../../services/apiClient';

type NrwTab = 'overview' | 'mnf' | 'leaks' | 'history';

// --- Toast System (Synchronized with project standard) ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const ToastItem: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({ toast, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={16} className="text-green-500" />,
    error: <AlertTriangle size={16} className="text-red-500" />,
    info: <Zap size={16} className="text-[var(--cyan)]" />,
    warning: <AlertTriangle size={16} className="text-yellow-500" />
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-300 pointer-events-auto mb-2 w-[300px]">
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-[13px] font-bold text-[var(--text)] leading-tight">{toast.message}</div>
    </div>
  );
};

const NrwPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NrwTab>('overview');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // API Data States
  const [dmaZones, setDmaZones] = useState<DMAZone[]>([]);
  const [activeMnfData, setActiveMnfData] = useState<MNFData | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [lossFilter, setLossFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');

  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DMAZone | LeakAlert | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<InspectionOrder | null>(null);
  const [handledAlerts, setHandledAlerts] = useState<string[]>([]);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionOrder[]>([]);

  useEffect(() => {
    fetchOverview();
    fetchInspectionHistory();
  }, [timeFilter]);

  const fetchInspectionHistory = async () => {
    try {
      const res = await apiClient.get('/nrw/inspections');
      if (res.data?.success) {
        setInspectionHistory(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch inspection orders:', e);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await apiClient.get('/nrw/summary');
      if (res.data?.success) {
        const dmas = res.data.data.by_dma.map((item: any) => ({
          id: item.dma_id,
          name: item.dma_name,
          district: item.dma_name,
          supplyFlow: Number(item.total_supply_m3) || 0,
          consumptionFlow: Number(item.total_consumption_m3) || 0,
          loss: Number(item.avg_nrw_pct) || 0,
          lossVolume: Number(item.total_nrw_m3) || 0,
          status: item.status || 'ok',
          customers: item.customer_count || 0,
          lastUpdate: new Date().toLocaleString()
        }));
        setDmaZones(dmas);
      }
    } catch (error) {
      console.error('Failed to fetch NRW summary:', error);
    }
  };

  // --- Filter Logic ---
  const filteredDmaZones = useMemo(() => {
    return dmaZones.filter(dma => {
      const matchSearch = dma.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dma.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = zoneFilter === 'all' || dma.district === zoneFilter;
      const matchLoss = lossFilter === 'all' || 
                        (lossFilter === 'critical' && dma.loss > 20) ||
                        (lossFilter === 'warning' && dma.loss >= 15 && dma.loss <= 20) ||
                        (lossFilter === 'ok' && dma.loss < 15);
      return matchSearch && matchZone && matchLoss;
    });
  }, [dmaZones, searchQuery, zoneFilter, lossFilter]);

  const filteredLeakAlerts = useMemo(() => {
    return LEAK_ALERTS.filter(alert => {
      const matchSearch = alert.zone.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.suspect.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = zoneFilter === 'all' || alert.zone.includes(zoneFilter);
      return matchSearch && matchZone;
    });
  }, [searchQuery, zoneFilter]);

  const filteredMnfData = useMemo(() => {
    return activeMnfData ? [activeMnfData] : MNF_DATA;
  }, [activeMnfData]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setZoneFilter('all');
    setLossFilter('all');
    setTimeFilter('today');
  };

  const uniqueZones = useMemo(() => {
    return Array.from(new Set(dmaZones.map(dma => dma.district)));
  }, [dmaZones]);

  // --- Toast Actions ---
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateOrder = (source: DMAZone | LeakAlert) => {
    setSelectedSource(source);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (payload: any) => {
    try {
      await apiClient.post('/nrw/inspections', payload);
      setIsOrderModalOpen(false);
      addToast('Đã phát lệnh kiểm tra NRW thành công', 'success');
      fetchInspectionHistory(); // Reload table
      
      // Mark alert as handled so it changes button to 'Đã phát lệnh'
      if (selectedSource && 'id' in selectedSource) {
        setHandledAlerts(prev => [...prev, selectedSource.id]);
      } else if (selectedSource && 'zone' in selectedSource) {
        // Just in case selected source is DMA
        setHandledAlerts(prev => [...prev, (selectedSource as any).id || (selectedSource as any).dmaId]);
      }
    } catch (error: any) {
      console.error('Inspection order error:', error?.response?.data || error?.message || error);
      const msg = error?.response?.data?.detail || error?.response?.data?.message || 'Lỗi khi phát lệnh kiểm tra';
      addToast(msg, 'error');
    }
  };

  const handleViewHistory = (order: InspectionOrder) => {
    setSelectedOrder(order);
    setIsHistoryModalOpen(true);
  };

  const handleAnalyzeMnf = async (dma: DMAZone) => {
    addToast(`Đang phân tích lưu lượng MNF cho ${dma.name}...`, 'info');
    try {
      const res = await apiClient.get(`/nrw/dma/${dma.id}/mnf`);
      if (res.data?.success) {
        const mnf = res.data.data;
        setActiveMnfData({
           dmaId: mnf.dma_id,
           mnfHour: mnf.mnf_hour || '03:00',
           mnfFlow: mnf.mnf_flow || 0,
           leakEstimate: mnf.leak_estimate || 0,
           leakPct: mnf.leak_pct || 0,
           samples: mnf.samples?.map((s: any) => ({
             hour: s.hour,
             supply: s.supply,
             consume: s.consume
           })) || []
        });
        setActiveTab('mnf');
      }
    } catch (error) {
      addToast(`Lỗi khi lấy dữ liệu MNF cho ${dma.name}`, 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan DMA', icon: <LayoutDashboard size={16} /> },
    { id: 'mnf', label: 'Minimum Night Flow', icon: <Moon size={16} /> },
    { id: 'leaks', label: 'Cảnh báo rò rỉ', icon: <Droplets size={16} /> },
    { id: 'history', label: 'Lịch sử xử lý', icon: <History size={16} /> },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto relative animate-in fade-in duration-500">
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={removeToast} />)}
      </div>

      {/* Header - Standardized Style */}
      <div className="page-header">
        <div className="page-title">
          <h1>NRW – Quản lý Thất thoát nước</h1>
          <p>
            Phân tích chỉ số MNF và quản lý các kịch bản giảm thất thoát nước mạng lưới
          </p>
        </div>
      </div>

      {/* Filter Bar Section — Standardized Component */}
      <FilterBar
        searchPlaceholder="Tìm kiếm DMA, khu vực..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={handleResetFilters}
        filters={[
          {
            key: 'zone',
            label: 'KHU VỰC',
            value: zoneFilter,
            onChange: setZoneFilter,
            options: [
              { value: 'all', label: 'Tất cả' },
              ...uniqueZones.map(z => ({ value: z, label: z })),
            ],
          },
          {
            key: 'loss',
            label: 'THẤT THOÁT',
            value: lossFilter,
            onChange: setLossFilter,
            options: [
              { value: 'all', label: 'Tất cả' },
              { value: 'critical', label: 'Nghiêm trọng' },
              { value: 'warning', label: 'Cảnh báo' },
              { value: 'ok', label: 'Bình thường' },
            ],
          },
          {
            key: 'time',
            label: 'THỜI GIAN',
            value: timeFilter,
            onChange: setTimeFilter,
            options: [
              { value: 'today', label: 'Hôm nay' },
              { value: 'yesterday', label: 'Hôm qua' },
              { value: 'week', label: 'Tuần này' },
            ],
          },
        ]}
      />

      {/* KPIs Section */}
      <NrwKPIs dmaZones={filteredDmaZones} />

      {/* Tabs Navigation - Synchronized Pill Style */}
      <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border)] p-1 rounded-full mb-8 w-fit shadow-sm overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as NrwTab)}
            className={`flex items-center gap-2.5 px-6 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[var(--blue)] to-[var(--cyan)] text-white shadow-md shadow-blue-500/10'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
        {activeTab === 'overview' && (
          <NrwOverviewTab 
            dmaZones={filteredDmaZones} 
            onViewGis={(dma) => {
              addToast(`Đang chuyển hướng sang bản đồ GIS cho ${dma.name}...`, 'info');
              setTimeout(() => navigate(`/gis?dmaId=${dma.id}`), 1000);
            }} 
            onCreateOrder={handleCreateOrder} 
            onAnalyzeMnf={handleAnalyzeMnf} 
          />
        )}
        {activeTab === 'mnf' && <MnfAnalysisTab mnfData={filteredMnfData} />}
        {activeTab === 'leaks' && (
          <LeakAlertsTab 
            alerts={filteredLeakAlerts} 
            handledAlerts={handledAlerts}
            onViewGis={(alert) => {
              addToast(`Mở GIS tại vị trí: ${alert.zone}...`, 'info');
              setTimeout(() => navigate(`/gis?dmaId=${alert.dmaId}`), 1000);
            }} 
            onCreateOrder={handleCreateOrder} 
          />
        )}
        {activeTab === 'history' && (
          <NrwHistoryTab 
            history={inspectionHistory} 
            onViewDetail={handleViewHistory} 
          />
        )}
      </div>

      {/* Modals */}
      <InspectionOrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} onSave={handleSaveOrder} source={selectedSource} />
      <HistoryDetailModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} order={selectedOrder} />
      <CreateDMAModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onDone={() => { fetchOverview(); addToast('Đã tạo phân vùng DMA thành công!', 'success'); }} />
    </div>
  );
};

export default NrwPage;
