import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronLeft, ChevronRight, LocateFixed, Map as MapIcon, Settings, Droplet, Disc, Radio, AlertOctagon } from 'lucide-react';
import FilterBar from '../../components/common/FilterBar';
import { GIS_DMA_ZONES, GIS_PIPE_NETWORK, GIS_FACTORIES, GIS_STATIONS, GIS_INCIDENTS } from './mockGisData';
import { getPipeStyle, makeValveIcon, makeStationIcon, makeFactoryIcon, makeIncidentIcon, injectGlobalLeafletCss } from './MapCore';
import { useAppStore } from '../../store/useAppStore';

const LAYER_ITEMS = [
  { key: 'stations', label: 'Trạm bơm', color: '#00e676', icon: Radio },
  { key: 'factories', label: 'Nhà máy', color: '#00c8ff', icon: Settings },
  { key: 'incidents', label: 'Sự cố', color: '#ff1744', icon: AlertOctagon },
  { key: 'pipes', label: 'Ống truyền dẫn', color: '#00c8ff', icon: Droplet },
  { key: 'dmaZones', label: 'Vùng DMA', color: '#7c4dff', icon: MapIcon },
  { key: 'valves', label: 'Van & thiết bị', color: '#ffca28', icon: Disc },
];

export default function GisPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [searchParams] = useSearchParams();
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  
  // Ref for Leaflet objects
  const markersRef = useRef<{
    stations: L.Marker[];
    factories: L.Marker[];
    incidents: L.Marker[];
    pipes: L.Layer[];
    dmaGroups: Record<string, { polygon: L.Polygon; label: L.Marker; pipes: L.Layer[]; valves: L.Marker[] }>;
  }>({
    stations: [], factories: [], incidents: [], pipes: [], dmaGroups: {}
  });

  // UI States
  const [panelLeft, setPanelLeft] = useState(true);
  const [panelRight, setPanelRight] = useState(true);
  const [legendVisible, setLegendVisible] = useState(false);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [layerCategoryFilter, setLayerCategoryFilter] = useState('all');

  // Layer Visibility Flags
  const [layerFlags, setLayerFlags] = useState<Record<string, boolean>>({
    stations: true, factories: true, incidents: true,
    pipes: true, dmaZones: true, valves: true
  });

  // DMA Visibility Flags
  const [dmaVisibility, setDmaVisibility] = useState<Record<string, boolean>>(
    GIS_DMA_ZONES.reduce((acc, dma) => ({ ...acc, [dma.id]: true }), {})
  );

  // Filtered lists for sidebar interaction
  const filteredStations = useMemo(() => {
    return GIS_STATIONS.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFactory = factoryFilter === 'all' || s.factory === factoryFilter;
      return matchSearch && matchFactory;
    });
  }, [searchQuery, factoryFilter]);

  const filteredDmas = useMemo(() => {
    return GIS_DMA_ZONES.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // Initial Map Setup
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    injectGlobalLeafletCss();

    const map = L.map(mapContainerRef.current, {
      center: [21.0, 107.1],
      zoom: 10,
      zoomControl: true,
      preferCanvas: true,
    });

    const tileUrl = isDarkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap · © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    mapRef.current = map;
    buildMapObjects();

    // Check for dmaId or stationId in URL and auto-zoom
    const dmaId = searchParams.get('dmaId');
    const stationId = searchParams.get('stationId');

    if (dmaId) {
      setTimeout(() => zoomToDma(dmaId), 500);
    } else if (stationId) {
      const station = GIS_STATIONS.find(s => s.id === stationId);
      if (station) {
        setTimeout(() => zoomToStation(station.lat, station.lng, station.id), 500);
      }
    }

    return () => {
    };
  }, []);

  // Update TileLayer when DarkMode changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    const map = mapRef.current;
    
    // Remove old layer
    map.removeLayer(tileLayerRef.current);
    
    // Create new layer
    const tileUrl = isDarkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      
    const newTileLayer = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap · © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);
    
    tileLayerRef.current = newTileLayer;
  }, [isDarkMode]);

  // Update Map Layer Visibility based on UI State
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const refs = markersRef.current;

    // 1. Stations (Filter by Layer flag & Factory filter)
    refs.stations.forEach((m, i) => {
      const s = GIS_STATIONS[i];
      const shouldShow = layerFlags.stations && (factoryFilter === 'all' || s.factory === factoryFilter);
      if (shouldShow) map.addLayer(m); else map.removeLayer(m);
    });

    // 2. Factories
    refs.factories.forEach(m => layerFlags.factories ? map.addLayer(m) : map.removeLayer(m));

    // 3. Incidents
    refs.incidents.forEach(m => layerFlags.incidents ? map.addLayer(m) : map.removeLayer(m));

    // 4. Pipes & Transmission Valves
    refs.pipes.forEach(l => {
      if (l instanceof L.Marker) { // Valve
        layerFlags.valves && layerFlags.pipes ? map.addLayer(l) : map.removeLayer(l);
      } else { // Polyline (core or glow)
        layerFlags.pipes ? map.addLayer(l) : map.removeLayer(l);
      }
    });

    // 5. DMA Zones
    Object.keys(refs.dmaGroups).forEach(dmaId => {
      const { polygon, label, pipes, valves } = refs.dmaGroups[dmaId];
      const isDmaOn = dmaVisibility[dmaId];
      
      if (isDmaOn && layerFlags.dmaZones) {
        map.addLayer(polygon);
        map.addLayer(label);
        pipes.forEach(p => map.addLayer(p));
      } else {
        map.removeLayer(polygon);
        map.removeLayer(label);
        pipes.forEach(p => map.removeLayer(p));
      }

      if (isDmaOn && layerFlags.valves && layerFlags.dmaZones) {
        valves.forEach(v => map.addLayer(v));
      } else {
        valves.forEach(v => map.removeLayer(v));
      }
    });

  }, [layerFlags, dmaVisibility, factoryFilter]);

  // Map Resize on Panel Toggle
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 330);
    return () => clearTimeout(timer);
  }, [panelLeft, panelRight]);

  const buildMapObjects = () => {
    const refs = markersRef.current;

    // DMA Building
    GIS_DMA_ZONES.forEach(dma => {
      const latlngs = dma.coords as [number, number][];
      const polygon = L.polygon(latlngs, {
        color: dma.color, weight: 2, opacity: 0.8,
        fillColor: dma.color, fillOpacity: dma.fillOpacity,
        dashArray: '6 4'
      });

      const lossColor = dma.loss >= 18 ? '#ff1744' : dma.loss >= 13 ? '#ffca28' : '#00e676';
      const statusHtml = ({ 
        ok: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e676;vertical-align:middle"></span> Bình thường', 
        warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffca28;vertical-align:middle"></span> NRW cao', 
        critical: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff1744;vertical-align:middle"></span> Nghiêm trọng' 
      } as Record<string, string>)[dma.status] || dma.status;

      polygon.bindPopup(`
        <div class="gis-popup-inner">
          <div class="gis-popup-title">${dma.name} · ${dma.id}</div>
          <div class="gis-popup-sub">${dma.district}</div>
          <div class="gis-popup-grid">
            <div><div class="gis-popup-key">Khách hàng</div><div class="gis-popup-val">${dma.customers.toLocaleString('vi-VN')}</div></div>
            <div><div class="gis-popup-key">NRW</div><div class="gis-popup-val" style="color:${lossColor}">${dma.loss}%</div></div>
            <div><div class="gis-popup-key">Cấp vào</div><div class="gis-popup-val" style="color:#00c8ff">${dma.supplyFlow} m³/h</div></div>
            <div><div class="gis-popup-key">Tiêu thụ</div><div class="gis-popup-val" style="color:#00e676">${dma.consumptionFlow} m³/h</div></div>
          </div>
          <div class="gis-popup-status">${statusHtml}</div>
        </div>
      `, { className: 'gis-popup', maxWidth: 280 });

      const center = polygon.getBounds().getCenter();
      const labelIcon = L.divIcon({
        html: `<div class="gis-dma-label" style="color:${dma.color};font-size:11px;font-weight:700;text-shadow:0 0 8px rgba(0,0,0,0.8),0 0 4px rgba(0,0,0,0.9);white-space:nowrap;pointer-events:none">${dma.name}</div>`,
        className: 'gis-dma-label', 
        iconAnchor: [40, 8]
      });
      const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });

      refs.dmaGroups[dma.id] = { polygon, label: labelMarker, pipes: [], valves: [] };
    });

    // Pipes and Transmission Valves
    GIS_PIPE_NETWORK.forEach(pipe => {
      const isTrans = pipe.type === 'transmission';
      const style = getPipeStyle(pipe);
      
      const glow = L.polyline(pipe.coords as [number, number][], {
        color: style.color, weight: style.weight + 3,
        opacity: 0.12, dashArray: style.dashArray,
        lineCap: 'round', lineJoin: 'round'
      });

      const core = L.polyline(pipe.coords as [number, number][], {
        color: style.color, weight: style.weight,
        opacity: style.opacity, dashArray: style.dashArray,
        lineCap: 'round', lineJoin: 'round'
      });

      const typeLabel = ({ transmission: 'Truyền dẫn', distribution: 'Phân phối', meter: 'Đo đếm' } as Record<string, string>)[pipe.type] || pipe.type;
      const statusLabel = ({ 
        active: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e676;vertical-align:middle"></span> Hoạt động', 
        warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffca28;vertical-align:middle"></span> Cảnh báo', 
        leaking: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff1744;vertical-align:middle"></span> Rò rỉ', 
        closed: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#546e7a;vertical-align:middle"></span> Đã đóng' 
      } as Record<string, string>)[pipe.status] || pipe.status;

      core.bindPopup(`
        <div class="gis-popup-inner">
          <div class="gis-popup-title">${pipe.label || pipe.id}</div>
          <div class="gis-popup-sub">${typeLabel} · DN${pipe.diameter}</div>
          <div class="gis-popup-status">${statusLabel}</div>
        </div>
      `, { className: 'gis-popup', maxWidth: 260 });

      const pipeTarget = isTrans ? refs.pipes : (pipe.dmaId && refs.dmaGroups[pipe.dmaId]?.pipes);
      if (pipeTarget) pipeTarget.push(glow, core);

      pipe.valves?.forEach(v => {
        const marker = L.marker(v.pos as [number, number], { icon: makeValveIcon(v), zIndexOffset: 200 });
        const vStatusHtml = ({ 
          open: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e676;vertical-align:middle"></span> Mở', 
          closed: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ff1744;vertical-align:middle"></span> Đóng',
          active: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e676;vertical-align:middle"></span> Hoạt động',
          warning: '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffca28;vertical-align:middle"></span> Cảnh báo'
        } as Record<string, string>)[v.status] || v.status;

        marker.bindPopup(`
          <div class="gis-popup-inner">
            <div class="gis-popup-title">${v.id}</div>
            <div class="gis-popup-sub">${v.type}</div>
            <div class="gis-popup-status">${vStatusHtml}</div>
          </div>
        `, { className: 'gis-popup', maxWidth: 200 });

        const valveTarget = isTrans ? refs.pipes : (pipe.dmaId && refs.dmaGroups[pipe.dmaId]?.valves);
        if (valveTarget) valveTarget.push(marker);
      });
    });

    // Stations Building
    GIS_STATIONS.forEach(s => {
      const marker = L.marker([s.lat, s.lng], { icon: makeStationIcon(s.status), zIndexOffset: 500 });
      marker.bindPopup(`
        <div class="gis-popup-inner">
          <div class="gis-popup-title">${s.name}</div>
          <div class="gis-popup-sub">${s.factory} · ID: ${s.id}</div>
          <div class="gis-popup-grid">
            <div><div class="gis-popup-key">Áp lực</div><div class="gis-popup-val" style="color:#00c8ff">${s.pressure} bar</div></div>
            <div><div class="gis-popup-key">Lưu lượng</div><div class="gis-popup-val" style="color:#00e676">${s.flow} m³/h</div></div>
            <div><div class="gis-popup-key">Mực nước</div><div class="gis-popup-val">${s.level}%</div></div>
          </div>
        </div>
      `, { className: 'gis-popup' });
      refs.stations.push(marker);
    });

    // Factories Building
    GIS_FACTORIES.forEach(f => {
      const marker = L.marker([f.lat, f.lng], { icon: makeFactoryIcon(), zIndexOffset: 400 });
      marker.bindPopup(`<div class="gis-popup-inner"><div class="gis-popup-title">${f.name}</div><div class="gis-popup-sub">${f.location}</div></div>`, { className: 'gis-popup' });
      refs.factories.push(marker);
    });

    // Incidents Building
    GIS_INCIDENTS.forEach(inc => {
      const marker = L.marker([inc.lat, inc.lng], { icon: makeIncidentIcon(), zIndexOffset: 600 });
      marker.bindPopup(`
        <div class="gis-popup-inner" style="border-color: rgba(255,23,68,0.4)">
          <div class="gis-popup-title" style="color:#ff5252">${inc.type} · ${inc.id}</div>
          <div class="gis-popup-sub">${inc.location}</div>
          <div class="flex gap-2 mt-2">
            <button class="flex-1 py-1 px-2 bg-red-500/20 border border-red-500/30 text-red-500 text-[11px] rounded hover:bg-red-500/30 transition-colors">Xem chi tiết</button>
          </div>
        </div>
      `, { className: 'gis-popup' });
      refs.incidents.push(marker);
    });
  };

  // User Actions Logic
  const resetAll = () => {
    mapRef.current?.flyTo([21.0, 107.1], 10, { duration: 1.0 });
    setSearchQuery('');
    setFactoryFilter('all');
    setAreaFilter('all');
    setLayerCategoryFilter('all');
    setLayerFlags({
      stations: true, factories: true, incidents: true,
      pipes: true, dmaZones: true, valves: true
    });
  };

  const zoomToStation = (lat: number, lng: number, id: string) => {
    mapRef.current?.flyTo([lat, lng], 16, { duration: 1.2 });
    const idx = GIS_STATIONS.findIndex(s => s.id === id);
    if (idx >= 0 && markersRef.current.stations[idx]) {
      setTimeout(() => markersRef.current.stations[idx].openPopup(), 1300);
    }
  };

  const zoomToDma = (id: string) => {
    const dma = GIS_DMA_ZONES.find(d => d.id === id);
    if (dma && mapRef.current) {
      const l = L.polygon(dma.coords as [number, number][]);
      mapRef.current.flyToBounds(l.getBounds(), { padding: [50, 50], duration: 1.2 });
    }
  };

  const zoomToIncident = (lat: number, lng: number, id: string) => {
    mapRef.current?.flyTo([lat, lng], 17, { duration: 1.2 });
    const idx = GIS_INCIDENTS.findIndex(inc => inc.id === id);
    if (idx >= 0 && markersRef.current.incidents[idx]) {
      setTimeout(() => markersRef.current.incidents[idx].openPopup(), 1300);
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden p-3 font-['Inter',_sans-serif] transition-colors duration-500 ${isDarkMode ? 'bg-[#030e1c] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. TOP FILTERS BAR — Reusable Component */}
      <FilterBar
        searchPlaceholder="Tìm trạm, khu vực, nhà máy..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={resetAll}
        filters={[
          {
            key: 'factory',
            label: 'NHÀ MÁY',
            value: factoryFilter,
            onChange: setFactoryFilter,
            options: [
              { value: 'all', label: 'Tất cả nhà máy' },
              ...Array.from(new Set(GIS_STATIONS.map(s => s.factory))).map(f => ({ value: f, label: f })),
            ],
          },
          {
            key: 'area',
            label: 'KHU VỰC',
            value: areaFilter,
            onChange: setAreaFilter,
            options: [
              { value: 'all', label: 'Tất cả khu vực' },
              { value: 'halong', label: 'TP. Hạ Long' },
              { value: 'campha', label: 'TP. Cẩm Phả' },
              { value: 'quangyen', label: 'Thị xã Quảng Yên' },
            ],
          },
          {
            key: 'layer',
            label: 'HIỂN THỊ LỚP',
            value: layerCategoryFilter,
            onChange: setLayerCategoryFilter,
            options: [
              { value: 'all', label: 'Tất cả lớp' },
              { value: 'physical', label: 'Lớp vật lý' },
              { value: 'service', label: 'Lớp dịch vụ' },
            ],
          },
        ]}
      />

      {/* 2. TITLE & STATS ROW area */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-col">
          <h2 className={`text-[20px] font-bold tracking-tight leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bản đồ GIS Mạng lưới</h2>
          <span className={`text-[12px] font-medium transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Quảng Ninh · {GIS_DMA_ZONES.length} DMA · {GIS_PIPE_NETWORK.length} đoạn ống · 35 van/thiết bị
          </span>
        </div>
        
        {/* Rounded Pills stats area */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#00e676]/10 border border-[#00e676]/20 rounded-full h-8 shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-transform hover:scale-105">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
            <span className="text-[13px] font-bold text-[#00e676]">{GIS_STATIONS.filter(s => s.status === 'online').length} Online</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#ffca28]/10 border border-[#ffca28]/20 rounded-full h-8 shadow-[0_0_15px_rgba(255,202,40,0.1)] transition-transform hover:scale-105">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffca28] animate-pulse" />
            <span className="text-[13px] font-bold text-[#ffca28]">{GIS_STATIONS.filter(s => s.status === 'warning').length} Cảnh báo</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#ff1744]/10 border border-[#ff1744]/20 rounded-full h-8 shadow-[0_0_15px_rgba(255,23,68,0.1)] transition-transform hover:scale-105">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff1744] animate-pulse" />
            <span className="text-[13px] font-bold text-[#ff1744]">{GIS_STATIONS.filter(s => s.status === 'offline').length} Offline</span>
          </div>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button onClick={() => mapRef.current?.flyTo([21.0, 107.1], 10, { duration: 1.0 })} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-[12px] border border-cyan-500/20 font-semibold tracking-wide">
            <LocateFixed size={14} /> Về trung tâm
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT area */}
      <div className="flex gap-3 flex-1 min-h-0 relative overflow-hidden">
        
        {/* LEFT SIDEBAR area (220px) */}
        <div className={`flex flex-col gap-3 transition-all duration-300 ease-in-out shrink-0 overflow-y-auto custom-scrollbar pr-1 max-h-full ${panelLeft ? 'w-[220px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          
          {/* Lớp hiển thị */}
          <div className={`border rounded-xl p-2.5 shadow-xl backdrop-blur-md transition-colors shrink-0 ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10' : 'bg-white/90 border-slate-200 shadow-slate-200'}`}>
            <div className={`text-[9px] font-bold tracking-[0.2em] uppercase mb-2 px-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Lớp hiển thị</div>
            <div className="flex flex-col space-y-0.5">
              {LAYER_ITEMS.map(({ key, label, color }) => (
                <label key={key} className={`flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg transition-all group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
                  <input type="checkbox" checked={layerFlags[key]} onChange={e => setLayerFlags(p => ({ ...p, [key]: e.target.checked }))} 
                    className="accent-cyan-500 w-3 h-3 cursor-pointer" />
                  <div className={`flex items-center gap-2 text-[11px] transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    <span className="w-2.5 h-0.5 rounded-full" style={{ background: color }} />
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Vùng DMA */}
          <div className={`border rounded-xl p-2.5 flex-[3] min-h-[320px] flex flex-col shadow-2xl backdrop-blur-md transition-colors overflow-hidden ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2.5 shrink-0 px-1">
              <div className={`text-[10px] font-bold tracking-[0.2em] uppercase leading-none ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Vùng quản lý DMA</div>
              <div className="flex gap-1">
                <button onClick={() => setDmaVisibility(GIS_DMA_ZONES.reduce((a, d) => ({ ...a, [d.id]: true }), {}))} className="text-[8px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-sm hover:bg-cyan-500/20 font-bold border border-cyan-500/20">Bật</button>
                <button onClick={() => setDmaVisibility(GIS_DMA_ZONES.reduce((a, d) => ({ ...a, [d.id]: false }), {}))} className="text-[8px] px-1.5 py-0.5 bg-slate-700/30 text-slate-400 rounded-sm hover:bg-slate-700/50 font-bold border border-white/5">Tắt</button>
              </div>
            </div>
            {/* Scrollable DMA items */}
            <div className={`overflow-y-auto flex-1 pr-1 space-y-0.5 custom-scrollbar`}>
              {filteredDmas.map(dma => {
                const isChecked = dmaVisibility[dma.id];
                const lossColor = dma.loss >= 18 ? 'text-red-500' : dma.loss >= 13 ? 'text-yellow-500' : 'text-green-500';
                const statusDot = dma.status === 'ok' ? 'bg-[#00e676]' : dma.status === 'warning' ? 'bg-[#ffca28]' : 'bg-[#ff1744]';
                return (
                  <label key={dma.id} onClick={(e) => { if (e.target instanceof HTMLInputElement) return; zoomToDma(dma.id); }}
                    className={`flex items-start gap-2 cursor-pointer py-1.5 px-2 rounded-lg group transition-all border border-transparent relative ${isDarkMode ? 'hover:bg-cyan-500/10 hover:border-cyan-500/20' : 'hover:bg-blue-50/50 hover:border-blue-200'}`}
                  >
                    <input type="checkbox" checked={isChecked} onChange={e => setDmaVisibility(p => ({ ...p, [dma.id]: e.target.checked }))} 
                      className="accent-cyan-500 w-3 h-3 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-1 h-3 rounded-full" style={{ background: dma.color }} />
                        <span className={`text-[11px] font-bold transition-colors truncate ${isDarkMode ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{dma.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-medium leading-none ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{dma.customers.toLocaleString()} KH</span>
                        <span className={`text-[9px] font-bold ${lossColor} leading-none`}>NRW {dma.loss}%</span>
                      </div>
                    </div>
                    {/* Status dot on far right */}
                    <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${statusDot} shadow-[0_0_8px_currentColor]`} />
                  </label>
                )
              })}
            </div>
          </div>

          {/* Chú giải collapsible */}
          <div className={`border rounded-xl p-2 shrink-0 flex flex-col shadow-xl transition-colors ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10' : 'bg-white/90 border-slate-200'}`}>
             <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Chú giải mạng lưới</span>
              <button onClick={() => setLegendVisible(!legendVisible)} className={`text-[9px] hover:underline px-2 py-0.5 rounded bg-slate-500/10 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                {legendVisible ? 'Ẩn' : 'Hiện'}
              </button>
             </div>
             {legendVisible && (
               <div className="mt-2.5 space-y-1.5 animate-in fade-in duration-300 px-1 pb-1 max-h-[180px] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#00c8ff" strokeWidth="4" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Truyền dẫn (DN300+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#00c8ff" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phân phối (DN150+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Nhánh (DN100-110)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#ffca28" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Cảnh báo áp thấp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#ff1744" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rò rỉ / Sự cố</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="#546e7a" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round"/></svg>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Đã đóng / Cô lập</span>
                  </div>
                  
                  {/* Point Symbols */}
                  <div className="pt-2 mt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00e676] ring-2 ring-[#00e676]/20 shadow-[0_0_8px_rgba(0,230,118,0.2)]" />
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Van đang mở</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ff1744] ring-2 ring-[#ff1744]/20" />
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Van đang đóng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ffca28] ring-2 ring-[#ffca28]/20" />
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Van cảnh báo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00c8ff] ring-2 ring-[#00c8ff]/30 shadow-[0_0_8px_rgba(0,200,255,0.3)]" />
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Đồng hồ lưu lượng</span>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* MAP CONTAINER area (Center) */}
        <div className="flex-1 bg-[#0a1b2e] border border-white/10 rounded-2xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Resize Toggle Buttons (Tabs) */}
          <button onClick={() => setPanelLeft(!panelLeft)} className="absolute left-0 top-1/2 -translate-y-1/2 z-[1000] w-4 h-16 bg-[#030e1c]/95 border border-l-0 border-cyan-500/20 rounded-r-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex items-center justify-center transition-all shadow-xl">
            {panelLeft ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          <button onClick={() => setPanelRight(!panelRight)} className="absolute right-0 top-1/2 -translate-y-1/2 z-[1000] w-4 h-16 bg-[#030e1c]/95 border border-r-0 border-cyan-500/20 rounded-l-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex items-center justify-center transition-all shadow-xl">
            {panelRight ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Horizontal Layer Bar if Left Panel is Hidden */}
          {!panelLeft && (
            <div className="absolute left-6 top-6 z-[999] flex items-center gap-2 p-2 bg-[#030e1c]/90 border border-cyan-500/20 rounded-xl backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500 shadow-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Lớp</span>
              {LAYER_ITEMS.map(({ key, color }) => (
                <button key={key} onClick={() => setLayerFlags(p => ({ ...p, [key]: !p[key] }))}
                  className={`w-4 h-4 rounded-full border border-white/10 transition-all ${layerFlags[key] ? 'ring-2 ring-offset-1 ring-offset-[#030e1c] ring-cyan-500' : 'opacity-40'}`}
                  style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR area (290px) */}
        <div className={`flex flex-col gap-3 transition-all duration-300 ease-in-out shrink-0 overflow-y-auto custom-scrollbar pr-1 max-h-full ${panelRight ? 'w-[290px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          
          {/* Trạm bơm area */}
          <div className={`border rounded-xl flex-[1.2] min-h-0 flex flex-col shadow-2xl backdrop-blur-md transition-colors overflow-hidden ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className={`p-3 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
               <h3 className={`text-[13px] font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Trạm bơm</h3>
               <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isDarkMode ? 'text-slate-500 bg-[#020a14] border-white/5' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>{filteredStations.length} trạm</span>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {filteredStations.map((s, i) => (
                <div key={i} onClick={() => zoomToStation(s.lat, s.lng, s.id)}
                  className={`flex items-center justify-between px-3 py-3 border-b cursor-pointer transition-all group ${isDarkMode ? 'border-white/5 hover:bg-cyan-500/5' : 'border-slate-100 hover:bg-blue-50'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === 'online' ? 'bg-[#00e676]' : s.status === 'warning' ? 'bg-[#ffca28]' : 'bg-[#ff1744]'} animate-pulse`} />
                    <div className="truncate">
                      <div className={`text-[13px] font-bold transition-colors truncate ${isDarkMode ? 'text-slate-100 group-hover:text-cyan-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{s.name}</div>
                      <div className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{s.factory}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className={`text-[13px] font-bold leading-tight ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{s.status !== 'offline' ? s.pressure.toFixed(1) : '---'} <span className={`text-[10px] font-medium uppercase ml-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>bar</span></div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{s.status !== 'offline' ? s.flow.toLocaleString('vi-VN') + ' m³/h' : '-- m³/h'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NRW theo DMA progress bars area */}
          <div className={`border rounded-xl flex-1 flex flex-col shadow-2xl backdrop-blur-md transition-colors overflow-hidden ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className="p-3 pb-1 flex flex-col gap-1 shrink-0">
               <h3 className={`text-[13px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>NRW theo DMA</h3>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar p-2 space-y-1">
              {GIS_DMA_ZONES.slice(0, 10).map((dma, i) => (
                <div key={i} onClick={() => zoomToDma(dma.id)} className={`px-2 py-2 rounded-lg transition-all group cursor-pointer relative overflow-hidden ${isDarkMode ? 'hover:bg-cyan-500/5' : 'hover:bg-blue-50'}`}>
                   <div className="flex justify-between items-center mb-1.5 relative z-10">
                     <span className={`text-[11px] font-medium transition-colors ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{dma.name}</span>
                     <span className={`text-[11px] font-bold ${dma.loss >= 18 ? 'text-[#ff1744]' : dma.loss >= 13 ? 'text-[#ffca28]' : 'text-[#00e676]'}`}>{dma.loss}%</span>
                   </div>
                   <div className={`h-1 w-full rounded-full overflow-hidden relative border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-slate-300'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${dma.loss >= 18 ? 'bg-[#ff1744]' : dma.loss >= 13 ? 'bg-[#ffca28]' : 'bg-[#00e676]'}`} 
                        style={{ width: `${Math.min(dma.loss * 4, 100)}%`, boxShadow: isDarkMode ? `0 0 10px ${dma.loss >= 18 ? '#ff174444' : dma.loss >= 13 ? '#ffca2844' : '#00e67644'}` : 'none' }} 
                      />
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sự cố đang mở area (thick left red border) */}
          <div className={`border rounded-xl flex-1 flex flex-col shadow-2xl backdrop-blur-md transition-colors overflow-hidden border-t-2 ${isDarkMode ? 'bg-[#0a1b2e]/85 border-white/10 border-t-red-500/20' : 'bg-white/90 border-slate-200 border-t-red-500/40'}`}>
             <div className={`p-3 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <h3 className={`text-[13px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Sự cố đang mở</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff1744] shadow-[0_0_8px_#ff1744]" />
                  <span className="text-[10px] font-bold text-red-500 uppercase">{GIS_INCIDENTS.length}</span>
                </div>
             </div>
             <div className="overflow-y-auto flex-1 custom-scrollbar p-2 space-y-2">
               {GIS_INCIDENTS.map((inc, i) => (
                 <div key={i} onClick={() => zoomToIncident(inc.lat, inc.lng, inc.id)}
                   className={`flex gap-0 border rounded-lg overflow-hidden cursor-pointer transition-all group ${isDarkMode ? 'bg-[#020a14] border-white/5 hover:bg-slate-800/40' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                 >
                   {/* Thick left red border */}
                   <div className="w-1.5 bg-[#ff1744] shrink-0 h-auto group-hover:w-2 transition-all shadow-[0_0_10px_#ff1744]" />
                   <div className="p-2.5 flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-0.5">
                       <span className="text-[12px] font-black text-rose-500 group-hover:text-red-400 transition-colors tracking-tight uppercase">{inc.id} — {inc.type}</span>
                       <span className="text-[9px] bg-red-500/10 px-1 rounded text-red-400 border border-red-500/20 font-bold">Mới</span>
                     </div>
                     <p className={`text-[11px] leading-tight line-clamp-1 ${isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900'}`}>{inc.location}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
