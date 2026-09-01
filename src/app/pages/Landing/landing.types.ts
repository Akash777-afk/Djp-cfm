export interface NavTabItem {
  label: string;
  active: boolean;
}

export type MainCardKey = 'sr' | 'incident' | 'change' | 'escalation';

export type SectionVariant = 'desktop' | 'mobile';

export interface IncidentStat {
  value: string;
  label: string;
  bg: string;
  border: string;
  color: string;
  width: number;
}

export interface IncidentBar {
  height: number;
  active: boolean;
}

export interface SrRow {
  srNumber: string;
  riseDate: string;
  summary: string;
  subType: 'Parent' | 'Child';
  level: number;
  trackingPercent: number;
  isLast: boolean;
}

export interface EscalationLevel {
  label: string;
  dotColor: string;
  count: number;
  percent: string;
  isLast: boolean;
}

// Field names mirror ChangeManagementService's real DashboardChangeRow
// exactly (changeId/plannedOutageId/status/createdOn) — this card maps
// straight from that API shape, so there's no need for a differently-named
// local shape in between.
export interface ChangeRow {
  changeId: string;
  plannedOutageId: string;
  status: string;
  createdOn: string;
  isLast: boolean;
}
