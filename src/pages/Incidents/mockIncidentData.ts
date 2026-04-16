import type { Incident, WorkOrder, IncidentStats } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'SC-001', type: 'Vỡ ống', location: 'Đường Lê Thánh Tông, Hồng Gai', severity: 'critical', status: 'processing', report: '2026-02-27 08:30', assignedTo: 'Đội 1 – Hạ Long', note: 'Ống phi 200, tụt áp 1.5 bar', factory: 'Hồng Gai' },
  { id: 'SC-002', type: 'Tụt áp', location: 'Khu TT Bãi Cháy', severity: 'warning', status: 'processing', report: '2026-02-27 10:15', assignedTo: 'Đội 2 – Hạ Long', note: 'Áp lực giảm từ 3.2 xuống 1.4 bar', factory: 'Bãi Cháy' },
  { id: 'SC-003', type: 'Máy bơm sự cố', location: 'Trạm Cẩm Phả', severity: 'critical', status: 'new', report: '2026-02-27 14:20', assignedTo: '', note: 'Máy bơm #2 báo lỗi Motor Overload', factory: 'Cẩm Phả' },
  { id: 'SC-004', type: 'Rò rỉ van', location: 'Đường Nguyễn Văn Cừ, Uông Bí', severity: 'warning', status: 'done', report: '2026-02-26 16:40', resolvedAt: '2026-02-26 19:20', assignedTo: 'Đội 4 – Uông Bí', note: 'Van DN150 bị hở', factory: 'Uông Bí' },
  { id: 'SC-005', type: 'Mất điện', location: 'Trạm bơm Vân Đồn', severity: 'warning', status: 'done', report: '2026-02-26 09:00', resolvedAt: '2026-02-26 13:45', assignedTo: 'Đội 5', note: 'Sự cố lưới điện, đã khắc phục sau 3h', factory: 'Vân Đồn' },
  { id: 'SC-006', type: 'Chất lượng nước', location: 'Nhà máy Hồng Gai', severity: 'warning', status: 'new', report: '2026-02-27 20:10', assignedTo: '', note: 'Chỉ số Clo dư vượt ngưỡng 0.6 mg/L', factory: 'Hồng Gai' },
  // Additional mock data for pagination
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `SC-${100 + i}`,
    type: ['Vỡ ống', 'Tụt áp', 'Rò rỉ van', 'Máy bơm sự cố', 'Mất điện', 'Chất lượng nước'][i % 6],
    location: ['Đường Trần Hưng Đạo', 'P. Giếng Đáy', 'Cao Thắng', 'Hà Lầm', 'Bãi Cháy', 'Cẩm Phả'][i % 6],
    severity: (i % 4 === 0 ? 'critical' : 'warning') as any,
    status: (i % 3 === 0 ? 'done' : i % 3 === 1 ? 'processing' : 'new') as any,
    report: `2026-02-${Math.max(1, 20 + (i % 8))} 09:00`,
    resolvedAt: i % 3 === 0 ? `2026-02-${Math.max(1, 20 + (i % 8))} 14:30` : undefined,
    assignedTo: `Đội ${1 + (i % 5)}`,
    note: 'Dữ liệu mô phỏng cho kiểm thử phân trang.',
    factory: ['Hồng Gai', 'Bãi Cháy', 'Cẩm Phả', 'Uông Bí', 'Móng Cái'][i % 5]
  }))
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { 
    id: 'WO-001', title: 'Kiểm tra định kỳ van D300', category: 'Bảo trì', priority: 'medium', status: 'new', deadline: '2026-03-05', assignedTo: 'Nguyễn Văn Tùng', location: 'Đường Tô Hiệu, Hạ Long', note: 'Kiểm tra độ rò rỉ và tra dầu mỡ định kỳ cho van tổng D300.', 
    timeline: [{ time: '2026-02-28 09:00', event: 'Tạo lệnh công tác', user: 'Admin' }] 
  },
  { 
    id: 'WO-002', title: 'Thay dầu máy bơm #3 Hồng Gai', category: 'Sửa chữa', priority: 'high', status: 'processing', deadline: '2026-03-02', assignedTo: 'Lê Văn Sơn', location: 'Nhà máy nước Hồng Gai', note: 'Thay dầu Castrol 4T, kiểm tra tiếng ồn ổ bi.', 
    timeline: [{ time: '2026-02-28 10:30', event: 'Tạo lệnh công tác', user: 'Admin' }, { time: '2026-03-01 08:00', event: 'Tiếp nhận xử lý', user: 'Lê Văn Sơn' }] 
  },
  { 
    id: 'WO-003', title: 'Lắp đặt đồng hồ thông minh DMA 01', category: 'Lắp đặt', priority: 'low', status: 'done', deadline: '2026-02-25', assignedTo: 'Phạm Minh Dũng', location: 'Ngõ 15 Phố Mới, Cẩm Phả', note: 'Lắp đặt 10 đồng hồ thông minh tại ngõ 15, Phố Mới.', 
    timeline: [{ time: '2026-02-20 08:30', event: 'Tạo lệnh công tác', user: 'Admin' }, { time: '2026-02-21 14:00', event: 'Hoàn thành lắp đặt', user: 'Phạm Minh Dũng' }] 
  },
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `WO-${100 + i}`,
    title: ['Vệ sinh bể lắng', 'Định chuẩn cảm biến pH', 'Kiểm tra tủ điện trạm Bãi Cháy', 'Sửa chữa rò rỉ khớp nối', 'Thay thế aptomat tổng'][i % 5],
    category: ['Bảo trì', 'Sửa chữa', 'Lắp đặt', 'Kiểm tra'][i % 4],
    priority: (i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low') as any,
    status: (i % 4 === 0 ? 'new' : i % 4 === 1 ? 'processing' : 'done') as any,
    location: ['Phường Hồng Hà', 'Bãi Cháy', 'Uông Bí', 'Cao Thắng', 'Cột 5'][i % 5],
    deadline: `2026-03-${10 + (i % 10)}`,
    assignedTo: ['Trần Văn Tùng', 'Lê Thị Lan', 'Phạm Minh Dũng', 'Bùi Văn Khoa', 'Vũ Anh Trường'][i % 5],
    note: 'Công việc thực hiện định kỳ theo kế hoạch vận hành.',
    timeline: [{ time: '2026-03-01 08:00', event: 'Tạo lệnh tự động', user: 'System' }]
  }))
];

// Calculation Helpers
const calculateStats = (incidents: Incident[]): IncidentStats => {
  const doneIncidents = incidents.filter(i => i.status === 'done' && i.resolvedAt);
  let avgHours = 0;
  if (doneIncidents.length > 0) {
    const totalDiff = doneIncidents.reduce((acc, i) => {
      const start = new Date(i.report.replace(' ', 'T')).getTime();
      const end = new Date(i.resolvedAt!.replace(' ', 'T')).getTime();
      return acc + (end - start);
    }, 0);
    avgHours = totalDiff / doneIncidents.length / 1000 / 3600;
  }

  const typeCounts = incidents.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const commonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return {
    total: incidents.length,
    new: incidents.filter(i => i.status === 'new').length,
    processing: incidents.filter(i => i.status === 'processing').length,
    done: incidents.filter(i => i.status === 'done').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    avgResolveTime: `${avgHours.toFixed(1)}h`,
    commonType
  };
};

export const INCIDENT_STATS: IncidentStats = calculateStats(MOCK_INCIDENTS);

export const INCIDENT_TRENDS = {
  incidents: [5, 8, 4, 12, 10, 6, 9, 7],
  resolveRate: [85, 88, 90, 82, 94, 91, 89, 92]
};
