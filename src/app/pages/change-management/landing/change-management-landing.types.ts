export type DashboardChangeStatus = 'Completed' | 'Scheduled' | 'Emergency' | 'Rejected' | 'In Progress' | 'Cancelled' | 'Planned' | 'Open';

export interface DashboardChangeRow {
  changeId: string;
  plannedOutageId: string;
  status: DashboardChangeStatus;
  createdOn: string;
}

export interface StatCard {
  key: string;
  label: string;
  count: number;
  viewText: string;
  color: string;
  bg: string;
  icon: string;
  special?: boolean;
}
