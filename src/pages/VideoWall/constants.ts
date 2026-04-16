import type { VwLayout, VwScenario } from './types';

export const VW_LAYOUTS: VwLayout[] = [
  { 
    id: '1p4', 
    label: '1 Chính + 4 Phụ', 
    cols: 3, 
    rows: 2, 
    css: { gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }, 
    firstSpan: { gridRow: '1 / span 2' } 
  },
  { 
    id: '2x2', 
    label: 'Lưới 2×2', 
    cols: 2, 
    rows: 2, 
    css: { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }, 
    firstSpan: {} 
  },
  { 
    id: '3x2', 
    label: 'Lưới 3×2', 
    cols: 3, 
    rows: 2, 
    css: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' }, 
    firstSpan: {} 
  },
  { 
    id: '1p3', 
    label: '1 Chính + 3 Phụ', 
    cols: 2, 
    rows: 3, 
    css: { gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }, 
    firstSpan: { gridRow: '1 / span 3' } 
  },
];

export const VW_SCENARIOS: VwScenario[] = [
  { 
    id: 'overview', 
    title: 'Tổng quan Điều hành', 
    icon: '🌐', 
    desc: 'Bản đồ cấp nước + Biểu đồ SCADA + Camera tổng đài + KPI Doanh thu' 
  },
  { 
    id: 'security', 
    title: 'An ninh & Cảnh báo', 
    icon: '🛡️', 
    desc: 'Độc quyền Camera CCTV (Cổng + Bơm + Hóa chất) + Danh sách Cảnh báo' 
  },
  { 
    id: 'scada', 
    title: 'Vận hành SCADA', 
    icon: '⚙️', 
    desc: 'Lưu lượng + Áp lực các nhà máy chính + Bản đồ áp lực' 
  },
  { 
    id: 'water', 
    title: 'Chất lượng & NRW', 
    icon: '💧', 
    desc: 'Biểu đồ Clo dư, Độ đục + Thất thoát + Camera phòng lab' 
  }
];

export const CAM_IMAGES = {
  gate_online: 'https://images.unsplash.com/photo-1557597774-9d2739f85a94?auto=format&fit=crop&q=80&w=800',
  perimeter: 'https://images.unsplash.com/photo-1590486803833-ffc9171e63a7?auto=format&fit=crop&q=80&w=800',
  chemical: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
  pump_room: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800',
  reservoir: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800',
  control_room: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
};
