export const REPORT_DATA = {
  'Hôm nay': {
    label: 'Hôm nay (28/02/2026)',
    dateRange: '28/02/2026',
    days: 1,
    production: { total: 181600, avgDay: 181600, vsKH: +1.2, chartLabels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'], chartData: [1250, 980, 850, 1100, 2450, 3200, 3450, 3300, 3100, 2980, 2450, 1850], doughnut: [65400, 52300, 38100, 16200, 6500, 3100] },
    quality: { passed: 92, failed: 0, total: 16, pH: 7.18, chlo: 0.48 },
    nrw: { avg: 14.2, lost: 25800, vsPrev: -0.2, target: 12 },
    incidents: { total: 1, done: 0, processing: 1, avgTime: 2.0 },
    revenue: { total: 5.45, debtRate: 0, debt: 2.1, newCustomers: 5, chartLabels: ['28/02'], chartData: [5.45], chartKH: [5.30] },
  },
  '7 ngày': {
    label: '7 ngày (22-28/02/2026)',
    dateRange: '22/02 – 28/02/2026',
    days: 7,
    production: { total: 1271200, avgDay: 181600, vsKH: +1.8, chartLabels: ['T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2'], chartData: [178200, 182500, 179100, 185300, 181800, 178900, 184800], doughnut: [458000, 365000, 245000, 105000, 65000, 33200] },
    quality: { passed: 88, failed: 1, total: 112, pH: 7.12, chlo: 0.52 },
    nrw: { avg: 14.6, lost: 26500, vsPrev: -0.1, target: 12 },
    incidents: { total: 3, done: 2, processing: 1, avgTime: 3.5 },
    revenue: { total: 15.2, debtRate: 95, debt: 2.4, newCustomers: 32, chartLabels: ['22/2', '23/2', '24/2', '25/2', '26/2', '27/2', '28/2'], chartData: [2.12, 2.18, 2.09, 2.22, 2.08, 2.21, 2.20], chartKH: [2.1, 2.15, 2.1, 2.18, 2.05, 2.17, 2.16] },
  },
  'T2/2026': {
    label: 'Tháng 2/2026',
    dateRange: '01/02 – 28/02/2026',
    days: 28,
    production: { total: 5450000, avgDay: 194600, vsKH: +2.4, chartLabels: ['T9/25', 'T10/25', 'T11/25', 'T12/25', 'T1/26', 'T2/26'], chartData: [4.8, 5.1, 4.9, 5.4, 5.2, 5.45], doughnut: [1950000, 1560000, 1020000, 480000, 310000, 130000] },
    quality: { passed: 83, failed: 1, total: 468, pH: 7.15, chlo: 0.51 },
    nrw: { avg: 14.4, lost: 27800, vsPrev: -0.3, target: 12 },
    incidents: { total: 16, done: 12, processing: 4, avgTime: 4.2 },
    revenue: { total: 59.4, debtRate: 94.8, debt: 2.45, newCustomers: 127, chartLabels: ['T9/25', 'T10/25', 'T11/25', 'T12/25', 'T1/26', 'T2/26'], chartData: [54.2, 58.5, 56.1, 62.4, 58.9, 59.4], chartKH: [52.0, 56.0, 55.5, 60.0, 58.0, 58.5] },
  },
  'Q1/2026': {
    label: 'Quý 1/2026',
    dateRange: '01/01 – 28/02/2026 (cập nhật)',
    days: 59,
    production: { total: 3686000, avgDay: 62474, vsKH: +1.9, chartLabels: ['T1/26', 'T2/26', 'T3/26 (DKT)'], chartData: [1.936, 1.750, 1.900], doughnut: [1376000, 1094000, 737000, 330000, 109000, 40000] },
    quality: { passed: 85, failed: 2, total: 354, pH: 7.10, chlo: 0.50 },
    nrw: { avg: 14.7, lost: 10900, vsPrev: -0.5, target: 12 },
    incidents: { total: 14, done: 11, processing: 3, avgTime: 4.8 },
    revenue: { total: 66.1, debtRate: 94.1, debt: 3.9, newCustomers: 254, chartLabels: ['T1/26', 'T2/26'], chartData: [31.9, 34.2], chartKH: [31.0, 33.5] },
  },
  'N2026': {
    label: 'Năm 2026',
    dateRange: '01/01 – 28/02/2026 (cập nhật)',
    days: 59,
    production: { total: 3686000, avgDay: 62474, vsKH: +1.9, chartLabels: ['T1/26', 'T2/26', 'T3-T12/26 (KH)'], chartData: [1.936, 1.750, 13.700], doughnut: [1376000, 1094000, 737000, 330000, 109000, 40000] },
    quality: { passed: 85, failed: 2, total: 354, pH: 7.10, chlo: 0.50 },
    nrw: { avg: 14.7, lost: 10900, vsPrev: -0.5, target: 12 },
    incidents: { total: 14, done: 11, processing: 3, avgTime: 4.8 },
    revenue: { total: 66.1, debtRate: 94.1, debt: 3.9, newCustomers: 254, chartLabels: ['T1/26', 'T2/26', 'T3/26 KH', 'T4/26 KH', 'T5/26 KH', 'T6/26 KH'], chartData: [31.9, 34.2, 33.5, 35.0, 36.0, 37.0], chartKH: [31.0, 33.5, 33.0, 34.5, 35.5, 36.5] },
  },
};

export const FACTORIES_MOCK = [
   { name: 'Diễn Vọng', capacity: 200000, output: 181500 },
   { name: 'Đồng Ho', capacity: 150000, output: 120500 },
   { name: 'Yên Lập', capacity: 100000, output: 85200 },
   { name: 'Lán Tháp', capacity: 50000, output: 36400 },
   { name: 'Hoành Bồ', capacity: 30000, output: 22100 },
   { name: 'Cẩm Phả', capacity: 80000, output: 65000 }
];

export const DMA_MOCK = [
   { name: 'Khu vực Trung tâm Hạ Long', supplyFlow: 25400, consumptionFlow: 21500, loss: 15.3 },
   { name: 'Khu vực Bãi Cháy', supplyFlow: 18200, consumptionFlow: 15100, loss: 17.0 },
   { name: 'Khu vực Cẩm Phả', supplyFlow: 32500, consumptionFlow: 27100, loss: 16.6 },
   { name: 'Khu vực Uông Bí', supplyFlow: 12400, consumptionFlow: 10800, loss: 12.9 }
];

export type ReportPeriodKey = keyof typeof REPORT_DATA;
export type ReportTab = 'production' | 'quality' | 'nrw' | 'incidents' | 'revenue';
