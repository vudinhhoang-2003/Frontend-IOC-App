import React, { useState } from 'react';
import { 
  Key, 
  FileBox, 
  History, 
  UploadCloud, 
  LineChart,
  Plus
} from 'lucide-react';

import ApiKeys from './views/ApiKeys';
import Templates from './views/Templates';
import SyncLog from './views/SyncLog';
import KpiImport from './views/KpiImport';
import KpiHistory from './views/KpiHistory';

type TabType = 'apikeys' | 'templates' | 'synclog' | 'kpiimport' | 'kpihistory';

const DataHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('kpiimport'); // Mặc định mở KPI Import

  const tabs = [
    { id: 'apikeys', label: 'Quản lý API Key', icon: Key },
    { id: 'templates', label: 'Template Nhập liệu', icon: FileBox },
    { id: 'synclog', label: 'Lịch sử đồng bộ', icon: History },
    { id: 'kpiimport', label: 'Nhập liệu KPI', icon: UploadCloud, isNew: true },
    { id: 'kpihistory', label: 'Lịch sử Import KPI', icon: LineChart },
  ];

  const handleCreateApiKey = () => {
    alert('Đang khởi tạo trình tạo API Key...');
  };

  const systemStatus = [
    { name: 'SCADA / PLC', protocol: 'Modbus TCP', host: '192.168.10.100', status: 'connected', latency: '12ms', lastSync: '22:30' },
    { name: 'Phần mềm Kế toán', protocol: 'REST API', host: 'erp.quawaco.vn', status: 'connected', latency: '85ms', lastSync: '22:00' },
    { name: 'Hóa đơn điện tử (VNPT)', protocol: 'SOAP API', host: 'einvoice.vnpt.vn', status: 'connected', latency: '210ms', lastSync: '21:45' },
    { name: 'Cổng TT ngân hàng', protocol: 'REST API', host: 'banking.vietinbank.vn', status: 'error', latency: '—', lastSync: '20:15' },
    { name: 'Tổng đài 1900 545 520', protocol: 'WebSocket', host: 'callcenter.quawaco.vn', status: 'connected', latency: '8ms', lastSync: '22:28' },
    { name: 'GIS Tuyến ống', protocol: 'WMS/WFS', host: 'gis.quawaco.vn', status: 'partial', latency: '145ms', lastSync: '18:00' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'connected') return <span className="badge badge-green font-black text-[9px] uppercase tracking-wider">Kết nối</span>;
    if (status === 'error') return <span className="badge badge-red font-black text-[9px] uppercase tracking-wider">Lỗi kết nối</span>;
    return <span className="badge badge-yellow font-black text-[9px] uppercase tracking-wider">Một phần</span>;
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto custom-scrollbar animate-fadeInScale">
      {/* Page Header */}
      <div className="page-header mb-6 flex justify-between items-start">
        <div className="page-title">
          <h1 className="text-[22px] font-bold text-[color:var(--text)]">Data Hub – Tích hợp Dữ liệu</h1>
          <p className="text-[13px] text-[color:var(--muted)] mt-0.5">
            Quản lý kết nối API, đồng bộ SCADA, hệ thống ngoại vi và Nhập liệu KPI
          </p>
        </div>
        <div className="page-actions flex gap-2.5">
          <button 
            onClick={handleCreateApiKey}
            className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold shadow-lg"
          >
            <Plus size={14} /> Tạo API Key
          </button>
        </div>
      </div>

      {/* System Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {systemStatus.map((s, i) => (
          <div key={i} className="card p-4 transition-all hover:border-[color:var(--cyan)] bg-[color:var(--bg-card)] border-[color:var(--border)] shadow-sm group">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[14px] font-bold text-[color:var(--text)] group-hover:text-[color:var(--cyan)] transition-colors">{s.name}</div>
              {getStatusBadge(s.status)}
            </div>
            <div className="text-[12px] text-[color:var(--muted)] mb-1 font-bold">
              Protocol: <span className="text-[color:var(--text)] opacity-90">{s.protocol}</span>
            </div>
            <div className="text-[12px] text-[color:var(--muted)] mb-3 font-bold">
              Host: <code className="text-[color:var(--cyan)] text-[11px] font-black select-all bg-[color:var(--bg-surface)] border border-[color:var(--border)] px-1.5 py-0.5 rounded-md">{s.host}</code>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[color:var(--muted)] mb-4 font-bold border-t border-[color:var(--border)] pt-3 border-dashed">
              <span>
                Latency: <span className={`font-black ${s.latency === '—' ? 'text-[color:var(--red)]' : 'text-[color:var(--green)]'}`}>{s.latency}</span>
              </span>
              <span>Sync: <span className="text-[color:var(--text)]">{s.lastSync}</span></span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm flex-1 !text-[11px] font-black hover:bg-[color:var(--bg-hover)]">Ping test</button>
              <button className="btn btn-outline btn-sm flex-1 !text-[11px] font-black border-[color:var(--border)] text-[color:var(--text)] hover:bg-[color:var(--bg-hover)]">Đồng bộ ngay</button>
            </div>
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
                  : tab.isNew 
                    ? 'text-[color:var(--blue)] hover:bg-[color:var(--blue)]/5 hover:text-[color:var(--blue)]/80'
                    : 'text-[color:var(--muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text)]'
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <Icon size={14} /> {tab.label}
              {tab.isNew && (
                <span className="bg-[color:var(--blue)] text-white text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ml-1.5 shadow-sm">Mới</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'apikeys' && <div className="animate-fadeInScale"><ApiKeys /></div>}
        {activeTab === 'templates' && <div className="animate-fadeInScale"><Templates /></div>}
        {activeTab === 'synclog' && <div className="animate-fadeInScale"><SyncLog /></div>}
        {activeTab === 'kpiimport' && <div className="animate-fadeInScale"><KpiImport /></div>}
        {activeTab === 'kpihistory' && <div className="animate-fadeInScale"><KpiHistory /></div>}
      </div>
    </div>
  );
};

export default DataHub;
