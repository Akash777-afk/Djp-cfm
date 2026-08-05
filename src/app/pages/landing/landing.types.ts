export interface NavTabItem {
  label: string;
  active: boolean;
}

export interface GlanceTile {
  label: string;
  action: (variant?: SectionVariant) => void;
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

export interface ChangeRow {
  outageId: string;
  crq: string;
  impact: string;
  implementor: string;
  submitted: boolean;
  isLast: boolean;
}
