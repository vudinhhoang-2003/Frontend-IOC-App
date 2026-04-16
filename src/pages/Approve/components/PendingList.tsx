import React from 'react';
import type { ApprovalRequest, ApprovalType, UrgencyLevel } from '../types';

interface PendingListProps {
  pendingRequests: ApprovalRequest[];
  onViewDetail: (request: ApprovalRequest) => void;
  onQuickApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const TYPE_LABELS: Record<ApprovalType, string> = {
  kpi_import: 'Import KPI',
  data_export: 'Export Dữ liệu',
  scada_ctrl: 'Điều khiển SCADA',
  role_change: 'Phân quyền',
  user_mgmt: 'Quản lý TK',
  api_key: 'Quản lý API Key',
  report_sign: 'Ký báo cáo',
  alert_ack: 'Xử lý Alert',
};

const TYPE_COLORS: Record<ApprovalType, string> = {
  kpi_import: '#0066ff',
  data_export: '#ff6d00',
  scada_ctrl: '#ff4444',
  role_change: '#9c27b0',
  user_mgmt: '#00c8ff',
  api_key: '#7b21e0',
  report_sign: '#00d2ff',
  alert_ack: '#f44336',
};

const URG_COLORS: Record<UrgencyLevel, string> = {
  high: 'var(--red)',
  med: 'var(--yellow)',
  low: 'var(--muted)',
};

const URG_LABELS: Record<UrgencyLevel, string> = {
  high: 'Ưu tiên cao',
  med: 'Bình thường',
  low: 'Thấp',
};

const PendingList: React.FC<PendingListProps> = ({ pendingRequests, onViewDetail, onQuickApprove, onReject }) => {
  if (!pendingRequests.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" style={{ marginBottom: '14px' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green)' }}>Không có yêu cầu nào đang chờ</div>
      </div>
    );
  }

  return (
    <>
      {pendingRequests.map((a) => {
        const tc = TYPE_COLORS[a.type] || 'var(--cyan)';
        const tl = TYPE_LABELS[a.type] || a.type;
        const uc = URG_COLORS[a.urgency];
        const ul = URG_LABELS[a.urgency];

        return (
          <div key={a.id} className="card" style={{ marginBottom: '16px', borderLeft: `3px solid ${tc}`, background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', borderLeftWidth: '3px', borderLeftColor: tc }}>
            <div className="card-header" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <div style={{ padding: '4px 9px', background: `${tc}22`, border: `1px solid ${tc}44`, borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: tc, whiteSpace: 'nowrap' }}>
                  {tl}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{a.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', background: `${uc}22`, color: uc, border: `1px solid ${uc}44` }}>{ul}</span>
                <code style={{ fontSize: '10px', color: 'var(--muted)' }}>{a.id}</code>
              </div>
            </div>

            <div className="card-body" style={{ padding: '16px', paddingTop: 0 }}>
              {/* Submitter info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border)', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#0050cc,#00c8ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{a.submitterAvatar}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{a.submitter}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{a.submitterRole} · Gửi lúc {a.submittedAt}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '10px', padding: '3px 8px', background: 'rgba(0,200,255,.08)', border: '1px solid rgba(0,200,255,.2)', borderRadius: '5px', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Người thực hiện đã xác thực OTP
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left: note + files */}
                <div>
                  {a.note && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Ghi chú người gửi</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.7', padding: '10px 13px', background: 'rgba(0,0,0,.15)', borderRadius: '8px', borderLeft: `2px solid ${tc}` }}>{a.note}</div>
                    </div>
                  )}
                  {a.files.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '6px' }}>File đính kèm</div>
                      {a.files.map((f, i) => {
                        const ext = f.split('.').pop()?.toUpperCase() || 'FILE';
                        const fc = { XLSX: '#00e676', XLS: '#00e676', PDF: '#ff6d00', PNG: '#ff4081', JPG: '#ff4081' }[ext as any] || 'var(--cyan)';
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'rgba(0,0,0,.15)', borderRadius: '7px', marginBottom: '5px', cursor: 'pointer' }}>
                            <span style={{ fontSize: '8px', fontWeight: 800, color: fc, background: `${fc}18`, padding: '2px 5px', borderRadius: '4px' }}>{ext}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{f}</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: data preview */}
                <div>
                  {a.data.length > 0 ? (
                    <>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Dữ liệu trích xuất bởi AI</div>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                        {a.data.map((d, di) => (
                          <div key={di} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderTop: di ? '1px solid var(--border)' : 'none' }}>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{d.kpi}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{d.val}</span>
                              <span style={{ fontSize: '10px', color: d.conf >= 90 ? 'var(--green)' : d.conf >= 75 ? 'var(--yellow)' : 'var(--red)' }}>AI {d.conf}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px', background: 'rgba(0,0,0,.1)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                      Không có dữ liệu xem trước cho tác vụ này
                    </div>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => onViewDetail(a)}
                  style={{ padding: '9px 18px', background: 'rgba(0,102,255,.1)', border: '1px solid rgba(0,102,255,.3)', borderRadius: '9px', color: '#60a5fa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Xem chi tiết &amp; Phê duyệt
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onReject(a.id)}
                    style={{ padding: '8px 16px', background: 'rgba(255,68,68,.1)', border: '1px solid rgba(255,68,68,.3)', borderRadius: '9px', color: 'var(--red)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Từ chối
                  </button>
                  <button 
                    onClick={() => onQuickApprove(a.id)}
                    style={{ padding: '8px 18px', background: 'linear-gradient(135deg,var(--green),#00a854)', color: '#071629', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,230,118,.25)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Phê duyệt nhanh
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PendingList;
