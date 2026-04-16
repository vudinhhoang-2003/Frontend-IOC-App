import React, { useState } from 'react';
import { PENDING_APPROVALS, APPROVAL_HISTORY, APPROVAL_SETTINGS } from './mockData';
import type { ApprovalRequest, ApprovalHistory } from './types';

// Components
import SummaryCards from './components/SummaryCards';
import PendingList from './components/PendingList';
import HistoryTable from './components/HistoryTable';
import SettingsTable from './components/SettingsTable';
import ApprovalDetailModal from './components/ApprovalDetailModal';
import OtpModal from './components/OtpModal';

type TabType = 'pending' | 'history' | 'settings';

const Approve: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequest[]>(PENDING_APPROVALS);
  const [history, setHistory] = useState<ApprovalHistory[]>(APPROVAL_HISTORY);

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState('');
  const [rejectNote, setRejectNote] = useState('');

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuickApprove = (id: string) => {
    const req = pendingRequests.find(r => r.id === id);
    if (req) {
      setSelectedRequest(req);
      setShowOtpModal(true);
    }
  };

  const handleApproveFromDetail = (id: string) => {
    // In original, detail view might lead to OTP directly
    setShowOtpModal(true);
  };

  const handleRejectPrompt = (id: string) => {
    setRejectId(id);
    setRejectNote('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectNote.trim()) {
      showToast('⚠ Vui lòng nhập lý do từ chối!');
      return;
    }

    const req = pendingRequests.find(r => r.id === rejectId);
    if (req) {
      const newHistoryItem: ApprovalHistory = {
        id: req.id,
        type: req.type,
        title: req.title,
        submitter: req.submitter,
        approver: 'Trần Phúc Hà (GĐ)', // Prototype style
        approvedAt: new Date().toLocaleString(),
        status: 'rejected',
        note: rejectNote,
      };

      setHistory([newHistoryItem, ...history]);
      setPendingRequests(pendingRequests.filter(r => r.id !== rejectId));
      showToast('✕ Đã từ chối yêu cầu. Người gửi sẽ nhận thông báo.');
      setShowRejectModal(false);
      setSelectedRequest(null);
    }
  };

  const handleVerifyOtp = (code: string) => {
    if (selectedRequest && code === '123456') {
      const newHistoryItem: ApprovalHistory = {
        id: selectedRequest.id,
        type: selectedRequest.type,
        title: selectedRequest.title,
        submitter: selectedRequest.submitter,
        approver: 'Trần Phúc Hà (GĐ)', // Original style
        approvedAt: new Date().toLocaleString(),
        status: 'approved',
        note: 'Đã phê duyệt thành công! Tác vụ đang được thực thi...',
      };

      setHistory([newHistoryItem, ...history]);
      setPendingRequests(pendingRequests.filter(r => r.id !== selectedRequest.id));
      showToast('✓ Đã phê duyệt thành công! Tác vụ đang được thực thi...');
      setShowOtpModal(false);
      setSelectedRequest(null);
    }
  };

  const handleNavigateRequest = (direction: 'next' | 'prev') => {
    const currentIndex = pendingRequests.findIndex(r => r.id === selectedRequest?.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < pendingRequests.length) {
      setSelectedRequest(pendingRequests[nextIndex]);
    }
  };

  return (
    <div className="approve-page-container" style={{ padding: '0px' }}>
      {/* ── Page Header (Clone from renderDieuhanhPage) ── */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div className="page-title">
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 5px 0', color: 'var(--text)' }}>Điều hành & Phê duyệt</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>Quản lý và phê duyệt các tác vụ quan trọng của hệ thống — dành riêng cho Lãnh đạo & Quản lý</p>
        </div>
        <div className="page-actions" style={{ display: 'flex' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Chỉ hiển thị với Lãnh đạo & Admin
          </span>
        </div>
      </div>

      {/* ── Summary Cards (Clone from renderDieuhanhPage) ── */}
      <SummaryCards pendingRequests={pendingRequests} history={history} />

      {/* ── Tabs (Clone from renderDieuhanhPage) ── */}
      <div className="tabs" style={{ display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'pending' ? 'rgba(0,200,255,0.1)' : 'transparent',
            color: activeTab === 'pending' ? 'var(--cyan)' : 'var(--muted)',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '2px solid var(--cyan)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Chờ phê duyệt <span style={{ background: 'var(--red)', color: 'var(--text)', fontSize: '9px', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontWeight: 700 }}>{pendingRequests.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'history' ? 'rgba(0,200,255,0.1)' : 'transparent',
            color: activeTab === 'history' ? 'var(--cyan)' : 'var(--muted)',
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--cyan)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
          Lịch sử phê duyệt
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            background: activeTab === 'settings' ? 'rgba(0,200,255,0.1)' : 'transparent',
            color: activeTab === 'settings' ? 'var(--cyan)' : 'var(--muted)',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid var(--cyan)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
          Cài đặt quy trình duyệt
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div id="dieuhanhContent">
        {activeTab === 'pending' && (
          <PendingList
            pendingRequests={pendingRequests}
            onViewDetail={(req) => setSelectedRequest(req)}
            onQuickApprove={handleQuickApprove}
            onReject={handleRejectPrompt}
          />
        )}
        {activeTab === 'history' && <HistoryTable history={history} />}
        {activeTab === 'settings' && <SettingsTable settings={APPROVAL_SETTINGS} />}
      </div>

      {/* ── Modals ── */}
      {selectedRequest && !showOtpModal && (
        <ApprovalDetailModal
          request={selectedRequest}
          totalPending={pendingRequests.length}
          currentIndex={pendingRequests.findIndex(r => r.id === selectedRequest.id)}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproveFromDetail}
          onReject={handleRejectPrompt}
          onNavigate={handleNavigateRequest}
        />
      )}

      {showOtpModal && selectedRequest && (
        <OtpModal
          title={selectedRequest.title}
          requestId={selectedRequest.id}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
        />
      )}

      {/* ── Reject Reason Modal (Original Style) ── */}
      {showRejectModal && (
        <div className="modal" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-box" style={{ background: 'var(--bg-elevated)', borderRadius: '12px', width: '500px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="modal-title" style={{ fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> From chối yêu cầu {rejectId}
              </span>
              <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setShowRejectModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '14px', fontSize: '13px', color: 'var(--muted)' }}>
                Bạn đang từ chối yêu cầu <b style={{ color: 'var(--text)' }}>{pendingRequests.find(r => r.id === rejectId)?.title}</b>.<br />
                Người gửi sẽ được thông báo lý do từ chối.
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Lý do từ chối <span style={{ color: 'var(--red)' }}>*</span></label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Nêu rõ lý do từ chối để người gửi có thể chỉnh sửa và gửi lại..."
                  style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', color: 'var(--text)', outline: 'none' }}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-ghost" onClick={() => setShowRejectModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>Hủy</button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmReject}
                style={{ padding: '8px 16px', background: 'var(--red)', border: 'none', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Xác nhận Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px 20px', borderRadius: '8px', zIndex: 10000, boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div dangerouslySetInnerHTML={{ __html: toast }} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }} />
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', marginLeft: '10px', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
};

export default Approve;
