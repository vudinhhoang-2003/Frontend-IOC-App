import type { GisDmaZone, GisPipe, GisFactory, GisStation, GisIncident } from './types';

export const GIS_DMA_ZONES: GisDmaZone[] = [
  {
    id: 'DMA-01', name: 'DMA Hồng Gai', district: 'TP. Hạ Long',
    color: '#00c8ff', fillOpacity: 0.06,
    loss: 17.3, customers: 15200, status: 'warning',
    supplyFlow: 2480, consumptionFlow: 2050,
    coords: [
      [20.985, 107.050], [20.990, 107.075], [20.975, 107.095],
      [20.960, 107.098], [20.950, 107.088], [20.948, 107.068],
      [20.955, 107.048], [20.965, 107.040], [20.980, 107.042],
    ]
  },
  {
    id: 'DMA-02', name: 'DMA Bãi Cháy', district: 'TP. Hạ Long',
    color: '#00e676', fillOpacity: 0.06,
    loss: 11.0, customers: 11500, status: 'ok',
    supplyFlow: 1820, consumptionFlow: 1620,
    coords: [
      [20.960, 107.010], [20.965, 107.035], [20.953, 107.055],
      [20.940, 107.050], [20.930, 107.038], [20.928, 107.020],
      [20.935, 107.005], [20.948, 107.000],
    ]
  },
  {
    id: 'DMA-03', name: 'DMA Cẩm Phả', district: 'TP. Cẩm Phả',
    color: '#ff1744', fillOpacity: 0.08,
    loss: 20.0, customers: 8900, status: 'critical',
    supplyFlow: 1350, consumptionFlow: 1080,
    coords: [
      [21.025, 107.245], [21.030, 107.285], [21.018, 107.305],
      [21.000, 107.300], [20.995, 107.278], [20.998, 107.248],
      [21.010, 107.238],
    ]
  },
  {
    id: 'DMA-04', name: 'DMA Uông Bí', district: 'TP. Uông Bí',
    color: '#7c4dff', fillOpacity: 0.06,
    loss: 10.0, customers: 6100, status: 'ok',
    supplyFlow: 950, consumptionFlow: 855,
    coords: [
      [21.055, 106.745], [21.060, 106.778], [21.048, 106.800],
      [21.030, 106.798], [21.022, 106.775], [21.025, 106.748],
      [21.038, 106.738],
    ]
  },
  {
    id: 'DMA-05', name: 'DMA Móng Cái', district: 'TP. Móng Cái',
    color: '#ffca28', fillOpacity: 0.06,
    loss: 13.2, customers: 4800, status: 'ok',
    supplyFlow: 720, consumptionFlow: 625,
    coords: [
      [21.540, 107.940], [21.548, 107.970], [21.535, 107.990],
      [21.515, 107.988], [21.508, 107.962], [21.515, 107.938],
      [21.528, 107.930],
    ]
  },
  {
    id: 'DMA-06', name: 'DMA Vân Đồn', district: 'H. Vân Đồn',
    color: '#ff9800', fillOpacity: 0.06,
    loss: 15.1, customers: 2600, status: 'warning',
    supplyFlow: 410, consumptionFlow: 348,
    coords: [
      [21.065, 107.370], [21.072, 107.408], [21.058, 107.425],
      [21.038, 107.420], [21.030, 107.398], [21.035, 107.368],
      [21.050, 107.358],
    ]
  },
];

