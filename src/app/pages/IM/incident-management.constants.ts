// Single canonical mock status-count map shared by the incident management
// page (stat tiles + NSTT table) and the landing page's Incident Management
// overview card, so their numbers can't drift apart. Used as the fallback
// dashboard whenever the real API is unreachable — see incident-management.mock.ts.
export const INCIDENT_STATUS_COUNTS: Record<string, number> = {
  unknown: 0,
  inProgress: 28,
  assigned: 9,
  escalated: 0,
  resolved: 3,
  closed: 1,
  cancelled: 0,
};

export const INCIDENT_TOTAL_COUNT =
  Object.values(INCIDENT_STATUS_COUNTS).reduce((sum, count) => sum + count, 0);

// Stat-tile chrome (colors/icons) is page presentation, not something any
// DJP API returns — kept as a single lookup so both the mock and real
// dashboard-building paths produce visually identical tiles, and so the
// component itself no longer hardcodes 8 literal tile objects. Card layout
// mirrors Change Management's app-cml-stat-cards (title/icon-badge/count/
// "View X"/arrow, colored bottom border) — borderColor doubles as both the
// border and title color, bg is the icon-badge background, same as CM's
// var(--stat-color)/var(--stat-bg) pair.
export interface TileChrome {
  bg: string;
  borderColor: string;
  viewText: string;
  icon: string;
}

export const TILE_CHROME: Record<string, TileChrome> = {
  all: {
    bg: 'rgba(174,174,174,0.15)', borderColor: '#9ca3af', viewText: 'View all tasks',
    icon: '/assets/incident-management/im-2-cd1-t.svg',
  },
  'in-progress': {
    bg: 'rgba(59,130,246,0.12)', borderColor: '#3b82f6', viewText: 'View in progress',
    icon: '/assets/incident-management/im-2-cd2-t.svg',
  },
  assigned: {
    bg: '#f5f3ff', borderColor: '#8b5cf6', viewText: 'View assigned',
    icon: '/assets/incident-management/im-2-cd3-t.svg',
  },
  escalated: {
    bg: '#fef2f2', borderColor: '#e60023', viewText: 'View escalated',
    icon: '/assets/incident-management/im-2-cd4-t.svg',
  },
  resolved: {
    bg: '#f0fdf4', borderColor: '#10b981', viewText: 'View resolved',
    icon: '/assets/incident-management/im-2-cd5-t.svg',
  },
  closed: {
    bg: 'rgba(255,223,245,0.34)', borderColor: '#b70777', viewText: 'View closed',
    icon: '/assets/incident-management/im-2-cd6-t.svg',
  },
  cancelled: {
    bg: '#fff7ed', borderColor: '#f97316', viewText: 'View cancelled',
    icon: '/assets/incident-management/im-2-cd7-t.svg',
  },
  unknown: {
    bg: '#fefce8', borderColor: '#eab308', viewText: 'View unknown',
    icon: '/assets/incident-management/im-2-cd8-t.svg',
  },
};

// Default bin selection — matches DJP's own hardcoded default
// (ImDashboardUiComponent.selectedObjects) exactly, including order.
export const DEFAULT_BINS: string[] = ['ES_IM ENGINEER', 'OUTAGE_RF', 'OUTAGE_IM'];

// Maps each status-tile key to the real API's exact status-bucket key
// (fetchNSTTDetails' response uses these literal "List of X NSTT and NSTT
// details" strings) — single source of truth so the mapper and the tile
// definitions can't drift apart.
export const STATUS_KEY_TO_LIST_KEY: Record<string, string> = {
  all: 'List of NSTT and NSTT details',
  'in-progress': 'List of In Progress NSTT and NSTT details',
  assigned: 'List of Assigned NSTT and NSTT details',
  resolved: 'List of Resolved NSTT and NSTT details',
  closed: 'List of Closed NSTT and NSTT details',
  cancelled: 'List of Cancelled NSTT and NSTT details',
  unknown: 'List of Unknown NSTT and NSTT details',
};

