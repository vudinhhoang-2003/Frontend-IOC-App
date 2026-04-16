import React from 'react';
import { Shield } from 'lucide-react';

const RoleSettings: React.FC = () => {
  const rolesInfo = [
    { name: 'Admin', badge: 'badge-red', desc: 'Toàn quyền. Truy cập mọi tính năng, quản lý người dùng và cấu hình hệ thống.', count: 2 },
    { name: 'Dispatcher', badge: 'badge-yellow', desc: 'Điều phối vận hành. Tạo lệnh, xem SCADA, quản lý khách hàng và báo cáo.', count: 5 },
    { name: 'Operator', badge: 'badge-blue', desc: 'Vận hành. Xem dữ liệu realtime, cập nhật trạng thái nhưng không thay đổi cấu hình.', count: 12 },
    { name: 'Viewer', badge: 'badge-gray', desc: 'Chỉ xem. Truy cập dashboard và báo cáo, không thể tương tác hay tạo lệnh.', count: 30 }
  ];

  const perms = [
    { label: 'Xem Dashboard', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Xem SCADA realtime', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Điều chỉnh van / bơm', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Tạo lệnh công việc', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Xem báo cáo', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Xuất dữ liệu / Excel', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Quản lý nhân sự', admin: true, dispatcher: false, operator: false, viewer: false },
    { label: 'Quản lý khách hàng', admin: true, dispatcher: true, operator: false, viewer: false },
    { label: 'Xem GIS bản đồ', admin: true, dispatcher: true, operator: true, viewer: true },
    { label: 'Truy cập NRW / Thất thoát', admin: true, dispatcher: true, operator: true, viewer: false },
    { label: 'Cài đặt hệ thống', admin: true, dispatcher: false, operator: false, viewer: false },
    { label: 'Quản lý phân quyền', admin: true, dispatcher: false, operator: false, viewer: false },
  ];

  const CheckIcon = ({ active }: { active: boolean }) => (
    <div className={`mx-auto w-5 h-5 rounded flex items-center justify-center border ${active ? 'bg-[color:var(--green)]/20 border-[color:var(--green)] text-[color:var(--green)]' : 'bg-[color:var(--bg-surface)] border-[color:var(--border)] text-[color:var(--muted)]/20'}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Roles Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {rolesInfo.map((r, i) => (
          <div key={i} className="card p-4 flex flex-col h-full">
            <div className="mb-2">
              <span className={`badge ${r.badge} text-[12px] px-2.5 py-1 font-bold tracking-wide`}>{r.name}</span>
            </div>
            <p className="text-[13px] text-[color:var(--muted)] leading-relaxed flex-1 mb-3">{r.desc}</p>
            <div className="text-[12px] text-[color:var(--muted)] mt-auto pt-3 border-t border-[color:var(--border)] font-medium">
              <strong className="text-[color:var(--text)]">{r.count}</strong> nhân viên truy cập
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="card overflow-x-auto custom-scrollbar">
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-[color:var(--bg-surface)]">
          <div className="flex items-center gap-2 font-semibold">
            <Shield size={14} className="text-[color:var(--cyan)]" /> Ma trận phân quyền
          </div>
          <span className="text-[12px] text-[color:var(--muted)] italic">Click vào ô để bật/tắt (Giả lập)</span>
        </div>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[color:var(--border)] whitespace-nowrap bg-[color:var(--bg-elevated)] sticky top-0 z-10">
              <th className="p-3 text-[13px] font-semibold text-[color:var(--muted)] uppercase">Tính năng / Phân hệ</th>
              <th className="p-3 text-center"><span className="badge badge-red uppercase tracking-wider text-[10px]">Admin</span></th>
              <th className="p-3 text-center"><span className="badge badge-yellow uppercase tracking-wider text-[10px]">Dispatcher</span></th>
              <th className="p-3 text-center"><span className="badge badge-blue uppercase tracking-wider text-[10px]">Operator</span></th>
              <th className="p-3 text-center"><span className="badge badge-gray uppercase tracking-wider text-[10px]">Viewer</span></th>
            </tr>
          </thead>
          <tbody>
            {perms.map((p, idx) => (
              <tr key={idx} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-surface)] transition-colors">
                <td className="p-3 text-[13px] font-medium">{p.label}</td>
                <td className="p-3 text-center cursor-pointer hover:bg-[color:var(--bg-surface)] transition-colors"><CheckIcon active={p.admin} /></td>
                <td className="p-3 text-center cursor-pointer hover:bg-[color:var(--bg-surface)] transition-colors"><CheckIcon active={p.dispatcher} /></td>
                <td className="p-3 text-center cursor-pointer hover:bg-[color:var(--bg-surface)] transition-colors"><CheckIcon active={p.operator} /></td>
                <td className="p-3 text-center cursor-pointer hover:bg-[color:var(--bg-surface)] transition-colors"><CheckIcon active={p.viewer} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleSettings;
