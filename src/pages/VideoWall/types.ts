export type LayoutType = '1p4' | '2x2' | '3x2' | '1p3';
export type ScenarioType = 'overview' | 'security' | 'scada' | 'water';

export interface VwLayout {
  id: LayoutType;
  label: string;
  cols: number;
  rows: number;
  css: React.CSSProperties;
  firstSpan: React.CSSProperties;
}

export interface VwScenario {
  id: ScenarioType;
  title: string;
  icon: string;
  desc: string;
}

export type BlockType = 'map' | 'scada_iframe' | 'camera_rand' | 'camera_gate' | 'camera_perimeter' | 'camera_chemical' | 'camera_pump' | 'camera_lab' | 'kpi' | 'scada_kpi' | 'scada_kpi_2' | 'water_quality' | 'incidents' | 'scada_chart' | 'kpi_nrw' | 'empty';

export interface VwBlock {
  type: BlockType;
  title: string;
}
