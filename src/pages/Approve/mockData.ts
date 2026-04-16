import type { ApprovalRequest, ApprovalHistory, ApprovalSetting } from './types';

export const PENDING_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APR-2026-0047',
    type: 'kpi_import',
    urgency: 'high',
    title: 'Import KPI Kinh doanh — Tháng 2/2026',
    desc: 'Nhập liệu 7 chỉ số KPI từ báo cáo tài chính T2/2026',
    submitter: 'Nguyễn Thành Tâm',
    submitterRole: 'Kế toán trưởng',
    submitterAvatar: 'NT',
    submittedAt: '2026-03-04 14:52:30',
    files: ['BaoCaoTaiChinh_T2_2026.xlsx', 'TongHopKPI_Feb2026.pdf'],
    note: 'Số liệu từ báo cáo tài chính nội bộ T2/2026, đã được phòng kế toán xác nhận. Cần lãnh đạo duyệt trước 17:00 hôm nay.',
    data: [
      { kpi: 'Doanh thu', val: '59,420 triệu đ', conf: 98 },
      { kpi: 'Sản lượng nước', val: '1,750,000 m³', conf: 97 },
      { kpi: 'Tỷ lệ NRW', val: '14.4%', conf: 95 },
      { kpi: 'Số khách hàng', val: '285,450 KH', conf: 91 },
      { kpi: 'Chi phí OPEX', val: '38,200 triệu đ', conf: 84 },
      { kpi: 'Tỷ lệ thu hóa đơn', val: '91.2%', conf: 75 },
    ],
    status: 'pending'
  },
  {
    id: 'APR-2026-0046',
    type: 'data_export',
    urgency: 'med',
    title: 'Export danh sách khách hàng toàn hệ thống',
    desc: '285,450 bản ghi khách hàng → file Excel để đối chiếu với SGD',
    submitter: 'Trần Minh Quân',
    submitterRole: 'Trưởng phòng Kinh doanh',
    submitterAvatar: 'TQ',
    submittedAt: '2026-03-04 13:10:15',
    files: [],
    note: 'Xuất toàn bộ danh sách khách hàng để chuẩn bị báo cáo Sở Xây dựng. File sẽ được mã hóa trước khi gửi.',
    data: [],
    status: 'pending'
  },
  {
    id: 'APR-2026-0045',
    type: 'scada_ctrl',
    urgency: 'high',
    title: 'Đóng van chính SC-007 — Khu Cẩm Phả',
    desc: 'Tắt van cấp nước để sửa chữa đường ống D400 tại Khu CN Cẩm Phả',
    submitter: 'Lê Văn Dũng',
    submitterRole: 'Kỹ sư SCADA',
    submitterAvatar: 'LD',
    submittedAt: '2026-03-04 11:30:00',
    files: ['LenhSuaChua_SC007.pdf'],
    note: 'Dự kiến ảnh hưởng ~2,300 HH. Thời gian dự kiến 3 tiếng (08:00–11:00 ngày 05/03). Đã thông báo CSKH trước 24h.',
    data: [],
    status: 'pending'
  },
  {
    id: 'APR-2026-0044',
    type: 'role_change',
    urgency: 'low',
    title: 'Cấp quyền SCADA Operator cho Phạm Thị Lan',
    desc: 'Thêm quyền điều khiển van/bơm cho nhân viên mới',
    submitter: 'Hoàng Thị Mai',
    submitterRole: 'Trưởng phòng IT',
    submitterAvatar: 'HM',
    submittedAt: '2026-03-04 09:15:00',
    files: ['QuyetDinhBoDung_PhTL.pdf'],
    note: 'Quyết định bổ sung nhân sự số 2026/QD-045. Nhân viên đã hoàn thành khóa đào tạo SCADA.',
    data: [],
    status: 'pending'
  }
];

export const APPROVAL_HISTORY: ApprovalHistory[] = [
  { id: 'APR-2026-0043', type: 'kpi_import', title: 'Import KPI Tháng 1/2026', submitter: 'Nguyễn Thành Tâm', approver: 'Trần Phúc Hà (GĐ)', approvedAt: '2026-02-03 16:30', status: 'approved', note: 'Đã duyệt. Số liệu khớp với báo cáo HĐQT.' },
  { id: 'APR-2026-0042', type: 'data_export', title: 'Export báo cáo NRW Q4/2025', submitter: 'Trần Minh Quân', approver: 'Nguyễn Văn Bình (PGĐ)', approvedAt: '2026-01-15 09:10', status: 'approved', note: 'Duyệt. File đã được mã hóa AES-256.' },
  { id: 'APR-2026-0041', type: 'scada_ctrl', title: 'Mở van SC-003 sau sửa chữa', submitter: 'Lê Văn Dũng', approver: 'Trần Phúc Hà (GĐ)', approvedAt: '2026-01-10 14:00', status: 'approved', note: '' },
  { id: 'APR-2026-0040', type: 'user_mgmt', title: 'Đặt lại mật khẩu tài khoản kế toán', submitter: 'Hoàng Thị Mai', approver: 'Trần Phúc Hà (GĐ)', approvedAt: '2026-01-05 10:30', status: 'rejected', note: 'Từ chối — người dùng chưa hoàn thành xác minh danh tính.' },
  { id: 'APR-2026-0039', type: 'kpi_import', title: 'Import KPI Tháng 12/2025', submitter: 'Nguyễn Thành Tâm', approver: 'Nguyễn Văn Bình (PGĐ)', approvedAt: '2026-01-03 15:45', status: 'approved', note: 'Duyệt. Số liệu đã được kiểm toán độc lập xác nhận.' },
];

export const APPROVAL_SETTINGS: ApprovalSetting[] = [
  { id: 'kpi_import', name: 'Import dữ liệu KPI', desc: 'Nhập liệu chỉ số KPI kinh doanh', needApproval: true, approver: 'Giám đốc', minApprovers: 1, notify: true },
  { id: 'data_export', name: 'Export dữ liệu lớn', desc: 'Export >1000 bản ghi', needApproval: true, approver: 'PGĐ hoặc GĐ', minApprovers: 1, notify: true },
  { id: 'scada_ctrl', name: 'Điều khiển SCADA', desc: 'Mở/đóng van, bật/tắt bơm', needApproval: true, approver: 'GĐ Kỹ thuật', minApprovers: 1, notify: true },
  { id: 'role_change', name: 'Thay đổi phân quyền', desc: 'Cập nhật quyền truy cập người dùng', needApproval: true, approver: 'PGĐ', minApprovers: 1, notify: false },
  { id: 'user_mgmt', name: 'Quản lý tài khoản', desc: 'Thêm/xóa/đặt lại tài khoản', needApproval: false, approver: 'Trưởng phòng IT', minApprovers: 1, notify: false },
  { id: 'api_key', name: 'Tạo/Thu hồi API Key', desc: 'Quản lý API Key tích hợp', needApproval: false, approver: 'Admin', minApprovers: 1, notify: false },
  { id: 'report_sign', name: 'Ký duyệt báo cáo', desc: 'Phê duyệt báo cáo gửi cơ quan nhà nước', needApproval: true, approver: 'Giám đốc', minApprovers: 1, notify: true },
  { id: 'alert_ack', name: 'Đóng cảnh báo CRITICAL', desc: 'Xử lý alert mức CRITICAL', needApproval: false, approver: 'Trưởng vận hành', minApprovers: 1, notify: true },
];
