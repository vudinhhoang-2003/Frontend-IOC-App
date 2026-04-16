export interface GisDmaZone {
  id: string;
  name: string;
  district: string;
  color: string;
  fillOpacity: number;
  loss: number;
  customers: number;
  status: 'ok' | 'warning' | 'critical';
  supplyFlow: number;
  consumptionFlow: number;
  coords: number[][] | [number, number][];
}

export interface GisValve {
  id: string;
  pos: [number, number] | number[];
  type: 'gate' | 'butterfly' | 'check' | 'meter' | string;
  status: 'open' | 'closed' | 'warning' | 'active' | string;
}

export interface GisPipe {
  id: string;
  type: 'transmission' | 'distribution' | 'meter' | string;
  dmaId: string | null;
  diameter: number;
  material: string;
  status: 'active' | 'warning' | 'leaking' | 'closed' | string;
  pressure: number;
  flow: number;
  label?: string;
  coords: number[][] | [number, number][];
  valves?: GisValve[];
}

export interface GisFactory {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  output: number;
  manager: string;
}

export interface GisStation {
  id: string;
  name: string;
  factory: string;
  lat: number;
  lng: number;
  status: 'online' | 'warning' | 'offline' | string;
  pressure: number;
  flow: number;
  level: number;
  power: number;
}

export interface GisIncident {
  id: string;
  type: string;
  location: string;
  severity: 'critical' | 'high' | 'warning' | string;
  status: 'new' | 'processing' | 'done' | string;
  report: string;
  assignedTo?: string;
  lat: number;
  lng: number;
}
