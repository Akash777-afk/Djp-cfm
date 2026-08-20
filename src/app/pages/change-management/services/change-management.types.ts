import { DashboardChangeRow, StatCard } from '../landing/change-management-landing.types';
import { PlannedOutage } from '../shared/types';

// ---------- API #1: Get Live CRQ/PO Data ----------
// GET {apiEndPoint}/cfm-mise/cm-api/getRemedyCRQLiveSelectedData?fromDate=&toDate=
// DJP's own component defensively checks Array.isArray(data) since the
// backend can return either a single object or an array — reproduced as-is,
// not "corrected" to always expect an array.
export interface CrqLiveApiRow {
  changeId: string;
  plannedOutageId: string;
  status: string;
  created_on: string; // raw format has no separator between date and time
}

// ---------- API #2: Query Planned Outages ----------
// POST {apiEndPoint}/cfm-mise/cm-api/queryplannedoutage
// Field names are DJP's real Siebel-style keys (Title Case with spaces) —
// kept verbatim rather than reshaped into camelCase, since this is also the
// exact shape #6/#8's update payload needs rebuilt from.
export interface PlannedOutageSiebelFields {
  'Planned Outage Id': string;
  'Activity Location': string;
  'Benefit Of Change': string;
  Category: string;
  'Change Description': string;
  'Change Type': string;
  Impact: string;
  Implementer: string;
  'Duration in Min': string;
  'Outage Reason': string;
  'Planned End Date': string;
  'Planned Start Date': string;
  'Requester Email Id': string;
  'Type of Change': string;
  Status: string;
  'Request CRQ'?: string;
  // Linked LSI(s) — DJP's own code treats this as either a single object or
  // an array (same Array.isArray defensive pattern as CrqLiveApiRow), and
  // only ever reads it for "does at least one exist" (mailOutage) — exact
  // sub-object field names beyond that were never dereferenced anywhere in
  // DJP's source, so kept as `any`. Backend response not live-verified.
  'B2B Planned Outage LSI BC'?: any;
}

export interface PlannedOutageApiRow {
  rawData: PlannedOutageSiebelFields;
}

// ---------- API #3: Get CRQ Data (validate) ----------
// GET {apiEndPoint}/cfm-mise/cm-api/getRemedyCRQ?changeid=
// Response shape beyond "is it a non-empty array" was never read in DJP —
// backend response not live-verified beyond that.
export type CrqValidationResponse = any[];

// ---------- API #4: Get Dropdown Values ----------
// GET {apiEndPoint}/cfm-mise/cm-api/getDropDownValues?name=
export type DropdownValuesResponse = string[];

// ---------- API #5: Get LSIs Against Node (Service Impact) ----------
// GET {apiEndPoint}/cfm-mise/cm-api/getLSIAgainstNode?domain=&node=
export interface ServiceImpactApiRow {
  LSI: string;
  ServiceType: string;
  Customer: string;
}

// ---------- API #6: Sync Planned Outage (create/update) ----------
// POST {apiEndPoint}/cfm-mise/cm-api/syncplannedoutage
// Success convention verified from source: data.StatusMessage === 'Success'
// (not {Code:'000'}, not {status:'Success'} — a third, distinct convention).
export interface SyncPoResponse {
  StatusMessage: string;
  SiebelMessage?: {
    'B2B Planned Outage BC'?: { 'Planned Outage Id'?: string };
  };
}

// ---------- API #7/#8: Save/Update PO Internal ----------
// POST {apiEndPoint}/cfm-mise/cm-api/changeid/savePOIDInternal|updatePOIDInternal
// DJP never reads the response at either call site (empty .subscribe()
// callback) — success/error convention is genuinely unconfirmed from
// source, not assumed here. Typed `any` on purpose; do not invent a
// {Code}/{status} check DJP itself doesn't have.
export type PoInternalResponse = any;

// ---------- API #9: Mail/Notify Outage ----------
// POST {apiEndPoint}/cfm-mise/cm-api/mailplannedoutage
// Success convention verified from source: data.StatusMessage ===
// 'Communications sent successfully' — a distinct literal from #6's.
export interface MailOutageResponse {
  StatusMessage: string;
}

// ---------- API #10: Check Link Status ----------
// GET {apiEndPoint}/cfm-mise/api/linkStatus?lsi=
// DJP reads data?.status directly off the response root, no wrapper.
export interface LinkStatusResponse {
  status?: string;
}

export interface CmDashboardData {
  statCards: StatCard[];
  changes: DashboardChangeRow[];
}

export interface CrqPageData {
  plannedOutages: PlannedOutage[];
}
