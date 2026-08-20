export interface PlannedOutage {
  outageId: string;
  crq: string;
  changeType: string;
  impact: string;
  status: string;
  implementer: string;
  description: string;
  startDate: string;
  endDate: string;
  reason: string;
  submission: string;
  // Added for real API integration. rawData carries the exact Siebel-style
  // field set (see PlannedOutageSiebelFields) needed to round-trip an
  // update back through Sync Planned Outage without losing fields this
  // simplified view doesn't show; undefined for rows created locally
  // (Create PO modal) that were never fetched from the real API.
  rawData?: Record<string, any>;
  // Linked LSI numbers, if any — needed for the Link Status check (API #10
  // operates on a single LSI, not the outage itself) and mirrors what
  // sendPlannedOutage() checks in DJP before allowing a notify.
  linkedLsis?: string[];
  // Impacted LSI records shown/edited on the Additional Details tab — a
  // richer per-outage table (party/implementer/remarks/status), distinct
  // from linkedLsis above which only feeds the Link Status/Notify checks.
  // Local-only: added/edited entirely client-side, never round-tripped
  // through an API.
  impactedLsis?: ImpactedLsiDetail[];
  // Outage Communications thread shown on the Outage Communications tab —
  // local-only, mock-seeded per outage.
  communications?: OutageCommunicationRecord[];
}

export interface ImpactedLsiDetail {
  id: string;
  lsi: string;
  serviceType: string;
  party: string;
  status: string;
  implementer: string;
  remarks: string;
}

export interface OutageCommunicationRecord {
  type: string;
  status: string;
  contactType: string;
  journey: string;
  triggerTime: string;
  senderEmail: string;
  remarks: string;
}
