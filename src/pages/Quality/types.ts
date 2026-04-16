export interface QualityLimit {
  min?: number;
  max?: number;
}

export interface QualityLimits {
  pH: QualityLimit;
  chlorine: QualityLimit;
  turbidity: QualityLimit;
  TDS: QualityLimit;
  arsenic: QualityLimit;
  coliform: QualityLimit;
}

export interface WaterQualityRecord {
  id?: number;
  factory: string;
  pH: number;
  chlorine: number;
  turbidity: number;
  TDS: number;
  arsenic: number;
  coliform: number;
  time: string;
  status: 'ok' | 'warning' | 'alert' | string;
}

export interface FactoryBasic {
  id: number;
  name: string;
}

export interface EmployeeBasic {
  id: string;
  name: string;
}
