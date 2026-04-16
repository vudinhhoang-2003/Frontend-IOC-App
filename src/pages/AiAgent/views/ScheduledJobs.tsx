import React, { useState } from 'react';
import { Play, Pause, Edit2, Info } from 'lucide-react';

const initialJobs = [
  { id: 'JB-001', name: 'Báo cáo sản lượng ngày', schedule: 'Mỗi ngày 06:00', channel: 'Email + Zalo', recipients: 'Ban Điều hành', status: 'active', lastRun: '27/02/2026 06:00', nextRun: '28/02/2026 06:00' },
  { id: 'JB-002', name: 'Cảnh báo chất lượng nước', schedule: 'Mỗi 1 giờ', channel: 'SMS + Push', recipients: 'Giám đốc IOC, Kỹ thuật...', status: 'active', lastRun: '27/02/2026 22:00', nextRun: '27/02/2026 23:00' },
  { id: 'JB-003', name: 'Báo cáo NRW tuần', schedule: 'Thứ Hai 08:00', channel: 'Email', recipients: 'Phòng Kỹ thuật', status: 'active', lastRun: '24/02/2026 08:00', nextRun: '02/03/2026 08:00' },
  { id: 'JB-004', name: 'Tổng hợp sự cố tháng', schedule: 'Ngày 1 mỗi tháng', channel: 'Email', recipients: 'Ban Giám đốc', status: 'paused', lastRun: '01/02/2026 07:00', nextRun: '01/03/2026 07:00' },
  { id: 'JB-005', name: 'Kiểm tra sản lượng bất thường', schedule: 'Mãnh ngày 22:30', channel: 'Inbox', recipients: 'Điều phối viên', status: 'active', lastRun: '27/02/2026 22:30', nextRun: '28/02/2026 22:30' },
];

const ScheduledJobs: React.FC = () => {
  const [jobs, setJobs] = useState(initialJobs);

  const toggleJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j));
  };

  return (
    <div className="card overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-[color:var(--border)] whitespace-nowrap bg-[color:var(--bg-surface)]">
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Mã</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Tên tác vụ</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Lịch chạy</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Kênh gửi</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Người nhận</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Lần chạy cuối</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Lần kế tiếp</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider">Trạng thái</th>
            <th className="p-4 text-xs font-black text-[color:var(--muted)] uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j, i) => (
            <tr key={j.id} className="border-b border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] transition-colors">
              <td className="p-4 font-mono text-[12px] text-[color:var(--cyan)] font-black">{j.id}</td>
              <td className="p-4 font-bold text-[13px] text-[color:var(--text)]">{j.name}</td>
              <td className="p-4 text-[12px] text-[color:var(--muted)]">{j.schedule}</td>
              <td className="p-4">
                <span className="badge badge-blue text-[10px] font-bold">{j.channel}</span>
              </td>
              <td className="p-4 text-[12px] text-[color:var(--muted)]">{j.recipients}</td>
              <td className="p-4 font-mono text-[11px] text-[color:var(--muted)]">{j.lastRun}</td>
              <td className="p-4 font-mono text-[11px] text-[color:var(--cyan)]">{j.nextRun}</td>
              <td className="p-4">
                {j.status === 'active' ? (
                  <span className="badge badge-green font-bold text-[10px]">Đang chạy</span>
                ) : (
                  <span className="badge badge-gray font-bold text-[10px]">Tạm dừng</span>
                )}
              </td>
               <td className="p-4 text-right">
                <div className="flex justify-end gap-1">
                  <button className="btn btn-ghost btn-sm px-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]" title="Xem chi tiết">
                    <Info size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm px-1.5 text-[color:var(--muted)] hover:text-[color:var(--blue)]" title="Chỉnh sửa">
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm px-1.5 text-[color:var(--muted)] hover:text-[color:var(--green)]" title="Chạy ngay">
                    <Play size={14} />
                  </button>
                  <button 
                    className={`btn btn-ghost btn-sm px-1.5 ${j.status === 'active' ? 'text-[color:var(--red)] hover:text-[color:var(--text)]' : 'text-[color:var(--cyan)] hover:text-[color:var(--text)]'}`} 
                    title={j.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                    onClick={() => toggleJob(j.id)}
                  >
                    {j.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduledJobs;
