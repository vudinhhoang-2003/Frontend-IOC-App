/**
 * LIMS Service – kết nối các endpoint Chất lượng nước từ BE
 * Base path: /web/lims
 */
import apiClient from './apiClient';
import type { AxiosResponse } from 'axios';

// ─── Helper ───────────────────────────────────────────────────────────────────

const handleResponse = <T>(response: AxiosResponse): T => {
  const data = response.data;
  if (!data.success) {
    throw new Error(data.error?.message || 'Đã xảy ra lỗi không xác định');
  }
  return data.data as T;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiSite {
  id: string;
  name: string;
  site_type: string;
  zone: string;
  factory_id?: number;
  factory_name?: string;
  lat?: number;
  lng?: number;
  address?: string;
  sample_frequency_days: number;
  is_active: boolean;
}

export interface ApiSampleResultFlat {
  pH?: number;
  turbidity?: number;
  chlorine?: number;
  coliform?: number;
  arsenic?: number;
  nitrate?: number;
  conductivity?: number;
  hardness?: number;
  tds?: number;
}

export interface ApiSample {
  id: number;
  sample_code: string;
  factory_id?: number;
  factory_name?: string;
  site_id?: string;
  site_name?: string;
  sample_type?: string;
  sampled_at: string;
  sampled_by?: string;
  collector?: string;
  lab_received?: string;
  lab_reported?: string;
  status: 'pending' | 'ok' | 'alert';
  status_raw: string;
  note?: string;
  results?: ApiSampleResultFlat | null;
}

export interface ApiCalibration {
  id: number;
  instrument_code: string;
  instrument_name: string;
  instrument_type?: string;
  factory_id?: number;
  factory_name?: string;
  model?: string;
  serial_no?: string;
  manufacturer?: string;
  parameters?: string[];
  agency?: string;
  calibration_interval_months: number;
  status: 'ok' | 'warning' | 'overdue' | 'failed';
  status_raw: string;
  last_calibrated?: string;
  next_calibrated: string;
  certificate_no?: string;
  certificate_url?: string;
  note?: string;
}

export interface ApiInspection {
  id: string;
  factory_id?: number;
  factory_name?: string;
  agency: string;
  inspection_type: string;
  planned_date?: string;
  actual_date?: string;
  period?: string;
  status: 'planned' | 'completed' | 'cancelled';
  result?: 'pass' | 'fail' | null;
  num_samples: number;
  num_fail: number;
  report_code?: string;
  report_url?: string;
  note?: string;
}

export interface ApiResultItem {
  parameter: string;
  value: number;
  unit?: string;
  limit_min?: number;
  limit_max?: number;
  standard_ref?: string;
}

// Query params
export interface SamplesParams {
  factory_id?: number;
  site_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CalibrationsParams {
  factory_id?: number;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface InspectionsParams {
  factory_id?: number;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// ─── LIMS Service ─────────────────────────────────────────────────────────────

const limsService = {
  // ── Sites ──────────────────────────────────────────────────────────────────

  /** Danh sách điểm lấy mẫu */
  getSites: async (factory_id?: number, is_active = true): Promise<ApiSite[]> => {
    const res = await apiClient.get('/web/lims/sites', {
      params: { factory_id, is_active },
    });
    return handleResponse<ApiSite[]>(res);
  },

  /** Chi tiết điểm lấy mẫu */
  getSite: async (siteId: string): Promise<ApiSite> => {
    const res = await apiClient.get(`/web/lims/sites/${siteId}`);
    return handleResponse<ApiSite>(res);
  },

  // ── Samples ────────────────────────────────────────────────────────────────

  /** Danh sách phiếu lấy mẫu */
  getSamples: async (params: SamplesParams = {}): Promise<ApiSample[]> => {
    const res = await apiClient.get('/web/lims/samples', { params });
    return handleResponse<ApiSample[]>(res);
  },

  /** Chi tiết phiếu mẫu + kết quả xét nghiệm (flat) */
  getSample: async (sampleId: number): Promise<ApiSample> => {
    const res = await apiClient.get(`/web/lims/samples/${sampleId}`);
    return handleResponse<ApiSample>(res);
  },

  /** Tạo phiếu lấy mẫu mới */
  createSample: async (payload: {
    sample_code: string;
    factory_id?: number;
    site_id?: string;
    sample_type?: string;
    sampled_at: string;
    note?: string;
  }): Promise<ApiSample> => {
    const res = await apiClient.post('/web/lims/samples', payload);
    return handleResponse<ApiSample>(res);
  },

  /** Nhập kết quả xét nghiệm hàng loạt */
  addResults: async (sampleId: number, results: ApiResultItem[]): Promise<ApiSample> => {
    const res = await apiClient.post(`/web/lims/samples/${sampleId}/results`, { results });
    return handleResponse<ApiSample>(res);
  },

  // ── Calibrations ───────────────────────────────────────────────────────────

  /** Danh sách thiết bị kiểm định */
  getCalibrations: async (params: CalibrationsParams = {}): Promise<ApiCalibration[]> => {
    const res = await apiClient.get('/web/lims/calibrations', { params });
    return handleResponse<ApiCalibration[]>(res);
  },

  /** Chi tiết thiết bị kiểm định */
  getCalibration: async (calibId: number): Promise<ApiCalibration> => {
    const res = await apiClient.get(`/web/lims/calibrations/${calibId}`);
    return handleResponse<ApiCalibration>(res);
  },

  // ── Inspections ────────────────────────────────────────────────────────────

  /** Lịch sử + kế hoạch kiểm định nước liên ngành */
  getInspections: async (params: InspectionsParams = {}): Promise<ApiInspection[]> => {
    const res = await apiClient.get('/web/lims/inspections', { params });
    return handleResponse<ApiInspection[]>(res);
  },

  /** Chi tiết một đợt kiểm định */
  getInspection: async (inspectionId: string): Promise<ApiInspection> => {
    const res = await apiClient.get(`/web/lims/inspections/${inspectionId}`);
    return handleResponse<ApiInspection>(res);
  },

  /** Tạo lịch kiểm định mới */
  createInspection: async (payload: {
    id: string;
    factory_id?: number;
    agency: string;
    planned_date?: string;
    period?: string;
    note?: string;
  }): Promise<ApiInspection> => {
    const res = await apiClient.post('/web/lims/inspections', payload);
    return handleResponse<ApiInspection>(res);
  },

  /** Cập nhật kết quả kiểm định */
  updateInspection: async (
    inspectionId: string,
    payload: {
      status?: string;
      result?: 'pass' | 'fail';
      actual_date?: string;
      num_samples?: number;
      num_fail?: number;
      report_code?: string;
      note?: string;
    }
  ): Promise<ApiInspection> => {
    const res = await apiClient.patch(`/web/lims/inspections/${inspectionId}`, payload);
    return handleResponse<ApiInspection>(res);
  },
};

export default limsService;
