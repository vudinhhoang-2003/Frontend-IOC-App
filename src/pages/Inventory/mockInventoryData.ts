// Mock data cho trang Sản xuất & Vật tư (copy 1:1 từ data.js prototype)

export interface Material {
  id: string; name: string; unit: string; stock: number; minStock: number; used: number; category: string;
}
export interface Chemical {
  id: string; name: string; unit: string; stock: number; minStock: number; dailyUsage: number; category: string;
}
export interface Equipment {
  id: string; name: string; factory: string; model: string; status: string; lastMaint: string; nextMaint: string; hoursRun: number;
}
export interface HistoryEntry {
  date: string; type: string; qty?: number; unit?: string; note: string; user: string; result?: string;
}
export interface AiPrediction {
  id: string; name: string; risk: 'high' | 'medium' | 'low'; score: number; nextFail: string; reason: string; recommendation: string; hoursLeft: number; totalHours: number; lastFix: string; trend: number[];
}

export const MATERIALS: Material[] = [
  { id: 'MT-001', name: 'Ống HDPE Ø110', unit: 'm', stock: 450, minStock: 200, used: 25, category: 'Ống' },
  { id: 'MT-002', name: 'Ống HDPE Ø150', unit: 'm', stock: 280, minStock: 150, used: 18, category: 'Ống' },
  { id: 'MT-003', name: 'Ống Gang Ø200', unit: 'm', stock: 120, minStock: 100, used: 8, category: 'Ống' },
  { id: 'MT-004', name: 'Van bướm DN150', unit: 'cái', stock: 35, minStock: 20, used: 2, category: 'Van' },
  { id: 'MT-005', name: 'Van cầu DN100', unit: 'cái', stock: 12, minStock: 15, used: 1, category: 'Van' },
  { id: 'MT-006', name: 'Đồng hồ tổng Ø50', unit: 'cái', stock: 80, minStock: 30, used: 3, category: 'Thiết bị đo' },
  { id: 'MT-007', name: 'Co nối Ø110', unit: 'cái', stock: 650, minStock: 200, used: 40, category: 'Phụ kiện' },
  { id: 'MT-008', name: 'Măng sông Ø150', unit: 'cái', stock: 95, minStock: 50, used: 7, category: 'Phụ kiện' },
];

export const CHEMICALS: Chemical[] = [
  { id: 'HC-001', name: 'PAC (Phèn nhôm)', unit: 'kg', stock: 2500, minStock: 1000, dailyUsage: 150, category: 'Keo tụ' },
  { id: 'HC-002', name: 'NaOCl (Clorua natri)', unit: 'lít', stock: 820, minStock: 400, dailyUsage: 52, category: 'Khử trùng' },
  { id: 'HC-003', name: 'Ca(OH)₂ (Vôi)', unit: 'kg', stock: 3200, minStock: 500, dailyUsage: 80, category: 'Điều chỉnh pH' },
  { id: 'HC-004', name: 'Polymer Anion', unit: 'kg', stock: 45, minStock: 50, dailyUsage: 3, category: 'Keo tụ' },
  { id: 'HC-005', name: 'Chlorine Dioxide ClO₂', unit: 'kg', stock: 180, minStock: 100, dailyUsage: 12, category: 'Khử trùng' },
  { id: 'HC-006', name: 'H₂SO₄ (Axit sulfuric)', unit: 'lít', stock: 280, minStock: 100, dailyUsage: 15, category: 'Điều chỉnh pH' },
];

export const EQUIPMENT_LIST: Equipment[] = [
  { id: 'EQ-001', name: 'Máy bơm ly tâm #1', factory: 'Hồng Gai', model: 'Grundfos CR90-2', status: 'running', lastMaint: '15/01/2026', nextMaint: '15/04/2026', hoursRun: 18420 },
  { id: 'EQ-002', name: 'Máy bơm ly tâm #2', factory: 'Hồng Gai', model: 'Grundfos CR90-2', status: 'running', lastMaint: '15/01/2026', nextMaint: '15/04/2026', hoursRun: 17200 },
  { id: 'EQ-003', name: 'Máy bơm áp lực #1', factory: 'Bãi Cháy', model: 'Flygt NP3102', status: 'running', lastMaint: '20/12/2025', nextMaint: '20/03/2026', hoursRun: 12550 },
  { id: 'EQ-004', name: 'Biến tần ABB', factory: 'Cẩm Phả', model: 'ABB ACS880', status: 'fault', lastMaint: '10/11/2025', nextMaint: 'Cần sửa chữa', hoursRun: 9800 },
  { id: 'EQ-005', name: 'Máy thổi khí #1', factory: 'Hồng Gai', model: 'Roots RGS-200', status: 'standby', lastMaint: '05/02/2026', nextMaint: '05/05/2026', hoursRun: 6240 },
  { id: 'EQ-006', name: 'Bể lắng tuyển nổi', factory: 'Bãi Cháy', model: 'Custom', status: 'running', lastMaint: '01/01/2026', nextMaint: '01/07/2026', hoursRun: 32000 },
  { id: 'EQ-007', name: 'Máy lọc cát đa lớp', factory: 'Uông Bí', model: 'Siemens', status: 'running', lastMaint: '15/02/2026', nextMaint: '15/05/2026', hoursRun: 21000 },
  { id: 'EQ-008', name: 'Máy bơm định lượng Clo', factory: 'Móng Cái', model: 'ProMinent Beta', status: 'running', lastMaint: '28/01/2026', nextMaint: '28/04/2026', hoursRun: 8900 },
];

