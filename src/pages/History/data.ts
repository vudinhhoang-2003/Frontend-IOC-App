export interface AuditLog {
  id: string;
  time: string;
  user: string;
  type: 'UPDATE' | 'CREATE' | 'DELETE' | 'SYSTEM' | 'EXPORT' | 'INFO';
  action: string;
  target: string;
  ip: string;
  details?: string;
}

export const mockActivityLog: AuditLog[] = [
  {
    id: 'AL-1001',
    time: '2026-04-08 10:45:12',
    user: 'Nguyễn Minh Tuấn',
    type: 'UPDATE',
    action: 'Cập nhật phân ca',
    target: 'Nhân viên (Hoàng Thị Lan)',
    ip: '192.168.1.45',
    details: '{"oldShift":"CA1","newShift":"CA2","reason":"Đổi ca đột xuất"}'
  },
  {
    id: 'AL-1002',
    time: '2026-04-08 09:12:05',
    user: 'Lê Văn Hùng',
    type: 'EXPORT',
    action: 'Xuất báo cáo',
    target: 'Báo cáo doanh thu tháng 3',
    ip: '192.168.1.112',
    details: '{"format":"xlsx","records":1500}'
  },
  {
    id: 'AL-1003',
    time: '2026-04-08 08:30:22',
    user: 'System',
    type: 'SYSTEM',
    action: 'Đồng bộ SCADA',
    target: 'Trạm Bơm Đập Nước',
    ip: '127.0.0.1',
    details: '{"syncStatus":"SUCCESS","recordsUpdated":5}'
  },
  {
    id: 'AL-1004',
    time: '2026-04-07 16:20:00',
    user: 'Phạm Văn Đức',
    type: 'UPDATE',
    action: 'Đổi ngưỡng cảnh báo',
    target: 'Cảm biến áp lực (P_02)',
    ip: '192.168.1.15',
    details: '{"oldThreshold":4.5,"newThreshold":5.0}'
  },
  {
    id: 'AL-1005',
    time: '2026-04-07 14:15:45',
    user: 'Nguyễn Minh Tuấn',
    type: 'CREATE',
    action: 'Tạo tài khoản',
    target: 'Kỹ sư vận hành (NV_11A)',
    ip: '192.168.1.45',
    details: '{"role":"operator","department":"Phòng Kỹ Thuật"}'
  },
  {
    id: 'AL-1006',
    time: '2026-04-06 10:05:10',
    user: 'Admin Hệ thống',
    type: 'DELETE',
    action: 'Xóa phòng ban',
    target: 'Phòng kiểm định (Cũ)',
    ip: '192.168.1.10',
    details: '{"reason":"Sáp nhập phòng"}'
  }
];
