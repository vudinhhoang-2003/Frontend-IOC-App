import type { Camera, NVR, LocationTypeInfo } from './types';
import gateImg from './assets/cctv_gate.png';
import pumpingImg from './assets/cctv_pumping.png';
import reservoirImg from './assets/cctv_reservoir.png';
import controlImg from './assets/cctv_control.png';

export const CAM_IMAGES: Record<string, string> = {
  gate: gateImg,
  pumping: pumpingImg,
  reservoir: reservoirImg,
  control: controlImg,
};

export const CAM_LOCATION_TYPES: Record<string, LocationTypeInfo> = {
  'Cổng & Bảo vệ': { 
    name: 'Cổng & Bảo vệ',
    positions: ['Cổng vào', 'Cổng ra', 'Sân trước', 'Bảo vệ'], 
    icon: 'Gate', 
    color: '#00c8ff' 
  },
  'Khu xử lý & Bơm': { 
    name: 'Khu xử lý & Bơm',
    positions: ['Bơm chính', 'Khu vực xử lý', 'Xưởng bơm'], 
    icon: 'Zap', 
    color: '#00e676' 
  },
  'Bể chứa & Hồ lắng': { 
    name: 'Bể chứa & Hồ lắng',
    positions: ['Bể nước', 'Bể chứa', 'Hồ lắng'], 
    icon: 'Droplet', 
    color: '#0055dd' 
  },
  'Phòng điều khiển': { 
    name: 'Phòng điều khiển',
    positions: ['Phòng điều khiển', 'Phòng kỹ thuật', 'Hành lang'], 
    icon: 'Monitor', 
    color: '#7c4dff' 
  },
  'Khu hóa chất': { 
    name: 'Khu hóa chất',
    positions: ['Khu vực hóa chất', 'Kho hóa chất'], 
    icon: 'FlaskConical', 
    color: '#ffca28' 
  },
  'Vành đai & An ninh': { 
    name: 'Vành đai & An ninh',
    positions: ['Tường rào', 'Cầu thang'], 
    icon: 'Shield', 
    color: '#ff5722' 
  },
};

export const SUB_LOCATIONS: Record<string, string[]> = {
  'Nhà máy Hồng Gai': ['Khu A – Xử lý thô', 'Khu B – Lọc', 'Khu C – Khử trùng', 'Khu D – Bể chứa', 'Cổng chính', 'Cổng phụ', 'Phòng điều hành'],
  'Nhà máy Bãi Cháy': ['Khu A – Bể lắng', 'Khu B – Lọc cát', 'Khu C – Tăng áp', 'Khu D – Hóa chất', 'Cổng chính', 'Khu kỹ thuật'],
  'Nhà máy Cẩm Phả': ['Nhà bơm 1', 'Nhà bơm 2', 'Bể điều hòa', 'Khu lọc', 'Cổng vào', 'Sân ngoài'],
  'Nhà máy Uông Bí': ['Tổ hợp bơm cao áp', 'Bể chứa nước sạch', 'Phòng SCADA', 'Khu hóa chất'],
  'Nhà máy Móng Cái': ['Cổng chính', 'Nhà bơm', 'Bể xử lý', 'Khu vực hóa chất', 'Phòng kỹ thuật'],
  'Trạm Vân Đồn': ['Cổng vào', 'Nhà bơm chính', 'Bể chứa', 'Khu lọc'],
  'Trạm bơm tăng áp': ['Nhà bơm chính', 'Khu van điều áp', 'Vành đai ngoài'],
  'Khu vực trọng điểm': ['Cổng trung tâm SCC', 'Vành đai phía Bắc', 'Vành đai phía Nam'],
};

export const SITES = [
  { id: 'Nhà máy Hồng Gai', name: 'Nhà máy Hồng Gai', short: 'HG', count: 28 },
  { id: 'Nhà máy Bãi Cháy', name: 'Nhà máy Bãi Cháy', short: 'BC', count: 26 },
  { id: 'Nhà máy Cẩm Phả', name: 'Nhà máy Cẩm Phả', short: 'CP', count: 22 },
  { id: 'Nhà máy Uông Bí', name: 'Nhà máy Uông Bí', short: 'UB', count: 18 },
  { id: 'Nhà máy Móng Cái', name: 'Nhà máy Móng Cái', short: 'MC', count: 10 },
  { id: 'Trạm Vân Đồn', name: 'Trạm Vân Đồn', short: 'VD', count: 8 },
  { id: 'Trạm bơm tăng áp', name: 'Trạm bơm tăng áp', short: 'TB', count: 12 },
  { id: 'Khu vực trọng điểm', name: 'Khu vực trọng điểm', short: 'KV', count: 6 },
];