export const GIS_PIPE_NETWORK: GisPipe[] = [
  // TRANSMISSION MAINS 
  {
      id: 'PM-001', type: 'transmission', dmaId: null, diameter: 400, material: 'Ống gang cầu',
      status: 'active', pressure: 3.2, flow: 1250, label: 'Truyền dẫn HG→HB',
      coords: [[20.9595, 107.070], [20.972, 107.075], [20.985, 107.080], [21.010, 107.090], [21.020, 107.090]],
      valves: [
          { pos: [20.972, 107.075], type: 'gate', status: 'open', id: 'V-001' },
          { pos: [20.985, 107.080], type: 'butterfly', status: 'open', id: 'V-002' },
      ]
  },
  {
      id: 'PM-002', type: 'transmission', dmaId: null, diameter: 350, material: 'Ống gang cầu',
      status: 'active', pressure: 2.8, flow: 980, label: 'Truyền dẫn BC→QY',
      coords: [[20.9487, 107.043], [20.950, 107.010], [20.952, 106.970], [20.955, 106.930], [20.960, 106.850]],
      valves: [
          { pos: [20.950, 107.010], type: 'gate', status: 'open', id: 'V-003' },
          { pos: [20.955, 106.930], type: 'check', status: 'open', id: 'V-004' },
      ]
  },
  {
      id: 'PM-003', type: 'transmission', dmaId: null, diameter: 300, material: 'Ống thép',
      status: 'warning', pressure: 2.1, flow: 620, label: 'Truyền dẫn HG→CP',
      coords: [[20.9595, 107.070], [20.965, 107.100], [20.975, 107.140], [20.985, 107.180], [21.000, 107.220], [21.005, 107.274]],
      valves: [
          { pos: [20.965, 107.100], type: 'gate', status: 'open', id: 'V-005' },
          { pos: [20.985, 107.180], type: 'butterfly', status: 'closed', id: 'V-006' },
          { pos: [21.000, 107.220], type: 'gate', status: 'open', id: 'V-007' },
      ]
  },
  
  // DMA-01 NETWORK
  {
      id: 'D01-001', type: 'distribution', dmaId: 'DMA-01', diameter: 150, material: 'Ống gang',
      status: 'active', pressure: 3.0, flow: 420, label: 'Vòng DMA-01 Bắc',
      coords: [[20.985, 107.052], [20.988, 107.058], [20.983, 107.068], [20.978, 107.075], [20.972, 107.078]],
      valves: [{ pos: [20.983, 107.068], type: 'gate', status: 'open', id: 'V-D01-01' }]
  },
  {
      id: 'D01-002', type: 'distribution', dmaId: 'DMA-01', diameter: 150, material: 'Ống gang',
      status: 'active', pressure: 2.9, flow: 380, label: 'Vòng DMA-01 Nam',
      coords: [[20.960, 107.052], [20.963, 107.060], [20.965, 107.070], [20.962, 107.082], [20.957, 107.088]],
      valves: [{ pos: [20.965, 107.070], type: 'gate', status: 'open', id: 'V-D01-02' }]
  },
  {
      id: 'D01-004', type: 'distribution', dmaId: 'DMA-01', diameter: 110, material: 'HDPE',
      status: 'warning', pressure: 1.8, flow: 150, label: 'Nhánh DMA-01-B (tụt áp)',
      coords: [[20.972, 107.078], [20.970, 107.085], [20.965, 107.090], [20.960, 107.095]],
      valves: [{ pos: [20.970, 107.085], type: 'gate', status: 'open', id: 'V-D01-03' }]
  },

  // DMA-03 NETWORK
  {
      id: 'D03-001', type: 'distribution', dmaId: 'DMA-03', diameter: 150, material: 'Ống gang',
      status: 'warning', pressure: 1.5, flow: 280, label: 'Vòng DMA-03 chính (áp thấp)',
      coords: [[21.010, 107.252], [21.015, 107.260], [21.018, 107.272], [21.015, 107.285], [21.008, 107.292]],
      valves: [
          { pos: [21.015, 107.260], type: 'gate', status: 'open', id: 'V-D03-01' },
          { pos: [21.018, 107.272], type: 'butterfly', status: 'open', id: 'V-D03-02' },
      ]
  },
  {
      id: 'D03-002', type: 'distribution', dmaId: 'DMA-03', diameter: 110, material: 'HDPE',
      status: 'leaking', pressure: 1.3, flow: 160, label: 'Đoạn rò rỉ DMA-03',
      coords: [[21.008, 107.268], [21.005, 107.275], [21.003, 107.283]],
      valves: [
          { pos: [21.005, 107.275], type: 'gate', status: 'closed', id: 'V-D03-03' },
      ]
  },
];

export const GIS_FACTORIES: GisFactory[] = [
  { id: '1', name: 'Nhà máy Hồng Gai', location: 'TP. Hạ Long', lat: 20.9595, lng: 107.0700, capacity: 30000, output: 27500, manager: 'Nguyễn Văn Hùng' },
  { id: '2', name: 'Nhà máy Bãi Cháy', location: 'TP. Hạ Long', lat: 20.9487, lng: 107.0432, capacity: 20000, output: 18200, manager: 'Trần Thị Lan' },
  { id: '3', name: 'Nhà máy Cẩm Phả', location: 'TP. Cẩm Phả', lat: 21.0055, lng: 107.2740, capacity: 15000, output: 13800, manager: 'Lê Đình Mạnh' },
];

export const GIS_STATIONS: GisStation[] = [
  { id: 'ST01', name: 'Trạm Hồng Gai', factory: 'Hồng Gai', lat: 20.9595, lng: 107.0700, status: 'online', pressure: 3.2, flow: 1250, level: 78, power: 245 },
  { id: 'ST02', name: 'Trạm Bãi Cháy', factory: 'Bãi Cháy', lat: 20.9487, lng: 107.0432, status: 'online', pressure: 2.8, flow: 980, level: 65, power: 198 },
  { id: 'ST03', name: 'Trạm Cẩm Phả', factory: 'Cẩm Phả', lat: 21.0055, lng: 107.2740, status: 'warning', pressure: 1.4, flow: 620, level: 42, power: 145 },
  { id: 'ST06', name: 'Trạm Vân Đồn', factory: 'Vân Đồn', lat: 21.0500, lng: 107.4000, status: 'offline', pressure: 2.9, flow: 380, level: 0, power: 0 },
];

export const GIS_INCIDENTS: GisIncident[] = [
  { id: 'SC-001', type: 'Vỡ ống', location: 'Đường Lê Thánh Tông, Hồng Gai', severity: 'critical', status: 'processing', report: '2026-02-27 08:30', assignedTo: 'Đội 1 – Hạ Long', lat: 20.965, lng: 107.090 },
  { id: 'SC-002', type: 'Tụt áp', location: 'Khu TT Bãi Cháy', severity: 'warning', status: 'processing', report: '2026-02-27 10:15', assignedTo: 'Đội 2 – Hạ Long', lat: 20.970, lng: 107.085 },
  { id: 'SC-003', type: 'Máy bơm sự cố', location: 'Trạm Cẩm Phả', severity: 'critical', status: 'new', report: '2026-02-27 14:20', lat: 21.005, lng: 107.275 },
];
