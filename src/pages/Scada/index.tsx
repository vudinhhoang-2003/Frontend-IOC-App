import React, { useState, useEffect } from 'react';
import type { ScadaStation, CommandLog, Device, DeviceType, DeviceStatus } from './types';
import scadaService from '../../services/scadaService';
import type { ApiStationDetail, ApiScadaReading, ApiScadaCommand } from '../../services/scadaService';
import { StationCard } from './components/StationCard';
import { StationDetailModal } from './components/StationDetailModal';
import { ControlConfirmModal } from './components/ControlConfirmModal';
import { StatusBadge } from './components/StatusBadge';
import { ScadaStationsView } from './components/ScadaStationsView';
import { ScadaLogsView } from './components/ScadaLogsView';

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapApiStationToLocal(apiStation: ApiStationDetail): ScadaStation {
  return {
    id: apiStation.id,
    name: apiStation.name,
    factory: (apiStation as any).factory_name ?? apiStation.factory_id?.toString() ?? '',
    type: apiStation.station_type === 'pump' ? 'pump' : 'pressure',
    pressure: 0,
    flow: 0,
    level: 0,
    power: 0,
    pressureUnit: 'bar',
    status: ((apiStation as any).status as ScadaStation['status']) ?? (apiStation.is_active ? 'online' : 'offline'),
    lat: apiStation.lat ?? 0,
    lng: apiStation.lng ?? 0,
    devices: (apiStation.devices ?? []).map(d => ({
      id: d.id,
      name: d.name,
      type: d.device_type as DeviceType,
      status: d.status as DeviceStatus,
    })),
  };
}

function applyReadingToStation(station: ScadaStation, reading: ApiScadaReading): ScadaStation {
  return {
    ...station,
    pressure: reading.pressure_bar ?? station.pressure,
    flow: reading.flow_m3h ?? station.flow,
    level: reading.level_pct ?? station.level,
    power: reading.power_kw ?? station.power,
  };
}

