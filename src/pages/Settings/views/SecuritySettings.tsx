import React from 'react';
import { ShieldCheck, Key, ShieldAlert } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* 2FA Section */}
      <div className="card">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="flex items-center gap-2 font-semibold text-[color:var(--cyan)]">
            <ShieldCheck size={14} /> Bảo mật 2 lớp (2FA)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[color:var(--muted)]">Bắt buộc với Admin</span>
            <span className="badge badge-green font-bold text-[10px]">Đang bật</span>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-[color:var(--cyan)]/10 border border-[color:var(--cyan)]/20 rounded-lg p-3.5 mb-4 text-[13px] text-[color:var(--text)]">
            Xác thực 2 lớp bảo vệ tài khoản ngay cả khi mật khẩu bị lộ. Hệ thống hỗ trợ <strong>4 phương thức 2FA</strong>.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'totp', name: 'Authenticator App (TOTP)', desc: 'Google/Microsoft/Authy — Mã 6 chữ số mỗi 30 giây. Không cần internet.', badge: 'Khuyến nghị', bc: 'text-[color:var(--green)] bg-[color:var(--green)]/10 border-[color:var(--green)]/20', on: true },
              { id: 'sms', name: 'SMS OTP', desc: 'Gửi OTP tới SĐT đăng ký. Phụ thuộc mạng di động.', badge: 'Phổ biến', bc: 'text-[color:var(--blue)] bg-[color:var(--blue)]/10 border-[color:var(--blue)]/20', on: true },
              { id: 'email', name: 'Email OTP', desc: 'Gửi OTP tới email công ty. Hiệu lực 5 phút.', badge: 'Dự phòng', bc: 'text-[color:var(--yellow)] bg-[color:var(--yellow)]/10 border-[color:var(--yellow)]/20', on: true },
              { id: 'zalo', name: 'Zalo ZNS OTP', desc: 'Gửi qua Zalo Notification Service. Phù hợp thực tế Việt Nam.', badge: 'Mới', bc: 'text-[color:var(--cyan)] bg-[color:var(--cyan)]/10 border-[color:var(--cyan)]/20', on: false }
            ].map(m => (
              <div key={m.id} className={`p-4 rounded-xl border transition-colors peer ${m.on ? 'bg-[color:var(--cyan)]/5 border-[color:var(--cyan)]/20' : 'bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-[13px]">{m.name}</div>
                    <div className={`mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${m.bc}`}>{m.badge}</div>
                  </div>
                  <label className="relative inline-block w-9 h-5 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={m.on} />
                    <span className="absolute inset-0 rounded-full transition-colors bg-[color:var(--bg-surface)] peer-checked:bg-[color:var(--cyan)]">
                      <span className="absolute w-[14px] h-[14px] bg-white rounded-full top-[3px] left-[3px] transition-all peer-checked:left-[19px]" />
                    </span>
                  </label>
                </div>
                <p className="text-[12px] text-[color:var(--muted)] leading-relaxed mt-3">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Backup Codes & Password Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trusted Devices and Backup Codes */}
        <div className="card p-4 flex flex-col justify-between">
          <div>
            <div className="font-semibold flex items-center gap-2 mb-2 text-[14px]">
              <Key size={14} className="text-[color:var(--cyan)]" /> Mã khôi phục dự phòng
            </div>
            <p className="text-[12px] text-[color:var(--muted)] mb-3">Dùng khi mất thiết bị 2FA. Mỗi mã chỉ dùng 1 lần.</p>
            <div className="bg-[color:var(--bg-surface)] rounded-lg p-3 font-mono text-[12px] text-[color:var(--cyan)] mb-4 tracking-[0.2em] leading-relaxed break-words text-center border-dashed border border-[color:var(--border)]">
              8G4K-MXNQ  3JTW-PVHR<br/>7CDB-LFAE  2YZS-KNQX
            </div>
          </div>
          <button className="btn btn-ghost btn-sm w-full">Tạo bộ mã mới</button>
        </div>

        {/* Password Policy */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] font-semibold flex items-center gap-2 text-[14px]">
            <ShieldAlert size={14} className="text-[color:var(--yellow)]" /> Chính sách mật khẩu
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              ['Độ dài tối thiểu', '8 ký tự'],
              ['Thời hạn đổi mật khẩu', '90 ngày'],
              ['Bắt buộc có HOA, thường, số, KH', 'Đang bật'],
              ['Khóa IP sai 5 lần', 'Đang bật']
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-[color:var(--border)] last:border-0">
                <span className="text-[13px] text-[color:var(--muted)]">{k}</span>
                <span className="text-[13px] font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2FA Protected Actions (High Risk) */}
      <div className="card">
         <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--blue)]/10">
          <div className="flex items-center gap-2 font-bold text-[color:var(--blue)]">
            <ShieldCheck size={14} /> Tác vụ yêu cầu 2FA khắt khe
          </div>
        </div>
        <div className="overflow-x-auto text-left">
          <table className="w-full">
            <tbody>
              {[
                { name: 'Import dữ liệu KPI', desc: 'Nhập liệu chỉ số KPI kinh doanh vào hệ thống', roles: 'Admin, Lãnh đạo', risk: 'Cao', type: 'high' },
                { name: 'Xuất / Export dữ liệu lớn', desc: 'Export >1000 bản ghi, báo cáo toàn hệ thống', roles: 'Admin', risk: 'Cao', type: 'high' },
                { name: 'Điều khiển SCADA / Van bơm', desc: 'Mở/đóng van, bật/tắt máy bơm trực tiếp', roles: 'Admin, SCADA', risk: 'Rất Cao', type: 'critical' },
                { name: 'Thay đổi phân quyền Role', desc: 'Cập nhật quyền truy cập người dùng', roles: 'Admin', risk: 'Trung bình', type: 'med' },
              ].map((a, i) => (
                <tr key={i} className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface)]">
                  <td className="p-4">
                    <div className="font-semibold text-[13px] mb-1">{a.name}</div>
                    <div className="text-[12px] text-[color:var(--muted)]">{a.desc}</div>
                  </td>
                  <td className="p-4 text-[12px]">
                    Áp dụng cho: <strong>{a.roles}</strong>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${a.type === 'critical' ? 'badge-red' : a.type === 'high' ? 'badge-yellow' : 'badge-blue'} text-[10px]`}>
                      Rủi ro {a.risk}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <span className="absolute inset-0 rounded-full transition-colors bg-[color:var(--bg-surface)] peer-checked:bg-[color:var(--cyan)]">
                        <span className="absolute w-[14px] h-[14px] bg-white rounded-full top-[3px] left-[3px] transition-all peer-checked:left-[19px]" />
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
