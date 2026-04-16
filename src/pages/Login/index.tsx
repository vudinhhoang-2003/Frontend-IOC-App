import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import authService, { extractApiError } from '../../services/authService';
import type { LoginResponse } from '../../services/authService';
import {
  Lock, User, Eye, EyeOff,
  Mail, MessageSquare, Smartphone,
  RefreshCcw, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/quawaco_logo.png';
import LoginBackground from './LoginBackground';

type LoginStep = 'CREDENTIALS' | 'MFA_METHODS' | 'OTP';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  // ─── Step & Form State ────────────────────────────────────────────────────
  const [step, setStep] = useState<LoginStep>('CREDENTIALS');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─── MFA State ────────────────────────────────────────────────────────────
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'sms' | 'email' | 'zalo'>('totp');
  /** Danh sách phương thức MFA mà BE trả về */
  const [availableMfaMethods, setAvailableMfaMethods] = useState<('totp' | 'sms' | 'email' | 'zalo')[]>([]);
  /** Token tạm (mfa_token) nhận từ BE sau bước login thành công */
  const [mfaToken, setMfaToken] = useState('');
  /** Lưu full LoginResponse để dùng khi next_step = 'success' (không cần 2FA) */
  const [loginResp, setLoginResp] = useState<LoginResponse | null>(null);

  // ─── OTP State ────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(295);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Error State ──────────────────────────────────────────────────────────
  const [errorMsg, setErrorMsg] = useState('');

  // ─── Clock ────────────────────────────────────────────────────────────────
  const [time, setTime] = useState('');
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('vi-VN')), 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── OTP Countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (step === 'OTP' && countdown > 0) {
      const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── STEP 1: Đăng nhập bằng username / password ───────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }
    setIsLoading(true);
    try {
      const resp = await authService.login({ username: username.trim(), password });
      setLoginResp(resp);

      if (resp.next_step === 'success') {
        // Không cần 2FA – đăng nhập thẳng
        loginSuccess(resp.access_token, resp.refresh_token, resp.user);
        navigate('/dashboard', { replace: true });
      } else {
        // Cần xác thực 2FA
        setMfaToken(resp.mfa_token || '');
        const methods = resp.mfa_methods || ['totp'];
        setAvailableMfaMethods(methods);
        // Ưu tiên chọn TOTP nếu có, còn không chọn phương thức đầu tiên
        setMfaMethod(methods.includes('totp') ? 'totp' : methods[0]);
        setStep('MFA_METHODS');
      }
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── STEP 2: Chuyển sang màn OTP sau khi chọn phương thức ────────────────
  const handleProceedToOtp = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      // Với SMS/Email/Zalo: gọi API gửi OTP
      if (mfaMethod !== 'totp') {
        await authService.sendOtp({ mfa_token: mfaToken, method: mfaMethod });
      }
      setOtp(['', '', '', '', '', '']);
      setCountdown(295);
      setShowResendSuccess(false);
      setStep('OTP');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── STEP 3: Xác thực OTP ─────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const resp = await authService.verify2FA({ mfa_token: mfaToken, method: mfaMethod, code });
      loginSuccess(resp.access_token, resp.refresh_token, resp.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(extractApiError(err));
      // Xóa OTP để nhập lại
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Gửi lại OTP ─────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (mfaMethod === 'totp') return; // TOTP không cần gửi lại
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authService.sendOtp({ mfa_token: mfaToken, method: mfaMethod });
      setCountdown(295);
      setOtp(['', '', '', '', '', '']);
      setShowResendSuccess(true);
      setTimeout(() => setShowResendSuccess(false), 3000);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setErrorMsg(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── OTP Input Handler ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
    const val = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
    // Tự submit khi điền đủ
    if (index === 5 && val) {
      const code = [...otp.slice(0, 5), val].join('');
      if (code.length === 6) setTimeout(handleVerifyOtp, 300);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ─── MFA Method Info ──────────────────────────────────────────────────────
  const getMfaDetails = () => {
    switch (mfaMethod) {
      case 'totp':  return { label: 'Mã từ Authenticator App', desc: 'Google / Microsoft Authenticator' };
      case 'sms':   return { label: 'Mã OTP gửi qua SMS', desc: 'Số điện thoại đã đăng ký' };
      case 'email': return { label: 'Mã OTP gửi qua Email', desc: 'Email công ty đã khai báo' };
      case 'zalo':  return { label: 'Mã OTP gửi qua Zalo ZNS', desc: 'Tài khoản Zalo đã đăng ký' };
    }
  };

  // ─── Shared Styles ────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: 'rgba(7, 22, 41, .88)',
    border: '1px solid rgba(0, 200, 255, .18)',
    borderRadius: '20px',
    padding: '36px 38px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 0 40px rgba(0, 200, 255, .07), 0 25px 60px rgba(0, 0, 0, .6)',
  };

  const inputClass =
    'w-full bg-[#00c8ff]/5 border border-[#00c8ff]/14 rounded-[9px] py-[13px] pl-[42px] pr-[14px] outline-none focus:border-[#00c8ff] focus:ring-[3px] focus:ring-[#00c8ff]/10 transition-all text-white placeholder:text-[#233044]';

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#020b16]">
      <LoginBackground />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.03) 0%, transparent 70%)' }} />
      <div className="login-grid" />

      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div className="animate-in fade-in zoom-in-95 duration-500 relative" style={cardStyle}>

          {/* ── Logo Header ── */}
          <div className="flex items-center justify-center gap-[14px] mb-[6px]">
            <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #0050cc, #00c8ff)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', boxShadow: '0 0 22px rgba(0, 200, 255, .4)' }}>
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold tracking-[3px] leading-none" style={{ fontSize: '24px', background: 'linear-gradient(90deg, #e3f2fd, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                QUAWACO
              </h1>
              <div className="font-mono tracking-[4px] uppercase mt-[4px]" style={{ fontSize: '10px', color: '#00c8ff' }}>IOC CENTER</div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00c8ff]/35 to-transparent my-[16px] mb-[22px]" />

          {/* ── Error Banner ── */}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-[10px] px-4 py-3 mb-5 animate-in fade-in duration-200">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <span className="text-red-300 text-[13px] leading-snug">{errorMsg}</span>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 1 – CREDENTIALS
          ════════════════════════════════════════════════════════════════ */}
          {step === 'CREDENTIALS' && (
            <>
              <div className="subtitle mb-[28px] text-center">
                <p style={{ fontSize: '13px', color: '#648da1', lineHeight: '1.6' }}>
                  Trung tâm Điều hành Thông minh<br />
                  Công ty Nước Quảng Ninh
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-[18px]">
                {/* Username */}
                <div className="space-y-[8px]">
                  <label className="font-bold uppercase block ml-[2px]" style={{ fontSize: '11px', color: '#00c8ff', letterSpacing: '1px' }}>TÀI KHOẢN</label>
                  <div className="relative group">
                    <User className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#648da1] group-focus-within:text-[#00c8ff] transition-colors" size={17} />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={inputClass}
                      style={{ fontSize: '14px' }}
                      placeholder="Nhập tài khoản"
                      autoComplete="username"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-[8px]">
                  <label className="font-bold uppercase block ml-[2px]" style={{ fontSize: '11px', color: '#00c8ff', letterSpacing: '1px' }}>MẬT KHẨU</label>
                  <div className="relative group">
                    <Lock className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#648da1] group-focus-within:text-[#00c8ff] transition-colors" size={17} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-[42px]`}
                      style={{ fontSize: '14px' }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-[13px] top-1/2 -translate-y-1/2 text-[#648da1] hover:text-[#00c8ff] transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-[26px]" style={{ fontSize: '13px' }}>
                  <label className="flex items-center gap-[7px] text-[#648da1] cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="accent-[#00c8ff]" defaultChecked /> Ghi nhớ đăng nhập
                  </label>
                  <button type="button" className="text-[#00c8ff] hover:underline" style={{ fontSize: '12px' }}>Quên mật khẩu?</button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-[14px] bg-gradient-to-r from-[#0050cc] to-[#00c8ff] text-white font-bold rounded-[9px] shadow-[0_4px_20px_rgba(0,102,255,0.28)] hover:shadow-[0_8px_28px_rgba(0,102,255,0.5)] transform hover:-translate-y-[2px] transition-all flex items-center justify-center gap-[8px] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{ fontSize: '13px', letterSpacing: '2px' }}
                >
                  {isLoading ? <RefreshCcw size={18} className="animate-spin" /> : 'ĐĂNG NHẬP'}
                </button>
              </form>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 2 – CHỌN PHƯƠNG THỨC MFA
          ════════════════════════════════════════════════════════════════ */}
          {step === 'MFA_METHODS' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-[64px] h-[64px] bg-[#00d2ff] rounded-[16px] flex items-center justify-center shadow-[0_0_25px_rgba(0,210,255,0.4)]">
                  <Lock className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-[20px] font-bold mb-[4px] text-white">Xác thực 2 lớp</h2>
              <p className="text-[13px] text-[#648da1] mb-[22px]">Chọn phương thức xác thực</p>

              {/* Danh sách method từ BE, hoặc fallback 4 option */}
              <div className="grid grid-cols-2 gap-[12px] mb-[22px]">
                {(
                  availableMfaMethods.length > 0
                    ? availableMfaMethods
                    : (['totp', 'sms', 'email', 'zalo'] as const)
                ).map((id) => {
                  const meta: Record<string, { name: string; desc: string; Icon: React.FC<{ size?: number; className?: string }> }> = {
                    totp:  { name: 'Authenticator App', desc: 'Google / Microsoft / Authy', Icon: Smartphone },
                    sms:   { name: 'SMS OTP', desc: 'Nhắn tin SĐT đăng ký', Icon: MessageSquare },
                    email: { name: 'Email OTP', desc: 'Gửi mã tới email công ty', Icon: Mail },
                    zalo:  { name: 'Zalo OTP', desc: 'Nhận mã qua Zalo ZNS', Icon: MessageSquare },
                  };
                  const { name, desc, Icon } = meta[id];
                  return (
                    <button
                      key={id}
                      onClick={() => setMfaMethod(id)}
                      className={`p-[18px] border transition-all text-center group ${mfaMethod === id ? 'border-[#00c8ff] bg-[#00c8ff]/10 ring-1 ring-[#00c8ff]/20' : 'border-[#00c8ff]/12 bg-white/5 hover:bg-white/10'}`}
                      style={{ borderRadius: '16px' }}
                    >
                      <Icon className={`mx-auto mb-[10px] transition-colors ${mfaMethod === id ? 'text-[#00c8ff]' : 'text-[#648da1] group-hover:text-[#00c8ff]'}`} size={24} />
                      <div className="text-[12px] font-bold leading-tight text-white mb-1">{name}</div>
                      <div className="text-[10px] text-[#648da1] opacity-70 leading-tight">{desc}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleProceedToOtp}
                disabled={isLoading}
                className="w-full py-[14px] bg-gradient-to-r from-[#0050cc] to-[#00c8ff] text-white font-bold rounded-[9px] shadow-glow uppercase tracking-wider mb-5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontSize: '13px' }}
              >
                {isLoading ? <RefreshCcw size={18} className="animate-spin" /> : 'TIẾP TỤC →'}
              </button>
              <button onClick={() => { setStep('CREDENTIALS'); setErrorMsg(''); }} className="mx-auto text-[#00d2ff] hover:underline flex items-center justify-center gap-[6px] text-[11px] font-medium">
                ← Quay lại đăng nhập
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 3 – NHẬP OTP
          ════════════════════════════════════════════════════════════════ */}
          {step === 'OTP' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-[64px] h-[64px] bg-[#00d2ff] rounded-[16px] flex items-center justify-center shadow-[0_0_25px_rgba(0,210,255,0.4)]">
                  <Lock className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-[20px] font-bold mb-[4px] text-white">Xác thực 2 lớp</h2>
              <p className="text-[13px] text-[#648da1] mb-[20px]">Nhập mã xác thực 6 chữ số</p>

              {/* Info / Resend success banner */}
              <div className={`border rounded-[12px] p-[14px] w-full text-left flex items-start gap-3 mb-[22px] transition-all duration-300 min-h-[68px] ${showResendSuccess ? 'bg-[#10b981]/10 border-[#10b981]/30' : 'bg-[#00c8ff]/5 border-[#00c8ff]/12'}`}>
                {showResendSuccess ? (
                  <div className="flex items-center gap-3 w-full animate-in zoom-in-95 fade-in duration-300">
                    <CheckCircle2 className="text-[#10b981]" size={20} />
                    <div>
                      <div className="font-bold text-[#10b981] text-[13px]">Gửi lại mã thành công!</div>
                      <div className="text-[#648da1] text-[11px] mt-0.5">Vui lòng kiểm tra lại thiết bị của bạn.</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-0.5"><MessageSquare size={16} className="text-[#10b981]" /></div>
                    <div>
                      <div className="font-bold text-[#10b981] text-[12px] leading-tight">{getMfaDetails()?.label}</div>
                      <div className="text-[#648da1] text-[11px] mt-1 opacity-70 leading-tight">{getMfaDetails()?.desc}</div>
                    </div>
                  </>
                )}
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-[10px] justify-center mb-[18px]">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-[42px] h-[58px] bg-[#051121] border border-[#00d2ff]/12 rounded-[10px] text-center text-xl text-white outline-none focus:border-[#00c8ff] focus:ring-1 focus:ring-[#00c8ff]/30 transition-all font-mono"
                  />
                ))}
              </div>

              <div className="text-[13px] text-[#648da1] mb-[22px]">
                Mã hết hạn sau <span className="font-bold text-[#f59e0b] font-mono">{formatCountdown(countdown)}</span>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join('').length < 6}
                className="w-full py-[14px] bg-gradient-to-r from-[#0050cc] to-[#00c8ff] text-white font-bold rounded-[9px] shadow-glow uppercase tracking-wider mb-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontSize: '13px' }}
              >
                {isLoading ? <RefreshCcw size={20} className="animate-spin" /> : 'XÁC THỰC & ĐĂNG NHẬP'}
              </button>

              {/* Gửi lại – chỉ hiện với SMS/Email/Zalo */}
              {mfaMethod !== 'totp' && (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading || countdown > 240}
                  className="w-full py-[12px] border border-[#00c8ff]/20 rounded-[9px] text-[#648da1] text-[12px] font-medium hover:bg-white/5 transition-colors mb-6 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : `Gửi lại mã OTP${countdown > 240 ? ` (${formatCountdown(countdown - 240)})` : ''}`}
                </button>
              )}

              <button onClick={() => { setStep('MFA_METHODS'); setErrorMsg(''); }} className="mx-auto text-[#00d2ff] hover:underline flex items-center justify-center gap-[6px] text-[11px] font-medium mb-1">
                ← Chọn phương thức khác
              </button>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center gap-[8px] justify-center mt-[22px] text-[11px] font-mono text-[#648da1]/40">
            <div className="w-[6px] h-[6px] rounded-full bg-[#10b981]/80 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>KẾT NỐI BẢO MẬT TLS 1.3</span>
            <span className="mx-[4px] opacity-30">|</span>
            <span className="text-[#00c8ff] font-bold">{time}</span>
          </div>
          <div className="flex justify-between mt-[22px] pt-[20px] border-t border-white/5 text-[9px] text-[#648da1]/40 font-bold uppercase tracking-[2.5px]">
            <span>QUAWACO IOC V1.0.0</span>
            <span>© 2026 QUAWACO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
