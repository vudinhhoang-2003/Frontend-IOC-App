import type { PumpProfile, PumpStation, EVNPrice } from './types';

export const EVN_PRICES: EVNPrice[] = [
  { name: 'Giờ Bình thường', range: '04:00–09:30, 11:30–17:00, 20:00–22:00', price: '1.738đ', color: 'var(--cyan)' },
  { name: 'Giờ Cao điểm', range: '09:30–11:30, 17:00–20:00', price: '3.171đ', color: 'var(--red)' },
  { name: 'Giờ Thấp điểm', range: '22:00–04:00', price: '1.133đ', color: 'var(--green)' }
];

export const PUMP_STATIONS: PumpStation[] = [
  { id: 'ST01', name: 'Trạm Hồng Gai', factory: 'Hồng Gai', type: 'pump', status: 'online' },
  { id: 'ST02', name: 'Trạm Bãi Cháy', factory: 'Bãi Cháy', type: 'pump', status: 'online' },
  { id: 'ST03', name: 'Trạm Cẩm Phả', factory: 'Cẩm Phả', type: 'pump', status: 'warning' },
  { id: 'ST04', name: 'Trạm Uông Bí', factory: 'Uông Bí', type: 'pump', status: 'online' },
  { id: 'ST05', name: 'Trạm Móng Cái', factory: 'Móng Cái', type: 'pump', status: 'online' },
];

export const INITIAL_PROFILES: PumpProfile[] = [
  {
    id: 'PP-01',
    name: 'Ngày thường',
    description: 'Lịch bơm tối ưu giá điện EVN cho các ngày trong tuần (Thứ 2 – Thứ 6). Ưu tiên tối đa giờ thấp điểm.',
    icon: 'weekday',
    color: '#00c8ff',
    isActive: true,
    appliesTo: 'weekday',
    createdAt: '01/01/2026',
    updatedAt: '20/02/2026',
    schedules: {
      'ST01': [[0.5, 3.5], [22.1, 1.4]],
      'ST02': [[0.0, 4.0], [22.0, 2.0]],
      'ST03': [[1.0, 3.0], [22.5, 1.5]],
      'ST04': [[0.2, 3.8], [22.2, 1.8]],
      'ST05': [[0.0, 3.5], [23.0, 1.0]],
    }
  },
  {
    id: 'PP-02',
    name: 'Cuối tuần',
    description: 'Tăng công suất buổi sáng và chiều tối cho nhu cầu sinh hoạt cao vào thứ 7, chủ nhật.',
    icon: 'weekend',
    color: '#7c3aed',
    isActive: false,
    appliesTo: 'weekend',
    createdAt: '01/01/2026',
    updatedAt: '15/02/2026',
    schedules: {
      'ST01': [[0.0, 4.5], [6.0, 1.5], [22.0, 1.5]],
      'ST02': [[0.0, 4.0], [6.0, 1.0], [22.0, 2.0]],
      'ST03': [[1.0, 3.5], [6.0, 1.0], [22.5, 1.5]],
      'ST04': [[0.0, 4.0], [22.0, 2.0]],
      'ST05': [[0.0, 3.5], [6.5, 1.0], [23.0, 1.0]],
    }
  },
  {
    id: 'PP-03',
    name: 'Ngày lễ / Sự kiện',
    description: 'Lịch bổ sung cho ngày nghỉ lễ và sự kiện lớn. Tăng dự phòng áp lực tại giờ bình thường.',
    icon: 'holiday',
    color: '#ffca28',
    isActive: false,
    appliesTo: 'holiday',
    createdAt: '10/01/2026',
    updatedAt: '10/01/2026',
    schedules: {
      'ST01': [[0.0, 4.5], [6.0, 2.0], [11.5, 1.0], [22.0, 1.5]],
      'ST02': [[0.0, 4.0], [6.0, 1.5], [22.0, 2.0]],
      'ST03': [[1.0, 3.5], [6.0, 1.5], [22.5, 1.5]],
      'ST04': [[0.0, 4.5], [6.5, 1.0], [22.0, 2.0]],
      'ST05': [[0.0, 4.0], [6.0, 1.0], [22.5, 1.5]],
    }
  },
  {
    id: 'PP-04',
    name: 'Tết Nguyên Đán',
    description: 'Chế độ bơm tăng cường tối đa cho dịp Tết. Ưu tiên an toàn cấp nước liên tục, tăng áp lực dự phòng.',
    icon: 'tet',
    color: '#ff5252',
    isActive: false,
    appliesTo: 'custom',
    createdAt: '15/01/2026',
    updatedAt: '15/01/2026',
    schedules: {
      'ST01': [[0.0, 5.0], [6.0, 2.0], [11.0, 1.5], [20.0, 2.5]],
      'ST02': [[0.0, 4.5], [6.0, 2.0], [20.0, 2.0]],
      'ST03': [[0.5, 4.0], [6.0, 2.0], [11.5, 1.0], [21.0, 2.0]],
      'ST04': [[0.0, 5.0], [6.5, 1.5], [21.5, 1.5]],
      'ST05': [[0.0, 4.5], [6.0, 1.5], [22.0, 1.5]],
    }
  },
];

export const AI_OPTIMIZED_DEFAULTS: Record<string, [number, number][]>= {
  'ST01': [[0.5, 3.5], [22.1, 1.4]],
  'ST02': [[0.0, 4.0], [22.0, 2.0]],
  'ST03': [[1.0, 3.0], [22.5, 1.5]],
  'ST04': [[0.2, 3.8], [22.2, 1.8]],
  'ST05': [[0.0, 3.5], [23.0, 1.0]],
};
