export type PlantStatus = 'active' | 'warning' | 'fault';

export type Plant = {
  id: number;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  output: number;
  status: PlantStatus;
  manager: string;
  established: string;
  powerUsage: number;
  chemicalCost: number;
  compliance: number;
  loss: number;
};

export type ViewMode = 'grid' | 'list';
