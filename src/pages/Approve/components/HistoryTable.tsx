import React from 'react';
import type { ApprovalHistory, ApprovalType } from '../types';

interface HistoryTableProps {
  history: ApprovalHistory[];
}

const TYPE_ICONS: Record<string, string> = {
  kpi_import: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  data_export: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  scada_ctrl: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  role_change: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  user_mgmt: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  return (
    <div className="card" style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="card-title" style={{ fontWeight: 600, color: 'var(--text)' }}>Lịch sử phê duyệt</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select className="form-control" style={{ fontSize: '12px', padding: '4px 9px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}>
            <option value="">Tất cả loại</option>
            <option value="kpi_import">Import KPI</option>
            <option value="data_export">Export Dữ liệu</option>
            <option value="scada_ctrl">SCADA</option>
            <option value="role_change">Phân quyền</option>
          </select>
        </div>
      </div>
      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Mã yêu cầu</th>
              <th style={{ padding: '12px 16px' }}>Tác vụ</th>
              <th style={{ padding: '12px 16px' }}>Người gửi</th>
              <th style={{ padding: '12px 16px' }}>Người duyệt</th>
              <th style={{ padding: '12px 16px' }}>Thời gian duyệt</th>
              <th style={{ padding: '12px 16px' }}>Ghi chú</th>
              <th style={{ padding: '12px 16px' }}>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => {
              const ic = TYPE_ICONS[h.type] || '';
              return (
                <tr key={h.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 16px' }}><code style={{ fontSize: '11px', color: 'var(--muted)' }}>{h.id}</code></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '26px', height: '26px', background: 'rgba(0,200,255,.08)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" dangerouslySetInnerHTML={{ __html: ic }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{h.title}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text)' }}>{h.submitter}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--cyan)' }}>{h.approver}</td>
                  <td className="mono" style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--muted)' }}>{h.approvedAt}</td>
                  <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--muted)', maxWidth: '180px' }}>{h.note || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {h.status === 'approved' ? (
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: 'rgba(0,230,118,0.1)', color: 'var(--green)', border: '1px solid rgba(0,230,118,0.2)' }}>Đã duyệt</span>
                    ) : (
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: 'rgba(255,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(255,68,68,0.2)' }}>Từ chối</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
