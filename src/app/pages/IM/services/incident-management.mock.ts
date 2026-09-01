import { StatTile } from '../components/nstt-status/nstt-status.component';
import { NsttChildSr, NsttRow } from '../components/all-nstts/all-nstts.component';
import { INCIDENT_STATUS_COUNTS, INCIDENT_TOTAL_COUNT, TILE_CHROME } from '../incident-management.constants';
import { IncidentDashboardData } from './incident-management.types';

// Fallback dashboard data — used by IncidentManagementService whenever the
// real API is unreachable (see its catchError). Same mock content that used
// to live directly in incident-management.component.ts, extended with
// per-NSTT child SR rows so the new expand-to-drawer UI has something to
// show even when running off mock data.
//
function buildTile(key: string, label: string, value: number): StatTile {
  return { key, label, value: String(value), ...TILE_CHROME[key] };
}

function buildMockStatTiles(): StatTile[] {
  return [
    buildTile('all', 'All Tasks', INCIDENT_TOTAL_COUNT),
    buildTile('in-progress', 'In Progress', INCIDENT_STATUS_COUNTS.inProgress),
    buildTile('assigned', 'Assigned', INCIDENT_STATUS_COUNTS.assigned),
    buildTile('escalated', 'Escalated', INCIDENT_STATUS_COUNTS.escalated),
    buildTile('resolved', 'Resolved', INCIDENT_STATUS_COUNTS.resolved),
    buildTile('closed', 'Closed', INCIDENT_STATUS_COUNTS.closed),
    buildTile('cancelled', 'Cancelled', INCIDENT_STATUS_COUNTS.cancelled),
    buildTile('unknown', 'Unknown', INCIDENT_STATUS_COUNTS.unknown),
  ];
}

function mockChildSrs(nstt: string, count: number): NsttChildSr[] {
  const srs: NsttChildSr[] = [];
  for (let i = 0; i < count; i++) {
    srs.push({
      srNumber: `9${nstt.replace(/\D/g, '').slice(-6)}${i}`,
      lsiNumber: '123456',
      owner: i === 0 ? 'A11UKIGQ' : '',
      sla: i % 2 === 0 ? 'Within SLA' : 'SLA Breached',
      outcome: '',
    });
  }
  return srs;
}

function buildMockNsttRows(): NsttRow[] {
  const vipCycle: Array<'diamond' | 'account'> = ['diamond', 'diamond', 'diamond', 'account', 'account', 'account', 'account'];
  const statusCounts: { status: string; count: number }[] = [
    { status: 'In progress', count: INCIDENT_STATUS_COUNTS.inProgress },
    { status: 'Assigned', count: INCIDENT_STATUS_COUNTS.assigned },
    { status: 'Resolved', count: INCIDENT_STATUS_COUNTS.resolved },
    { status: 'Closed', count: INCIDENT_STATUS_COUNTS.closed },
  ];

  const rows: NsttRow[] = [];
  let i = 0;
  for (const { status, count } of statusCounts) {
    for (let j = 0; j < count; j++, i++) {
      const nstt = 'INC0012345';
      const srCount = 1 + (i % 3);
      rows.push({
        vipType: vipCycle[i % vipCycle.length],
        nstt,
        nsttAgeing: '03.20.26',
        site: 'LUCKNOW',
        status,
        actualIncidentTime: '12.08.25   03:10:12',
        assignedGroup: 'Noc_NS',
        lastErtTime: '12.08.25   03:10:12',
        upTime: '12.08.25   03:10:12',
        srCount,
        srDetails: mockChildSrs(nstt, srCount),
        nsttOwner: i % 4 === 0 ? 'A11UKIGQ' : 'Update',
        uniqueLsiCount: srCount,
      });
    }
  }
  return rows;
}

export function getMockDashboardData(): IncidentDashboardData {
  return {
    statTiles: buildMockStatTiles(),
    nsttRows: buildMockNsttRows(),
    groupOptions: ['NOC_NS', 'CEN_Network', 'NOC_S&D', 'NOC_NS_ANG', 'NSG-ITMC'],
  };
}
