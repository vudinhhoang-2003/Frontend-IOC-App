export type Severity = 'info' | 'warning' | 'critical';

export interface AlertRule {
  id: number;
  name: string;
  station: string;
  param: 'Áp lực' | 'Mực nước' | 'Lưu lượng' | 'Kết nối' | 'Công suất';
  threshold: string;
  severity: Severity;
  active: boolean;
}

export interface AlertKPI {
  label: string;
  value: string | number;
  sub: string;
  subType?: 'trend-up' | 'trend-down' | 'neutral';
  unit?: string;
}
