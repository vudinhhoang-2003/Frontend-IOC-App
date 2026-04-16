import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Employee, EmployeeKpi } from '../data';

interface KpiBoardProps {
  employees: Employee[];
  employeeKpi: EmployeeKpi[];
}

const KpiBoard: React.FC<KpiBoardProps> = ({ employees, employeeKpi }) => {
  const chartData = employeeKpi
    .filter((k) => k.score > 0)
    .map((k) => {
      const emp = employees.find((e) => e.id === k.id);
      return {
        name: emp?.name || k.id,
        score: k.score,
        details: k
      };
    });

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'var(--green)';
    if (score >= 85) return 'var(--cyan)';
    if (score >= 70) return 'var(--yellow)';
    return 'var(--gray)';
  };

  const getRank = (score: number) => {
    if (score >= 95) return 'Xuất sắc';
    if (score >= 85) return 'Tốt';
    if (score >= 70) return 'Khá';
    if (score > 0) return 'Trung bình';
    return '—';
  };

  const getRankBadgeClass = (score: number) => {
    if (score >= 95) return 'badge-green';
    if (score >= 85) return 'badge-blue';
    if (score >= 70) return 'badge-yellow';
    return 'badge-gray';
  };

  const topEmployees = [...employeeKpi]
    .filter((k) => k.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[color:var(--bg-dropdown)] border border-[color:var(--border)] rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>
            Điểm KPI: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-[13px] text-[color:var(--muted)]">
          KPI tự động tổng hợp từ dữ liệu hệ thống – Tháng 2/2026
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => alert('Đang xuất báo cáo KPI...')}>
          <Download size={14} className="mr-1 inline-block" /> Xuất Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card flex flex-col h-[350px]">
          <div className="p-4 border-b border-white/5 font-semibold">Phân bổ điểm KPI</div>
          <div className="flex-1 p-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#546e7a', fontSize: 10 }} 
                  axisLine={{ stroke: 'rgba(0,200,255,.05)' }} 
                  tickLine={false} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#546e7a', fontSize: 10 }} 
                  axisLine={{ stroke: 'rgba(0,200,255,.05)' }} 
                  tickLine={false} 
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="score" radius={[5, 5, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col h-[350px]">
          <div className="p-4 border-b border-white/5 font-semibold">Top nhân viên tháng 2</div>
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {topEmployees.map((k, idx) => {
              const e = employees.find((x) => x.id === k.id);
              const rankGradients = [
                'linear-gradient(135deg, #ffd700, #ff9900)',
                'linear-gradient(135deg, #c0c0c0, #909090)',
                'linear-gradient(135deg, #cd7f32, #8b4513)',
                'linear-gradient(135deg, #0066ff, #0044aa)',
                'linear-gradient(135deg, #00c8ff, #0088bb)',
              ];
              return (
                <div key={k.id} className="flex items-center gap-3 py-2.5 border-b border-[color:var(--border)] last:border-b-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-md relative"
                    style={{ background: rankGradients[idx] || rankGradients[4] }}
                  >
                    <span className="relative z-10">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{e?.name || k.id}</div>
                    <div className="text-[11px] text-[color:var(--muted)] truncate">{e?.dept}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: getScoreColor(k.score) }}>
                      {k.score}<span className="text-[11px] text-[color:var(--muted)]">%</span>
                    </div>
                    <div className="text-[10px] text-[color:var(--muted)]">
                      {k.done}/{k.tasks} task
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-white/5 font-semibold">Bảng KPI chi tiết</div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[color:var(--border)] whitespace-nowrap">
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Nhân viên</th>
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Nhà máy</th>
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Chỉ số chính</th>
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Điểm</th>
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Xếp loại</th>
                <th className="p-3 text-xs font-semibold text-[color:var(--muted)] uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employeeKpi.map((k) => {
                const e = employees.find((x) => x.id === k.id);
                return (
                  <tr key={k.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 line-clamp-2">
                      <div className="font-semibold text-[13px]">{e?.name || k.id}</div>
                      <div className="text-[10px] text-[color:var(--muted)] font-normal">{e?.position}</div>
                    </td>
                    <td className="p-3 text-xs">{e?.factory || '—'}</td>
                    <td className="p-3 min-w-[120px]">
                      {Object.entries(k.metrics || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-[11px] leading-relaxed">
                          <span className="text-[color:var(--muted)] capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-semibold">{val}%</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden w-24">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${k.score}%`, backgroundColor: getScoreColor(k.score) }}
                          />
                        </div>
                        <span 
                          className="font-mono text-xs font-bold min-w-[36px]" 
                          style={{ color: getScoreColor(k.score) }}
                        >
                          {k.score || '—'}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`badge ${getRankBadgeClass(k.score)}`}>{getRank(k.score)}</span>
                    </td>
                    <td className="p-3">
                      <button className="btn btn-ghost btn-sm" onClick={() => alert(`Chi tiết KPI ${e?.name}`)}>
                        Chi tiết
                      </button>
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

export default KpiBoard;
