import React, { useState } from 'react';
import { Mail, MessageSquare, BellRing, Webhook, Smartphone, ServerCrash, Droplets, Zap, ShieldAlert, FileSignature, AlertTriangle } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [channels, setChannels] = useState([
    { id: 'email', name: 'Email (SMTP)', desc: 'smtp.quawaco.vn:587', icon: Mail, on: true },
    { id: 'sms', name: 'SMS (Viettel BSS)', desc: 'Gateway: api.sms.vn', icon: MessageSquare, on: true },
    { id: 'zalo', name: 'Zalo ZNS', desc: 'OA ID: 3702xxx', icon: Smartphone, on: false },
    { id: 'push', name: 'Push Web (WebSocket)', desc: 'Thử nghiệm qua Notification API', icon: BellRing, on: true },
    { id: 'webhook', name: 'Webhook POST', desc: 'Bắn thông báo qua hệ thống khác', icon: Webhook, on: false },
  ]);

  const rules = [
    { event: 'Cảnh báo nghiêm trọng (Critical)', channels: 'Email + SMS + Push', targets: 'Admin + Dispatcher', priority: 'Cao', status: true, icon: ShieldAlert, color: 'text-red-500' },
    { event: 'Cảnh báo thường (Warning)', channels: 'Email + Push', targets: 'Dispatcher + Operator', priority: 'Trung Bình', status: true, icon: AlertTriangle },
    { event: 'Cảnh báo Phát hiện rò rỉ NRW', channels: 'Email + SMS', targets: 'Admin + Dispatcher', priority: 'Cao', status: true, icon: Droplets, color: 'text-blue-500' },
    { event: 'Sự cố nhà máy / Trạm bơm', channels: 'SMS + Email', targets: 'Admin + Dispatcher', priority: 'Cao', status: true, icon: ServerCrash, color: 'text-red-500' },
    { event: 'Mất điện lưới', channels: 'SMS + Push', targets: 'Tất cả Team', priority: 'Cao', status: true, icon: Zap, color: 'text-yellow-500' },
    { event: 'Ký duyệt báo cáo', channels: 'Email + Push', targets: 'Ban Lãnh đạo', priority: 'Bình thường', status: false, icon: FileSignature, color: 'text-green-500' },
  ];

  const handleToggleChannel = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, on: !c.on } : c));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Channels and SMTP Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notification Channels */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] font-semibold flex items-center gap-2">
             Kênh gửi thông báo
          </div>
          <div className="p-4">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--bg-surface)] transition-colors px-2 rounded -mx-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${c.on ? 'bg-[color:var(--cyan)]/10 text-[color:var(--cyan)]' : 'bg-[color:var(--bg-surface)] text-[color:var(--muted)]'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-[13px]">{c.name}</div>
                      <div className="text-[11px] text-[color:var(--muted)]">{c.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-block w-9 h-5 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={c.on} onChange={() => handleToggleChannel(c.id)} />
                    <span className="absolute inset-0 rounded-full transition-colors bg-[color:var(--bg-surface)] peer-checked:bg-[color:var(--cyan)]">
                      <span className="absolute w-[14px] h-[14px] bg-white rounded-full top-[3px] left-[3px] transition-all peer-checked:left-[19px]" />
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email SMTP Config */}
        <div className="card">
          <div className="p-4 border-b border-[color:var(--border)] font-semibold">
            Cấu hình Email (SMTP)
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[color:var(--muted)] mb-1.5">SMTP Host</label>
              <input type="text" defaultValue="smtp.quawaco.vn" className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[color:var(--muted)] mb-1.5">Cổng (Port)</label>
                <input type="number" defaultValue="587" className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[color:var(--muted)] mb-1.5">Mã hóa bảo mật</label>
                <select className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>Không nén</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[color:var(--muted)] mb-1.5">Địa chỉ gửi thư báo</label>
              <input type="text" defaultValue="ioc-noreply@quawaco.vn" className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[color:var(--muted)] mb-1.5">Tên người gửi (Hiển thị Email)</label>
              <input type="text" defaultValue="Quawaco IOC System" className="w-full bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[color:var(--cyan)] transition-colors" />
            </div>
            <button className="btn btn-ghost btn-sm mt-2 border border-[color:var(--border)]">Kiểm tra kết nối</button>
          </div>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="card">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="font-semibold text-[14px]">Quy tắc kịch bản (Automation Rules)</div>
          <button className="btn btn-primary btn-sm">+ Thêm kịch bản</button>
        </div>
        <div className="overflow-x-auto text-left">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[color:var(--border)] uppercase text-[10px] text-[color:var(--muted)] tracking-wider">
                <th className="p-4 font-semibold">Tên sự kiện</th>
                <th className="p-4 font-semibold">Kênh gửi</th>
                <th className="p-4 font-semibold">Đối tượng tiếp nhận</th>
                <th className="p-4 font-semibold">Quyền ưu tiên</th>
                <th className="p-4 font-semibold">Bật/Tắt</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => {
                const Icon = r.icon || BellRing;
                return (
                  <tr key={i} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-surface)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={r.color || 'text-white'} />
                        <span className="font-medium text-[13px]">{r.event}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[12px] text-[color:var(--muted)]">{r.channels}</td>
                    <td className="p-4 text-[12px]">{r.targets}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.priority === 'Cao' ? 'bg-red-500/10 text-red-400' : r.priority === 'Trung Bình' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-400'}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <label className="relative inline-block w-8 h-4 cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={r.status} />
                        <span className="absolute inset-0 rounded-full transition-colors bg-[color:var(--bg-surface)] peer-checked:bg-[color:var(--cyan)]">
                          <span className="absolute w-3 h-3 bg-white rounded-full top-[2px] left-[2px] transition-all peer-checked:left-[18px]" />
                        </span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
