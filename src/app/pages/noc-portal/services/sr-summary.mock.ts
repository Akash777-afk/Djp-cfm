import { SrSummaryData } from '../components/sr-summary/sr-summary.component';

// Mock data for SrSummaryService — stands in for a real "GET /sr/{srNumber}
// /summary" response, same convention as sr-details.mock.ts / work-notes.mock.ts.
//
// The reference mockup's own Problem Summary/Severity/Sub Type fields all
// displayed the SR number itself (an obvious placeholder-data bug in that
// mockup, not intentional content) — replaced with plausible distinct
// values here instead of reproducing that mistake.
export const MOCK_SR_SUMMARY: SrSummaryData = {
  topInfo: [
    [
      { key: 'srNumber', label: 'SR Number', value: 'SR-2024-003567', editable: false },
      { key: 'impact',   label: 'Impact',    value: 'High',           editable: false },
      { key: 'type',     label: 'Type',      value: 'Incident',       editable: false },
    ],
    [
      { key: 'problemSummary', label: 'Problem Summary', value: 'Intermittent connectivity affecting payment processing during peak hours', editable: false },
      { key: 'severity',       label: 'Severity',        value: 'Critical',              editable: false },
      { key: 'subType',        label: 'Sub Type',        value: 'Network Connectivity',  editable: false },
    ],
    [
      { key: 'srRaisedDate', label: 'SR Raised Date', value: 'March 5, 2026 08:30 AM', editable: false },
      { key: 'caseType',     label: 'Case Type',       value: 'Production Issue',       editable: false },
      { key: 'subSubType',   label: 'Sub Sub Type',    value: 'Server Connectivity',    editable: false },
    ],
  ],
  details: [
    [
      { key: 'srSource',        label: 'SR Source',         value: 'Customer Portal',                    editable: false },
      { key: 'createdDateTime', label: 'Created Date/Time', value: '05-Mar-2026 08:15 UTC',               editable: false },
      { key: 'currentTaskGroup',label: 'Current Task Group',value: 'Field Operations - Network Team',     editable: true },
      { key: 'serviceProviderName', label: 'Service Provider Name', value: 'TechServe Solutions Inc.',    editable: true },
      { key: 'refNoNw',         label: 'Ref No N/W',        value: 'NW-2024-7845-REF',                    editable: true },
    ],
    [
      { key: 'srCreatedBy',     label: 'SR Created By',     value: 'Sarah Johnson (sjohnson@company.com)',editable: false },
      { key: 'resolvedDateTime',label: 'Resolved Date/Time',value: '07-Mar-2026 14:30 UTC',               editable: false },
      { key: 'srType',          label: 'SR Type',           value: 'Network Infrastructure - Critical',   editable: true },
      { key: 'serviceProviderTt', label: 'Service Provider TT#', value: 'SP-TT-884721-2024',              editable: true },
      { key: 'comment',         label: 'Comment',           value: 'Customer reported intermittent connectivity issues during peak hours affecting payment processing systems.', editable: true },
    ],
    [
      { key: 'tacNumber',    label: 'TAC Number',    value: 'TAC-2024-03876-A1',              editable: true },
      { key: 'currentOwner', label: 'Current Owner', value: 'David Chen - Senior Network Engineer', editable: true },
      { key: 'nsttNumber',   label: 'NSTT Number',   value: 'NSTT-947821-2024-Q1',             editable: true },
      { key: 'refNwSr',      label: 'Ref N/W Sr',    value: 'SR-NW-2024-03876-PRIMARY',        editable: true },
    ],
  ],
};
