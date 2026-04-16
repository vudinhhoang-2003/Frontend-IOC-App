import React from 'react';
import type { ApprovalRequest } from '../types';

interface ApprovalDetailModalProps {
  request: ApprovalRequest;
  currentIndex: number;
  totalPending: number;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const TYPE_COLORS: Record<string, string> = {
  kpi_import: '#0066ff',
  data_export: '#ff6d00',
  scada_ctrl: '#ff4444',
  role_change: '#9c27b0',
};

const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ 
  request: a, 
  currentIndex, 
  totalPending, 
  onClose, 
  onApprove, 
  onReject, 
  onNavigate 
}) => {
  const tc = TYPE_COLORS[a.type] || 'var(--cyan)';

  return (
    <div className="modal" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-box" style={{ background: 'var(--bg-elevated)', borderRadius: '14px', width: '90%', maxWidth: '1100px', height: '90%', maxHeight: '800px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.5)', border: '1px solid var(--border)' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '5px 10px', background: `${tc}18`, border: `1px solid ${tc}33`, borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: tc }}>{a.id}</div>
            <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '16px' }}>Chi tiết yêu cầu phê duyệt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button disabled={currentIndex === 0} onClick={() => onNavigate('prev')} style={{ background: 'none', border: 'none', color: currentIndex === 0 ? 'rgba(255,255,255,.1)' : 'var(--muted)', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span>Yêu cầu <b>{currentIndex + 1}</b> / {totalPending}</span>
              <button disabled={currentIndex === totalPending - 1} onClick={() => onNavigate('next')} style={{ background: 'none', border: 'none', color: currentIndex === totalPending - 1 ? 'rgba(255,255,255,.1)' : 'var(--muted)', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '5px' }} onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Title & Desc */}
            <div style={{ background: 'rgba(0,0,0,.15)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: tc, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Nội dung yều cầu</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: '0 0 10px 0', lineHeight: '1.4' }}>{a.title}</h2>
              <div style={{ display: 'flex', gap: '15px', color: 'var(--muted)', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Gửi lúc: {a.submittedAt}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Người gửi: {a.submitter} ({a.submitterRole})
                </span>
              </div>
              <div style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-e)' }}>{a.desc}</div>
            </div>

            {/* AI Insights & Impact */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Phân tích & Trích xuất dữ liệu bởi AI
              </div>
              {a.data.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {a.data.map((d, i) => (
                    <div key={i} style={{ background: 'rgba(0,200,255,.03)', border: '1px solid rgba(0,200,255,.15)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)' }}>{d.kpi}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cyan)' }}>{d.val}</div>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: d.conf >= 90 ? 'var(--green)' : 'var(--yellow)', opacity: .8 }}>ĐỘ TIN CẬY {d.conf}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(0,0,0,.1)', borderRadius: '12px', border: '1px dashed var(--border)', color: 'var(--muted)', fontSize: '13px' }}>
                  Chưa có dữ liệu trích xuất tự động cho loại tác vụ này
                </div>
              )}
            </div>

            {/* Note */}
            {a.note && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Ghi chú đính kèm</div>
                <div style={{ padding: '16px', background: 'rgba(255,109,0,.04)', borderLeft: '3px solid #ff6d00', borderRadius: '4px 10px 10px 4px', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-e)' }}>
                  {a.note}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Status Card */}
            <div style={{ background: 'rgba(0,0,0,.15)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '15px' }}>Thông tin phê duyệt</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Cấp độ ưu tiên:</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', background: a.urgency === 'high' ? 'rgba(255,68,68,.15)' : 'rgba(255,255,255,.05)', color: a.urgency === 'high' ? 'var(--red)' : 'var(--muted)' }}>
                    {a.urgency === 'high' ? 'KHẨN CẤP' : 'BÌNH THƯỜNG'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Quy trình duyệt:</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>1 cấp (Giám đốc)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Xác thực bảo mật:</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Yêu cầu OTP k-tra
                  </span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Tài liệu đính kèm ({a.files.length})</div>
              {a.files.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {a.files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,.03)', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                      <div style={{ background: 'rgba(0,200,255,.1)', padding: '5px', borderRadius: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{f}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)' }}>1.4 MB · XLSX</div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)', background: 'rgba(0,0,0,.08)', borderRadius: '10px', border: '1px dashed var(--border)' }}>
                  Không có file đính kèm
                </div>
              )}
            </div>

            {/* Warning */}
            <div style={{ marginTop: 'auto', background: 'rgba(255,68,68,.06)', border: '1px solid rgba(255,68,68,.15)', borderRadius: '12px', padding: '15px' }}>
               <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                 <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', lineHeight: '1.5' }}>
                   <b style={{ color: 'var(--red)' }}>Lưu ý bảo mật:</b> Việc phê duyệt tác vụ này có thể thay đổi dữ liệu báo cáo tài chính của toàn công ty. Vui lòng kiểm tra kỹ trước khi xác nhận.
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,.02)' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Đóng lại
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onReject(a.id)}
              style={{ padding: '10px 24px', background: 'rgba(255,68,68,.1)', border: '1px solid rgba(255,68,68,.3)', borderRadius: '9px', color: 'var(--red)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Từ chối yêu cầu
            </button>
            <button 
              onClick={() => onApprove(a.id)}
              style={{ padding: '10px 32px', background: 'linear-gradient(135deg,var(--green),#00a854)', border: 'none', borderRadius: '9px', color: '#071629', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(0,230,118,.25)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Xác nhận Phê duyệt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetailModal;
