import React from 'react';
import { Download, Save } from 'lucide-react';
import type { Employee, Shift } from '../data';

interface AttendanceProps {
  employees: Employee[];
  shifts: Shift[];
  attendanceSchedule: Record<string, string[]>;
}

const Attendance: React.FC<AttendanceProps> = ({ employees, shifts, attendanceSchedule }) => {
  const days = Array.from({ length: 27 }, (_, i) => i + 1);
  
  const shiftColors: Record<string, string> = {
    'CA1': 'rgba(0,200,255,.18)', 'CA2': 'rgba(255,202,40,.18)', 'CA3': 'rgba(124,77,255,.18)',
    'CAN': 'rgba(0,230,118,.18)', 'CAP': 'rgba(33,150,243,.18)', 'CAO': 'rgba(255,109,0,.18)',
    'CAL': 'rgba(255,23,68,.18)', 'CA-': 'rgba(144,164,174,.18)', 'CA0': 'transparent'
  };
  
  const shiftText: Record<string, string> = {
    'CA1': 'S', 'CA2': 'C', 'CA3': 'Đ', 'CAN': 'N',
    'CAP': 'P', 'CAO': 'Ô', 'CAL': 'L', 'CA-': 'V', 'CA0': '–'
  };
  
  const shiftFg: Record<string, string> = {
    'CA1': 'var(--cyan)', 'CA2': 'var(--yellow)', 'CA3': '#b388ff', 'CAN': 'var(--green)',
    'CAP': 'var(--blue)', 'CAO': '#ff6d00', 'CAL': '#ff1744', 'CA-': 'var(--muted)', 'CA0': 'var(--muted)'
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-4 flex-wrap justify-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          {shifts.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-[11px]">
              <div 
                className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[10px] font-bold border"
                style={{
                  backgroundColor: shiftColors[s.id] || 'transparent',
                  borderColor: shiftFg[s.id] || 'var(--border)',
                  color: shiftFg[s.id]
                }}
              >
                {shiftText[s.id]}
              </div>
              <span className="text-[color:var(--muted)] whitespace-nowrap">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Đang xuất bảng chấm công...')}>
            <Download size={14} className="mr-1 inline-block" /> Xuất Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Đang lưu phân ca...')}>
            <Save size={14} className="mr-1 inline-block" /> Lưu phân ca
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto custom-scrollbar">
        <table className="min-w-[900px] w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 font-semibold text-xs text-[color:var(--muted)] min-w-[160px] sticky left-0 bg-[color:var(--bg-elevated)] z-10 before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-px before:bg-[color:var(--border)]">
                Nhân viên
              </th>
              <th className="p-3 font-semibold text-xs text-[color:var(--muted)] min-w-[100px]">Phòng ban</th>
              {days.map((d) => (
                <th key={d} className="p-2 text-center font-semibold text-[11px] text-[color:var(--muted)] min-w-[36px]">
                  {d}/2
                </th>
              ))}
              <th className="p-3 text-center font-semibold text-xs text-[color:var(--muted)] min-w-[80px]">Tổng công</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const sched = attendanceSchedule[e.id] || [];
              const workDays = sched.filter((s) => s !== 'CA0').length;
              return (
                <tr key={e.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-3 font-semibold sticky left-0 bg-[color:var(--bg-elevated)] group-hover:bg-[#0c1e36] z-10 before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-px before:bg-[color:var(--border)] transition-colors">
                    {e.name}
                  </td>
                  <td className="p-3 text-[11px] text-[color:var(--muted)]">{e.dept.substring(0, 18)}</td>
                  {days.map((d, i) => {
                    const s = sched[i] || 'CA0';
                    return (
                      <td key={i} className="p-1 text-center">
                        <div
                          className="w-7 h-7 mx-auto rounded-md flex items-center justify-center text-[11px] font-bold cursor-pointer transition-transform hover:scale-110"
                          style={{
                            backgroundColor: shiftColors[s],
                            color: shiftFg[s],
                          }}
                          title={shifts.find((sh) => sh.id === s)?.name || 'Nghỉ'}
                        >
                          {shiftText[s]}
                        </div>
                      </td>
                    );
                  })}
                  <td 
                    className="p-3 text-center font-bold"
                    style={{
                      color: workDays >= 20 ? 'var(--green)' : workDays > 10 ? 'var(--yellow)' : 'var(--red)'
                    }}
                  >
                    {workDays}<span className="text-[10px] text-[color:var(--muted)] font-normal"> ngày</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
