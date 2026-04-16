export interface Limit {
  min: number;
  max: number;
  unit: string;
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

export interface SampleResult {
  pH: number;
  turbidity: number;
  chlorine: number;
  coliform: number;
  arsenic: number;
  nitrate: number;
  conductivity: number;
  hardness: number;
  [key: string]: number;
}

export interface Sample {
  id: string;
  siteId: string;
  siteName: string;
  time: string;
  collector: string;
  status: 'ok' | 'alert' | 'pending';
  results: SampleResult | null;
}

export interface Calibration {
  id: string;
  equipment: string;
  lastDate: string;
  nextDate: string;
  agency: string;
  status: 'ok' | 'warning' | 'overdue';
  cert: string;
}

export interface Trends {
  dates: string[];
  turbidity: number[];
  chlorine: number[];
  pH: number[];
}

export interface AIRecommendation {
  level: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  action: string;
  input: string;
  dosing: string;
  predictedOutput: string;
  savings: string;
  date: string;
  site: string;
}

export interface InspectionHistory {
  id: string;
  plant: string;
  agency: string;
  date: string;
  result: 'pass' | 'fail';
  numSamples: number;
  numFail: number;
  report: string;
  note: string;
}

export interface UpcomingInspection {
  id: string;
  plant: string;
  agency: string;
  plannedDate: string;
  period: string;
  note: string;
}

export interface WaterInspections {
  history: InspectionHistory[];
  upcoming: UpcomingInspection[];
}

export interface LimsData {
  limits: Record<string, Limit>;
  sites: Site[];
  samples: Sample[];
  calibrations: Calibration[];
  trends: Trends;
  aiRecommendations: AIRecommendation[];
  waterInspections: WaterInspections;
}
