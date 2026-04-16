export type CameraStatus = 'online' | 'warning' | 'offline';
export type CameraType = 'PTZ Dome' | 'Fixed Bullet' | 'Fixed Dome' | 'PTZ Speed';
export type GridMode = '2x2' | '3x2' | '3x4' | '4x4' | 'list';
export type CameraTab = 'live' | 'nvr' | 'storage';

export interface Camera {
  id: string;
  name: string;
  site: string;
  siteShort: string;
  position: string;
  locationType: string;
  subLocation: string;
  type: CameraType;
  resolution: string;
  fps: number;
  status: CameraStatus;
  nvr: string;
  channel: number;
  uptime: number; // in minutes
  lastEvent?: string;
  bitrate: string; // in Mbps
  ip: string;
  imageKey: string;
}

export interface NVR {
  id: string;
  name: string;
  channels: number;
  hdd: number; // in TB
  hdUsed: number; // in TB
  bandwidth: number; // in Mbps
  cams: string[]; // array of camera IDs
}

export interface LocationTypeInfo {
  name: string;
  positions: string[];
  icon: string;
  color: string;
}
