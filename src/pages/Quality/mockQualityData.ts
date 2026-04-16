import type { WaterQualityRecord, QualityLimits, FactoryBasic, EmployeeBasic } from './types';

export const QUALITY_LIMITS: QualityLimits = { 
  pH: { min: 6.5, max: 8.5 }, 
  chlorine: { min: 0.1, max: 0.5 }, 
  turbidity: { max: 2.0 }, 
  TDS: { max: 500 }, 
  arsenic: { max: 0.01 }, 
  coliform: { max: 0 } 
};

export const MOCK_WATER_QUALITY: WaterQualityRecord[] = [
  { id: 1, factory: 'Hồng Gai', pH: 7.2, chlorine: 0.32, turbidity: 1.2, TDS: 148, arsenic: 0.002, coliform: 0, time: '22:00 27/02', status: 'ok' },
  { id: 2, factory: 'Bãi Cháy', pH: 7.0, chlorine: 0.28, turbidity: 1.8, TDS: 162, arsenic: 0.001, coliform: 0, time: '22:00 27/02', status: 'ok' },
  { id: 3, factory: 'Cẩm Phả', pH: 7.4, chlorine: 0.61, turbidity: 2.1, TDS: 175, arsenic: 0.003, coliform: 0, time: '21:30 27/02', status: 'warning' },
  { id: 4, factory: 'Uông Bí', pH: 7.1, chlorine: 0.30, turbidity: 0.9, TDS: 140, arsenic: 0.001, coliform: 0, time: '21:45 27/02', status: 'ok' },
  { id: 5, factory: 'Móng Cái', pH: 7.3, chlorine: 0.25, turbidity: 1.5, TDS: 158, arsenic: 0.002, coliform: 0, time: '21:00 27/02', status: 'ok' },
  { id: 6, factory: 'Vân Đồn', pH: 6.9, chlorine: 0.35, turbidity: 1.1, TDS: 135, arsenic: 0.001, coliform: 0, time: '20:30 27/02', status: 'ok' },
  { id: 7, factory: 'Nhà máy Tiên Yên', pH: 7.2, chlorine: 0.31, turbidity: 1.3, TDS: 144, arsenic: 0.002, coliform: 0, time: '20:00 27/02', status: 'ok' },
  { id: 8, factory: 'Trạm bơm Hải Hà', pH: 7.0, chlorine: 0.29, turbidity: 1.6, TDS: 155, arsenic: 0.001, coliform: 0, time: '19:30 27/02', status: 'ok' },
  { id: 9, factory: 'Nhà máy Đầm Hà', pH: 6.2, chlorine: 0.05, turbidity: 3.5, TDS: 210, arsenic: 0.004, coliform: 2, time: '19:00 27/02', status: 'alert' },
];

export const MOCK_FACTORIES: FactoryBasic[] = [
  { id: 1, name: 'Nhà máy Hồng Gai' },
  { id: 2, name: 'Nhà máy Bãi Cháy' },
  { id: 3, name: 'Nhà máy Cẩm Phả' },
  { id: 4, name: 'Nhà máy Uông Bí' },
  { id: 5, name: 'Nhà máy Móng Cái' },
  { id: 6, name: 'Trạm Vân Đồn' },
  { id: 7, name: 'Nhà máy Tiên Yên' },
  { id: 8, name: 'Trạm bơm Hải Hà' },
  { id: 9, name: 'Nhà máy Đầm Hà' },
];

export const MOCK_EMPLOYEES: EmployeeBasic[] = [
  { id: 'NV-001', name: 'Trần Đình Dũng' },
  { id: 'NV-002', name: 'Nguyễn Thị Phương' },
  { id: 'NV-003', name: 'Lê Văn Sơn' },
  { id: 'NV-004', name: 'Phạm Thị Hà' },
  { id: 'NV-005', name: 'Hoàng Minh Tuấn' },
  { id: 'NV-006', name: 'Đỗ Thị Linh' },
  { id: 'NV-007', name: 'Bùi Văn Khoa' },
  { id: 'NV-008', name: 'Vũ Thị Thanh' },
];
