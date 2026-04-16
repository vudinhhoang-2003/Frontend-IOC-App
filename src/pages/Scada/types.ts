export type ScadaStatus = 'online' | 'offline' | 'warning' | 'fault';
export type DeviceStatus = 'running' | 'standby' | 'fault' | 'open' | 'closed' | 'inactive';
export type DeviceType = 'pump' | 'valve';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
}

export interface ScadaStation {
  id: string;
  name: string;
  factory: string;
  type: 'pump' | 'pressure';
  pressure: number;
  pressureUnit: string;
  flow: number;
  level: number;
  power: number;
  status: ScadaStatus;
  lat: number;
  lng: number;
  devices: Device[];
  schedule?: [number, number][];
}

export interface CommandLog {
  id: number;
  time: string;
  station: string;
  device: string;
  action: string;
  user: string;
  status: 'success' | 'fail';
}

export type ScadaTab = 'overview' | 'stations' | 'logs';
