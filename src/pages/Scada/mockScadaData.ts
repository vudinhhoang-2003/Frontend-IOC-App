import type { ScadaStation, CommandLog } from './types';

export const MOCK_STATIONS: ScadaStation[] = [
  { 
    id: 'ST01', 
    name: 'Trạm Hồng Gai', 
    factory: 'Hồng Gai', 
    type: 'pump', 
    pressure: 3.2, 
    pressureUnit: 'bar', 
    flow: 1250, 
    level: 78, 
    power: 245, 
    status: 'online', 
    lat: 20.9595, 
    lng: 107.0700, 
    devices: [
      { id: 'P01', name: 'Bơm số 1', type: 'pump', status: 'running' }, 
      { id: 'P02', name: 'Bơm số 2', type: 'pump', status: 'standby' }, 
      { id: 'V01', name: 'Van tổng', type: 'valve', status: 'open' }
    ] 
  },
  { 
    id: 'ST02', 
    name: 'Trạm Bãi Cháy', 
    factory: 'Bãi Cháy', 
    type: 'pump', 
    pressure: 2.8, 
    pressureUnit: 'bar', 
    flow: 980, 
    level: 65, 
    power: 198, 
    status: 'online', 
    lat: 20.9487, 
    lng: 107.0432, 
    devices: [
      { id: 'P01', name: 'Bơm chính 1', type: 'pump', status: 'running' }, 
      { id: 'V01', name: 'Van đầu nén', type: 'valve', status: 'open' }
    ] 
  },
  { 
    id: 'ST03', 
    name: 'Trạm Cẩm Phả', 
    factory: 'Cẩm Phả', 
    type: 'pump', 
    pressure: 1.4, 
    pressureUnit: 'bar', 
    flow: 620, 
    level: 42, 
    power: 145, 
    status: 'warning', 
    lat: 21.0055, 
    lng: 107.2740, 
    devices: [
      { id: 'P01', name: 'Bơm áp 1', type: 'pump', status: 'running' }, 
      { id: 'P02', name: 'Bơm áp 2', type: 'pump', status: 'fault' }
    ] 
  },
  { 
    id: 'ST04', 
    name: 'Trạm Uông Bí', 
    factory: 'Uông Bí', 
    type: 'pump', 
    pressure: 3.0, 
    pressureUnit: 'bar', 
    flow: 875, 
    level: 71, 
    power: 182, 
    status: 'online', 
    lat: 21.0338, 
    lng: 106.7733, 
    devices: [
      { id: 'P01', name: 'Bơm tăng áp', type: 'pump', status: 'running' }
    ] 
  },
  { 
    id: 'ST05', 
    name: 'Trạm Móng Cái', 
    factory: 'Móng Cái', 
    type: 'pump', 
    pressure: 2.6, 
    pressureUnit: 'bar', 
    flow: 550, 
    level: 58, 
    power: 120, 
    status: 'online', 
    lat: 21.5240, 
    lng: 107.9640, 
    devices: [
      { id: 'P01', name: 'Bơm Grundfos', type: 'pump', status: 'running' }
    ] 
  },
  { 
    id: 'ST06', 
    name: 'Trạm Vân Đồn', 
    factory: 'Vân Đồn', 
    type: 'pump', 
    pressure: 2.9, 
    pressureUnit: 'bar', 
    flow: 380, 
    level: 0, 
    power: 0, 
    status: 'offline', 
    lat: 21.0500, 
    lng: 107.4000, 
    devices: [
      { id: 'P01', name: 'Bơm dự phòng', type: 'pump', status: 'inactive' }
    ] 
  },
  { 
    id: 'ST07', 
    name: 'Trạm Hoành Bồ', 
    factory: 'Hồng Gai', 
    type: 'pressure', 
    pressure: 3.1, 
    pressureUnit: 'bar', 
    flow: 420, 
    level: 80, 
    power: 89, 
    status: 'online', 
    lat: 21.0200, 
    lng: 107.0900, 
    devices: [
      { id: 'V01', name: 'Van giảm áp', type: 'valve', status: 'open' }
    ] 
  },
  { 
    id: 'ST08', 
    name: 'Trạm Quảng Yên', 
    factory: 'Bãi Cháy', 
    type: 'pressure', 
    pressure: 2.7, 
    pressureUnit: 'bar', 
    flow: 310, 
    level: 55, 
    power: 67, 
    status: 'online', 
    lat: 20.9500, 
    lng: 106.8200, 
    devices: [
      { id: 'V01', name: 'Van điều tiết', type: 'valve', status: 'open' }
    ] 
  },
];

export const MOCK_COMMAND_LOGS: CommandLog[] = [
  { id: 1, time: "2026-02-26 08:15:22", station: "ST01", device: "Bơm tăng áp 1", action: "Bật", user: "Trần Đình Dũng", status: "success" },
  { id: 2, time: "2026-02-26 14:30:05", station: "ST02", device: "Van xả áp 1", action: "Mở", user: "Admin", status: "success" },
  { id: 3, time: "2026-02-27 09:05:12", station: "ST03", device: "Bơm cấp 2", action: "Dừng", user: "NV Hệ thống", status: "fail" },
  { id: 4, time: "2026-02-27 09:10:45", station: "ST03", device: "Bơm cấp 2", action: "Dừng", user: "NV Hệ thống", status: "success" },
  { id: 5, time: "2026-02-28 07:00:00", station: "ST01", device: "Van tuyến 1", action: "Đóng", user: "Trần Đình Dũng", status: "success" },
  { id: 6, time: "2026-02-28 18:45:30", station: "ST05", device: "Máy phát điện", action: "Bật", user: "Auto System", status: "success" },
  { id: 7, time: "2026-03-01 06:15:10", station: "ST01", device: "Bơm tăng áp 2", action: "Bật", user: "Admin", status: "success" },
  { id: 8, time: "2026-03-01 08:30:22", station: "ST04", device: "Máy thổi khí", action: "Dừng", user: "Trần Đình Dũng", status: "success" },
  { id: 9, time: "2026-03-01 10:15:05", station: "ST02", device: "Van xả áp 1", action: "Đóng", user: "NV Hệ thống", status: "success" },
  { id: 10, time: "2026-03-01 11:42:15", station: "ST01", device: "Bơm tăng áp 1", action: "Dừng", user: "Admin", status: "success" },
];