function mapApiCommandToLog(cmd: ApiScadaCommand): CommandLog {
  return {
    id: cmd.id,
    time: cmd.time,
    station: cmd.station_id,
    device: cmd.device_id,
    action: cmd.action,
    user: (cmd as any).issued_by_name ?? cmd.issued_by,
    status: cmd.status === 'success' ? 'success' : 'fail',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const ScadaPage: React.FC = () => {
  const [stations, setStations] = useState<ScadaStation[]>([]);
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<'dashboard' | 'stations' | 'logs'>('dashboard');
  const [selectedStation, setSelectedStation] = useState<ScadaStation | null>(null);
  const [isControlTabInModal, setIsControlTabInModal] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString('vi-VN'));

  const [controlStep, setControlStep] = useState<'idle' | 'confirm' | 'loading' | 'success'>('idle');
  const [controlTarget, setControlTarget] = useState<{ station: ScadaStation, device: Device, action: string } | null>(null);
  const [controlError, setControlError] = useState<string | null>(null);

  // ── Fetch stations on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiStations = await scadaService.getStations();
        // Fetch detail (with devices) for each station in parallel
        const detailResults = await Promise.allSettled(
          apiStations.map(s => scadaService.getStationDetail(s.id))
        );
        const mapped: ScadaStation[] = detailResults
          .map((result, idx) => {
            if (result.status === 'fulfilled') {
              return mapApiStationToLocal(result.value);
            }
            // Fallback: use base station data without devices
            return {
              id: apiStations[idx].id,
              name: apiStations[idx].name,
              factory: apiStations[idx].factory_id?.toString() ?? '',
              type: (apiStations[idx].station_type === 'pump' ? 'pump' : 'pressure') as 'pump' | 'pressure',
              pressure: 0,
              flow: 0,
              level: 0,
              power: 0,
              pressureUnit: 'bar',
              status: apiStations[idx].is_active ? 'online' : 'offline',
              lat: apiStations[idx].lat ?? 0,
              lng: apiStations[idx].lng ?? 0,
              devices: [],
            } as ScadaStation;
          });
        setStations(mapped);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách trạm';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  // ── Auto-refresh: fetch latest readings every 5 seconds ─────────────────────
  useEffect(() => {
    const timer = setInterval(async () => {
      setStations(prev => {
        // Trigger async updates but return prev synchronously to avoid stale closure issues
        prev.forEach(async (station) => {
          if (station.status === 'offline') return;
          try {
            const reading = await scadaService.getLatestReading(station.id);
            if (reading) {
              setStations(current =>
                current.map(s => s.id === station.id ? applyReadingToStation(s, reading) : s)
              );
            }
          } catch {
            // Silent fail — keep existing values
          }
        });
        return prev;
      });
      setRefreshTime(new Date().toLocaleTimeString('vi-VN'));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ── Fetch logs when logs view is opened ──────────────────────────────────────
  useEffect(() => {
    if (currentView === 'logs') {
      scadaService.getCommands({}).then(cmds => {
        setLogs(cmds.map(mapApiCommandToLog));
      }).catch(() => {
        // Silent fail — keep existing logs
      });
    }
  }, [currentView]);

  const handleControlRequest = (station: ScadaStation, device: Device, action: string) => {
    setControlTarget({ station, device, action });
    setControlError(null);
    setControlStep('confirm');
  };

  const executeControl = async () => {
    if (!controlTarget) return;
    setControlStep('loading');
    setControlError(null);

    const { station, device, action } = controlTarget;

    try {
      // TODO: Get real TOTP code from user input
      const result = await scadaService.sendCommand({
        station_id: station.id,
        device_id: device.id,
        action: action,
        totp_code: '000000', // placeholder — ControlConfirmModal does not yet have real TOTP input
      });

      // Update device status locally based on action
      const newState = action === 'Bật' ? 'running' : action === 'Dừng' ? 'standby' : action === 'Mở' ? 'open' : 'closed';
      setStations(prev => prev.map(s => {
        if (s.id !== station.id) return s;
        return { ...s, devices: s.devices.map(d => d.id === device.id ? { ...d, status: newState } : d) };
      }));

      // Append new command log
      const newLog = mapApiCommandToLog(result);
      setLogs(prev => [newLog, ...prev]);

      // Refresh full command log for this station
      scadaService.getCommands({ station_id: station.id }).then(cmds => {
        setLogs(cmds.map(mapApiCommandToLog));
      }).catch(() => {
        // Silent fail — keep the optimistic log entry
      });

      setControlStep('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lệnh điều khiển thất bại';
      setControlError(message);
      setControlStep('idle');
    }
  };

  const renderDashboard = () => (
    <div className="scada-page-container" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      {/* HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="page-title">
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Giám sát SCADA</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '2px 0 0' }}>Dữ liệu thời gian thực từ các trạm đo</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'rgba(0,200,255,.06)', border: '1px solid rgba(0,200,255,.15)', borderRadius: '30px' }}>
            <div className="pulse-dot green"></div>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>LIVE</span>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--cyan)' }}>{refreshTime}</span>
          </div>
          <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => window.location.reload()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg> Làm mới
          </button>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '14px' }}>Đang tải dữ liệu trạm...</div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div style={{
          padding: '16px 20px',
          marginBottom: '24px',
          background: 'rgba(255,71,87,0.1)',
          border: '1px solid rgba(255,71,87,0.3)',
          borderRadius: '8px',
          color: '#ff4757',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* STATION GRID */}
      {!isLoading && (
        <div className="station-grid">
          {stations.map(s => (
            <StationCard
              key={s.id}
              station={s}
              onClick={() => { setSelectedStation(s); setIsControlTabInModal(false); }}
            />
          ))}
        </div>
      )}

      {/* DATA TABLES SECTION */}
      {!isLoading && (
        <div className="grid-2">
          <div className="card" style={{ padding: 0 }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <span className="card-title" style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                Dữ liệu chi tiết
              </span>
              <button className="btn btn-detail" onClick={() => setCurrentView('stations')}>Xem tất cả</button>
            </div>
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Trạm</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Áp lực</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Lưu lượng</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Trạng thái</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.slice(0, 5).map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(0,200,255,0.05)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{s.id}</div>
                      </td>
                      <td className="mono" style={{ padding: '12px 14px' }}>
                        {s.status !== 'offline' ? (
                          <span style={{ color: s.pressure < 2 ? 'var(--red)' : s.pressure < 2.5 ? 'var(--yellow)' : 'var(--green)' }}>{s.pressure}</span>
                        ) : '—'}
                      </td>
                      <td className="mono" style={{ padding: '12px 14px' }}>{s.status !== 'offline' ? s.flow : '—'}</td>
                      <td style={{ padding: '12px 14px' }}><StatusBadge status={s.status} /></td>
                      <td style={{ padding: '12px 14px' }}>
                        <button className="btn btn-detail" onClick={() => setSelectedStation(s)}>Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <span className="card-title" style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                Nhật ký điều khiển mới nhất
              </span>
              <button className="btn btn-detail" onClick={() => setCurrentView('logs')}>Xem tất cả</button>
            </div>
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Thời gian</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Thiết bị</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Lệnh</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Người thực hiện</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 5).map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(0,200,255,0.05)' }}>
                      <td className="mono" style={{ padding: '12px 14px', fontSize: '11px' }}>{log.time}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text)' }}>{log.device}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{stations.find(st => st.id === log.station)?.name}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${log.action === 'Bật' || log.action === 'Mở' ? 'badge-green' : 'badge-red'}`} style={{
                          padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                          background: log.action === 'Bật' || log.action === 'Mở' ? 'rgba(0,240,128,0.1)' : 'rgba(255,71,87,0.1)',
                          color: log.action === 'Bật' || log.action === 'Mở' ? '#00f080' : '#ff4757'
                        }}>{log.action}</span>
                        <div style={{ fontSize: '10px', color: log.status === 'success' ? 'var(--green)' : 'var(--red)', marginTop: '4px' }}>{log.status === 'success' ? 'Thành công' : 'Thất bại'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px' }}>{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .station-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 1200px) { .grid-2 { grid-template-columns: 1fr; } }
        .mono { font-family: 'Roboto Mono', monospace; font-size: 12px; }
        .pulse-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 8px; }
        .pulse-dot.green { background: #00f080; box-shadow: 0 0 8px #00f080; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        
        .btn-cyan-glow {
          background: #00bfff !important; color: white !important; border: none !important;
          box-shadow: 0 0 15px rgba(0, 191, 255, 0.4) !important;
          border-radius: 30px !important;
        }
        .btn-cyan-glow:hover { transform: translateY(-1px); box-shadow: 0 0 20px rgba(0, 191, 255, 0.6) !important; }
        
        .btn-white {
          background: white !important; color: black !important; border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          border-radius: 30px !important;
        }
        .btn-white:hover { background: #f8f9fa !important; }

        .btn-detail, .btn-ghost-dark {
          background: var(--bg-hover) !important; color: var(--cyan) !important;
          border: 1px solid var(--border) !important;
          border-radius: 30px !important; padding: 5px 16px !important; font-size: 12px !important;
          transition: 0.2s;
        }
        .btn-detail:hover, .btn-ghost-dark:hover { 
          color: white !important; border-color: var(--cyan) !important; background: var(--cyan) !important; 
        }

        .btn-outline {
          background: transparent !important; color: var(--text) !important;
          border: 1px solid var(--border) !important;
          border-radius: 30px !important;
          transition: 0.2s;
        }
        .btn-outline:hover { background: var(--bg-hover) !important; border-color: var(--cyan) !important; }
      `}</style>

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'stations' && (
        <ScadaStationsView
          stations={stations}
          onBack={() => setCurrentView('dashboard')}
          onOpenStation={(s) => { setSelectedStation(s); setIsControlTabInModal(false); }}
        />
      )}
      {currentView === 'logs' && (
        <ScadaLogsView
          logs={logs}
          stations={stations}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          isControlTab={isControlTabInModal}
          setIsControlTab={setIsControlTabInModal}
          onControl={handleControlRequest}
          refreshTime={refreshTime}
        />
      )}

      {controlStep !== 'idle' && controlTarget && (
        <ControlConfirmModal
          step={controlStep as any}
          station={controlTarget.station}
          device={controlTarget.device}
          action={controlTarget.action}
          onConfirm={executeControl}
          onCancel={() => { setControlStep('idle'); setControlTarget(null); setControlError(null); }}
          onFinish={() => { setControlStep('idle'); setControlTarget(null); setSelectedStation(null); setControlError(null); }}
        />
      )}

      {/* Control error toast */}
      {controlError && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          background: 'rgba(255,71,87,0.15)',
          border: '1px solid rgba(255,71,87,0.4)',
          borderRadius: '8px',
          color: '#ff4757',
          fontSize: '13px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '360px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {controlError}
          <button
            onClick={() => setControlError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', padding: '0 4px' }}
          >✕</button>
        </div>
      )}
    </div>
  );
};

export default ScadaPage;
