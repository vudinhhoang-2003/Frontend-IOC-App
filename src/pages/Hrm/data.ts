// Types
export interface Employee {
  id: string;
  name: string;
  position: string;
  dept: string;
  factory?: string;
  role: 'admin' | 'dispatcher' | 'operator' | 'viewer';
  status: 'active' | 'leave' | 'inactive';
  phone?: string;
  email: string;
  age: number;
  exp: number;
  startDate?: string;
}

export interface Shift {
  id: string;
  name: string;
  time: string;
  color: string;
}

export interface EmployeeKpi {
  id: string;
  tasks: number;
  done: number;
  incidents: number;
  workHours: number;
  score: number;
  category: string;
  metrics: Record<string, number>;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  deputies: string[];
  staff: number;
  color: string;
  desc: string;
}

// Mock Data
export const mockEmployees: Employee[] = [
  { id: 'NV-001', name: 'Trần Đình Dũng', position: 'Giám đốc IOC', dept: 'Ban Điều hành', factory: 'Quawaco HQ', role: 'admin', status: 'active', phone: '0912345678', email: 'dungdd@quawaco.vn', age: 45, exp: 22 },
  { id: 'NV-002', name: 'Nguyễn Thị Phương', position: 'Điều phối viên trưởng', dept: 'Trung tâm Điều hành', factory: 'Quawaco HQ', role: 'dispatcher', status: 'active', phone: '0987654321', email: 'phuongnt@quawaco.vn', age: 38, exp: 12 },
  { id: 'NV-003', name: 'Lê Văn Sơn', position: 'Kỹ sư SCADA', dept: 'Phòng Kỹ thuật', factory: 'Quawaco HQ', role: 'operator', status: 'active', phone: '0967891234', email: 'sonlv@quawaco.vn', age: 32, exp: 8 },
  { id: 'NV-004', name: 'Phạm Thị Hà', position: 'Kỹ thuật viên mạng lưới', dept: 'Phòng Kỹ thuật', factory: 'Quawaco HQ', role: 'operator', status: 'active', phone: '0943210987', email: 'hapth@quawaco.vn', age: 29, exp: 5 },
  { id: 'NV-005', name: 'Hoàng Minh Tuấn', position: 'Nhân viên Kinh doanh', dept: 'Phòng KD-DV Khách hàng', factory: 'Quawaco HQ', role: 'viewer', status: 'active', phone: '0911223344', email: 'tuanhm@quawaco.vn', age: 35, exp: 10 },
  { id: 'NV-006', name: 'Đỗ Thị Linh', position: 'Kế toán trưởng', dept: 'Phòng Kế toán', factory: 'Quawaco HQ', role: 'viewer', status: 'active', phone: '0922334455', email: 'linhdth@quawaco.vn', age: 42, exp: 18 },
  { id: 'NV-007', name: 'Bùi Văn Khoa', position: 'Trưởng đội sửa chữa', dept: 'Đội 1 – TP. Hạ Long', factory: 'Hồng Gai', role: 'operator', status: 'active', phone: '0933445566', email: 'khoabv@quawaco.vn', age: 40, exp: 15 },
  { id: 'NV-008', name: 'Vũ Thị Thanh', position: 'Nhân viên hành chính', dept: 'Văn phòng', factory: 'Quawaco HQ', role: 'viewer', status: 'inactive', phone: '0944556677', email: 'thanhvt@quawaco.vn', age: 27, exp: 3 },
  ...Array.from({ length: 42 }, (_, i) => ({
    id: `NV-${100 + i}`,
    name: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'][i % 8] + ' ' + ['Văn', 'Thị', 'Minh', 'Anh', 'Đức', 'Xuân'][i % 6] + ' ' + ['Tùng', 'Lan', 'Dũng', 'Hạnh', 'Trường', 'Mai', 'Sơn', 'Quỳnh'][i % 8],
    position: ['Trưởng CA', 'Quản lý NM', 'Kế toán NM', 'Thủ kho NM', 'Kỹ thuật viên', 'Bảo vệ', 'Tạp vụ'][i % 7],
    dept: ['Sản xuất', 'Kỹ thuật', 'Kế toán', 'Hành chính', 'Vận hành'][i % 5],
    factory: ['Hồng Gai', 'Bãi Cháy', 'Cẩm Phả', 'Uông Bí', 'Móng Cái', 'Hoành Bồ', 'Vân Đồn', 'Tiên Yên', 'Hải Hà'][i % 9],
    role: (i % 10 === 0 ? 'dispatcher' : i % 4 === 0 ? 'operator' : 'viewer') as any,
    status: (i % 8 === 0 ? 'leave' : 'active') as any,
    phone: `09${Math.floor(10000000 + Math.random() * 80000000)}`,
    email: `emp${i + 100}@quawaco.vn`,
    age: Math.floor(Math.random() * 30 + 22),
    exp: Math.floor(Math.random() * 15 + 1)
  }))
];

