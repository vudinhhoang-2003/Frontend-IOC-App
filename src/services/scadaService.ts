/**
 * SCADA Service – kết nối các endpoint SCADA từ BE
 * Base path: /web/scada
 */
import apiClient from './apiClient';
import type { AxiosResponse } from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiDevice {
  id: string;
  name: string;
  device_type: string;
  model?: string;
  serial_no?: string;
  status: string;
}

export interface ApiStation {
  id: string;
  factory_id?: number;
  name: string;
  station_type?: string;
  lat?: number;
  lng?: number;
  is_active: boolean;
}

export interface ApiStationDetail extends ApiStation {
  devices: ApiDevice[];
}

export interface ApiScadaReading {
  time: string;
  station_id: string;
  pressure_bar?: number;
  flow_m3h?: number;
  level_pct?: number;
  power_kw?: number;
  voltage_v?: number;
  current_a?: number;
  frequency_hz?: number;
  temperature_c?: number;
  status_code?: string;
}

export interface SendCommandPayload {
  station_id: string;
  device_id: string;
  action: string;
  param_value?: string;
  totp_code: string;
}

export interface ApiScadaCommand {
  id: number;
  time: string;
  station_id: string;
  device_id: string;
  action: string;
  param_value?: string;
  issued_by: string;
  totp_verified: boolean;
  status: string;
  ack_time?: string;
  response_msg?: string;
  ip_address?: string;
}

export interface CreateAlarmPayload {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  station_id?: string;
  device_id?: string;
  parameter?: string;
  alarm_value?: number;
  threshold?: number;
}

export interface ApiAlarm {
  id: string;
  severity: string;
  message: string;
  station_id?: string;
  device_id?: string;
  parameter?: string;
  alarm_value?: number;
  threshold?: number;
  is_ack: boolean;
  ack_by?: string;
  ack_at?: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface AlarmSummary {
  critical: number;
  warning: number;
  info: number;
}

export interface ReadingsParams {
  station_id?: string;
  from?: string;
  to?: string;
  limit?: number;
  interval?: string;
}

export interface CommandsParams {
  station_id?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export interface AlarmsParams {
  station_id?: string;
  severity?: string;
  is_ack?: boolean;
  is_resolved?: boolean;
  from?: string;
  to?: string;
  limit?: number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const handleResponse = <T>(response: AxiosResponse): T => {
  const data = response.data;
  if (!data.success) {
    throw new Error(data.error?.message || 'Đã xảy ra lỗi không xác định');
  }
  return data.data as T;
};

// ─── SCADA Service ────────────────────────────────────────────────────────────

const scadaService = {
  /** Lấy danh sách tất cả trạm */
  getStations: async (): Promise<ApiStation[]> => {
    const res = await apiClient.get('/web/scada/stations');
    return handleResponse<ApiStation[]>(res);
  },

  /** Lấy chi tiết trạm kèm danh sách thiết bị */
  getStationDetail: async (stationId: string): Promise<ApiStationDetail> => {
    const res = await apiClient.get(`/web/scada/stations/${stationId}`);
    return handleResponse<ApiStationDetail>(res);
  },

  /** Lấy bản ghi telemetry mới nhất của một trạm */
  getLatestReading: async (stationId: string): Promise<ApiScadaReading | null> => {
    const res = await apiClient.get('/web/scada/readings/latest', {
      params: { station_id: stationId },
    });
    return handleResponse<ApiScadaReading | null>(res);
  },

  /** Lấy lịch sử dữ liệu telemetry */
  getReadings: async (params: ReadingsParams): Promise<ApiScadaReading[]> => {
    const res = await apiClient.get('/web/scada/readings', { params });
    return handleResponse<ApiScadaReading[]>(res);
  },

  /** Gửi lệnh điều khiển thiết bị (yêu cầu TOTP 2FA) */
  sendCommand: async (payload: SendCommandPayload): Promise<ApiScadaCommand> => {
    try {
      const res = await apiClient.post('/web/scada/commands', payload);
      return handleResponse<ApiScadaCommand>(res);
    } catch (error: unknown) {
      // Xử lý lỗi 2006/2007 từ backend
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: { code?: string; message?: string } } } };
        const code = axiosError.response?.data?.error?.code;
        const message = axiosError.response?.data?.error?.message;
        if (code === '2006') throw new Error('Yêu cầu mã TOTP 2FA để thực hiện lệnh điều khiển');
        if (code === '2007') throw new Error('Mã TOTP không hợp lệ hoặc đã hết hạn');
        if (message) throw new Error(message);
      }
      throw error;
    }
  },

  /** Lấy lịch sử lệnh điều khiển */
  getCommands: async (params: CommandsParams): Promise<ApiScadaCommand[]> => {
    const res = await apiClient.get('/web/scada/commands', { params });
    return handleResponse<ApiScadaCommand[]>(res);
  },

  /** Lấy danh sách cảnh báo */
  getAlarms: async (params: AlarmsParams): Promise<ApiAlarm[]> => {
    const res = await apiClient.get('/web/scada/alarms', { params });
    return handleResponse<ApiAlarm[]>(res);
  },

  /** Xác nhận cảnh báo */
  acknowledgeAlarm: async (alarmId: string): Promise<ApiAlarm> => {
    const res = await apiClient.patch(`/web/scada/alarms/${alarmId}/ack`);
    return handleResponse<ApiAlarm>(res);
  },

  /** Lấy tổng hợp cảnh báo chưa xác nhận */
  getAlarmSummary: async (): Promise<AlarmSummary> => {
    const res = await apiClient.get('/web/scada/alarms/summary');
    return handleResponse<AlarmSummary>(res);
  },
};

export default scadaService;
