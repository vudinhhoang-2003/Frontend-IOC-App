import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Grid2X2, Grid3X3, LayoutGrid, List, 
  Video, HardDrive, Database,
  AlertTriangle, XCircle,
  PlayCircle,
  Monitor, Activity, Square
} from 'lucide-react';
import { 
  MOCK_CAMERAS, MOCK_NVRS, 
  CAM_LOCATION_TYPES, CAM_IMAGES, 
  STORAGE_RETENTION_DAYS,
  SITES, SUB_LOCATIONS
} from './mockCameraData';
import type { Camera, GridMode, CameraTab } from './types';
import { useAppStore } from '../../store/useAppStore';
import FilterBar from '../../components/common/FilterBar';
import type { FilterConfig } from '../../components/common/FilterBar';

const CameraPage: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const location = useLocation();
  
  // State
  const [activeTab, setActiveTab] = useState<CameraTab>('live');
  const [gridMode, setGridMode] = useState<GridMode>('4x4');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSite, setFilterSite] = useState('all');

  // Handle incoming filter from Plants page
  useEffect(() => {
    const state = location.state as { siteFilter?: string };
    if (state?.siteFilter) {
      console.log('Applying site filter from navigation:', state.siteFilter);
      setFilterSite(state.siteFilter);
      // Optional: Clear state to avoid re-applying on reload if desired
      // window.history.replaceState({}, document.title); 
    }
  }, [location]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSubLoc, setFilterSubLoc] = useState('all');
  const [filterNvr, setFilterNvr] = useState('all');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter logic
  const filteredCameras = useMemo(() => {
    return MOCK_CAMERAS.filter(cam => {
      const matchSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSite = filterSite === 'all' || cam.site === filterSite;
      const matchStatus = filterStatus === 'all' || cam.status === filterStatus;
      const matchType = filterType === 'all' || cam.locationType === filterType;
      const matchSubLoc = filterSubLoc === 'all' || cam.subLocation === filterSubLoc;
      const matchNvr = filterNvr === 'all' || cam.nvr === filterNvr;
      return matchSearch && matchSite && matchStatus && matchType && matchSubLoc && matchNvr;
    });
  }, [searchQuery, filterSite, filterStatus, filterType, filterSubLoc, filterNvr]);

  // Available sublocations based on site/type
  const availableSubLocs = useMemo(() => {
    if (filterSite === 'all' && filterType === 'all') return [];
    return SUB_LOCATIONS[filterSite] || [];
  }, [filterSite, filterType]);

  const itemsPerPage = useMemo(() => {
    if (gridMode === 'list') return 50;
    const [cols, rows] = gridMode.split('x').map(Number);
    return (cols || 4) * (rows || 4);
  }, [gridMode]);

  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage) || 1;
  const paginatedCameras = filteredCameras.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_CAMERAS.length,
    online: MOCK_CAMERAS.filter(c => c.status === 'online').length,
    warning: MOCK_CAMERAS.filter(c => c.status === 'warning').length,
    offline: MOCK_CAMERAS.filter(c => c.status === 'offline').length,
  }), []);

  // Helpers
  const getStatusColor = (s: string) => ({ online: '#00e676', warning: '#ffca28', offline: '#ff1744' }[s] || '#546e7a');
  const getStatusLabel = (s: string) => ({ online: 'Trực tuyến', warning: 'Cảnh báo', offline: 'Ngoại tuyến' }[s] || s);

  const handleReset = () => {
    setSearchQuery('');
    setFilterSite('all');
    setFilterStatus('all');
    setFilterType('all');
    setFilterSubLoc('all');
    setFilterNvr('all');
    setCurrentPage(1);
  };

  return (
    <div className={`flex flex-col min-h-full p-4 font-['Inter',_sans-serif] transition-colors duration-500 ${isDarkMode ? 'bg-[#020b16] text-[#f0f7ff]' : 'bg-[#f4f7f9] text-[#0a1a2f]'}`}>
      
      {/* 1. Page Header (Compact) */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight mb-0.5">Hệ thống Camera CCTV</h2>
          <div className="text-[11px] text-[#648da1] flex items-center gap-3">
            <span>Trung tâm SCC</span>
            <span className="w-1 h-1 rounded-full bg-[#648da1]/30"></span>
            <span>{stats.total} điểm camera</span>
            <span className="w-1 h-1 rounded-full bg-[#648da1]/30"></span>
            <span>4 NVR</span>
            <span className="w-1 h-1 rounded-full bg-[#648da1]/30"></span>
            <span>700 Mbps đường truyền riêng</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-[rgba(0,210,255,0.06)] border border-[rgba(0,210,255,0.15)] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00f080] shadow-[0_0_8px_#00f080] animate-pulse" />
            <span className="text-[11px] text-[#00d2ff] uppercase font-bold tracking-wider">LIVE</span>
            <span className="text-[11px] font-mono text-[#00d2ff] font-bold">{currentTime.toLocaleTimeString('vi-VN')}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-[rgba(157,112,255,0.08)] border border-[#9d70ff]/20 flex items-center gap-2 cursor-pointer hover:bg-[#9d70ff]/15 transition-all">
            <Monitor className="text-[#9d70ff]" size={14} />
            <span className="text-[11px] font-bold text-[#9d70ff]">Multiviewer Wall</span>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary (Small Pills) */}
      <div className="flex gap-2 mb-2 flex-wrap relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[rgba(0,230,118,0.07)] border border-[rgba(0,230,118,0.2)] rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676] animate-pulse" />
          <span className="text-[11px] font-bold text-[#00e676]">{stats.online} Online</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[rgba(255,202,40,0.07)] border border-[rgba(255,202,40,0.2)] rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffca28] shadow-[0_0_8px_#ffca28] animate-pulse" />
          <span className="text-[11px] font-bold text-[#ffca28]">{stats.warning} Cảnh báo</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[rgba(255,23,68,0.07)] border border-[rgba(255,23,68,0.2)] rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff1744] shadow-[0_0_8px_#ff1744] animate-pulse" />
          <span className="text-[11px] font-bold text-[#ff1744]">{stats.offline} Offline</span>
        </div>
      </div>

      {/* 3. Navigation Tabs (Small) */}
      <div className="flex items-center gap-1 mb-2 p-0.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(0,210,255,0.08)] w-fit relative z-10">
        {[
          { id: 'live', icon: Video, label: 'Hình ảnh Live' },
          { id: 'nvr', icon: HardDrive, label: 'Đầu ghi NVR' },
          { id: 'storage', icon: Database, label: 'Lưu trữ' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CameraTab)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[var(--bg-hover)] text-[var(--cyan)] border border-[var(--border-active)] shadow-[0_0_15px_rgba(0,200,255,0.1)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] border border-transparent'
            }`}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Filters Bar — Reusable Component */}
      {activeTab === 'live' && (
        <FilterBar
          searchPlaceholder="Tìm camera..."
          searchValue={searchQuery}
          onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          onReset={handleReset}
          filters={[
            {
              key: 'site',
              label: 'ĐỊA ĐIỂM',
              value: filterSite,
              onChange: (v) => { setFilterSite(v); setFilterSubLoc('all'); setCurrentPage(1); },
              options: [
                { value: 'all', label: 'Tất cả địa điểm' },
                ...SITES.map(s => ({ value: s.id, label: s.name })),
              ],
            },
            {
              key: 'type',
              label: 'LOẠI VỊ TRÍ',
              value: filterType,
              onChange: (v) => { setFilterType(v); setFilterSubLoc('all'); setCurrentPage(1); },
              options: [
                { value: 'all', label: 'Tất cả loại vị trí' },
                ...Object.keys(CAM_LOCATION_TYPES).map(t => ({ value: t, label: t })),
              ],
            },
            {
              key: 'subloc',
              label: 'KHU VỰC',
              value: filterSubLoc,
              onChange: (v) => { setFilterSubLoc(v); setCurrentPage(1); },
              options: [
                { value: 'all', label: availableSubLocs.length === 0 ? '(Chọn địa điểm trước)' : 'Tất cả khu vực' },
                ...availableSubLocs.map(sl => ({ value: sl, label: sl })),
              ],
            },
            {
              key: 'status',
              label: 'TRẠNG THÁI',
              value: filterStatus,
              onChange: (v) => { setFilterStatus(v); setCurrentPage(1); },
              options: [
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'online', label: 'Trực tuyến' },
                { value: 'warning', label: 'Cảnh báo' },
                { value: 'offline', label: 'Ngoại tuyến' },
              ],
            },
          ]}
        />
      )}

      {activeTab === 'live' && (
        <div className="flex flex-col gap-2 mb-2 p-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl relative z-10">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                {[
                  { id: '2x2', icon: Grid2X2 },
                  { id: '3x2', icon: Grid3X3 },
                  { id: '3x4', icon: Grid3X3 },
                  { id: '4x4', icon: LayoutGrid },
                  { id: 'list', icon: List }
                ].map(mode => (
                  <button key={mode.id} onClick={() => { setGridMode(mode.id as GridMode); setCurrentPage(1); }}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                      gridMode === mode.id ? 'bg-[var(--bg-hover)] text-[var(--cyan)] shadow-[0_0_0_1px_var(--cyan)]' : 'text-[var(--muted)] hover:bg-[var(--bg-hover)]'
                    }`}>
                    <mode.icon size={13} />
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-[var(--muted)]">
                Đang hiển thị <span className="text-[var(--text)] font-bold">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCameras.length)}</span> trên <span className="text-[var(--cyan)] font-bold">{filteredCameras.length}</span> camera
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-elevated)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Trước</button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (totalPages > 5 && p > 3 && p < totalPages) {
                    if (p === 4) return <span key={p} className="text-[var(--muted)]">...</span>;
                    return null;
                  }
                  return (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                      currentPage === p ? 'bg-[var(--cyan)] text-[var(--bg-base)]' : 'bg-[var(--bg-elevated)] text-[var(--text)] hover:bg-[var(--bg-hover)]'
                    }`}>{p}</button>
                  );
                })}
              </div>
              <button className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-elevated)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Sau</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0 relative z-10">
        {activeTab === 'live' && (
          <div className={`grid gap-[8px] animate-in fade-in duration-500 ${
            gridMode === '2x2' ? 'grid-cols-2' : 
            gridMode === '3x2' ? 'grid-cols-2 lg:grid-cols-3' :
            gridMode === '3x4' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
            gridMode === '4x4' ? 'grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' : 
            'grid-cols-1'
          }`}>
            {gridMode === 'list' ? (
              <div className="col-span-full border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border)] text-[var(--muted)] text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ID / Tên</th>
                      <th className="px-4 py-3">Loại vị trí</th>
                      <th className="px-4 py-3">Địa điểm cụ thể</th>
                      <th className="px-4 py-3 text-center">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedCameras.map(cam => (
                      <tr key={cam.id} onClick={() => setSelectedCamera(cam)} className="group cursor-pointer hover:bg-[#00d2ff]/5 transition-all">
                        <td className="px-4 py-2">
                          <div className="font-bold text-[var(--text)] group-hover:text-[var(--cyan)]">{cam.name} / {cam.id}</div>
                        </td>
                        <td className="px-4 py-2">{cam.locationType}</td>
                        <td className="px-4 py-2">{cam.site}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${cam.status === 'online' ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : cam.status === 'warning' ? 'bg-[#ffca28]/10 border-[#ffca28]/20 text-[#ffca28]' : 'bg-[#ff1744]/10 border-[#ff1744]/20 text-[#ff1744]'}`}>
                            {getStatusLabel(cam.status).toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              paginatedCameras.map(cam => (
                <div key={cam.id} onClick={() => setSelectedCamera(cam)} 
                  className={`group flex flex-col cursor-pointer bg-[var(--bg-card)] border rounded-lg overflow-hidden transition-all duration-300 ${
                    cam.status === 'online' ? 'border-[var(--border)] hover:border-[var(--cyan)]/40' :
                    cam.status === 'warning' ? 'border-[rgba(255,202,40,0.25)] hover:border-[#ffca28]/40' :
                    'border-[rgba(255,23,68,0.2)] hover:border-[#ff1744]/40'
                  }`}>
                  <div className="relative aspect-video bg-[var(--bg-surface)] overflow-hidden">
                    {cam.status === 'offline' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <XCircle size={24} className="text-[#ff1744]" />
                        <span className="text-[9px] text-[#ff1744] font-bold uppercase">OFFLINE</span>
                      </div>
                    ) : (
                      <>
                        <img src={CAM_IMAGES[cam.imageKey]} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" alt="" />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {cam.status === 'online' ? (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm">
                              <div className="w-1 h-1 rounded-full bg-[#ff1744] animate-pulse" />
                              <span className="text-[8px] font-bold text-white italic">REC</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/20 rounded backdrop-blur-sm">
                              <AlertTriangle className="text-yellow-500" size={8} />
                              <span className="text-[8px] font-bold text-yellow-400">WARN</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between">
                          <span className="text-[8px] font-mono text-white/70">{currentTime.toLocaleTimeString('vi-VN')}</span>
                          <span className="text-[8px] text-white/40">{cam.resolution}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="flex items-center justify-between gap-1 overflow-hidden">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-[var(--text)] truncate">{cam.name}</div>
                        <div className="text-[8px] text-[var(--muted)] truncate overflow-hidden">{cam.siteShort} · {cam.position}</div>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cam.status === 'online' ? 'bg-[#00e676]' : cam.status === 'warning' ? 'bg-[#ffca28]' : 'bg-[#ff1744]'}`} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NVR Tab */}
        {activeTab === 'nvr' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
            {MOCK_NVRS.map(nvr => (
              <div key={nvr.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--cyan)]/40 transition-all p-4">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                       <HardDrive className="text-[var(--cyan)]" size={18} />
                       <div>
                          <div className="text-[14px] font-bold text-[var(--text)]">{nvr.id}</div>
                          <div className="text-[10px] text-[var(--muted)] uppercase">{nvr.name}</div>
                       </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#00e676] px-2 py-0.5 bg-[#00e676]/10 border border-[#00e676]/20 rounded">ONLINE</span>
                 </div>
                 <div className="space-y-3">
                    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                       <div className="h-full bg-[var(--cyan)]" style={{ width: `${Math.round(nvr.hdUsed / nvr.hdd * 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--muted)]">
                       <span>HDD: {nvr.hdUsed}/{nvr.hdd} TB</span>
                       <span>BW: {nvr.bandwidth} Mbps</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in">
            {[
              { label: 'Dung lượng', value: '48.0 TB', color: 'var(--cyan)' },
              { label: 'Đã sử dụng', value: '32.4 TB', color: 'var(--yellow)' },
              { label: 'Số ngày lưu', value: STORAGE_RETENTION_DAYS + 'd', color: 'var(--green)' },
              { label: 'Băng thông', value: '642 Mbps', color: 'var(--purple)' }
            ].map((kpi, i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-xl">
                 <div className="text-[10px] text-[var(--muted)] mb-1">{kpi.label}</div>
                 <div className="text-[20px] font-black" style={{ color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side Panel Overlay */}
      {selectedCamera && (
        <div className="fixed inset-0 z-[600] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCamera(null)} />
          <div className="relative w-[400px] h-full bg-[var(--bg-surface)] border-l border-[var(--border)] flex flex-col p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-[16px] font-bold">{selectedCamera.name}</h3>
               <button onClick={() => setSelectedCamera(null)} className="text-[#648da1] text-2xl">&times;</button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 border border-white/5">
               <img src={CAM_IMAGES[selectedCamera.imageKey]} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-6">
              {[
                { l: 'ID', v: selectedCamera.id },
                { l: 'Trạng thái', v: getStatusLabel(selectedCamera.status) },
                { l: 'Vị trí', v: selectedCamera.site },
                { l: 'Khu vực', v: selectedCamera.subLocation },
                { l: 'IP', v: selectedCamera.ip },
                { l: 'NVR', v: selectedCamera.nvr }
              ].map(x => (
                <div key={x.l} className="bg-white/5 p-2 rounded border border-white/5">
                   <div className="text-[#648da1] text-[9px] mb-0.5">{x.l}</div>
                   <div className="font-bold truncate">{x.v}</div>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 bg-[#00d2ff] text-black font-bold rounded-lg hover:bg-[#00d2ff]/80 transition-all flex items-center justify-center gap-2">
               <PlayCircle size={18} /> PLAYBACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;
