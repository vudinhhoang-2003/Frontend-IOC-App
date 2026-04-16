export type IncidentStatus = 'new' | 'processing' | 'done' | 'closed';
export type Severity = 'critical' | 'warning' | 'info';
export type WorkOrderStatus = 'new' | 'processing' | 'done' | 'closed';
export type Priority = 'high' | 'medium' | 'low';

export interface Incident {
  id: string;
  type: string;
  location: string;
  severity: Severity;
  status: IncidentStatus;
  report: string;
  assignedTo: string;
  note: string;
  resolvedAt?: string;
  factory?: string;
}

export interface WorkOrderTimeline {
  time: string;
  event: string;
  user: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: WorkOrderStatus;
  deadline: string;
  assignedTo: string;
  note: string;
  location: string;
  timeline: WorkOrderTimeline[];
}

export interface IncidentStats {
  total: number;
  new: number;
  processing: number;
  done: number;
  critical: number;
  avgResolveTime: string;
  commonType: string;
}

export type IncidentTab = 'incidents' | 'tasks';
export type IncidentViewMode = 'table' | 'kanban';
export type WorkOrderViewMode = 'table' | 'kanban';
