import { StatTile } from '../components/nstt-status/nstt-status.component';
import { NsttRow } from '../components/all-nstts/all-nstts.component';

// Raw wire shape of one entry from
// POST {apiEndPoint}/cfm-mise/im/fetchNSTTDetails
// Field names/casing match DJP's own NSTTDetails interface
// (djp/incidentmanagement/src/app/model/fetch-nstt.model.ts) exactly.
export interface NsttApiRow {
  'Incident Id': string;
  NSTT: string;
  Status: string;
  Site: string;
  'Assigned Group': string;
  'Actual Incident Time': string;
  'Up Time': string;
  'Last ERT Time'?: string;
  VIPFlag: string; // 'Y' | 'N'
  'SR count': number;
  'SR details for each NSTT': SrDetailForNstt[];
}

// A single child SR under one NSTT — subset of DJP's SRDetailsForEachNSTT
// (that interface has ~15 fields; these are the ones actually surfaced in
// the expand-to-children drawer).
export interface SrDetailForNstt {
  'SR Number': string;
  'LSI Number'?: string;
  'TAC1 Current Owner OLM ID'?: string;
  'TAC1 Current Owner'?: string;
  'SR SLA'?: string;
  Outcome?: string;
  'Task Creation Time'?: string;
  // Used only for the dedup rule below — DJP's own response can carry
  // multiple task rows per SR Number (one per task), including
  // 'Customer Update Task' entries that aren't a real distinct SR.
  'Task Name'?: string;
}

// Full raw response of fetchNSTTDetails — 8 status-bucketed lists + counts +
// the untagged bucket + the group-filter dropdown source, exactly as DJP's
// own dashboard.component.ts destructures it by these literal string keys.
export interface IncidentDashboardApiResponse {
  'List of NSTT and NSTT details': NsttApiRow[];
  'List of In Progress NSTT and NSTT details': NsttApiRow[];
  'List of Resolved NSTT and NSTT details': NsttApiRow[];
  'List of Closed NSTT and NSTT details': NsttApiRow[];
  'List of Cancelled NSTT and NSTT details': NsttApiRow[];
  'List of Assigned NSTT and NSTT details': NsttApiRow[];
  'List of Unknown NSTT and NSTT details': NsttApiRow[];
  'List of Other NSTT and NSTT details'?: NsttApiRow[];
  'SR without NSTT and NSTT details'?: { 'SR count': number };
  'Count of total NSTTs': number;
  'Count of In Progress NSTTs': number;
  'Count of Resolved/Resolved by Netcool NSTTs': number;
  'Count of Closed NSTTs': number;
  'Count of Cancelled NSTTs': number;
  'Count of Assigned NSTTs': number;
  'Count of Unknown NSTTs': number;
  'assigned group'?: string[];
}

// POST {apiEndPoint}/cfm-mise/djp/fetchSrPendencyStatus response — a flat
// list of tasks, deduped and filtered client-side to ones with a non-empty
// B2BEscalationNotes (see EscalationMatrixService's dedupeByMaxLevel for the
// analogous "group + keep newest" pattern; this one is simpler — no
// per-key grouping beyond newest-by-SR).
export interface AllTaskDetail {
  'SR Number': string;
  'Task Creation Time': string;
  B2BEscalationNotes?: string;
}

export interface EscalatedSrApiResponse {
  'All Tasks': AllTaskDetail[];
}

// POST {apiEndPoint}/cfm-mise/djp/fetchUserColumnList (get) and
// POST {apiEndPoint}/cfm-mise/djp/UpdateUserColumnList (update) — same
// envelope both directions. Response convention for the update call is
// {status: 'Success'}, NOT {Code:'000'} — a different contract than EM's
// mutation endpoints, verified from source, not assumed (see the IM API
// reference's Phase 8 note on the module's 3 different success conventions).
export interface ColumnPreferencesPayload {
  olmId: string;
  type: string; // 'nstt_column_list'
  columnNameValues?: Record<string, 'Y' | 'N'>;
}

export interface ColumnPreferencesGetResponse {
  columnNameValues: Record<string, 'Y' | 'N'>;
}

export interface ColumnPreferencesUpdateResponse {
  status: string; // 'Success' on success
}

export interface IncidentDashboardData {
  statTiles: StatTile[];
  nsttRows: NsttRow[];
  groupOptions: string[];
}