// ================================================================
// Column settings (Custom Settings modal) — API #5, fetchUserColumnList /
// UpdateUserColumnList. Field source: djp/incidentmanagement's own
// NSTTColumnListValue model (src/app/model/settings/nstt-column-list.model.ts)
// — every key below is copied verbatim from that interface, since these
// exact strings are what round-trips through columnNameValues on the real
// API. Do not rename/add/remove keys here without checking that model —
// this is the full real field universe DJP itself supports, not an
// approximation. (label is presentation-only — a couple are cleaned up
// for readability, e.g. the model's "FF Expected Visit Time" typo is
// labeled "FFI Expected Visit Time"; the key sent to the API is untouched.)
export interface NsttColumnField {
  key: string;
  label: string;
}

export const ALL_NSTT_COLUMNS: NsttColumnField[] = [
  { key: 'SR Details Each NSTT', label: 'SR Details Each NSTT' },
  { key: 'Actual Incident Time', label: 'Actual Incident Time' },
  { key: 'Assigned Group', label: 'Assigned Group' },
  { key: 'Assignee', label: 'Assignee' },
  { key: 'Categorization Tier 3', label: 'Categorization Tier 3' },
  { key: 'Incident Id', label: 'Incident ID' },
  { key: 'Incident Impact', label: 'Incident Impact' },
  { key: 'Last ERT Time', label: 'Last ERT Time' },
  { key: 'Last Resolved Date', label: 'Last Resolved Date' },
  { key: 'Notes', label: 'Notes' },
  { key: 'Re Opened Date', label: 'Re Opened Date' },
  { key: 'Resolution', label: 'Resolution' },
  { key: 'Resolution Categorization Tier 1', label: 'Resolution Categorization Tier 1' },
  { key: 'Resolution Categorization Tier 2', label: 'Resolution Categorization Tier 2' },
  { key: 'Service Affecting', label: 'Service Affecting' },
  { key: 'Site', label: 'Site' },
  { key: 'Status', label: 'Status' },
  { key: 'Status Reason', label: 'Status Reason' },
  { key: 'Summary', label: 'Summary' },
  { key: 'Support Organization', label: 'Support Organization' },
  { key: 'Up Time', label: 'Up Time' },
  { key: 'Opt Cat Change Flag to NON FFI', label: 'Opt Cat Change Flag to NON FFI' },
  { key: 'FF Expected Visit Time', label: 'FFI Expected Visit Time' },
  { key: 'FFI Last Modified By', label: 'FFI Last Modified By' },
  { key: 'FFI Last Modified Date', label: 'FFI Last Modified Date' },
  { key: 'Field Engineer Actual Visit Time', label: 'Field Engineer Actual Visit Time' },
  { key: 'Field Engineer Contact Number', label: 'Field Engineer Contact Number' },
  { key: 'Field Engineer Name', label: 'Field Engineer Name' },
  { key: 'Opt Cat Change Flag to FFI', label: 'Opt Cat Change Flag to FFI' },
  { key: 'Status Change Flag', label: 'Status Change Flag' },
  { key: 'TT Acceptance Time', label: 'TT Acceptance Time' },
  { key: 'CI NSA', label: 'CI NSA' },
  { key: 'CI SA', label: 'CI SA' },
  { key: 'End Point App', label: 'End Point App' },
];

// Of the 34 fields above, only these 6 are currently mapped from the real
// NSTT API response into NsttRow (see IncidentManagementService.toNsttRow) —
// so only these can actually appear/reorder as real table columns today.
// The rest can still be selected/saved (matching DJP's real full-field
// contract exactly), they just won't change the table yet — wiring their
// raw data through is a separate, larger follow-up.
export const TABLE_RENDERABLE_COLUMNS = new Set<string>([
  'Site', 'Status', 'Actual Incident Time', 'Assigned Group', 'Last ERT Time', 'Up Time',
]);

// First-run default (no saved preference yet, real or mock) — matches
// today's existing 6 optional columns exactly, in their existing order.
export const DEFAULT_SELECTED_COLUMNS: string[] = [
  'Site', 'Status', 'Actual Incident Time', 'Assigned Group', 'Last ERT Time', 'Up Time',
];