const TYPES: Camera['type'][] = ['PTZ Dome', 'Fixed Bullet', 'Fixed Dome', 'PTZ Speed'];
const RESOLUTIONS = ['4K (8MP)', '4K (8MP)', '1080P (2MP)', '2K (4MP)'];
const STATUSES: Camera['status'][] = ['online', 'online', 'online', 'online', 'online', 'warning', 'offline'];
const ALL_POSITIONS = Object.values(CAM_LOCATION_TYPES).flatMap(lt => lt.positions);

const generateMockData = () => {
  const cameras: Camera[] = [];
  const nvrs: NVR[] = [
    { id: 'NVR-01', name: 'NVR-01 — Hồng Gai + Bãi Cháy', channels: 32, hdd: 16, hdUsed: 12.4, bandwidth: 198, cams: [] },
    { id: 'NVR-02', name: 'NVR-02 — Cẩm Phả + Uông Bí', channels: 32, hdd: 16, hdUsed: 11.1, bandwidth: 176, cams: [] },
    { id: 'NVR-03', name: 'NVR-03 — Trạm bơm + Khu phụ', channels: 16, hdd: 8, hdUsed: 5.8, bandwidth: 142, cams: [] },
    { id: 'NVR-04', name: 'NVR-04 — Dự phòng / Đặc biệt', channels: 32, hdd: 16, hdUsed: 9.7, bandwidth: 184, cams: [] },
  ];

  let camIdx = 1;
  SITES.forEach((loc, li) => {
    const nvrIdx = li < 2 ? 0 : li < 4 ? 1 : 2;
    const subLocs = SUB_LOCATIONS[loc.name] || ['Khu vực chung'];
    
    for (let i = 0; i < loc.count; i++) {
      const pos = ALL_POSITIONS[i % ALL_POSITIONS.length];
      const locTypeEntry = Object.entries(CAM_LOCATION_TYPES).find(([, lt]) => lt.positions.includes(pos));
      const locType = locTypeEntry ? locTypeEntry[0] : 'Vành đai & An ninh';
      const statusWeight = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      
      // Determine image key based on position
      let imgKey = 'gate';
      if (pos.includes('Bơm') || pos.includes('Xưởng')) imgKey = 'pumping';
      else if (pos.includes('Bể') || pos.includes('Hồ')) imgKey = 'reservoir';
      else if (pos.includes('Phòng') || pos.includes('Hành lang')) imgKey = 'control';

      const cam: Camera = {
        id: `CAM-${String(camIdx).padStart(3, '0')}`,
        name: `${loc.short}-${String(i + 1).padStart(2, '0')}`,
        site: loc.name,
        siteShort: loc.short,
        position: pos,
        locationType: locType,
        subLocation: subLocs[i % subLocs.length],
        type: TYPES[i % TYPES.length],
        resolution: RESOLUTIONS[i % RESOLUTIONS.length],
        fps: [15, 20, 25, 30][i % 4],
        status: statusWeight,
        nvr: nvrs[nvrIdx].id,
        channel: i + 1,
        uptime: statusWeight === 'offline' ? 0 : Math.floor(Math.random() * 1440 * 30),
        lastEvent: statusWeight === 'online' ? undefined : 'Mất tín hiệu video',
        bitrate: statusWeight === 'offline' ? '0' : (1.5 + Math.random() * 4).toFixed(1),
        ip: `192.168.${10 + li}.${20 + i}`,
        imageKey: imgKey,
      };
      
      nvrs[nvrIdx].cams.push(cam.id);
      cameras.push(cam);
      camIdx++;
    }
  });

  return { cameras, nvrs };
};

export const { cameras: MOCK_CAMERAS, nvrs: MOCK_NVRS } = generateMockData();
export const TOTAL_BANDWIDTH = 700;
export const STORAGE_RETENTION_DAYS = 15;
