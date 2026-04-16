import React, { useState, useMemo } from 'react';
import type { ScadaStation, CommandLog } from '../types';

interface ScadaLogsViewProps {
  logs: CommandLog[];
  stations: ScadaStation[];
  onBack: () => void;
}

export const ScadaLogsView: React.FC<ScadaLogsViewProps> = ({ logs, stations, onBack }) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  const filtered = useMemo(() => {
    return [...logs].reverse().filter(l => {
      const stationName = stations.find(s => s.id === l.station)?.name || '';
      const q = query.toLowerCase();
      return (
        l.device.toLowerCase().includes(q) ||
        l.station.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.time.includes(q) ||
        stationName.toLowerCase().includes(q)
      );
    });
  }, [logs, stations, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, filtered.length);

  return (
    <div className="view-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '100px' }}>
      {/* HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn btn-ghost" style={{ padding: '8px', minWidth: '40px', borderRadius: '50%' }} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div className="page-title">
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Nhật ký điều khiển toàn hệ thống</h1>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0 0' }}>Lịch sử thao tác thiết bị SCADA trên toàn mạng lưới</p>
          </div>
        </div>
        <button className="btn btn-outline" style={{ borderRadius: '30px', padding: '8px 20px' }}>Xuất báo cáo</button>
      </div>

      {/* CONTENT AREA */}
      <div className="card" style={{ margin: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
        {/* Search Bar */}
        <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '8px 16px 8px 36px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '30px', color: 'white', fontSize: '13px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#0d1b2a', zIndex: 2 }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Thời gian</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Trạm</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Thiết bị</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Lệnh</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Kết quả</th>
                <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Người thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Không tìm thấy nhật ký</td></tr>
              ) : paginated.map(l => {
                const sName = stations.find(st => st.id === l.station)?.name || 'Unknown';
                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(0,200,255,0.03)' }}>
                    <td className="mono" style={{ padding: '12px 24px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{l.time}</td>
                    <td style={{ padding: '12px' }}><div style={{ fontWeight: 600, fontSize: '13px' }}>{sName}</div><div style={{ fontSize: '10px', color: 'var(--muted)' }}>{l.station}</div></td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{l.device}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${l.action === 'Bật' || l.action === 'Mở' ? 'badge-green' : 'badge-red'}`} style={{ 
                        padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600,
                        background: l.action === 'Bật' || l.action === 'Mở' ? 'rgba(0,240,128,0.1)' : 'rgba(255,71,87,0.1)',
                        color: l.action === 'Bật' || l.action === 'Mở' ? '#00f080' : '#ff4757'
                      }}>{l.action}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontWeight: 600, color: l.status === 'success' ? 'var(--green)' : 'var(--red)', fontSize: '11px' }}>{l.status === 'success' ? 'Thành công' : 'Thất bại'}</span>
                    </td>
                    <td style={{ padding: '12px 24px', fontSize: '12px' }}>{l.user}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}><strong>{startIdx}-{endIdx}</strong> / <strong>{filtered.length}</strong> nhật ký</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-ghost-dark btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '6px 16px' }}>Trang trước</button>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{page} / {totalPages}</div>
            <button className="btn btn-ghost-dark btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: '6px 16px', marginRight: '40px' }}>Trang sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};
