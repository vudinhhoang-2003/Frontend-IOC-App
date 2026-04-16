import React from 'react';
import type { ScadaStation, Device } from '../types';

interface ControlConfirmModalProps {
  step: 'confirm' | 'loading' | 'success';
  station: ScadaStation;
  device: Device;
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
  onFinish: () => void;
}

export const ControlConfirmModal: React.FC<ControlConfirmModalProps> = ({
  step, station, device, action, onConfirm, onCancel, onFinish
}) => {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center'
    } as any}>
      <div className="modal-box" style={{
        background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px',
        width: '520px', maxWidth: '90vw', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.9)'
      }}>
        
        {/* VIEW: CONFIRM OTP */}
        {step === 'confirm' && (
          <>
            <div className="modal-header" style={{ padding: '24px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>Xác nhận điều khiển</span>
              <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '40px 30px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,191,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#00bfff' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Xác nhận lệnh {action}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
                Bạn có chắc chắn muốn thực hiện lệnh <strong>{action.toUpperCase()}</strong> cho <br/><strong>{device.name}</strong> tại <strong>{station.name}</strong>?
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'none', marginBottom: '16px' }}>Mã xác thực 2 bước (Giả lập)</div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ width: '44px', height: '54px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,191,255,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'white' }}>•</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: '24px 30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px' }}>
              <button className="btn btn-ghost-dark" style={{ flex: 1, padding: '12px', borderRadius: '12px' }} onClick={onCancel}>Hủy</button>
              <button className="btn btn-cyan-glow" style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 600 }} onClick={onConfirm}>Xác nhận thực hiện</button>
            </div>
          </>
        )}

        {/* VIEW: LOADING */}
        {step === 'loading' && (
          <div className="modal-body" style={{ padding: '80px 30px', textAlign: 'center' }}>
            <div className="spinner" style={{ 
              width: '50px', height: '50px', border: '4px solid rgba(0,191,255,0.1)', borderTopColor: '#00bfff', 
              borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' 
            }}></div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>Đang gửi lệnh...</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>Hệ thống đang mã hóa bản tin điều khiển trạm {station.id}</div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {step === 'success' && (
          <div className="modal-body" style={{ padding: '50px 30px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,240,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#00f080' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>Lệnh đã thực thi!</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
              Thiết bị <strong>{device.name}</strong> đã được <strong>{action.toLowerCase()}</strong> thành công.
            </div>
            <button className="btn btn-cyan-glow" style={{ minWidth: '130px', padding: '10px 30px', borderRadius: '10px' }} onClick={onFinish}>Xong</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
