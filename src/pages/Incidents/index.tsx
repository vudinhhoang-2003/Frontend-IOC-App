import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { MOCK_INCIDENTS, MOCK_WORK_ORDERS } from './mockIncidentData';
import type {
  Incident, WorkOrder, IncidentTab, IncidentViewMode,
  IncidentStatus, Severity, Priority
} from './types';

/*
 * IncidentPage - 1:1 migration from prototype/js/pages/incidents.js
 * Uses ONLY CSS classes from main.css (now added to index.css):
 *   .page-header, .page-title, .page-actions
 *   .kpi-grid, .kpi-card, .kpi-label, .kpi-value, .kpi-sub
 *   .tabs, .tab-btn
 *   .card, .table-wrap, table/thead/tbody/th/td
 *   .badge, .badge-red, .badge-yellow, .badge-green, .badge-blue, .badge-gray
 *   .btn, .btn-primary, .btn-ghost, .btn-outline, .btn-sm
 *   .pagination-bar, .pagination-btns
 *   .modal-overlay, .modal-box, .modal-header, .modal-title, .modal-close, .modal-body, .modal-footer
 *   .kanban-board, .kanban-col, .kanban-col-header, .kanban-cards, .kanban-card
 *   .mono, .text-cyan
 */

// ── Badge helpers (matching data.js severityBadge/statusBadge) ──

function statusBadge(s: string) {
  const m: Record<string, string> = {
    new: 'badge-blue', processing: 'badge-blue', done: 'badge-green',
  };
  const l: Record<string, string> = {
    new: 'Mới', processing: 'Đang xử lý', done: 'Hoàn thành',
  };
  return <span className={`badge ${m[s] || 'badge-gray'}`}>{l[s] || s}</span>;
}

function severityBadge(s: Severity) {
  const m: Record<string, string> = { critical: 'badge-red', warning: 'badge-yellow', info: 'badge-blue' };
  const dotColor: Record<string, string> = { critical: 'var(--red)', warning: 'var(--yellow)', info: 'var(--cyan)' };
  const l: Record<string, string> = { critical: 'Nghiêm trọng', warning: 'Cảnh báo', info: 'Thông tin' };
  return (
    <span className={`badge ${m[s] || 'badge-gray'}`}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: dotColor[s], verticalAlign: 'middle' }}></span>
      {' '}{l[s] || s}
    </span>
  );
}

function priorityBadge(p: Priority) {
  const cfg: Record<string, [string, string]> = { high: ['badge-red', 'Cao'], medium: ['badge-yellow', 'Trung bình'], low: ['badge-blue', 'Thấp'] };
  const [c, l] = cfg[p] || ['badge-gray', p];
  return <span className={`badge ${c}`}>{l}</span>;
}

// ── Pagination (matching renderPagination in incidents.js) ──

const Pagination: React.FC<{
  total: number; current: number; pageSize: number;
  onPageChange: (p: number) => void;
}> = ({ total, current, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const start = (current - 1) * pageSize;
  return (
    <div className="pagination-bar" style={{ marginTop: 10, padding: 16, borderTop: '1px solid var(--border)' }}>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
        Hiển thị {start + 1}–{Math.min(start + pageSize, total)} / {total} mục
      </div>
      <div className="pagination-btns">
        <button className="btn btn-ghost btn-sm" disabled={current === 1} onClick={() => onPageChange(current - 1)}>Trước</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            className="btn btn-sm"
            onClick={() => onPageChange(p)}
            style={{
              minWidth: 32,
              border: `1px solid ${p === current ? 'var(--cyan)' : 'var(--border)'}`,
              background: p === current ? 'rgba(0,200,255,.15)' : 'transparent',
              color: p === current ? 'var(--cyan)' : 'var(--muted)',
            }}
          >{p}</button>
        ))}
        <button className="btn btn-ghost btn-sm" disabled={current === totalPages} onClick={() => onPageChange(current + 1)}>Sau</button>
      </div>
    </div>
  );
};

// ── Main Page Component ──

const IncidentPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [workOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [incidentTab, setIncidentTab] = useState<IncidentTab>('incidents');
  const [incidentsViewMode, setIncidentsViewMode] = useState<IncidentViewMode>('table');
  const [incidentPage, setIncidentPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const pageSize = 10;
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedTask, setSelectedTask] = useState<WorkOrder | null>(null);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

  // ── KPI calculations (1:1 with incidents.js) ──
  const stats = useMemo(() => {
    const doneIncidents = incidents.filter(i => i.status === 'done' && i.resolvedAt);
    let avgHours = "0.0";
    if (doneIncidents.length > 0) {
      const totalDiff = doneIncidents.reduce((acc, i) => {
        const start = new Date(i.report.replace(' ', 'T')).getTime();
        const end = new Date(i.resolvedAt!.replace(' ', 'T')).getTime();
        return acc + (end - start);
      }, 0);
      avgHours = (totalDiff / doneIncidents.length / 1000 / 3600).toFixed(1);
    }
    const typeCounts = incidents.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    const commonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    return {
      total: incidents.length,
      new: incidents.filter(i => i.status === 'new').length,
      processing: incidents.filter(i => i.status === 'processing').length,
      done: incidents.filter(i => i.status === 'done').length,
      avgHours, commonType
    };
  }, [incidents]);

  // ── Drag & Drop ──
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    setIncidents(prev => prev.map(i => i.id === id ? {
      ...i, status: newStatus as IncidentStatus,
      resolvedAt: newStatus === 'done' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : i.resolvedAt
    } : i));
  };

  const currentIncidents = incidents.slice((incidentPage - 1) * pageSize, incidentPage * pageSize);
  const currentTasks = workOrders.slice((taskPage - 1) * pageSize, taskPage * pageSize);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── PAGE HEADER (line 29-52 of incidents.js) ── */}
      <div className="page-header">
        <div className="page-title"><h1>Sự cố &amp; Lệnh Công tác</h1><p>Quản lý và theo dõi tiến độ xử lý sự cố</p></div>
        <div className="page-actions">
          {incidentTab === 'incidents' && (
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
              <button onClick={() => setIncidentsViewMode('table')} style={{
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', transition: 'all .2s',
                background: incidentsViewMode === 'table' ? 'var(--cyan)' : 'transparent',
                color: incidentsViewMode === 'table' ? 'var(--bg-base)' : 'var(--muted)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /></svg> Bảng
              </button>
              <button onClick={() => setIncidentsViewMode('kanban')} style={{
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', transition: 'all .2s',
                background: incidentsViewMode === 'kanban' ? 'var(--cyan)' : 'transparent',
                color: incidentsViewMode === 'kanban' ? 'var(--bg-base)' : 'var(--muted)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="18" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg> Kanban
              </button>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => incidentTab === 'incidents' ? setShowNewIncident(true) : setShowNewTask(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            {incidentTab === 'incidents' ? 'Tạo sự cố mới' : 'Tạo lệnh mới'}
          </button>
        </div>
      </div>

      {/* ── KPI GRID (line 55-62 of incidents.js) ── */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <div className="kpi-card" style={{ '--accent-color': 'var(--cyan)' } as React.CSSProperties}><div className="kpi-label">Tổng sự cố</div><div className="kpi-value">{stats.total}</div><div className="kpi-sub">Sự vụ</div></div>
        <div className="kpi-card" style={{ '--accent-color': 'var(--blue)' } as React.CSSProperties}><div className="kpi-label">Mới</div><div className="kpi-value">{stats.new}</div><div className="kpi-sub">Chờ phân công</div></div>
        <div className="kpi-card" style={{ '--accent-color': 'var(--yellow)' } as React.CSSProperties}><div className="kpi-label">Đang xử lý</div><div className="kpi-value">{stats.processing}</div><div className="kpi-sub">Đang xử lý</div></div>
        <div className="kpi-card" style={{ '--accent-color': 'var(--green)' } as React.CSSProperties}><div className="kpi-label">Hoàn thành</div><div className="kpi-value">{stats.done}</div><div className="kpi-sub">Đã đóng</div></div>
        <div className="kpi-card" style={{ '--accent-color': 'var(--purple)' } as React.CSSProperties}><div className="kpi-label">Thời gian xử lý TB</div><div className="kpi-value">{stats.avgHours}<span style={{ fontSize: 16, color: 'var(--muted)' }}>h</span></div><div className="kpi-sub">Mỗi sự vụ</div></div>
        <div className="kpi-card" style={{ '--accent-color': 'var(--cyan)' } as React.CSSProperties}><div className="kpi-label">Loại phổ biến</div><div className="kpi-value" style={{ fontSize: 18, paddingTop: 10 }}>{stats.commonType}</div><div className="kpi-sub">Nhiều nhất</div></div>
      </div>

      {/* ── TABS (line 64-71 of incidents.js) ── */}
      <div className="tabs">
        <button className={`tab-btn ${incidentTab === 'incidents' ? 'active' : ''}`} onClick={() => setIncidentTab('incidents')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 6 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          Danh sách Sự cố
        </button>
        <button className={`tab-btn ${incidentTab === 'tasks' ? 'active' : ''}`} onClick={() => setIncidentTab('tasks')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 6 }}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
          Lệnh công tác (Tasks)
        </button>
      </div>

      {/* ── VIEW CONTAINER (line 73-75 of incidents.js) ── */}
      <div id="incidentViewContainer" style={{ marginTop: 20 }}>

        {/* ── INCIDENT TABLE VIEW (renderIncidentTable, line 96-129) ── */}
        {incidentTab === 'incidents' && incidentsViewMode === 'table' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Mã SC</th><th>Loại sự cố</th><th>Địa điểm</th>
                  <th>Mức độ</th><th>Trạng thái</th><th>Báo cáo lúc</th>
                  <th>Đội phụ trách</th><th>Thao tác</th>
                </tr></thead>
                <tbody>
                  {currentIncidents.map(i => (
                    <tr key={i.id} data-id={i.id} data-status={i.status} data-severity={i.severity}>
                      <td className="mono text-cyan">{i.id}</td>
                      <td style={{ fontWeight: 500 }}>{i.type}</td>
                      <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{i.location}</td>
                      <td>{severityBadge(i.severity)}</td>
                      <td>{statusBadge(i.status)}</td>
                      <td className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{i.report}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {i.assignedTo || <span style={{ color: 'var(--red)' }}>Chưa phân công</span>}
                      </td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedIncident(i)}>Xem</button>
                        {i.status !== 'done' && <button className="btn btn-outline btn-sm" onClick={() => setSelectedIncident(i)}>Cập nhật</button>}
                      </td>
                    </tr>
                  ))}
                  {currentIncidents.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Không có dữ liệu phù hợp</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={incidents.length} current={incidentPage} pageSize={pageSize} onPageChange={setIncidentPage} />
          </div>
        )}

        {/* ── INCIDENT KANBAN VIEW (renderIncidentKanban, line 202-227) ── */}
        {incidentTab === 'incidents' && incidentsViewMode === 'kanban' && (
          <div className="kanban-board">
            {[
              { id: 'new', label: 'Mới', color: 'var(--blue)', bg: 'rgba(0,102,255,.08)', border: 'rgba(0,102,255,.25)' },
              { id: 'processing', label: 'Đang xử lý', color: 'var(--yellow)', bg: 'rgba(255,202,40,.08)', border: 'rgba(255,202,40,.25)' },
              { id: 'done', label: 'Hoàn thành', color: 'var(--green)', bg: 'rgba(0,230,118,.08)', border: 'rgba(0,230,118,.25)' },
            ].map(col => {
              const cards = incidents.filter(i => i.status === col.id);
              return (
                <div key={col.id} className="kanban-col" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, col.id)}
                  style={{ borderColor: col.border, background: col.bg }}>
                  <div className="kanban-col-header" style={{ borderBottomColor: col.color }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: col.color }}>{col.label}</span>
                    <span style={{ background: col.color, color: 'var(--bg-base)', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{cards.length}</span>
                  </div>
                  <div className="kanban-cards">
                    {cards.map(i => {
                      const sevColor = i.severity === 'critical' ? 'var(--red)' : 'var(--yellow)';
                      return (
                        <div key={i.id} className="kanban-card" draggable onDragStart={e => e.dataTransfer.setData('id', i.id)}
                          style={{ borderLeftColor: sevColor }} onClick={() => setSelectedIncident(i)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <span style={{ fontFamily: "'Roboto Mono',monospace", fontSize: 11, color: 'var(--cyan)', fontWeight: 700 }}>{i.id}</span>
                            {severityBadge(i.severity)}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{i.type}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.4 }}>{i.location}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{i.report.split(' ')[0]}</span>
                            {i.assignedTo
                              ? <span style={{ fontSize: 10, background: 'rgba(0,200,255,.1)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: 4 }}>{i.assignedTo.substring(0, 15)}</span>
                              : <span style={{ fontSize: 10, color: 'var(--red)' }}>Chưa phân công</span>}
                          </div>
                        </div>
                      );
                    })}
                    {cards.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: 12 }}>Không có sự cố</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TASK TABLE VIEW (renderTaskTable, line 131-172) ── */}
        {incidentTab === 'tasks' && (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Mã Lệnh</th><th>Nội dung công việc</th><th>Loại</th>
                  <th>Ưu tiên</th><th>Trạng thái</th><th>Hạn chót</th>
                  <th>Người phụ trách</th><th>Thao tác</th>
                </tr></thead>
                <tbody>
                  {currentTasks.map(t => (
                    <tr key={t.id}>
                      <td className="mono text-cyan">{t.id}</td>
                      <td style={{ fontWeight: 600 }}>{t.title}</td>
                      <td><span className="badge badge-gray">{t.category}</span></td>
                      <td>{priorityBadge(t.priority)}</td>
                      <td>{statusBadge(t.status)}</td>
                      <td className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{t.deadline}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.assignedTo}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => setSelectedTask(t)}>Xem</button></td>
                    </tr>
                  ))}
                  {currentTasks.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Không có dữ liệu phù hợp</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={workOrders.length} current={taskPage} pageSize={pageSize} onPageChange={setTaskPage} />
          </div>
        )}
      </div>

      {/* ── INCIDENT DETAIL MODAL (viewIncident, line 390-415) ── */}
      {selectedIncident && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedIncident.id} — {selectedIncident.type}</span>
              <button className="modal-close" onClick={() => setSelectedIncident(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              {[
                ['Địa điểm', selectedIncident.location],
                ['Mức độ', severityBadge(selectedIncident.severity)],
                ['Trạng thái', statusBadge(selectedIncident.status)],
                ['Thời gian báo cáo', selectedIncident.report],
                ['Đội phụ trách', selectedIncident.assignedTo || 'Chưa phân công'],
                ['Ghi chú', selectedIncident.note]
              ].map(([k, v], idx) => (
                <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                  <span style={{ minWidth: 160, color: 'var(--muted)', fontSize: 13 }}>{k}</span>
                  <span style={{ fontSize: 13 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Timeline xử lý</div>
                {[
                  { t: 'Tiếp nhận sự cố', ts: selectedIncident.report, c: 'cyan' },
                  { t: selectedIncident.assignedTo ? `Phân công: ${selectedIncident.assignedTo}` : 'Chưa phân công đội', ts: selectedIncident.assignedTo ? selectedIncident.report : '—', c: selectedIncident.assignedTo ? 'blue' : 'gray' },
                  { t: selectedIncident.status === 'done' ? 'Hoàn thành xử lý' : 'Đang xử lý...', ts: selectedIncident.resolvedAt || '—', c: selectedIncident.status === 'done' ? 'green' : 'yellow' }
                ].map((x, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${x.c})`, marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px var(--${x.c})` }}></div>
                    <div><div style={{ fontSize: 13 }}>{x.t}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>{x.ts}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedIncident(null)}>Đóng</button>
              {selectedIncident.status !== 'done' && (
                <button className="btn btn-primary" onClick={() => {
                  setIncidents(prev => prev.map(i => i.id === selectedIncident.id ? { ...i, status: 'done', resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : i));
                  setSelectedIncident(null);
                }}>Đánh dấu hoàn thành</button>
              )}
            </div>
          </div>
        </div>,
        document.body)}

      {/* ── TASK DETAIL MODAL (viewWorkOrder, line 423-460) ── */}
      {selectedTask && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{selectedTask.id} — {selectedTask.title}</span>
              <button className="modal-close" onClick={() => setSelectedTask(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {[
                ['Loại công việc', selectedTask.category],
                ['Mức độ ưu tiên', priorityBadge(selectedTask.priority)],
                ['Trạng thái', statusBadge(selectedTask.status)],
                ['Hạn chót', selectedTask.deadline],
                ['Người phụ trách', selectedTask.assignedTo]
              ].map(([k, v], idx) => (
                <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                  <span style={{ minWidth: 160, color: 'var(--muted)', fontSize: 13 }}>{k}</span>
                  <span style={{ fontSize: 13 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Ghi chú / Mô tả:</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, background: 'var(--bg-hover)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  {selectedTask.note || 'Không có ghi chú thêm.'}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Tiến độ thực hiện</div>
                {selectedTask.timeline.map((x, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', marginTop: 5, flexShrink: 0, boxShadow: '0 0 6px var(--cyan)' }}></div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{x.event}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{x.time} — Thực hiện bởi: <span style={{ color: 'var(--cyan)' }}>{x.user}</span></div>
                    </div>
                  </div>
                ))}
                {selectedTask.status !== 'done' && (
                  <div style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--muted)', marginTop: 5, flexShrink: 0 }}></div>
                    <div><div style={{ fontSize: 13, color: 'var(--muted)' }}>Chờ hoàn thành...</div></div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedTask(null)}>Đóng</button>
              {selectedTask.status !== 'done' && (
                <button className="btn btn-primary" onClick={() => {
                  setSelectedTask(null);
                }}>Đánh dấu hoàn thành</button>
              )}
            </div>
          </div>
        </div>,
        document.body)}

      {/* ── NEW INCIDENT MODAL (openNewIncident, line 302-333) ── */}
      {showNewIncident && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowNewIncident(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Tạo sự cố mới</span>
              <button className="modal-close" onClick={() => setShowNewIncident(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Loại sự cố</label>
                  <select className="form-control">
                    <option>Vỡ ống</option><option>Tụt áp</option><option>Máy bơm sự cố</option><option>Chất lượng nước</option><option>Mất điện</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mức độ</label>
                  <select className="form-control">
                    <option value="critical">Nghiêm trọng</option><option value="warning">Cảnh báo</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Địa điểm</label>
                <input className="form-control" placeholder="Nhập địa điểm xảy ra sự cố..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phân công đội</label>
                  <select className="form-control">
                    <option>Đội 1 – TP. Hạ Long</option><option>Đội 2 – TP. Hạ Long</option><option>Đội 3 – TP. Cẩm Phả</option><option>Đội 4 – TP. Uông Bí</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nhà máy liên quan</label>
                  <select className="form-control">
                    <option>NM Diễn Vọng</option><option>NM Đồng Ho</option><option>NM Hoàng Quế</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows={3} placeholder="Mô tả chi tiết sự cố..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNewIncident(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={() => setShowNewIncident(false)}>Tạo sự cố</button>
            </div>
          </div>
        </div>,
        document.body)}

      {/* ── NEW TASK MODAL (openNewTask, line 335-377) ── */}
      {showNewTask && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowNewTask(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Tạo Lệnh công tác mới</span>
              <button className="modal-close" onClick={() => setShowNewTask(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tên lệnh công tác</label>
                  <input className="form-control" placeholder="Nhập tiêu đề lệnh CT..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Loại công việc</label>
                  <select className="form-control">
                    <option>Sửa chữa</option><option>Kiểm tra</option><option>Bảo trì</option><option>Khẩn cấp</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mức độ ưu tiên</label>
                  <select className="form-control">
                    <option value="high">Cao</option><option value="medium">Trung bình</option><option value="low">Thấp</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hạn chót</label>
                  <input type="date" className="form-control" defaultValue={new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Địa điểm</label>
                <input className="form-control" placeholder="Địa điểm thực hiện CT..." />
              </div>
              <div className="form-group">
                <label className="form-label">Phân công</label>
                <select className="form-control">
                  <option>Đội 1 – TP. Hạ Long</option><option>Đội 2 – TP. Hạ Long</option><option>Đội 3 – TP. Cẩm Phả</option><option>Đội 4 – TP. Uông Bí</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows={3} placeholder="Mô tả chi tiết công việc..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNewTask(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={() => setShowNewTask(false)}>Tạo lệnh công tác</button>
            </div>
          </div>
        </div>,
        document.body)}
    </div>
  );
};

export default IncidentPage;
