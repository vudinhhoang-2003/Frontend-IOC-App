import React from 'react';

const SyncLog: React.FC = () => {
  const logs = [
    { source: 'SCADA/PLC', action: 'Đồng bộ dữ liệu áp lực & lưu lượng', records: 256, status: 'success', time: '22:30 27/02' },
    { source: 'Kế toán ERP', action: 'Đồng bộ dữ liệu doanh thu tháng 2', records: 1842, status: 'success', time: '22:00 27/02' },
    { source: 'Ngân hàng VietinBank', action: 'Đối soát thanh toán thu hộ', records: 0, status: 'error', time: '20:15 27/02' },
    { source: 'SCADA/PLC', action: 'Đồng bộ dữ liệu trạm Vân Đồn', records: 0, status: 'partial', time: '20:00 27/02' },
    { source: 'GIS Server', action: 'Cập nhật tọa độ tuyến ống mới', records: 45, status: 'success', time: '18:00 27/02' },
    { source: 'Kế toán ERP', action: 'Đồng bộ danh sách hợp đồng', records: 12, status: 'success', time: '08:00 27/02' },
  ];

  return (
    <div className="card overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-[color:var(--border)] whitespace-nowrap bg-black/10">
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Nguồn / Hệ thống</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Hành động tự động</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase text-center">Số bản ghi (Rows)</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Trạng thái (Status)</th>
            <th className="p-4 text-xs font-semibold text-[color:var(--muted)] uppercase">Thời gian thực thi</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-[13px]">{l.source}</td>
              <td className="p-4 text-[13px]">{l.action}</td>
              <td className="p-4 text-center font-mono text-[12px]">{l.records.toLocaleString()}</td>
              <td className="p-4">
                {l.status === 'success' && <span className="badge badge-green font-bold text-[10px]">Thành công</span>}
                {l.status === 'error' && <span className="badge badge-red font-bold text-[10px]">Lỗi kết nối / Failed</span>}
                {l.status === 'partial' && <span className="badge badge-yellow font-bold text-[10px]">Thiếu dữ liệu</span>}
              </td>
              <td className="p-4 font-mono text-[12px] text-[color:var(--muted)]">{l.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SyncLog;
