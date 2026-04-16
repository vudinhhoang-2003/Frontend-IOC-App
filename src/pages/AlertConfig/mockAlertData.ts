import type { AlertRule } from './types';

export const INITIAL_ALERT_RULES: AlertRule[] = [
  { id: 1, name: 'Áp lực thấp Hồng Gai', station: 'ST01', param: 'Áp lực', threshold: '< 2.0 bar', severity: 'critical', active: true },
  { id: 2, name: 'Mực nước thấp Bãi Cháy', station: 'ST02', param: 'Mực nước', threshold: '< 30%', severity: 'critical', active: true },
  { id: 3, name: 'Lưu lượng bất thường Cẩm Phả', station: 'ST03', param: 'Lưu lượng', threshold: '> 1500 m3/h', severity: 'warning', active: false },
  { id: 4, name: 'Mất kết nối SCADA', station: 'Tất cả', param: 'Kết nối', threshold: '> 5 phút', severity: 'warning', active: true },
  { id: 5, name: 'Hiệu suất bơm thấp', station: 'ST01, ST02', param: 'Công suất', threshold: '< 80% định mức', severity: 'info', active: true }
];
