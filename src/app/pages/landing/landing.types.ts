export interface NavTab {
  label: string;
  active: boolean;
}

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
  escalationLevel: string;
  badgeClass: string;
  badgeDotClass: string;
  trackingPercent: number;
  trackingColor: string;
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

export type ModuleKey =
  | 'noc-portal'
  | 'proactive-automation'
  | 'incident-management'
  | 'problem-management'
  | 'change-management'
  | 'rooster-management'
  | 'escalation-matrix'
  | 'sr-assign-reassign';

export type CardKey = 'sr' | 'incident' | 'change' | 'escalation';

// Which layout half of a section component to render — each of the 7 landing
// section components contains both its desktop (absolute-canvas) markup and
// its mobile (flowing) markup, and is instantiated once per variant so the
// two stay bound to the same lifted-up state from LandingComponent.
export type SectionVariant = 'desktop' | 'mobile';
