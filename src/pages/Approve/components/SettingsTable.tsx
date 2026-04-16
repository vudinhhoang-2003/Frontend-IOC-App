import React from 'react';
import type { ApprovalSetting } from '../types';

interface SettingsTableProps {
  settings: ApprovalSetting[];
}

const SettingsTable: React.FC<SettingsTableProps> = ({ settings }) => {
  return (
    <div className="card" style={{ background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="card-header" style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="card-title" style={{ fontWeight: 600, color: 'var(--text)' }}>Cấu hình quy trình phê duyệt</span>
        <button style={{ padding: '7px 15px', background: 'rgba(0,200,255,.1)', border: '1px solid rgba(0,200,255,.3)', borderRadius: '7px', color: 'var(--cyan)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          Lưu thay đổi
        </button>
      </div>
      <div className="table-wrap" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Tên tác vụ</th>
              <th style={{ padding: '12px 16px' }}>Bắt buộc duyệt?</th>
              <th style={{ padding: '12px 16px' }}>Cấp phê duyệt</th>
              <th style={{ padding: '12px 16px' }}>Số người duyệt</th>
              <th style={{ padding: '12px 16px' }}>Thông báo</th>
              <th style={{ padding: '12px 16px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.desc}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', width: '34px', height: '18px', background: s.needApproval ? 'var(--cyan)' : 'var(--border)', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '.2s' }}>
                    <div style={{ position: 'absolute', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', left: s.needApproval ? '17px' : '3px', top: '2px', transition: '.2s' }} />
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select className="form-control" defaultValue={s.approver} style={{ width: '140px', fontSize: '12px', padding: '5px 8px', background: 'rgba(0,0,0,.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}>
                    <option value="Giám đốc">Giám đốc</option>
                    <option value="PGĐ">Phó Giám đốc</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="Admin">Hệ thống (Tự động)</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                   <input type="number" defaultValue={s.minApprovers} style={{ width: '45px', fontSize: '12px', padding: '5px 8px', background: 'rgba(0,0,0,.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none', textAlign: 'center' }} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <input type="checkbox" defaultChecked={s.notify} style={{ cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '5px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsTable;
