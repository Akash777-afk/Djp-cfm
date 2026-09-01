import { EscalationLevelTile } from '../components/escalation-levels/escalation-levels.component';
import { EscalatedSrRow } from '../components/escalated-srs/escalated-srs.component';

// Raw wire shape of one row from
// GET {broadcastURL}/cfm-mise/fac-api/fetchEscalationsHistory?status=Open
// (djp/EscalationMatrix's AppService.getAllEscalationsData / dashboard.component.ts
// displayedColumns). Field names/casing match the real API exactly — do not
// rename these to camelCase, the mapper below is the only place that
// translates into djp-cfm's own EscalatedSrRow shape.
//
// ASSUMPTION (flagged per rule 13, not verifiable without a live response
// sample): `Call_TRACKING` is mapped to djp-cfm's `srType` (Parent/Child/
// Escalated badge). dashboard.component.ts lists it as a displayed column
// alongside SR_Number/Level/etc. but never reads or interprets its value
// itself — DJP's own UI just prints it verbatim in a table cell. If real
// data shows this assumption is wrong, only normalizeSrType() in
// escalation-matrix.service.ts needs to change.
export interface EscalationApiRow {
  SR_Number: string;
  LSI: string;
  Factory: string;
  Circle: string;
  Cluster: string;
  Requested_Level: number;
  Customer_Name: string;
  Created_on: string;
  Call_TRACKING?: string;
}

// Raw wire shape of GET {broadcastURL}/cfm-mise/fac-api/getEscalationsCallCount?srNumber=...
// ASSUMPTION (flagged): exact field names weren't visible in DJP's
// dashboard.component.ts beyond `level{N}_Count` being assigned onto
// `level1_Count..level6_Count` on each row — reproduced as given.
export interface CallHistoryCounts {
  level1_Count?: number;
  level2_Count?: number;
  level3_Count?: number;
  level4_Count?: number;
  level5_Count?: number;
  level6_Count?: number;
}

export interface EscalationDashboardData {
  levelTiles: EscalationLevelTile[];
  srRows: EscalatedSrRow[];
}
