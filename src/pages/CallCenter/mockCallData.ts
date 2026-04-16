import type { CallLog, CallTicket, AgentStatus, CallCenterStats } from './types';

export const MOCK_CALL_STATS: CallCenterStats = {
  totalCalls: 185,
  resolvedCalls: 172,
  openTickets: 42,
  csat: 4.4,
  avgDuration: '5:09',
  topTopic: 'Hóa đơn',
  topFactory: 'Nhà máy Hồng Gai',
};

export const AGENT_STATUSES: AgentStatus[] = [
  { name: 'NV Phương', status: 'available' },
  { name: 'NV Tuấn', status: 'busy' },
  { name: 'NV Hoa', status: 'break' },
  { name: 'NV Minh', status: 'available' },
  { name: 'NV Lan', status: 'busy' },
];

export const CALL_TRENDS = {
  calls: [12, 18, 15, 22, 19, 25, 21, 28, 24, 30, 27, 35],
  resolved: [10, 16, 14, 20, 18, 23, 19, 26, 22, 28, 25, 32],
  tickets: [5, 8, 6, 10, 9, 12, 10, 15, 12, 18, 15, 20],
  duration: [5.2, 5.5, 5.1, 4.9, 5.3, 5.0, 5.2, 4.8, 5.1, 5.0, 4.9, 5.1],
  csat: [4.2, 4.3, 4.4, 4.3, 4.5, 4.4, 4.5, 4.4, 4.6, 4.5, 4.4, 4.4],
};

export const MOCK_CALL_LOGS: CallLog[] = [
  { id: 'CC-085', customer: 'Nguyễn Văn A', phone: '0912345678', type: 'inbound', topic: 'Hóa đơn tiền nước', note: 'Thắc mắc về chỉ số nước tháng 3 tăng cao đột biến...', agent: 'NV Phương', status: 'resolved', time: '08:45:12' },
  { id: 'CC-084', customer: 'Trần Thị B', phone: '0987654321', type: 'inbound', topic: 'Chất lượng nước', note: 'Nước có hiện tượng đục, yêu cầu kiểm tra bể chứa...', agent: 'NV Tuấn', status: 'pending', time: '08:32:05', ticketId: 'TK-402' },
  { id: 'CC-083', customer: 'Lê Văn C', phone: '0905123987', type: 'outbound', topic: 'Hẹn lịch lắp đặt', note: 'Gọi xác nhận lịch lắp đồng hồ mới tại Bãi Cháy.', agent: 'NV Hoa', status: 'resolved', time: '08:20:18' },
  { id: 'CC-082', customer: 'Phạm Minh D', phone: '0933445566', type: 'inbound', topic: 'Áp lực yếu', note: 'Khu vực phường Hồng Gai nước chảy rất yếu từ sáng.', agent: 'NV Phương', status: 'escalated', time: '08:15:30', ticketId: 'TK-401' },
  { id: 'CC-081', customer: 'Hoàng Kim E', phone: '0868778899', type: 'inbound', topic: 'Hợp đồng mới', note: 'Yêu cầu tư vấn thủ tục lắp mới cho hộ kinh doanh.', agent: 'NV Minh', status: 'resolved', time: '08:05:45' },
];

export const MOCK_TICKETS: CallTicket[] = [
  {
    id: 'TK-401',
    title: 'Áp lực nước yếu tại Phường Hồng Gai',
    category: 'Áp lực yếu',
    priority: 'high',
    status: 'processing',
    assignee: 'Đội Kỹ thuật HG',
    calls: 5,
    created: '02/04/2026',
    factory: 'Nhà máy Hồng Gai',
    timeline: [
      { action: 'Tiếp nhận yêu cầu', time: '08:15 02/04', user: 'NV Phương', note: 'Khách hàng phản ánh nước yếu cục bộ' },
      { action: 'Khảo sát hiện trường', time: '09:30 02/04', user: 'Kỹ thuật A', note: 'Đang kiểm tra van điều áp kv Hồng Gai' }
    ]
  },
  {
    id: 'TK-402',
    title: 'Nước đục sau sự cố vỡ ống tại Bãi Cháy',
    category: 'Chất lượng nước',
    priority: 'medium',
    status: 'new',
    assignee: 'Nhóm LIMS - BC',
    calls: 3,
    created: '03/04/2026',
    factory: 'Nhà máy Bãi Cháy',
    timeline: [
      { action: 'Khởi tạo ticket', time: '08:32 03/04', user: 'NV Tuấn', note: 'Đã nhận 3 cuộc gọi từ cùng khu vực' }
    ]
  },
  {
    id: 'TK-398',
    title: 'Khách hàng thắc mắc hóa đơn KH01934',
    category: 'Hóa đơn',
    priority: 'low',
    status: 'closed',
    assignee: 'Phòng Kinh doanh',
    calls: 1,
    created: '28/03/2026',
    rating: 5,
    feedback: 'Nhân viên giải thích rất tận tình, đã hiểu rõ vấn đề sai lệch chỉ số.'
  }
];
