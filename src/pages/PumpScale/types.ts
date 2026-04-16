export type ScheduleInterval = [number, number]; // [startHour, duration]

export interface PumpProfile {
  id: string;
  name: string;
  description: string;
  icon: 'weekday' | 'weekend' | 'holiday' | 'tet' | 'custom';
  color: string;
  isActive: boolean;
  appliesTo: 'weekday' | 'weekend' | 'holiday' | 'custom';
  createdAt: string;
  updatedAt: string;
  schedules: Record<string, ScheduleInterval[]>; // stationId -> intervals
}

export interface PumpStation {
  id: string;
  name: string;
  factory: string;
  type: 'pump' | 'pressure';
  status: 'online' | 'warning' | 'offline';
  schedule?: ScheduleInterval[];
}

export interface EVNPrice {
  name: string;
  range: string;
  price: string;
  color: string;
}
