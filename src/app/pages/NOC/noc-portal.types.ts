export interface AlarmBadge {
  label: string;
  count: number;
  bg: string;
  border: string;
  color: string;
}

export interface OtnSpanLossRow {
  label: string;
  value: number;
  bg: string;
  border: string;
  color: string;
}

export interface StatusField {
  label: string;
  value: string;
  bg: string;
  border: string;
  color: string;
}

export interface ProductDetailField {
  label: string;
  value: string;
}

export interface SrNotificationTab {
  key: string;
  label: string;
  count: number;
  active: boolean;
}

export interface PrimaryNavItem {
  key: string;
  label: string;
  icon: string;
}

export interface TopUtilityIcon {
  key: string;
  icon: string;
  alt: string;
  // Each source asset has its own natural design size (not uniform) —
  // forcing them into one common box is what made the call icon look
  // mismatched against the others.
  width: number;
  height: number;
}

// ---------- SR Details state (shown after an SR number is searched) ----------
// Icon shown in each journey event's circle badge — add a key + svg case in
// the template as new event types show up; unknown/future keys just render
// no icon rather than breaking.
export type SrJourneyEventIcon = 'ticket' | 'assign' | 'send' | 'chat' | 'check' | 'close';

export interface SrJourneyEvent {
  icon: SrJourneyEventIcon;
  label: string;
  // Pre-formatted display string ("09.45 am - 10.05.25"), same convention
  // as every other timestamp in SrDetails (e.g. SR Insights' "Fault Report
  // Time") — the backend sends display-ready text, not a Date this UI
  // would have to format itself.
  time: string;
  description: string;
}

// One stage of the journey — drives BOTH the compact stepper in the
// accordion header (label/state/number) AND the expanded column of events
// below it (events). Same array, two views — see noc-portal.component.html,
// nothing here is duplicated between them.
export interface SrJourneyStage {
  key: string;
  label: string;
  state: 'done' | 'current' | 'upcoming';
  // Only 'current'/'upcoming' stages show a number in their compact-stepper
  // circle — 'done' stages show a checkmark instead, so this is unused for
  // those.
  number?: number;
  events: SrJourneyEvent[];
}

export interface FltObservationField {
  label: string;
  value: string;
  status: 'down' | 'up' | 'no';
}

export interface RcaData {
  fltPingFields: FltObservationField[];
  fltAlarmFields: FltObservationField[];
  // Both Expected Root Cause columns render this same list — see
  // SrDetailsService's mock for why that's not a bug.
  rootCauseBullets: string[];
}

// A single labeled entry inside an SR Insights card. `bullets` is optional —
// most entries are plain label+value ("SR Status: Closed (All)"); a few
// (e.g. "RFO – Consolidated Observation") carry a bullet list under their
// value instead of/alongside it.
export interface SrInsightField {
  label: string;
  value: string;
  bullets?: string[];
}

export interface SrInsightsCard {
  title: string;
  description: string;
  fields: SrInsightField[];
}

export interface SrInsightsData {
  srSummarization: SrInsightsCard;
  historicalFaultInsights: SrInsightsCard;
}

// The single response shape SrDetailsService returns for a searched SR
// number — bundles every backend-driven SR-state section in one place, the
// same way a real "GET /sr/{srNumber}" response would. `journey`, `rca` and
// `insights` are wired to real sections today; SR Summary/All Work Notes
// still use their own placeholder data — add a field here + bind it in the
// template when one of those is ready; nothing else about this shape needs
// to change to support that.
export interface SrDetails {
  journey: SrJourneyStage[];
  rca: RcaData;
  insights: SrInsightsData;
}
