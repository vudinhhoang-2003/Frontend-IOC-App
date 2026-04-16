import React, { useState, useRef, useEffect } from 'react';

interface OtpModalProps {
  title: string;
  requestId: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ title, requestId, onClose, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input
    if (inputs.current[0]) inputs.current[0].focus();
  }, []);

  const handleChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(x => x)) {
      onVerify(otp.join(''));
    }
  };

  return (
    <div className="modal" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-overlay, rgba(0,0,0,.7))', backdropFilter: 'blur(8px)' }}>
      <div className="modal-box" style={{ background: 'var(--bg-elevated)', borderRadius: '24px', width: '420px', padding: '40px 30px', textAlign: 'center', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>

        {/* Icon */}
        <div style={{ width: '70px', height: '70px', background: 'rgba(0,200,255,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="11" r="3" /><path d="M7 11h10" /></svg>
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', margin: '0 0 10px 0' }}>Xác thực bảo mật</h3>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', margin: '0 0 30px 0' }}>
          Vui lòng nhập mã OTP được gửi tới ứng dụng <b>Google Authenticator</b> của bạn để phê duyệt yêu cầu <b style={{ color: 'var(--text)' }}>{requestId}</b>
        </p>

        {/* OTP Inputs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{ width: '48px', height: '56px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '10px', textAlign: 'center', fontSize: '24px', fontWeight: 800, color: 'var(--cyan)', outline: 'none', transition: '.2s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          ))}
        </div>

        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '30px' }}>
          Bạn chưa nhận được mã? <span style={{ color: 'var(--cyan)', fontWeight: 600, cursor: 'pointer' }}>Gửi lại mã (59s)</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '14px', background: 'var(--bg-hover)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--muted)', cursor: 'pointer' }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onVerify(otp.join(''))}
            disabled={otp.some(x => !x)}
            style={{ flex: 1, padding: '14px', background: otp.every(x => x) ? 'linear-gradient(135deg,var(--cyan),#0088ff)' : 'var(--bg-hover)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: otp.every(x => x) ? 'var(--bg-base)' : 'var(--muted)', cursor: otp.every(x => x) ? 'pointer' : 'default', transition: '.3s', boxShadow: otp.every(x => x) ? '0 8px 25px rgba(0,200,255,.3)' : 'none' }}
          >
            Xác nhận
          </button>
        </div>

        <div style={{ marginTop: '24px', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          Mã hóa đầu cuối AES-256
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
