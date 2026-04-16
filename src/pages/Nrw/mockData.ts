import type { DMAZone, MNFData, LeakAlert, InspectionOrder } from './types';

export const DMA_ZONES: DMAZone[] = [
  { id: 'DMA-01', name: 'DMA Hồng Gai', district: 'P. Hồng Gai', supplyFlow: 12500, consumptionFlow: 10250, loss: 18.0, customers: 4500, status: 'critical' },
  { id: 'DMA-02', name: 'DMA Bãi Cháy', district: 'P. Bãi Cháy', supplyFlow: 21000, consumptionFlow: 18480, loss: 12.0, customers: 8200, status: 'ok' },
  { id: 'DMA-03', name: 'DMA Cẩm Phả', district: 'P. Cẩm Trung', supplyFlow: 14200, consumptionFlow: 11076, loss: 22.0, customers: 5120, status: 'critical' },
  { id: 'DMA-04', name: 'DMA Uông Bí', district: 'P. Quang Trung', supplyFlow: 8900, consumptionFlow: 7565, loss: 15.0, customers: 3100, status: 'warning' },
  { id: 'DMA-05', name: 'DMA Cẩm Phả Đông', district: 'P. Cẩm Thịnh', supplyFlow: 6500, consumptionFlow: 5915, loss: 9.0, customers: 2450, status: 'ok' },
  { id: 'DMA-06', name: 'DMA Vân Đồn', district: 'TT. Cái Rồng', supplyFlow: 4200, consumptionFlow: 3612, loss: 14.0, customers: 1800, status: 'warning' },
];

export const MNF_DATA: MNFData[] = [
  {
    dmaId: 'DMA-01',
    mnfHour: '03:00',
    mnfFlow: 4520,
    leakEstimate: 1470,
    leakPct: 32.5,
    samples: [
      { hour: '18:00', supply: 8200, consume: 7800 },
      { hour: '20:00', supply: 7500, consume: 7100 },
      { hour: '22:00', supply: 6200, consume: 5600 },
      { hour: '00:00', supply: 5100, consume: 4200 },
      { hour: '02:00', supply: 4600, consume: 3200 },
      { hour: '03:00', supply: 4520, consume: 3050 },
      { hour: '04:00', supply: 4700, consume: 3300 },
      { hour: '06:00', supply: 6500, consume: 5800 },
    ]
  },
  {
    dmaId: 'DMA-03',
    mnfHour: '02:30',
    mnfFlow: 890,
    leakEstimate: 730,
    leakPct: 82.0,
    samples: [
      { hour: '18:00', supply: 2200, consume: 2050 },
      { hour: '20:00', supply: 1950, consume: 1800 },
      { hour: '22:00', supply: 1600, consume: 1400 },
      { hour: '00:00', supply: 1200, consume: 850 },
      { hour: '02:00', supply: 920, consume: 450 },
      { hour: '03:00', supply: 890, consume: 410 },
      { hour: '04:00', supply: 950, consume: 550 },
      { hour: '06:00', supply: 1500, consume: 1350 },
    ]
  }
];

export const LEAK_ALERTS: LeakAlert[] = [
  { id: 'AL-001', dmaId: 'DMA-01', zone: 'DMA Hồng Gai', mnf: 1850, expected: 380, excess: 1470, risk: 'Cao', suspect: 'Ống cũ P. Hồng Gai – Bạch Đằng', action: 'Rà soát ống phi 200 khu vực phường Hồng Gai', detected: '27/02/2026 04:00' },
  { id: 'AL-002', dmaId: 'DMA-03', zone: 'DMA Cẩm Phả', mnf: 970, expected: 240, excess: 730, risk: 'Rất cao', suspect: 'Tuyến ống Trần Phú – Cẩm Phả', action: 'Kiểm tra tuyến ống cấp 2 đường Trần Phú', detected: '27/02/2026 04:00' },
  { id: 'AL-003', dmaId: 'DMA-06', zone: 'DMA Vân Đồn', mnf: 180, expected: 80, excess: 100, risk: 'Trung bình', suspect: 'Ống dịch vụ khu dân cư mới', action: 'Kiểm tra đồng hồ khách hàng và van phụ', detected: '26/02/2026 03:30' },
];

export const INSPECTION_HISTORY: InspectionOrder[] = [
  { id: 'LKT-260227-001', date: '27/02/2026 05:30', dmaName: 'DMA Hồng Gai', suspect: 'Ống C1 – ngõ 125, P. Hồng Gai', team: 'Đội NRW chuyên biệt', action: 'Phát lệnh kiểm tra rò rỉ vùng MNF cao', recovered: 0, status: 'processing', responsibleId: 'NV-007', responsibleName: 'Bùi Văn Khoa' },
  { id: 'LKT-260225-008', date: '25/02/2026 08:00', dmaName: 'DMA Cẩm Phả', suspect: 'Tuyến Trần Phú – Cẩm Phả', team: 'Đội kỹ thuật 3', action: 'Đo lưu lượng đêm – xác định điểm rò', recovered: 0, status: 'processing', responsibleId: 'NV-115', responsibleName: 'Lê Thị Lan' },
  { id: 'LKT-260222-015', date: '22/02/2026 09:15', dmaName: 'DMA Bãi Cháy', suspect: 'Van V-502, đường Hạ Long', team: 'Đội kỹ thuật 2', action: 'Thay thế gioăng cao su van D150', recovered: 28.4, status: 'done', responsibleId: 'NV-108', responsibleName: 'Trần Văn Tùng' },
  { id: 'LKT-260218-021', date: '18/02/2026 07:45', dmaName: 'DMA Vân Đồn', suspect: 'Ống dịch vụ khu Cái Rồng B', team: 'Đội NRW chuyên biệt', action: 'Kiểm tra và thay đồng hồ rò', recovered: 12.0, status: 'done', responsibleId: 'NV-130', responsibleName: 'Vũ Anh Trường' },
  { id: 'LKT-260215-081', date: '15/02/2026 06:20', dmaName: 'DMA Hồng Gai', suspect: 'Ống C1 - ngõ 125', team: 'Đội kỹ thuật 1', action: 'Hàn đắp mặt bích C1', recovered: 42.5, status: 'done', responsibleId: 'NV-007', responsibleName: 'Bùi Văn Khoa' },
  { id: 'LKT-260212-044', date: '12/02/2026 14:00', dmaName: 'DMA Uông Bí', suspect: 'Tuyến đường Quang Trung', team: 'Đội kỹ thuật 4', action: 'Cô lập đoạn ống và bơm grout', recovered: 89.3, status: 'done', responsibleId: 'NV-122', responsibleName: 'Phạm Minh Dũng' },
  { id: 'LKT-260210-102', date: '10/02/2026 10:30', dmaName: 'DMA Bãi Cháy', suspect: 'Van V-102', team: 'Đội kỹ thuật 2', action: 'Thay thế gioăng cao su', recovered: 18.2, status: 'done', responsibleId: 'NV-108', responsibleName: 'Trần Văn Tùng' },
  { id: 'LKT-260207-033', date: '07/02/2026 08:15', dmaName: 'DMA Cẩm Phả Đông', suspect: 'Ống D300 – km 4 QL18', team: 'Đội kỹ thuật 3', action: 'Hàn xì dưới áp', recovered: 195.0, status: 'done', responsibleId: 'NV-135', responsibleName: 'Đặng Mai Lan' },
];