export const mockShifts: Shift[] = [
  { id: 'CA1', name: 'Ca Sáng', time: '06:00 – 14:00', color: 'cyan' },
  { id: 'CA2', name: 'Ca Chiều', time: '14:00 – 22:00', color: 'yellow' },
  { id: 'CA3', name: 'Ca Đêm', time: '22:00 – 06:00', color: 'purple' },
  { id: 'CAN', name: 'Hành chính', time: '08:00 – 17:00', color: 'green' },
  { id: 'CAP', name: 'Nghỉ Phép', time: '—', color: 'blue' },
  { id: 'CAO', name: 'Nghỉ Ốm', time: '—', color: 'orange' },
  { id: 'CAL', name: 'Ngày Lễ', time: '—', color: 'red' },
  { id: 'CA-', name: 'Vắng', time: '—', color: 'muted' },
  { id: 'CA0', name: 'Nghỉ Tuần', time: '—', color: 'gray' },
];

export const mockAttendanceSchedule: Record<string, string[]> = {
  'NV-001': ['CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0'],
  'NV-002': ['CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0'],
  'NV-003': ['CA1', 'CA2', 'CA3', 'CA1', 'CA2', 'CA0', 'CA0', 'CA3', 'CA1', 'CA2', 'CA3', 'CA1', 'CA0', 'CA0', 'CA2', 'CA3', 'CA1', 'CA2', 'CA3', 'CA0', 'CA0', 'CA1', 'CA2', 'CA3', 'CA1', 'CA2', 'CA0'],
  'NV-004': ['CA3', 'CA1', 'CAP', 'CAP', 'CA1', 'CA0', 'CA0', 'CA2', 'CA3', 'CA1', 'CA2', 'CA3', 'CA0', 'CA0', 'CA1', 'CA2', 'CAO', 'CAO', 'CA2', 'CA0', 'CA0', 'CA3', 'CA1', 'CA2', 'CA3', 'CA1', 'CA0'],
  'NV-005': ['CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0'],
  'NV-006': ['CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0', 'CA0', 'CAN', 'CAN', 'CAN', 'CAN', 'CAN', 'CA0'],
  'NV-007': ['CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA-', 'CA-', 'CA0', 'CA0', 'CA1', 'CA1', 'CA1', 'CA1', 'CA1', 'CA0'],
  'NV-008': ['CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0', 'CA0'],
  ...Array.from({ length: 50 }, (_, i) => ({
    [`NV-${100 + i}`]: Array.from({ length: 27 }, (_, d) => {
      if (d % 7 >= 5) return 'CA0';
      if (Math.random() < 0.05) return 'CAP';
      if (Math.random() < 0.02) return 'CAO';
      return i % 3 === 0 ? 'CAN' : (['CA1', 'CA2', 'CA3'][Math.floor(Math.random() * 3)]);
    })
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
};

export const mockEmployeeKpi: EmployeeKpi[] = [
  { id: 'NV-001', tasks: 48, done: 45, incidents: 0, workHours: 184, score: 96, category: 'Lãnh đạo', metrics: { leadership: 98, execution: 94 } },
  { id: 'NV-002', tasks: 120, done: 118, incidents: 2, workHours: 182, score: 91, category: 'Điều phối', metrics: { responsiveness: 95, accuracy: 88 } },
  { id: 'NV-003', tasks: 85, done: 83, incidents: 1, workHours: 186, score: 94, category: 'Kỹ thuật', metrics: { maintenance: 96, troubleshooting: 92 } },
  { id: 'NV-004', tasks: 76, done: 71, incidents: 3, workHours: 188, score: 87, category: 'Kỹ thuật', metrics: { network_repair: 85, reporting: 90 } },
  { id: 'NV-005', tasks: 64, done: 64, incidents: 0, workHours: 180, score: 98, category: 'Kinh doanh', metrics: { sales: 99, customer_satisfaction: 97 } },
  { id: 'NV-006', tasks: 92, done: 90, incidents: 1, workHours: 180, score: 93, category: 'Kế toán', metrics: { accuracy: 95, reporting_deadline: 91 } },
  { id: 'NV-007', tasks: 110, done: 105, incidents: 4, workHours: 192, score: 85, category: 'Vận hành', metrics: { output_target: 88, chemical_efficiency: 82 } },
  ...Array.from({ length: 42 }, (_, i) => ({
    id: `NV-${100 + i}`,
    tasks: Math.floor(Math.random() * 50 + 20),
    done: Math.floor(Math.random() * 20 + 20),
    incidents: Math.floor(Math.random() * 5),
    workHours: 160 + Math.floor(Math.random() * 40),
    score: Math.floor(Math.random() * 30 + 70),
    category: ['Sản xuất', 'Kỹ thuật', 'Kinh doanh', 'Kế toán', 'Hành chính'][i % 5],
    metrics: { primary: Math.floor(Math.random() * 20 + 80), secondary: Math.floor(Math.random() * 20 + 75) }
  }))
];

export const mockOrgStructure = {
  id: 'root', type: 'company', name: 'Công ty TNHH MTV Cấp nước Quawaco', position: 'Công ty',
  head: { name: 'Nguyễn Minh Tuấn', title: 'Giám đốc', initials: 'MT' },
  children: [
      {
          id: 'd1', type: 'dept', name: 'Ban Giám đốc', color: '#00c8ff',
          head: { name: 'Lê Văn Hùng', title: 'Phó GĐ Kỹ thuật', initials: 'LH' },
          deputies: [{ name: 'Trần Thị Mai', title: 'Phó GĐ Kinh doanh', initials: 'TM' }],
          children: []
      },
      {
          id: 'd2', type: 'dept', name: 'Phòng Kỹ thuật', color: '#00e676',
          head: { name: 'Phạm Văn Đức', title: 'Trưởng phòng', initials: 'PD' },
          deputies: [{ name: 'Hoàng Thị Lan', title: 'Phó phòng', initials: 'HL' }],
          children: [
              { id: 'd2a', type: 'team', name: 'Đội SCADA & Điều độ', color: '#00e676', headName: 'Nguyễn Văn An', staff: 4 },
              { id: 'd2b', type: 'team', name: 'Đội Cơ điện – Bảo dưỡng', color: '#00e676', headName: 'Vũ Thị Hoa', staff: 6 },
          ]
      },
      {
          id: 'd3', type: 'dept', name: 'Phòng Kinh doanh', color: '#0066ff',
          head: { name: 'Bùi Thị Hương', title: 'Trưởng phòng', initials: 'BH' },
          deputies: [],
          children: [
              { id: 'd3a', type: 'team', name: 'Bộ phận Khách hàng', color: '#0066ff', headName: 'Đinh Văn Nam', staff: 5 },
              { id: 'd3b', type: 'team', name: 'Bộ phận Tổng đài', color: '#0066ff', headName: 'Lý Thị Vân', staff: 3 },
          ]
      },
      {
          id: 'd4', type: 'dept', name: 'Phòng NRW & Thất thoát', color: '#7c4dff',
          head: { name: 'Đỗ Minh Khoa', title: 'Trưởng phòng', initials: 'DK' },
          deputies: [{ name: 'Cao Thị Bình', title: 'Phó phòng', initials: 'CB' }],
          children: [
              { id: 'd4a', type: 'team', name: 'Đội NRW chuyên biệt', color: '#7c4dff', headName: 'Tô Văn Lực', staff: 5 },
          ]
      },
      {
          id: 'd5', type: 'dept', name: 'Phòng Chất lượng', color: '#ffca28',
          head: { name: 'Trương Thị Nga', title: 'Trưởng phòng', initials: 'TN' },
          deputies: [],
          children: []
      },
      {
          id: 'd6', type: 'dept', name: 'Phòng Nhân sự – Hành chính', color: '#ff6d00',
          head: { name: 'Lưu Thị Phương', title: 'Trưởng phòng', initials: 'LP' },
          deputies: [{ name: 'Mai Văn Tú', title: 'Phó phòng', initials: 'MT' }],
          children: []
      },
      {
          id: 'd7', type: 'dept', name: 'Phòng CNTT & Dữ liệu', color: '#e91e63',
          head: { name: 'Phùng Đức Thắng', title: 'Trưởng phòng', initials: 'PT' },
          deputies: [],
          children: []
      },
  ]
};

export const mockDeptList: Department[] = [
  { id: 'd1', name: 'Ban Giám đốc', code: 'BGD', head: 'Lê Văn Hùng', deputies: ['Trần Thị Mai'], staff: 3, color: '#00c8ff', desc: 'Lãnh đạo và điều hành công ty' },
  { id: 'd2', name: 'Phòng Kỹ thuật', code: 'PKT', head: 'Phạm Văn Đức', deputies: ['Hoàng Thị Lan'], staff: 12, color: '#00e676', desc: 'SCADA, vận hành kỹ thuật, bảo dưỡng' },
  { id: 'd3', name: 'Phòng Kinh doanh', code: 'PKD', head: 'Bùi Thị Hương', deputies: [], staff: 8, color: '#0066ff', desc: 'Dịch vụ khách hàng, hợp đồng, tổng đài' },
  { id: 'd4', name: 'Phòng NRW & Thất thoát', code: 'NRW', head: 'Đỗ Minh Khoa', deputies: ['Cao Thị Bình'], staff: 6, color: '#7c4dff', desc: 'Quản lý tổn thất nước, DMA, MNF' },
  { id: 'd5', name: 'Phòng Chất lượng', code: 'PCL', head: 'Trương Thị Nga', deputies: [], staff: 4, color: '#ffca28', desc: 'Giám sát chất lượng nước, lấy mẫu, xét nghiệm' },
  { id: 'd6', name: 'Phòng Nhân sự – Hành chính', code: 'PNS', head: 'Lưu Thị Phương', deputies: ['Mai Văn Tú'], staff: 5, color: '#ff6d00', desc: 'Quản lý CBCNV, hành chính, lương thưởng' },
  { id: 'd7', name: 'Phòng CNTT & Dữ liệu', code: 'CNTT', head: 'Phùng Đức Thắng', deputies: [], staff: 3, color: '#e91e63', desc: 'Hạ tầng CNTT, IOC platform, dữ liệu' },
];

export interface ChangeHistoryLog {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  type: 'add' | 'update' | 'delete' | 'system';
}

export const mockChangeHistory: ChangeHistoryLog[] = [
  { id: 'log-1', action: 'Thêm nhân viên mới', description: 'Đã thêm nhân viên Nguyễn Văn A vào phòng Kỹ thuật.', user: 'Admin Hẹ thống', timestamp: '2026-02-14T08:30:00Z', type: 'add' },
  { id: 'log-2', action: 'Cập nhật phân ca', description: 'Đã chỉnh sửa lịch trực ca của đội SCADA & Điều độ.', user: 'Lê Văn Hùng', timestamp: '2026-02-13T16:45:00Z', type: 'update' },
  { id: 'log-3', action: 'Xóa phòng ban', description: 'Xóa phòng kiểm định cũ dư thừa trên hệ thống.', user: 'Admin Hệ thống', timestamp: '2026-02-12T10:15:00Z', type: 'delete' },
  { id: 'log-4', action: 'Khởi tạo KPI tháng 2', description: 'Hệ thống tự động khởi tạo bảng đánh giá KPI tháng 2/2026 cho 120 nhân sự.', user: 'System', timestamp: '2026-02-01T00:00:00Z', type: 'system' },
  { id: 'log-5', action: 'Thay đổi chức vụ', description: 'Cập nhật chức vụ của Trần Thị Mai thành Phó GĐ Kinh doanh.', user: 'Lưu Thị Phương', timestamp: '2026-01-20T14:20:00Z', type: 'update' },
];
