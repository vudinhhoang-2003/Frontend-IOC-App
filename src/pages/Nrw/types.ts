export type DMAStatus = 'ok' | 'warning' | 'critical';

export interface DMAZone {
  id: string;
  name: string;
  district: string;
  supplyFlow: number;
  consumptionFlow: number;
  loss: number;
  customers: number;
  status: DMAStatus;
}

export interface MNFSample {
  hour: string;
  supply: number;
  consume: number;
}

export interface MNFData {
  dmaId: string;
  mnfHour: string;
  mnfFlow: number;
  leakEstimate: number;
  leakPct: number;
  samples: MNFSample[];
}

export interface LeakAlert {
  id: string;
  dmaId: string;
  zone: string;
  mnf: number;
  expected: number;
  excess: number;
  risk: 'Rất cao' | 'Cao' | 'Trung bình';
  suspect: string;
  action: string;
  detected: string;
}

export interface InspectionOrder {
  id: string;
  date: string;
  // Support both camelCase (mock) and snake_case (API)
  dmaName?: string;
  dma_name?: string;
  suspect: string;
  team: string;
  action: string;
  recovered: number;
  status: 'processing' | 'done';
  responsibleId?: string;
  responsibleName?: string;
  responsible_id?: string;
  responsible_name?: string;
  created_at?: string;
}