export const PROD_HISTORY: Record<string, HistoryEntry[]> = {
  'VT-001': [
    { date: '2026-02-20', type: 'Nhập kho', qty: 500, unit: 'cái', note: 'Nhập từ NCC Phước Sơn', user: 'Admin' },
    { date: '2026-02-15', type: 'Xuất kho', qty: 120, unit: 'cái', note: 'Xuất cho đội lắp đặt ST01', user: 'Kỹ thuật' },
    { date: '2026-01-28', type: 'Nhập kho', qty: 300, unit: 'cái', note: 'Nhập khẩn cấp bổ sung', user: 'Admin' },
  ],
  'VT-002': [
    { date: '2026-02-22', type: 'Nhập kho', qty: 50, unit: 'm', note: 'Nhập theo hợp đồng Q1', user: 'Mua sắm' },
    { date: '2026-02-10', type: 'Xuất kho', qty: 30, unit: 'm', note: 'Xuất sửa tuyến ống P5', user: 'Kỹ thuật' },
  ],
  'HC-001': [
    { date: '2026-02-19', type: 'Nhập kho', qty: 500, unit: 'kg', note: 'Nhà cung cấp Chemtech', user: 'HC' },
    { date: '2026-02-10', type: 'Xuất kho', qty: 150, unit: 'kg', note: 'Xuất dùng khử trùng tuần 6', user: 'SX' },
    { date: '2026-01-20', type: 'Nhập kho', qty: 400, unit: 'kg', note: 'Nhập kho lại tháng 1', user: 'HC' },
  ],
  'EQ-001': [
    { date: '2026-02-23', type: 'Bảo dưỡng định kỳ', note: 'Thay nhớt, kiểm tra cánh bơm', user: 'Đội BT1', result: 'Bình thường' },
    { date: '2026-01-10', type: 'Sửa chữa', note: 'Thay phớt cơ khí bơm trục', user: 'Đội BT1', result: 'Hoàn thành' },
    { date: '2025-11-15', type: 'Bảo dưỡng định kỳ', note: 'Vệ sinh tổng thể, đo rung động', user: 'Đội BT1', result: 'Bình thường' },
  ],
  'EQ-003': [
    { date: '2026-02-28', type: 'Sửa chữa khẩn cấp', note: 'Thay thế van bi bị kẹt', user: 'Đội BT2', result: 'Hoàn thành' },
    { date: '2026-02-01', type: 'Bảo dưỡng định kỳ', note: 'Vệ sinh van, kiểm tra actuator', user: 'Đội BT2', result: 'Bình thường' },
  ],
};

export const AI_PREDICTIONS: AiPrediction[] = [
  { id: 'EQ-001', name: 'Bơm ly tâm 1 – NM Hạ Long 1', risk: 'high', score: 88, nextFail: '~14 ngày', reason: 'Rung động bất thường tăng 40% trong 2 tuần gần đây. Nhiệt độ ổ trục vượt ngưỡng cảnh báo 3 lần.', recommendation: 'Lên lịch bảo dưỡng khẩn trong vòng 7 ngày. Kiểm tra cân bằng động cánh bơm, thay bạc đạn.', hoursLeft: 220, totalHours: 8420, lastFix: '2026-02-23', trend: [60, 62, 65, 70, 74, 80, 85, 88] },
  { id: 'EQ-003', name: 'Van điều tiết tuyến A', risk: 'medium', score: 54, nextFail: '~45 ngày', reason: 'Thời gian đóng/mở van tăng thêm 2.3 giây so với baseline. Actuator xuất hiện rung nhẹ.', recommendation: 'Kiểm tra actuator trong lần bảo dưỡng định kỳ tiếp theo. Bôi trơn trục van.', hoursLeft: 1200, totalHours: 5100, lastFix: '2026-02-28', trend: [40, 42, 45, 47, 50, 51, 53, 54] },
  { id: 'EQ-002', name: 'Tủ điều khiển tự động', risk: 'low', score: 22, nextFail: '> 180 ngày', reason: 'Hệ thống hoạt động ổn định. Điện áp và dòng điện trong mức giới hạn. Không có cảnh báo.', recommendation: 'Tiếp tục giám sát theo lịch định kỳ. Không cần can thiệp ngay.', hoursLeft: 4500, totalHours: 6200, lastFix: '2026-02-15', trend: [25, 24, 23, 22, 22, 22, 21, 22] },
];
